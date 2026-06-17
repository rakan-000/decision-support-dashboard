/**
 * Knowledge Base retrieval (server-only).
 *
 * Implements the `retrieveKbContext()` contract consumed by the analysis
 * pipeline. Two scoring modes, selected automatically:
 *
 *   - Local lexical (BM25)  — default; no embeddings, nothing leaves the server.
 *   - Cosine similarity     — used when chunks were embedded (EMBEDDINGS_PROVIDER
 *                             = openai) and a query embedding is available.
 *
 * Results are re-weighted by document type (policies, procedures, governance
 * manuals, and the delegation-of-authority matrix rank highest) and boosted for
 * department-specific matches, reflecting the internal source-of-truth priority.
 */
import "server-only";
import { and, eq, inArray, isNull, or } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { knowledgeBaseDocuments, knowledgeBaseChunks } from "@/lib/db/schema";
import type { KbSourceRef, KbType } from "@/lib/db/schema";
import { getEmbeddingProvider, cosineSimilarity } from "./embeddings";

export type KbRetrieval = {
  contextText: string;
  sources: KbSourceRef[];
  mode: "lexical" | "cosine" | "none";
};

/** Internal source-of-truth priority by document type. */
const TYPE_WEIGHT: Record<KbType, number> = {
  governance_manual: 1.5,
  delegation_authority: 1.5,
  policy: 1.4,
  compliance: 1.3,
  procedure: 1.3,
  org_structure: 1.1,
  dept_manual: 1.1,
  guideline: 1.0,
};

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

type Candidate = {
  kbDocumentId: string;
  title: string;
  type: KbType;
  departmentId: string | null;
  chunkText: string;
  embedding: number[] | null;
};

function bm25Scores(query: string, candidates: Candidate[]): number[] {
  const k1 = 1.5;
  const b = 0.75;
  const docTokens = candidates.map((c) => tokenize(c.chunkText));
  const N = candidates.length;
  const avgdl = docTokens.reduce((s, t) => s + t.length, 0) / Math.max(N, 1);

  // Document frequency per term.
  const df = new Map<string, number>();
  docTokens.forEach((toks) => {
    for (const term of new Set(toks)) df.set(term, (df.get(term) ?? 0) + 1);
  });

  const qTerms = [...new Set(tokenize(query))];

  return docTokens.map((toks) => {
    const dl = toks.length;
    const tf = new Map<string, number>();
    for (const t of toks) tf.set(t, (tf.get(t) ?? 0) + 1);

    let score = 0;
    for (const term of qTerms) {
      const f = tf.get(term);
      if (!f) continue;
      const n = df.get(term) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * dl) / avgdl)));
    }
    return score;
  });
}

export async function retrieveKbContext(
  query: string,
  departmentId: string | null,
  topK = 8,
): Promise<KbRetrieval> {
  // Candidate chunks: active org-wide docs + active department-specific docs.
  const rows = db
    .select({
      kbDocumentId: knowledgeBaseDocuments.id,
      filename: knowledgeBaseDocuments.filename,
      description: knowledgeBaseDocuments.description,
      version: knowledgeBaseDocuments.version,
      type: knowledgeBaseDocuments.documentType,
      docDept: knowledgeBaseDocuments.departmentId,
      chunkText: knowledgeBaseChunks.chunkText,
      embedding: knowledgeBaseChunks.embedding,
    })
    .from(knowledgeBaseChunks)
    .innerJoin(
      knowledgeBaseDocuments,
      eq(knowledgeBaseChunks.kbDocumentId, knowledgeBaseDocuments.id),
    )
    .where(
      and(
        eq(knowledgeBaseDocuments.isActive, true),
        departmentId
          ? or(
              isNull(knowledgeBaseDocuments.departmentId),
              eq(knowledgeBaseDocuments.departmentId, departmentId),
            )
          : isNull(knowledgeBaseDocuments.departmentId),
      ),
    )
    .all();

  if (rows.length === 0) {
    return { contextText: "", sources: [], mode: "none" };
  }

  const candidates: Candidate[] = rows.map((r) => ({
    kbDocumentId: r.kbDocumentId,
    title: r.description?.trim() || r.filename,
    type: r.type as KbType,
    departmentId: r.docDept,
    chunkText: r.chunkText,
    embedding: (r.embedding as number[] | null) ?? null,
  }));

  // Decide scoring mode.
  const provider = getEmbeddingProvider();
  const haveVectors = candidates.every((c) => Array.isArray(c.embedding) && c.embedding.length > 0);

  let baseScores: number[];
  let mode: "lexical" | "cosine";

  if (provider.isExternal && haveVectors) {
    const [queryVec] = await provider.embed([query]);
    if (queryVec) {
      baseScores = candidates.map((c) => cosineSimilarity(queryVec, c.embedding as number[]));
      mode = "cosine";
    } else {
      baseScores = bm25Scores(query, candidates);
      mode = "lexical";
    }
  } else {
    baseScores = bm25Scores(query, candidates);
    mode = "lexical";
  }

  // Re-weight by type priority + department-specific boost.
  const ranked = candidates
    .map((c, i) => {
      const typeWeight = TYPE_WEIGHT[c.type] ?? 1;
      const deptBoost = c.departmentId && c.departmentId === departmentId ? 1.25 : 1;
      return { c, score: baseScores[i] * typeWeight * deptBoost };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  if (ranked.length === 0) {
    return { contextText: "", sources: [], mode };
  }

  // Build the injected context block.
  const contextText = ranked
    .map(
      (x) =>
        `[${x.c.type.toUpperCase()} · ${x.c.title}]\n${x.c.chunkText}`,
    )
    .join("\n\n---\n\n");

  // Dedupe sources by document, keep best score per doc.
  const bestByDoc = new Map<string, KbSourceRef>();
  for (const x of ranked) {
    const existing = bestByDoc.get(x.c.kbDocumentId);
    const score = Math.round(x.score * 100) / 100;
    if (!existing || score > existing.score) {
      bestByDoc.set(x.c.kbDocumentId, {
        kbDocumentId: x.c.kbDocumentId,
        title: x.c.title,
        score,
      });
    }
  }

  return {
    contextText,
    sources: [...bestByDoc.values()].sort((a, b) => b.score - a.score),
    mode,
  };
}
