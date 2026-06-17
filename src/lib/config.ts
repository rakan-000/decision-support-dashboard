/**
 * Centralized, environment-driven configuration.
 * No secrets are ever hardcoded. Every integration reads from process.env.
 */

export const config = {
  ai: {
    apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    model: process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8",
    get isConfigured() {
      return Boolean(process.env.ANTHROPIC_API_KEY);
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
  return {
    aiConfigured: config.ai.isConfigured,
    aiModel: config.ai.model,
    embeddingsExternal: config.embeddings.isExternal,
    storageLocal: true,
  };
}
