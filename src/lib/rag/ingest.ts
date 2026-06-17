/**
 * Knowledge Base ingestion pipeline (server-only).
 *
 *   read file (private storage) -> parse (existing parsers) -> chunk
 *   -> embed (optional, provider-based) -> store chunks -> update KB doc
 *
 * No file or content leaves the server unless EMBEDDINGS_PROVIDER=openai is
 * explicitly configured (in which case only chunk text is embedded).
 */
import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { knowledgeBaseDocuments, knowledgeBaseChunks } from "@/lib/db/schema";
import { storage } from "@/lib/storage";
import { parseFile } from "@/lib/parsers";
import { chunkText } from "./chunk";
import { getEmbeddingProvider } from "./embeddings";

export async function ingestKbDocument(kbDocumentId: string): Promise<number> {
  const doc = db
    .select()
    .from(knowledgeBaseDocuments)
    .where(eq(knowledgeBaseDocuments.id, kbDocumentId))
    .get();
  if (!doc) throw new Error("Knowledge base document not found");

  // Re-ingestion is idempotent.
  db.delete(knowledgeBaseChunks)
    .where(eq(knowledgeBaseChunks.kbDocumentId, kbDocumentId))
    .run();

  const buffer = await storage.read(doc.storageKey);
  const parsed = await parseFile(buffer, fileTypeFromExt(doc.filename));
  const chunks = chunkText(parsed.text);

  const provider = getEmbeddingProvider();
  const vectors = await provider.embed(chunks.map((c) => c.text));

  if (chunks.length > 0) {
    db.insert(knowledgeBaseChunks)
      .values(
        chunks.map((c, i) => ({
          kbDocumentId,
          chunkText: c.text,
          chunkIndex: c.index,
          embedding: vectors[i] ?? null,
          tokenCount: c.tokenCount,
        })),
      )
      .run();
  }

  db.update(knowledgeBaseDocuments)
    .set({
      chunkCount: chunks.length,
      language: (parsed.metadata.language as "ar" | "en" | "mixed") ?? doc.language ?? "en",
    })
    .where(eq(knowledgeBaseDocuments.id, kbDocumentId))
    .run();

  return chunks.length;
}

function fileTypeFromExt(filename: string): "pdf" | "excel" | "word" {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (ext === "xlsx" || ext === "xls" || ext === "csv") return "excel";
  return "word";
}
