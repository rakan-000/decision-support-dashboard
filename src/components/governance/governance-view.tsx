"use client";

import Link from "next/link";
import { ShieldCheck, GitCompareArrows, FileText, AlertTriangle } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/primitives";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScoreGauge, DepartmentComparison } from "@/components/dashboard/charts";
import { departmentName } from "@/lib/constants";
import { formatPercent } from "@/lib/utils";
import type { DepartmentStat, LowScoreDoc, GapRow } from "@/lib/db";

export function GovernanceView({
  compliance,
  governance,
  lowScoreDocs,
  gaps,
  deptStats,
}: {
  compliance: number;
  governance: number;
  lowScoreDocs: LowScoreDoc[];
  gaps: GapRow[];
  deptStats: DepartmentStat[];
}) {
  const { t, locale } = useLocale();

  return (
    <div>
      <PageHeader title={t("governance.title")} />

      <Reveal className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.scores")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <ScoreGauge label={t("metric.complianceScore")} value={compliance} accent="var(--ok)" />
              <ScoreGauge label={t("metric.governanceScore")} value={governance} accent="var(--risk-info)" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("governance.policyAlignment")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-xs text-[var(--muted-foreground)]">
              {t("governance.alignmentDesc")}
            </p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-semibold text-[var(--ok)]">
                {formatPercent(compliance)}
              </span>
              <ShieldCheck className="mb-1.5 size-5 text-[var(--ok)]" />
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
              <div className="h-full rounded-full bg-[var(--ok)]" style={{ width: `${compliance}%` }} />
            </div>
          </CardContent>
        </Card>
      </Reveal>

      <Reveal className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Low-score documents */}
        <Card>
          <CardHeader>
            <CardTitle>{t("governance.lowScore")}</CardTitle>
          </CardHeader>
          <CardContent>
            {lowScoreDocs.length === 0 ? (
              <Empty label={t("common.noData")} />
            ) : (
              <ul className="space-y-2">
                {lowScoreDocs.map((d) => (
                  <li key={d.id}>
                    <Link
                      href={`/analysis/${d.id}`}
                      className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)] p-3 transition-colors hover:bg-[var(--muted)]"
                    >
                      <FileText className="size-4 shrink-0 text-[var(--muted-foreground)]" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--foreground)]">
                          {d.filename}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {departmentName(d.departmentCode, locale)}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-3 text-xs">
                        <span className="text-[var(--ok)]">{formatPercent(d.compliance ?? 0)}</span>
                        <span className="text-[var(--risk-info)]">{formatPercent(d.governance ?? 0)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Gap summary */}
        <Card>
          <CardHeader className="flex-row items-center gap-2">
            <GitCompareArrows className="size-4 text-[var(--muted-foreground)]" />
            <CardTitle>{t("governance.gapSummary")}</CardTitle>
          </CardHeader>
          <CardContent>
            {gaps.length === 0 ? (
              <Empty label={t("common.noData")} />
            ) : (
              <ul className="space-y-2">
                {gaps.map((g, i) => (
                  <li key={i} className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-[var(--warn)]" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--foreground)]">{g.area}</p>
                        <p className="truncate text-xs text-[var(--muted-foreground)]">
                          {g.sourceFilename}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Reveal>

      <Reveal className="mt-4">
        <DepartmentComparison stats={deptStats} />
      </Reveal>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] py-8 text-center text-sm text-[var(--muted-foreground)]">
      {label}
    </div>
  );
}
