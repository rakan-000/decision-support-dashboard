import { NextResponse } from "next/server";
import { providerStatus } from "@/lib/config";
import { getClient, getModel } from "@/lib/ai/client";
import { isAiProvider } from "@/lib/ai/provider-selection";

export const runtime = "nodejs";

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unknown provider error";
}

export async function GET(request: Request) {
  const status = providerStatus();
  const requested = new URL(request.url).searchParams.get("provider");
  if (requested && !isAiProvider(requested)) {
    return NextResponse.json({ error: "Invalid AI provider" }, { status: 400 });
  }
  const provider = requested ?? status.defaultProvider;

  if (provider === "demo") {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      connected: false,
      providers: status,
      message: "Demo analysis is selected. No external AI provider is contacted.",
    });
  }

  const selected = status.providers.find((item) => item.id === provider);
  if (!selected?.configured) {
    return NextResponse.json({ ok: false, mode: "unconfigured", connected: false, providers: status, message: `${provider} requires an API key and model in server settings.` }, { status: 400 });
  }

  try {
    const model = selected.model;
    let text = "Connected";
    if (provider === "anthropic") {
      const client = getClient();
      if (!client) throw new Error("Anthropic client could not be initialized");
      const response = await client.messages.create({
        model: getModel(), max_tokens: 64,
        system: "Return only the Arabic word جاهز.",
        messages: [{ role: "user", content: "اختبر الاتصال فقط. أجب: جاهز" }],
      });
      text = response.content.filter((block): block is Extract<typeof block, { type: "text" }> => block.type === "text").map((block) => block.text).join(" ").trim();
    } else if (provider === "gemini") {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Reply with جاهز only." }] }] }),
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) throw new Error(`Gemini connection failed (${response.status})`);
      text = "Connected";
    } else {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model, input: "Reply with جاهز only.", store: false, max_output_tokens: 32 }),
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok) throw new Error(`OpenAI connection failed (${response.status})`);
      text = "Connected";
    }

    return NextResponse.json({
      ok: true,
      mode: "real_ai",
      connected: true,
      providers: status,
      model,
      message: text || "Connected",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        mode: "error",
        connected: false,
        providers: status,
        model: selected.model,
        message: errorMessage(error),
      },
      { status: 502 },
    );
  }
}
