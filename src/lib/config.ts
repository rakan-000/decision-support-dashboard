/**
 * Centralized, environment-driven configuration.
 * No secrets are ever hardcoded. Every integration reads from process.env.
 */

export const config = {
  ai: {
    apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    model: process.env.ANTHROPIC_MODEL ?? "",
    maxOutputTokens: Number(process.env.ANTHROPIC_MAX_OUTPUT_TOKENS ?? 16000),
    effort: process.env.ANTHROPIC_EFFORT ?? "high",
    get isConfigured() {
      return Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_MODEL);
    },
  },
  embeddings: {
    provider: (process.env.EMBEDDINGS_PROVIDER ?? "local") as "local" | "openai",
    openaiKey: process.env.OPENAI_API_KEY ?? "",
    get isExternal() {
      return (process.env.EMBEDDINGS_PROVIDER ?? "local") === "openai";
    },
  },
  storage: {
    dir: process.env.STORAGE_DIR ?? "./storage/uploads",
  },
  database: {
    url: process.env.DATABASE_URL ?? "./data/app.db",
  },
  platform: {
    defaultLocale: (process.env.DEFAULT_LOCALE ?? "ar") as "ar" | "en",
    maxUploadMb: Number(process.env.MAX_UPLOAD_MB ?? 50),
  },
};

/** Provider readiness summary surfaced in the UI privacy notice. */
export function providerStatus() {
  const providers = [
    { id: "anthropic", name: "Claude", configured: config.ai.isConfigured, model: config.ai.model },
    { id: "gemini", name: "Gemini", configured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL), model: process.env.GEMINI_MODEL ?? "" },
    { id: "openai", name: "ChatGPT", configured: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL), model: process.env.OPENAI_MODEL ?? "" },
  ] as const;
  const preferred = providers.find((item) => item.id === process.env.AI_PROVIDER && item.configured);
  const active = preferred ?? providers.find((item) => item.configured);
  return {
    aiConfigured: Boolean(active),
    aiModel: active?.model ?? "",
    aiEffort: config.ai.effort,
    defaultProvider: (active?.id ?? "demo") as "anthropic" | "gemini" | "openai" | "demo",
    providers,
    embeddingsExternal: config.embeddings.isExternal,
    storageLocal: true,
  };
}
