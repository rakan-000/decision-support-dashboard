/**
 * Typed query helpers used by server components / route handlers.
 * Keep DB access centralized here so the storage engine can be swapped later.
 */
import "server-only";
import { and, count, desc, eq, inArray, avg } from "drizzle-orm";
import { db } from "./client";
import {
  departments,
  documents,
  documentAnalyses,
  risks,
  actions,
  recommendations,
  knowledgeBaseDocuments,
  knowledgeBaseChunks,
  activityLog,
  exportJobs,
} from "./schema";
import { sql } from "drizzle-orm";

export async function getDepartments() {
  return db.select().from(departments).orderBy(departments.code).all();
}

export type DashboardMetrics = {
  totalDocuments: number;
  activeRisks: number;
  openActions: number;
  closedActions: number;
  recommendations: number;
  departments: number;
  complianceScore: number;
  governanceScore: number;
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [docs] = db.select({ c: count() }).from(documents).all();
  const [activeRisks] = db
    .select({ c: count() })
    .from(risks)
    .where(inArray(risks.status, ["open", "in_progress"]))
    .all();
  const [openActions] = db
    .select({ c: count() })
    .from(actions)
    .where(inArray(actions.status, ["open", "in_progress", "overdue"]))
    .all();
  const [closedActions] = db
    .select({ c: count() })
    .from(actions)
    .where(eq(actions.status, "complete"))
    .all();
  const [recs] = db.select({ c: count() }).from(recommendations).all();
  const [depts] = db.select({ c: count() }).from(departments).all();
  const [scores] = db
    .select({
      compliance: avg(documentAnalyses.complianceScore),
      governance: avg(documentAnalyses.governanceScore),
    })
    .from(documentAnalyses)
    .all();

  return {
    totalDocuments: docs?.c ?? 0,
    activeRisks: activeRisks?.c ?? 0,
    openActions: openActions?.c ?? 0,
    closedActions: closedActions?.c ?? 0,
    recommendations: recs?.c ?? 0,
    departments: depts?.c ?? 0,
    complianceScore: Math.round(Number(scores?.compliance ?? 0)),
    governanceScore: Math.round(Number(scores?.governance ?? 0)),
  };
}

export type RecentDocument = {
  id: string;
  filename: string;
  fileType: string;
  status: string;
  priority: string | null;
  departmentCode: string | null;
  confidenceScore: number | null;
  createdAt: string;
};

