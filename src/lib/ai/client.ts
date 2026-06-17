/**
 * Anthropic Claude client (server-only).
 *
 * Production-ready and fully environment-driven:
 * - The API key is read exclusively from ANTHROPIC_API_KEY (never hardcoded).
 * - The model is read from ANTHROPIC_MODEL (config default), never hardcoded
 *   at the call site.
 * - When no key is configured, `getClient()` returns null and the pipeline
 *   transparently falls back to clearly-labeled demo analysis. Adding the key
 *   later switches to real Claude analysis with no code changes.
 */
import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { config } from "@/lib/config";

let cached: Anthropic | null | undefined;

export function getClient(): Anthropic | null {
  if (cached !== undefined) return cached;
  if (!config.ai.isConfigured) {
    cached = null;
    return cached;
  }
  cached = new Anthropic({ apiKey: config.ai.apiKey });
  return cached;
}

export function getModel(): string {
  return config.ai.model;
}
