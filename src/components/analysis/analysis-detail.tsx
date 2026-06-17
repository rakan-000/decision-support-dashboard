"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Scale,
  GitCompareArrows,
  Lightbulb,
  ListChecks,
  Target,
  Library,
  Info,
  Sparkles,
  Clock,
  LayoutGrid,
} from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/analysis/export-menu";
import { departmentName, PRIORITY_META, type Priority } from "@/lib/constants";
import { formatDate, formatPercent, formatNumber, cn } from "@/lib/utils";

type Insight = { title: string; detail: string };
type GapItem = { area: string; current: string; expected: string; kbSource?: string };
type Kpi = { name: string; target: string; rationale: string };
type Swot = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
} | null;
type Pestel = {
  political: string[];
  economic: string[];
  social: string[];
  technological: string[];
  environmental: string[];
  legal: string[];
} | null;

export type AnalysisDetailProps = {
  doc: {
    id: string;
    filename: string;
    fileType: string;
    status: string;
    priority: string | null;
    departmentCode: string | null;
    detectedOwner: string | null;
    language: string | null;
    errorMessage: string | null;
    createdAt: string;
  };
  analysis: {
    executiveSummary: string | null;
    keyInsights: Insight[] | null;
    governanceReview: string | null;
    complianceReview: string | null;
    gapAnalysis: GapItem[] | null;
    rootCauseAnalysis: string | null;
    swotAnalysis: Swot;
    pestelAnalysis: Pestel;
    kpiOpportunities: Kpi[] | null;
    confidenceScore: number | null;
    complianceScore: number | null;
    governanceScore: number | null;
    kbSourcesUsed: { title: string; score?: number }[] | null;
    analysisModel: string | null;
    isDemo: boolean;
  } | null;
  risks: {
    id: string;
    title: string;
    description: string | null;
    severity: string;
    category: string | null;
    evidence: string | null;
  }[];
  actions: { id: string; title: string; description: string | null; priority: string }[];
  recommendations: {
    id: string;
    title: string;
    body: string;
    evidence: string | null;
    isEvidenceSufficient: boolean;
    specificity: string;
  }[];
};

const INSUFFICIENT = "Insufficient Evidence Found";

type TabKey =
  | "overview"
  | "risks"
  | "governance"
  | "compliance"
  | "recommendations"
  | "actions"
  | "kpi"
  | "sources";

