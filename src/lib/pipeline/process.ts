/**
 * Document processing pipeline (server-only).
 *
 * Stage lifecycle:
 *   queued -> extracting -> classifying -> analyzing -> complete  (or -> failed)
 *
 * Each stage commits its status to the database so the UI timeline can reflect
 * real progress by polling the document record.
 *
 * The "analyzing" stage runs the analysis orchestrator, which uses Anthropic
 * Claude when ANTHROPIC_API_KEY is configured and a clearly-labeled demo
 * analyzer otherwise. Only extracted text + retrieved internal-policy context
 * are sent to the model — never the raw file.
 */
import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  documents,
  departments,
  documentAnalyses,
  risks,
  actions,
  recommendations,
  type DocStatus,
} from "@/lib/db/schema";
import { storage } from "@/lib/storage";
import { parseFile } from "@/lib/parsers";
import { classifyDocument } from "@/lib/parsers/classify";
import { retrieveKbContext } from "@/lib/rag/retrieve";
import { runAnalysis } from "@/lib/ai/analyze";

// Small delay so distinct stages are observable in the UI timeline.
const STAGE_DELAY_MS = Number(process.env.PIPELINE_STAGE_DELAY_MS ?? 350);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function setStatus(documentId: string, status: DocStatus, note?: string) {
  const doc = db
    .select({ log: documents.processingLog })
    .from(documents)
    .where(eq(documents.id, documentId))
    .get();
  const log = doc?.log ?? [];
  log.push({ stage: status, at: new Date().toISOString(), note });
  db.update(documents)
    .set({ status, processingLog: log })
    .where(eq(documents.id, documentId))
    .run();
}

/** Remove any prior analysis artifacts so reprocessing is idempotent. */
function clearPriorAnalysis(documentId: string) {
  db.delete(recommendations).where(eq(recommendations.documentId, documentId)).run();
  db.delete(actions).where(eq(actions.documentId, documentId)).run();
  db.delete(risks).where(eq(risks.documentId, documentId)).run();
  db.delete(documentAnalyses).where(eq(documentAnalyses.documentId, documentId)).run();
}

export async function processDocument(documentId: string): Promise<void> {
  const doc = db.select().from(documents).where(eq(documents.id, documentId)).get();
  if (!doc) throw new Error("Document not found");

  try {
    // --- Extracting ---
    setStatus(documentId, "extracting", "Reading file and extracting content");
    await sleep(STAGE_DELAY_MS);

    const buffer = await storage.read(doc.storageKey);
    const parsed = await parseFile(buffer, doc.fileType);

    db.update(documents)
      .set({
        extractedText: parsed.text,
        extractedTables: parsed.tables,
        metadata: {
          ...parsed.metadata,
          sheetNames: parsed.sheetNames,
          charCount: parsed.charCount,
        },
        language: (parsed.metadata.language as "ar" | "en" | "mixed") ?? "en",
      })
      .where(eq(documents.id, documentId))
      .run();

    // --- Classifying (heuristic, fully local) ---
    setStatus(documentId, "classifying", "Detecting department, priority, dates");
    await sleep(STAGE_DELAY_MS);

    const classification = classifyDocument(
      parsed.text,
      doc.filename,
      (parsed.metadata.language as "ar" | "en" | "mixed") ?? "en",
    );

    // Respect a user-provided department pre-tag; otherwise use detection.
    let departmentId = doc.departmentId;
    if (!departmentId && classification.departmentCode) {
      const dept = db
        .select({ id: departments.id })
        .from(departments)
        .where(eq(departments.code, classification.departmentCode))
        .get();
      departmentId = dept?.id ?? null;
    }

    db.update(documents)
      .set({
        departmentId,
        priority: doc.priority ?? classification.priority,
        detectedOwner: classification.owner,
        detectedDates: classification.dates,
        language: classification.language,
      })
      .where(eq(documents.id, documentId))
      .run();

    // --- Analyzing (Claude when configured; clearly-labeled demo otherwise) ---
    setStatus(documentId, "analyzing", "Generating executive intelligence");
    await sleep(STAGE_DELAY_MS);

    const kb = await retrieveKbContext(parsed.text, departmentId);
    const { analysis, isDemo, model } = await runAnalysis({
      filename: doc.filename,
      text: parsed.text,
      classification,
      kbContext: kb.contextText,
      kbSources: kb.sources,
    });

    // Persist analysis artifacts (idempotent).
    clearPriorAnalysis(documentId);

    db.insert(documentAnalyses)
      .values({
        documentId,
        executiveSummary: analysis.executiveSummary,
        keyInsights: analysis.keyInsights,
        governanceReview: analysis.governanceReview,
        complianceReview: analysis.complianceReview,
        gapAnalysis: analysis.gapAnalysis,
        rootCauseAnalysis: analysis.rootCauseAnalysis,
        swotAnalysis: analysis.swot,
        pestelAnalysis: analysis.pestel,
        kpiOpportunities: analysis.kpiOpportunities,
        deptClassification: analysis.departmentClassification,
        priorityLevel: analysis.priorityLevel,
        confidenceScore: analysis.confidenceScore,
        complianceScore: analysis.complianceScore,
        governanceScore: analysis.governanceScore,
        kbSourcesUsed: kb.sources,
        analysisModel: model,
        isDemo,
      })
      .run();

    if (analysis.risks.length > 0) {
      db.insert(risks)
        .values(
          analysis.risks.map((r) => ({
            documentId,
            title: r.title,
            description: r.description,
            severity: r.severity,
            category: r.category,
            status: "open" as const,
            departmentId,
            evidence: r.evidence,
          })),
        )
        .run();
    }

    if (analysis.executiveActions.length > 0) {
      db.insert(actions)
        .values(
          analysis.executiveActions.map((a) => ({
            documentId,
            title: a.title,
            description: a.description,
            status: "open" as const,
            priority: a.priority,
            departmentId,
          })),
        )
        .run();
    }

    if (analysis.recommendations.length > 0) {
      db.insert(recommendations)
        .values(
          analysis.recommendations.map((r) => ({
            documentId,
            title: r.title,
            body: r.body,
            evidence: r.evidence,
            isEvidenceSufficient: r.isEvidenceSufficient,
            specificity: r.specificity,
            status: "pending" as const,
            departmentId,
          })),
        )
        .run();
    }

    // Reflect the AI-determined priority on the document record.
    db.update(documents)
      .set({ priority: analysis.priorityLevel })
      .where(eq(documents.id, documentId))
      .run();

    // --- Complete ---
    await sleep(STAGE_DELAY_MS);
    setStatus(
      documentId,
      "complete",
      isDemo ? "Complete (demo analysis)" : "Complete (AI analysis)",
    );
    db.update(documents)
      .set({ processedAt: new Date().toISOString() })
      .where(eq(documents.id, documentId))
      .run();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown processing error";
    setStatus(documentId, "failed", message);
    db.update(documents)
      .set({ errorMessage: message })
      .where(eq(documents.id, documentId))
      .run();
    throw err;
  }
}
