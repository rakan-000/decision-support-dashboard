/**
 * Embeddings provider abstraction (server-only).
 *
 * Default ("local"): NO embeddings are computed and NO data leaves the server.
 * Retrieval falls back to a fully-local lexical (BM25) scorer. This keeps the
 * MVP free and private.
 *
 * Optional ("openai"): when EMBEDDINGS_PROVIDER=openai and OPENAI_API_KEY is
 * set, chunks are embedded with text-embedding-3-large at ingestion time and
 * retrieval uses cosine similarity. Switching providers requires no code
 * changes elsewhere — the ingestion and retrieval layers consume this module.
 */
import "server-only";
import { config } from "@/lib/config";

export type EmbeddingProvider = {
  name: "local" | "openai";
  isExternal: boolean;
  /** Returns one vector per input, or null per input when embeddings are disabled. */
  embed(texts: string[]): Promise<(number[] | null)[]>;
};

const localProvider: EmbeddingProvider = {
  name: "local",
  isExternal: false,
  async embed(texts) {
    return texts.map(() => null);
  },
};

function openAiProvider(): EmbeddingProvider {
  const model = process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-large";
  return {
    name: "openai",
    isExternal: true,
    async embed(texts) {
      if (texts.length === 0) return [];
      const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.embeddings.openaiKey}`,
        },
        body: JSON.stringify({ model, input: texts }),
      });
      if (!res.ok) {
        throw new Error(`Embeddings request failed: ${res.status}`);
      }
      const json = (await res.json()) as { data: { embedding: number[] }[] };
      return json.data.map((d) => d.embedding);
    },
  };
}

export function getEmbeddingProvider(): EmbeddingProvider {
  if (config.embeddings.provider === "openai" && config.embeddings.openaiKey) {
    return openAiProvider();
  }
  return localProvider;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
