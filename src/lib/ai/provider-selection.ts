export const AI_PROVIDERS = ["anthropic", "gemini", "openai", "demo"] as const;
export type AiProvider = (typeof AI_PROVIDERS)[number];

export function isAiProvider(value: unknown): value is AiProvider {
  return typeof value === "string" && AI_PROVIDERS.includes(value as AiProvider);
}

export const AI_PROVIDER_STORAGE_KEY = "decision-intelligence-ai-provider";