export async function getRecentDocuments(limit = 5): Promise<RecentDocument[]> {
  const rows = db
    .select({
      id: documents.id,
      filename: documents.filename,
      fileType: documents.fileType,
      status: documents.status,
      priority: documents.priority,
      departmentCode: departments.code,
      confidenceScore: documentAnalyses.confidenceScore,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .leftJoin(departments, eq(documents.departmentId, departments.id))
    .leftJoin(documentAnalyses, eq(documentAnalyses.documentId, documents.id))
    .orderBy(desc(documents.createdAt))
    .limit(limit)
    .all();
  return rows as RecentDocument[];
}

export type AnalysisListItem = {
  id: string;
  filename: string;
  fileType: string;
  status: string;
  priority: string | null;
  departmentCode: string | null;
  detectedOwner: string | null;
  confidenceScore: number | null;
  complianceScore: number | null;
  governanceScore: number | null;
  isDemo: boolean | null;
  summary: string | null;
  createdAt: string;
  kbSourceCount: number;
  riskCount: number;
};

export async function getAnalysisDocuments(): Promise<AnalysisListItem[]> {
  const rows = db
    .select({
      id: documents.id,
      filename: documents.filename,
      fileType: documents.fileType,
      status: documents.status,
      priority: documents.priority,
      departmentCode: departments.code,
      detectedOwner: documents.detectedOwner,
      confidenceScore: documentAnalyses.confidenceScore,
      complianceScore: documentAnalyses.complianceScore,
      governanceScore: documentAnalyses.governanceScore,
      isDemo: documentAnalyses.isDemo,
      summary: documentAnalyses.executiveSummary,
      kbSourcesUsed: documentAnalyses.kbSourcesUsed,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .leftJoin(departments, eq(documents.departmentId, departments.id))
    .leftJoin(documentAnalyses, eq(documentAnalyses.documentId, documents.id))
    .orderBy(desc(documents.createdAt))
    .all();

  // Risk counts per document (single grouped query).
  const riskRows = db
    .select({ documentId: risks.documentId, c: count() })
    .from(risks)
    .groupBy(risks.documentId)
    .all();
  const riskByDoc = new Map(riskRows.map((r) => [r.documentId, r.c]));

  return rows.map((r) => {
    const sources = (r.kbSourcesUsed as { kbDocumentId: string }[] | null) ?? [];
    const summary = r.summary ? r.summary.slice(0, 180) : null;
    return {
      id: r.id,
      filename: r.filename,
      fileType: r.fileType,
      status: r.status,
      priority: r.priority,
      departmentCode: r.departmentCode,
      detectedOwner: r.detectedOwner,
      confidenceScore: r.confidenceScore,
      complianceScore: r.complianceScore,
      governanceScore: r.governanceScore,
      isDemo: r.isDemo,
      summary,
      createdAt: r.createdAt,
      kbSourceCount: sources.length,
      riskCount: riskByDoc.get(r.id) ?? 0,
    };
  });
}

export async function getDepartmentDistribution() {
  return db
    .select({
      code: departments.code,
      nameEn: departments.nameEn,
      nameAr: departments.nameAr,
      documents: count(documents.id),
    })
    .from(departments)
    .leftJoin(documents, eq(documents.departmentId, departments.id))
    .groupBy(departments.id)
    .all();
}

export async function getDocumentDetail(id: string) {
  const doc = db
    .select({
      id: documents.id,
      filename: documents.filename,
      fileType: documents.fileType,
      status: documents.status,
      priority: documents.priority,
      departmentId: documents.departmentId,
      departmentCode: departments.code,
      detectedOwner: documents.detectedOwner,
      detectedDates: documents.detectedDates,
      language: documents.language,
      fileSizeKb: documents.fileSizeKb,
      metadata: documents.metadata,
      errorMessage: documents.errorMessage,
      processedAt: documents.processedAt,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .leftJoin(departments, eq(documents.departmentId, departments.id))
    .where(eq(documents.id, id))
    .get();

  if (!doc) return null;

  const analysis = db
    .select()
    .from(documentAnalyses)
    .where(eq(documentAnalyses.documentId, id))
    .get();
  const riskRows = db.select().from(risks).where(eq(risks.documentId, id)).all();
  const actionRows = db.select().from(actions).where(eq(actions.documentId, id)).all();
  const recRows = db
    .select()
    .from(recommendations)
    .where(eq(recommendations.documentId, id))
    .all();

  return {
    doc,
    analysis: analysis ?? null,
    risks: riskRows,
    actions: actionRows,
    recommendations: recRows,
  };
}

export type DocumentDetail = NonNullable<Awaited<ReturnType<typeof getDocumentDetail>>>;

// ---- Knowledge Base --------------------------------------------------------

export type KbDocumentRow = {
  id: string;
  filename: string;
  documentType: string;
  departmentId: string | null;
  departmentCode: string | null;
  language: string | null;
  isActive: boolean;
  version: string | null;
  effectiveDate: string | null;
  description: string | null;
  chunkCount: number;
  createdAt: string;
};

export async function getKbDocuments(): Promise<KbDocumentRow[]> {
  const rows = db
    .select({
      id: knowledgeBaseDocuments.id,
      filename: knowledgeBaseDocuments.filename,
      documentType: knowledgeBaseDocuments.documentType,
      departmentId: knowledgeBaseDocuments.departmentId,
      departmentCode: departments.code,
      language: knowledgeBaseDocuments.language,
      isActive: knowledgeBaseDocuments.isActive,
      version: knowledgeBaseDocuments.version,
      effectiveDate: knowledgeBaseDocuments.effectiveDate,
      description: knowledgeBaseDocuments.description,
      chunkCount: knowledgeBaseDocuments.chunkCount,
      createdAt: knowledgeBaseDocuments.createdAt,
    })
    .from(knowledgeBaseDocuments)
    .leftJoin(departments, eq(knowledgeBaseDocuments.departmentId, departments.id))
    .orderBy(desc(knowledgeBaseDocuments.createdAt))
    .all();
  return rows as KbDocumentRow[];
}

export type KbStats = {
  total: number;
  active: number;
  chunks: number;
};

export async function getKbStats(): Promise<KbStats> {
  const [total] = db.select({ c: count() }).from(knowledgeBaseDocuments).all();
  const [active] = db
    .select({ c: count() })
    .from(knowledgeBaseDocuments)
    .where(eq(knowledgeBaseDocuments.isActive, true))
    .all();
  const [chunks] = db.select({ c: count() }).from(knowledgeBaseChunks).all();
  return {
    total: total?.c ?? 0,
    active: active?.c ?? 0,
    chunks: chunks?.c ?? 0,
  };
}

// ---- Dashboard + modules ---------------------------------------------------

export type DepartmentStat = {
  code: string;
  nameEn: string;
  nameAr: string;
  documents: number;
  activeRisks: number;
  openActions: number;
  compliance: number;
  governance: number;
};

export async function getDepartmentStats(): Promise<DepartmentStat[]> {
  const depts = db.select().from(departments).orderBy(departments.code).all();

  const docCounts = db
    .select({ departmentId: documents.departmentId, c: count() })
    .from(documents)
    .groupBy(documents.departmentId)
    .all();
  const riskCounts = db
    .select({ departmentId: risks.departmentId, c: count() })
    .from(risks)
    .where(inArray(risks.status, ["open", "in_progress"]))
    .groupBy(risks.departmentId)
    .all();
  const actionCounts = db
    .select({ departmentId: actions.departmentId, c: count() })
    .from(actions)
    .where(inArray(actions.status, ["open", "in_progress", "overdue"]))
    .groupBy(actions.departmentId)
    .all();
  const scoreRows = db
    .select({
      departmentId: documents.departmentId,
      compliance: avg(documentAnalyses.complianceScore),
      governance: avg(documentAnalyses.governanceScore),
    })
    .from(documentAnalyses)
    .innerJoin(documents, eq(documentAnalyses.documentId, documents.id))
    .groupBy(documents.departmentId)
    .all();

  const docMap = new Map(docCounts.map((r) => [r.departmentId, r.c]));
  const riskMap = new Map(riskCounts.map((r) => [r.departmentId, r.c]));
  const actionMap = new Map(actionCounts.map((r) => [r.departmentId, r.c]));
  const scoreMap = new Map(
    scoreRows.map((r) => [
      r.departmentId,
      { c: Math.round(Number(r.compliance ?? 0)), g: Math.round(Number(r.governance ?? 0)) },
    ]),
  );

  return depts.map((d) => ({
    code: d.code,
    nameEn: d.nameEn,
    nameAr: d.nameAr,
    documents: docMap.get(d.id) ?? 0,
    activeRisks: riskMap.get(d.id) ?? 0,
    openActions: actionMap.get(d.id) ?? 0,
    compliance: scoreMap.get(d.id)?.c ?? 0,
    governance: scoreMap.get(d.id)?.g ?? 0,
  }));
}

export async function getRiskSeverityCounts() {
  const rows = db
    .select({ severity: risks.severity, status: risks.status, c: count() })
    .from(risks)
    .groupBy(risks.severity, risks.status)
    .all();
  return rows;
}

export async function getPriorityDistribution() {
  const rows = db
    .select({ priority: documents.priority, c: count() })
    .from(documents)
    .groupBy(documents.priority)
    .all();
  const map = new Map(rows.map((r) => [r.priority ?? "medium", r.c]));
  return {
    critical: map.get("critical") ?? 0,
    high: map.get("high") ?? 0,
    medium: map.get("medium") ?? 0,
    low: map.get("low") ?? 0,
  };
}

export async function getRecommendationStatusCounts() {
  const rows = db
    .select({ status: recommendations.status, c: count() })
    .from(recommendations)
    .groupBy(recommendations.status)
    .all();
  const map = new Map(rows.map((r) => [r.status, r.c]));
  return {
    pending: map.get("pending") ?? 0,
    accepted: map.get("accepted") ?? 0,
    implemented: map.get("implemented") ?? 0,
    rejected: map.get("rejected") ?? 0,
  };
}

export type RecommendationRow = {
  id: string;
  title: string;
  body: string;
  evidence: string | null;
  isEvidenceSufficient: boolean;
  specificity: string;
  status: string;
  departmentCode: string | null;
  documentId: string | null;
  sourceFilename: string | null;
};

export async function getRecommendationsList(): Promise<RecommendationRow[]> {
  const rows = db
    .select({
      id: recommendations.id,
      title: recommendations.title,
      body: recommendations.body,
      evidence: recommendations.evidence,
      isEvidenceSufficient: recommendations.isEvidenceSufficient,
      specificity: recommendations.specificity,
      status: recommendations.status,
      departmentCode: departments.code,
      documentId: recommendations.documentId,
      sourceFilename: documents.filename,
      createdAt: recommendations.createdAt,
    })
    .from(recommendations)
    .leftJoin(departments, eq(recommendations.departmentId, departments.id))
    .leftJoin(documents, eq(recommendations.documentId, documents.id))
    .orderBy(desc(recommendations.createdAt))
    .all();
  return rows as RecommendationRow[];
}

export type LowScoreDoc = {
  id: string;
  filename: string;
  departmentCode: string | null;
  compliance: number | null;
  governance: number | null;
};

export async function getLowScoreDocuments(threshold = 70): Promise<LowScoreDoc[]> {
  const rows = db
    .select({
      id: documents.id,
      filename: documents.filename,
      departmentCode: departments.code,
      compliance: documentAnalyses.complianceScore,
      governance: documentAnalyses.governanceScore,
    })
    .from(documentAnalyses)
    .innerJoin(documents, eq(documentAnalyses.documentId, documents.id))
    .leftJoin(departments, eq(documents.departmentId, departments.id))
    .all();
  return rows
    .filter(
      (r) =>
        (r.compliance ?? 100) < threshold || (r.governance ?? 100) < threshold,
    )
    .sort(
      (a, b) =>
        (a.compliance ?? 0) + (a.governance ?? 0) - ((b.compliance ?? 0) + (b.governance ?? 0)),
    ) as LowScoreDoc[];
}

export type GapRow = { area: string; current: string; expected: string; sourceFilename: string };

export async function getGapItems(limit = 12): Promise<GapRow[]> {
  const rows = db
    .select({
      gap: documentAnalyses.gapAnalysis,
      filename: documents.filename,
    })
    .from(documentAnalyses)
    .innerJoin(documents, eq(documentAnalyses.documentId, documents.id))
    .all();
  const out: GapRow[] = [];
  for (const r of rows) {
    const gaps = (r.gap as { area: string; current: string; expected: string }[] | null) ?? [];
    for (const g of gaps) {
      out.push({
        area: g.area,
        current: g.current,
        expected: g.expected,
        sourceFilename: r.filename,
      });
      if (out.length >= limit) return out;
    }
  }
  return out;
}

export type ActionRow = {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  status: string;
  departmentCode: string | null;
  documentId: string | null;
  sourceFilename: string | null;
};

export async function getOpenActions(): Promise<ActionRow[]> {
  const rows = db
    .select({
      id: actions.id,
      title: actions.title,
      description: actions.description,
      priority: actions.priority,
      status: actions.status,
      departmentCode: departments.code,
      documentId: actions.documentId,
      sourceFilename: documents.filename,
    })
    .from(actions)
    .leftJoin(departments, eq(actions.departmentId, departments.id))
    .leftJoin(documents, eq(actions.documentId, documents.id))
    .where(inArray(actions.status, ["open", "in_progress", "overdue"]))
    .orderBy(desc(actions.createdAt))
    .all();
  return rows as ActionRow[];
}

export type ActivityItem = {
  action: string;
  title: string;
  at: string;
  documentId?: string | null;
};

export async function getActivityFeed(limit = 30): Promise<ActivityItem[]> {
  const items: ActivityItem[] = [];

  for (const d of db
    .select({ id: documents.id, filename: documents.filename, status: documents.status, createdAt: documents.createdAt, processedAt: documents.processedAt })
    .from(documents)
    .all()) {
    items.push({ action: "UPLOAD", title: d.filename, at: d.createdAt, documentId: d.id });
    if (d.status === "complete" && d.processedAt) {
      items.push({ action: "ANALYZE", title: d.filename, at: d.processedAt, documentId: d.id });
    }
  }

  for (const k of db
    .select({ filename: knowledgeBaseDocuments.filename, description: knowledgeBaseDocuments.description, createdAt: knowledgeBaseDocuments.createdAt })
    .from(knowledgeBaseDocuments)
    .all()) {
    items.push({ action: "KB_ADD", title: k.description?.trim() || k.filename, at: k.createdAt });
  }

  for (const x of db
    .select({ format: exportJobs.format, createdAt: exportJobs.createdAt, documentId: exportJobs.documentId })
    .from(exportJobs)
    .all()) {
    items.push({ action: "EXPORT", title: x.format, at: x.createdAt, documentId: x.documentId });
  }

  for (const a of db.select().from(activityLog).all()) {
    items.push({ action: a.action, title: a.entityType ?? a.action, at: a.createdAt });
  }

  return items
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, limit);
}

export type DepartmentIntelligence = {
  code: string;
  nameEn: string;
  nameAr: string;
  documents: number;
  activeRisks: number;
  openActions: number;
  compliance: number;
  governance: number;
  recentDocuments: { id: string; filename: string; priority: string | null; createdAt: string }[];
};

export async function getDepartmentIntelligence(
  code: string,
): Promise<DepartmentIntelligence | null> {
  const dept = db.select().from(departments).where(eq(departments.code, code)).get();
  if (!dept) return null;

  const stats = (await getDepartmentStats()).find((s) => s.code === code);
  const recentDocuments = db
    .select({
      id: documents.id,
      filename: documents.filename,
      priority: documents.priority,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .where(eq(documents.departmentId, dept.id))
    .orderBy(desc(documents.createdAt))
    .limit(10)
    .all();

  return {
    code: dept.code,
    nameEn: dept.nameEn,
    nameAr: dept.nameAr,
    documents: stats?.documents ?? 0,
    activeRisks: stats?.activeRisks ?? 0,
    openActions: stats?.openActions ?? 0,
    compliance: stats?.compliance ?? 0,
    governance: stats?.governance ?? 0,
    recentDocuments,
  };
}

// Re-export for ergonomic imports in server code.
export { and, eq, sql };
