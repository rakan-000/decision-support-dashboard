/**
 * Export report assembly (server-only).
 *
 * Normalizes a persisted document + analysis into a flat, serializable report
 * model used by both the PDF (print-ready HTML) and PowerPoint generators.
 * Only locally-stored data is used; nothing is sent externally.
 */
import "server-only";
import type { DocumentDetail } from "@/lib/db";
import { departmentName, PRIORITY_META, type Priority } from "@/lib/constants";
import { translate, type Locale } from "@/lib/i18n/dictionary";

export type ReportModel = {
  locale: Locale;
  filename: string;
  department: string;
  priority: string;
  status: string;
  confidence: number;
  compliance: number;
  governance: number;
  isDemo: boolean;
  generatedAt: string;
  executiveSummary: string;
  keyInsights: { title: string; detail: string }[];
  risks: { title: string; severity: string; description: string; evidence: string }[];
  governanceReview: string;
  complianceReview: string;
  gapAnalysis: { area: string; current: string; expected: string }[];
  kpiOpportunities: { name: string; target: string; rationale: string }[];
  recommendations: {
    title: string;
    body: string;
    evidence: string;
    insufficient: boolean;
  }[];
  executiveActions: { title: string; description: string; priority: string }[];
  sources: { title: string }[];
};

export function assembleReport(detail: DocumentDetail, locale: Locale): ReportModel {
  const { doc, analysis } = detail;
  const p = (doc.priority ?? "medium") as Priority;
  const priorityLabel = locale === "ar" ? PRIORITY_META[p].ar : PRIORITY_META[p].en;

  return {
    locale,
    filename: doc.filename,
    department: departmentName(doc.departmentCode, locale),
    priority: priorityLabel,
    status: translate(`docstatus.${doc.status}`, locale),
    confidence: Math.round(analysis?.confidenceScore ?? 0),
    compliance: Math.round(analysis?.complianceScore ?? 0),
    governance: Math.round(analysis?.governanceScore ?? 0),
    isDemo: Boolean(analysis?.isDemo),
    generatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    executiveSummary: analysis?.executiveSummary ?? "",
    keyInsights: analysis?.keyInsights ?? [],
    risks: detail.risks.map((r) => ({
      title: r.title,
      severity: r.severity,
      description: r.description ?? "",
      evidence: r.evidence ?? "",
    })),
    governanceReview: analysis?.governanceReview ?? "",
    complianceReview: analysis?.complianceReview ?? "",
    gapAnalysis: analysis?.gapAnalysis ?? [],
    kpiOpportunities: analysis?.kpiOpportunities ?? [],
    recommendations: detail.recommendations.map((r) => ({
      title: r.title,
      body: r.body,
      evidence: r.evidence ?? "",
      insufficient: !r.isEvidenceSufficient || r.specificity === "insufficient_evidence",
    })),
    executiveActions: detail.actions.map((a) => ({
      title: a.title,
      description: a.description ?? "",
      priority: a.priority,
    })),
    sources: (analysis?.kbSourcesUsed ?? []).map((s) => ({ title: s.title })),
  };
}

/** Labels resolved once for a report, in the requested locale. */
export function reportLabels(locale: Locale) {
  const t = (k: string) => translate(k, locale);
  return {
    appName: t("app.name"),
    reportTitle: locale === "ar" ? "تقرير تنفيذي" : "Executive Report",
    summaryTitle: locale === "ar" ? "ملخص تنفيذي" : "Executive Summary Brief",
    department: t("common.department"),
    priority: t("common.priority"),
    status: t("common.status"),
    confidence: t("common.confidence"),
    compliance: t("metric.complianceScore"),
    governance: t("metric.governanceScore"),
    executiveSummary: t("analysis.executiveSummary"),
    keyInsights: t("analysis.keyInsights"),
    risks: t("analysis.risks"),
    governanceReview: t("analysis.governanceReview"),
    complianceReview: t("analysis.complianceReview"),
    gapAnalysis: t("analysis.gapAnalysis"),
    kpi: t("analysis.kpiOpportunities"),
    recommendations: t("analysis.recommendations"),
    executiveActions: t("analysis.executiveActions"),
    sources: t("analysis.kbSources"),
    insufficient: t("analysis.insufficientEvidence"),
    evidence: t("common.evidence"),
    demo: t("analysis.demoBadge"),
    generated: locale === "ar" ? "تم الإنشاء" : "Generated",
    none: t("common.noData"),
  };
}
