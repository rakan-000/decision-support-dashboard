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
  const client = getClient();

  // --- Demo mode (no API key) ---
  if (!client) {
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

  // --- Real Claude analysis ---
  const model = getModel();
  const message = await client.messages.create({
    model,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: buildUserPrompt({
          filename: input.filename,
          documentText: input.text,
          classification: input.classification,
          kbContext: input.kbContext,
        }),
      },
    ],
  });

  const raw = message.content
    .filter((b): b is Extract<typeof b, { type: "text" }> => b.type === "text")
    .map((b) => b.text)
    .join("\n");

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

  return { analysis: result.data, isDemo: false, model };
}
