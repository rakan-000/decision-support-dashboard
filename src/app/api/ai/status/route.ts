import { NextResponse } from "next/server";
import { config, providerStatus } from "@/lib/config";
import { getClient, getModel } from "@/lib/ai/client";

export const runtime = "nodejs";

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unknown provider error";
}

export async function GET() {
  const status = providerStatus();

  if (!config.ai.isConfigured) {
    return NextResponse.json({
      ok: true,
      mode: "demo",
      connected: false,
      providers: status,
      message: "ANTHROPIC_API_KEY is not configured. The platform is running in demo analysis mode.",
    });
  }

  const client = getClient();
  if (!client) {
    return NextResponse.json(
      {
        ok: false,
        mode: "error",
        connected: false,
        providers: status,
        message: "Anthropic client could not be initialized.",
      },
      { status: 500 },
    );
  }

  try {
    const model = getModel();
    const response = await client.messages.create({
      model,
      max_tokens: 64,
      system:
        "You are a connection health check. Return only the Arabic word جاهز.",
      messages: [
        {
          role: "user",
          content:
            "اختبر الاتصال فقط. لا تحلل أي وثائق. أجب بكلمة واحدة: جاهز",
        },
      ],
    });

    const text = response.content
      .filter((block): block is Extract<typeof block, { type: "text" }> => block.type === "text")
      .map((block) => block.text)
      .join(" ")
      .trim();

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
        model: config.ai.model,
        message: errorMessage(error),
      },
      { status: 502 },
    );
  }
}
