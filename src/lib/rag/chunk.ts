/**
 * Text chunking for knowledge-base ingestion (server-only, no external calls).
 *
 * Splits long documents into overlapping, paragraph-aware chunks suitable for
 * lexical or vector retrieval. Sizes are character-based for portability across
 * Arabic and English content.
 */
import "server-only";

export type Chunk = { text: string; index: number; tokenCount: number };

const MAX_CHARS = Number(process.env.KB_CHUNK_CHARS ?? 900);
const OVERLAP_CHARS = Number(process.env.KB_CHUNK_OVERLAP ?? 150);

/** Rough token estimate (works for AR + EN without a tokenizer dependency). */
export function estimateTokens(text: string): number {
  const words = text.trim().match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
  return Math.max(words, Math.ceil(text.length / 4));
}

export function chunkText(input: string): Chunk[] {
  const text = input.replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  // Split on blank lines (paragraphs) first; fall back to hard slicing.
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  const chunks: string[] = [];
  let buffer = "";

  const flush = () => {
    if (buffer.trim()) chunks.push(buffer.trim());
    buffer = "";
  };

  for (const para of paragraphs) {
    if (para.length > MAX_CHARS) {
      flush();
      // Hard-slice oversized paragraphs with overlap.
      for (let start = 0; start < para.length; start += MAX_CHARS - OVERLAP_CHARS) {
        chunks.push(para.slice(start, start + MAX_CHARS).trim());
      }
      continue;
    }
    if (buffer.length + para.length + 2 > MAX_CHARS) {
      flush();
    }
    buffer = buffer ? `${buffer}\n\n${para}` : para;
  }
  flush();

  return chunks.map((text, index) => ({
    text,
    index,
    tokenCount: estimateTokens(text),
  }));
}
