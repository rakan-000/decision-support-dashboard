/**
 * Analysis orchestrator (server-only).
 *
 * Single entry point used by the pipeline. It transparently switches between:
 *   - Real Claude analysis  (when ANTHROPIC_API_KEY is configured)
 *   - Demo analysis         (when it is not) — clearly labeled, isDemo = true
 *
 * Only extracted text + retrieved internal-policy context are sent to the
 * model. Raw files are never transmitted. Output is validated against the
 * strict Zod schema before it is returned; invalid model output is rejected.
 */
import "server-only";
import { getClient, getModel } from "./client";
import { AnalysisSchema, type Analysis } from "./schema";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";
import { demoAnalysis } from "./demo";
import type { Classification } from "@/lib/parsers/classify";
import type { KbSourceRef } from "@/lib/db/schema";
import { config } from "@/lib/config";
import { providerStatus } from "@/lib/config";
import type { AiProvider } from "./provider-selection";

export type AnalysisResult = {
  analysis: Analysis;
  isDemo: boolean;
  model: string;
};

export type AnalyzeInput = {
  filename: string;
  text: string;
  classification: Classification;
  kbContext: string;
  kbSources: KbSourceRef[];
  provider?: AiProvider;
};

/** Extract the first balanced JSON object from a model text response. */
function extractJson(raw: string): string {
  let s = raw.trim();
  // Strip markdown code fences if present.
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  if (s.startsWith("{") && s.endsWith("}")) return s;
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) return s.slice(first, last + 1);
  return s;
}

export async function runAnalysis(input: AnalyzeInput): Promise<AnalysisResult> {
  const status = providerStatus();
  const provider = input.provider ?? status.defaultProvider;
  const selected = status.providers.find((item) => item.id === provider);
  if (provider !== "demo" && !selected?.configured) {
    throw new Error(`Selected AI provider ${provider} is not configured. Add its API key and model in server environment settings.`);
  }

  if (provider === "demo") {
    return {
      analysis: demoAnalysis({
        filename: input.filename,
        text: input.text,
        classification: input.classification,
        kbSources: input.kbSources,
      }),
      isDemo: true,
      model: "demo",
    };
  }

  const model = selected!.model;
  const prompt = buildUserPrompt({
          filename: input.filename,
          documentText: input.text,
          classification: input.classification,
          kbContext: input.kbContext,
  });
  let raw: string;
  if (provider === "anthropic") {
    const client = getClient();
    if (!client) throw new Error("Claude client could not be initialized");
    const message = await client.messages.create({
      model: getModel(),
      max_tokens: config.ai.maxOutputTokens,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });
    raw = message.content
      .filter((block): block is Extract<typeof block, { type: "text" }> => block.type === "text")
      .map((block) => block.text)
      .join("\n");
  } else if (provider === "gemini") {
    raw = await callGemini(model, prompt);
  } else {
    raw = await callOpenAi(model, prompt);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(raw));
  } catch {
    throw new Error("AI analysis returned non-JSON output");
  }

  const result = AnalysisSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `AI analysis failed schema validation: ${result.error.issues
        .slice(0, 3)
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
    );
  }

  return { analysis: result.data, isDemo: false, model: `${provider}:${model}` };
}

async function providerFetch(url: string, init: RequestInit): Promise<unknown> {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(120_000) });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI provider request failed (${response.status}): ${body.slice(0, 300)}`);
  }
  return response.json();
}

async function callGemini(model: string, prompt: string): Promise<string> {
  const data = await providerFetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", maxOutputTokens: Number(process.env.GEMINI_MAX_OUTPUT_TOKENS ?? 16000) },
      }),
    },
  ) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n");
  if (!text) throw new Error("Gemini returned no analysis text");
  return text;
}

async function callOpenAi(model: string, prompt: string): Promise<string> {
  const data = await providerFetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model,
      instructions: SYSTEM_PROMPT,
      input: prompt,
      store: false,
      max_output_tokens: Number(process.env.OPENAI_MAX_OUTPUT_TOKENS ?? 16000),
      text: { format: { type: "json_object" } },
    }),
  }) as { status?: string; output?: { content?: { type: string; text?: string }[] }[]; error?: { message?: string } };
  if (data.status !== "completed") throw new Error(data.error?.message ?? "OpenAI response did not complete");
  const text = data.output?.flatMap((item) => item.content ?? []).filter((part) => part.type === "output_text").map((part) => part.text ?? "").join("\n");
  if (!text) throw new Error("OpenAI returned no analysis text");
  return text;
}