export function AnalysisDetail({
  doc,
  analysis,
  risks,
  actions,
  recommendations,
}: AnalysisDetailProps) {
  const { t, locale } = useLocale();
  const [tab, setTab] = useState<TabKey>("overview");

  const priority = (doc.priority ?? "medium") as Priority;

  if (doc.status !== "complete" || !analysis) {
    const failed = doc.status === "failed";
    return (
      <div>
        <BackLink label={t("common.back")} />
        <Card className="mt-4 flex flex-col items-center justify-center gap-3 py-20 text-center">
          {failed ? (
            <AlertTriangle className="size-8 text-[var(--danger)]" />
          ) : (
            <Clock className="size-8 text-[var(--muted-foreground)]" />
          )}
          <p className="text-sm font-medium text-[var(--foreground)]">{doc.filename}</p>
          <p className="text-sm text-[var(--muted-foreground)]">
            {failed ? doc.errorMessage || t("docstatus.failed") : t("upload.processing")}
          </p>
        </Card>
      </div>
    );
  }

  const sources = analysis.kbSourcesUsed ?? [];

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { key: "overview", label: t("analysis.overview"), icon: LayoutGrid },
    { key: "risks", label: t("analysis.risks"), icon: AlertTriangle, count: risks.length },
    { key: "governance", label: t("analysis.governanceReview"), icon: ShieldCheck },
    { key: "compliance", label: t("analysis.complianceReview"), icon: Scale },
    { key: "recommendations", label: t("analysis.recommendations"), icon: Lightbulb, count: recommendations.length },
    { key: "actions", label: t("analysis.executiveActions"), icon: ListChecks, count: actions.length },
    { key: "kpi", label: t("analysis.kpiOpportunities"), icon: Target, count: analysis.kpiOpportunities?.length ?? 0 },
    { key: "sources", label: t("analysis.kbSources"), icon: Library, count: sources.length },
  ];

  return (
    <div className="space-y-6">
      <BackLink label={t("common.back")} />

      {/* Executive header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--muted)] text-[var(--muted-foreground)]">
            <FileText className="size-5" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold tracking-tight text-[var(--foreground)]">
              {doc.filename}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
              <Badge variant="outline" dot={PRIORITY_META[priority].color}>
                {locale === "ar" ? PRIORITY_META[priority].ar : PRIORITY_META[priority].en}
              </Badge>
              <span>{departmentName(doc.departmentCode, locale)}</span>
              <span>·</span>
              <span>{formatDate(doc.createdAt)}</span>
              {doc.detectedOwner && (
                <>
                  <span>·</span>
                  <span>{t("common.owner")}: {doc.detectedOwner}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {analysis.isDemo ? (
            <Badge variant="warning">
              <Info className="size-3.5" />
              {t("analysis.demoBadge")}
            </Badge>
          ) : (
            <Badge variant="primary">
              <Sparkles className="size-3.5" />
              {t("analysis.realBadge")}
            </Badge>
          )}
          <ExportMenu documentId={doc.id} />
        </div>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ScoreCard label={t("common.confidence")} value={analysis.confidenceScore} accent="var(--primary-500)" />
        <ScoreCard label={t("metric.complianceScore")} value={analysis.complianceScore} accent="var(--ok)" />
        <ScoreCard label={t("metric.governanceScore")} value={analysis.governanceScore} accent="var(--risk-info)" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-[var(--border)]">
        {tabs.map((tb) => {
          const Icon = tb.icon;
          const active = tab === tb.key;
          return (
            <button
              key={tb.key}
              type="button"
              onClick={() => setTab(tb.key)}
              className={cn(
                "inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors -mb-px",
                active
                  ? "border-[var(--primary-500)] text-[var(--foreground)]"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
              )}
            >
              <Icon className="size-4" />
              {tb.label}
              {tb.count != null && tb.count > 0 && (
                <span className="ms-1 rounded-full bg-[var(--muted)] px-1.5 text-[10px] text-[var(--muted-foreground)]">
                  {formatNumber(tb.count)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      {tab === "overview" && (
        <div className="space-y-6">
          <Section icon={FileText} title={t("analysis.executiveSummary")}>
            <p className="text-sm leading-relaxed text-[var(--foreground)]">
              {analysis.executiveSummary}
            </p>
          </Section>
          {analysis.keyInsights && analysis.keyInsights.length > 0 && (
            <Section icon={Lightbulb} title={t("analysis.keyInsights")}>
              <ul className="space-y-3">
                {analysis.keyInsights.map((ins, i) => (
                  <li key={i} className="rounded-[var(--radius-md)] bg-[var(--muted)] p-3">
                    <p className="text-sm font-medium text-[var(--foreground)]">{ins.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{ins.detail}</p>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}

      {tab === "risks" && (
        <div className="space-y-6">
          <Section icon={AlertTriangle} title={t("analysis.risks")}>
            {risks.length === 0 ? (
              <Empty label={t("common.noData")} />
            ) : (
              <div className="space-y-2">
                {risks.map((r) => {
                  const sev = (r.severity as Priority) ?? "medium";
                  return (
                    <div key={r.id} className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-[var(--foreground)]">{r.title}</p>
                        <Badge variant="outline" dot={PRIORITY_META[sev].color} className="shrink-0">
                          {locale === "ar" ? PRIORITY_META[sev].ar : PRIORITY_META[sev].en}
                        </Badge>
                      </div>
                      {r.description && (
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{r.description}</p>
                      )}
                      {r.evidence && r.evidence !== INSUFFICIENT && (
                        <p className="mt-2 border-s-2 border-[var(--border)] ps-2 text-xs italic text-[var(--muted-foreground)]">
                          {t("common.evidence")}: {r.evidence}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          <Section icon={GitCompareArrows} title={t("analysis.swot")}>
            {analysis.swotAnalysis ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Quadrant title={t("swot.strengths")} items={analysis.swotAnalysis.strengths} tone="ok" />
                <Quadrant title={t("swot.weaknesses")} items={analysis.swotAnalysis.weaknesses} tone="danger" />
                <Quadrant title={t("swot.opportunities")} items={analysis.swotAnalysis.opportunities} tone="info" />
                <Quadrant title={t("swot.threats")} items={analysis.swotAnalysis.threats} tone="warn" />
              </div>
            ) : (
              <Empty label={t("analysis.notApplicable")} />
            )}
          </Section>

          <Section icon={GitCompareArrows} title={t("analysis.pestel")}>
            {analysis.pestelAnalysis ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Quadrant title={t("pestel.political")} items={analysis.pestelAnalysis.political} />
                <Quadrant title={t("pestel.economic")} items={analysis.pestelAnalysis.economic} />
                <Quadrant title={t("pestel.social")} items={analysis.pestelAnalysis.social} />
                <Quadrant title={t("pestel.technological")} items={analysis.pestelAnalysis.technological} />
                <Quadrant title={t("pestel.environmental")} items={analysis.pestelAnalysis.environmental} />
                <Quadrant title={t("pestel.legal")} items={analysis.pestelAnalysis.legal} />
              </div>
            ) : (
              <Empty label={t("analysis.notApplicable")} />
            )}
          </Section>

          {analysis.rootCauseAnalysis && (
            <Section icon={GitCompareArrows} title={t("analysis.rootCause")}>
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                {analysis.rootCauseAnalysis}
              </p>
            </Section>
          )}
        </div>
      )}

      {tab === "governance" && (
        <div className="space-y-6">
          <Section icon={ShieldCheck} title={t("analysis.governanceReview")}>
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
              {analysis.governanceReview || t("common.noData")}
            </p>
          </Section>
          {analysis.gapAnalysis && analysis.gapAnalysis.length > 0 && (
            <Section icon={GitCompareArrows} title={t("analysis.gapAnalysis")}>
              <div className="space-y-2">
                {analysis.gapAnalysis.map((g, i) => (
                  <div key={i} className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                    <p className="text-sm font-medium text-[var(--foreground)]">{g.area}</p>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-[var(--muted-foreground)]">
                          {locale === "ar" ? "الحالي" : "Current"}
                        </p>
                        <p className="text-sm text-[var(--foreground)]">{g.current || "-"}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-[var(--muted-foreground)]">
                          {locale === "ar" ? "المتوقع" : "Expected"}
                        </p>
                        <p className="text-sm text-[var(--foreground)]">{g.expected || "-"}</p>
                      </div>
                    </div>
                    {g.kbSource && (
                      <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                        {t("common.source")}: {g.kbSource}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}

      {tab === "compliance" && (
        <Section icon={Scale} title={t("analysis.complianceReview")}>
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            {analysis.complianceReview || t("common.noData")}
          </p>
        </Section>
      )}

      {tab === "recommendations" && (
        <Section icon={Lightbulb} title={t("analysis.recommendations")}>
          {recommendations.length === 0 ? (
            <Empty label={t("common.noData")} />
          ) : (
            <div className="space-y-3">
              {recommendations.map((r) => {
                const insufficient =
                  !r.isEvidenceSufficient || r.specificity === "insufficient_evidence";
                return (
                  <div key={r.id} className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                    <p className="text-sm font-medium text-[var(--foreground)]">{r.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">{r.body}</p>
                    {insufficient ? (
                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                        <AlertTriangle className="size-3.5" />
                        {t("analysis.insufficientEvidence")}
                      </div>
                    ) : (
                      r.evidence && (
                        <p className="mt-2 border-s-2 border-[var(--primary-500)] ps-2 text-xs italic text-[var(--muted-foreground)]">
                          {t("common.evidence")}: {r.evidence}
                        </p>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Section>
      )}

      {tab === "actions" && (
        <Section icon={ListChecks} title={t("analysis.executiveActions")}>
          {actions.length === 0 ? (
            <Empty label={t("common.noData")} />
          ) : (
            <div className="space-y-2">
              {actions.map((a) => {
                const p = (a.priority as Priority) ?? "medium";
                return (
                  <div key={a.id} className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)]">{a.title}</p>
                      {a.description && (
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">{a.description}</p>
                      )}
                    </div>
                    <Badge variant="outline" dot={PRIORITY_META[p].color} className="shrink-0">
                      {locale === "ar" ? PRIORITY_META[p].ar : PRIORITY_META[p].en}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Section>
      )}

      {tab === "kpi" && (
        <Section icon={Target} title={t("analysis.kpiOpportunities")}>
          {analysis.kpiOpportunities && analysis.kpiOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {analysis.kpiOpportunities.map((k, i) => (
                <div key={i} className="rounded-[var(--radius-md)] bg-[var(--muted)] p-3">
                  <p className="text-sm font-medium text-[var(--foreground)]">{k.name}</p>
                  {k.target && <p className="mt-1 text-sm text-[var(--primary-700)]">{k.target}</p>}
                  {k.rationale && (
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">{k.rationale}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Empty label={t("common.noData")} />
          )}
        </Section>
      )}

      {tab === "sources" && (
        <Section icon={Library} title={t("analysis.kbSources")}>
          {sources.length === 0 ? (
            <Empty label={t("common.noData")} />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {sources.map((s, i) => (
                <div key={i} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary-100)] text-[var(--primary-700)]">
                    <Library className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--foreground)]">{s.title}</p>
                    {typeof s.score === "number" && (
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {t("common.confidence")}: {formatNumber(Math.round(s.score * 100) / 100)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      )}
    </div>
  );
}

// ---- building blocks -------------------------------------------------------

function BackLink({ label }: { label: string }) {
  return (
    <Button asChild variant="ghost" size="sm">
      <Link href="/analysis">
        <ArrowLeft className="size-4 flip-rtl" />
        {label}
      </Link>
    </Button>
  );
}

function ScoreCard({ label, value, accent }: { label: string; value: number | null; accent: string }) {
  const v = Math.round(value ?? 0);
  return (
    <Card className="p-5">
      <p className="text-xs font-medium text-[var(--muted-foreground)]">{label}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight" style={{ color: accent }}>
          {formatPercent(v)}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <div className="h-full rounded-full" style={{ width: `${v}%`, backgroundColor: accent }} />
      </div>
    </Card>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2">
        <Icon className="size-4 text-[var(--muted-foreground)]" />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] py-8 text-center text-sm text-[var(--muted-foreground)]">
      {label}
    </div>
  );
}

function Quadrant({
  title,
  items,
  tone = "info",
}: {
  title: string;
  items: string[];
  tone?: "ok" | "danger" | "warn" | "info";
}) {
  const color =
    tone === "ok"
      ? "var(--ok)"
      : tone === "danger"
        ? "var(--danger)"
        : tone === "warn"
          ? "var(--warn)"
          : "var(--risk-info)";
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
        <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-[var(--muted-foreground)]">-</p>
      ) : (
        <ul className="list-inside list-disc space-y-1 text-sm text-[var(--muted-foreground)]">
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
