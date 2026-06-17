"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  FileStack,
  AlertTriangle,
  ListTodo,
  FileText,
} from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ScoreGauge } from "@/components/dashboard/charts";
import { PRIORITY_META, type Priority } from "@/lib/constants";
import { formatNumber, formatDate } from "@/lib/utils";
import type { DepartmentIntelligence } from "@/lib/db";

export function DepartmentDetailView({ data }: { data: DepartmentIntelligence }) {
  const { t, locale } = useLocale();

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm">
        <Link href="/departments">
          <ArrowLeft className="size-4 flip-rtl" />
          {t("common.back")}
        </Link>
      </Button>

      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary-100)] text-[var(--primary-700)]">
          <Building2 className="size-6" />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            {locale === "ar" ? data.nameAr : data.nameEn}
          </h1>
          <p className="text-xs text-[var(--muted-foreground)]">{data.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard label={t("dept.documents")} count={data.documents} icon={FileStack} />
        <KpiCard label={t("dept.risks")} count={data.activeRisks} icon={AlertTriangle} accent="var(--risk-high)" />
        <KpiCard label={t("dept.actions")} count={data.openActions} icon={ListTodo} accent="var(--risk-medium)" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.scores")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <ScoreGauge label={t("metric.complianceScore")} value={data.compliance} accent="var(--ok)" />
              <ScoreGauge label={t("metric.governanceScore")} value={data.governance} accent="var(--risk-info)" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("dept.recentDocs")}</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentDocuments.length === 0 ? (
              <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] py-8 text-center text-sm text-[var(--muted-foreground)]">
                {t("common.noData")}
              </div>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {data.recentDocuments.map((d) => {
                  const p = (d.priority ?? "medium") as Priority;
                  return (
                    <li key={d.id}>
                      <Link
                        href={`/analysis/${d.id}`}
                        className="-mx-2 flex items-center gap-3 rounded-[var(--radius-md)] px-2 py-3 transition-colors hover:bg-[var(--muted)]"
                      >
                        <FileText className="size-4 shrink-0 text-[var(--muted-foreground)]" />
                        <p className="min-w-0 flex-1 truncate text-sm text-[var(--foreground)]">
                          {d.filename}
                        </p>
                        <Badge variant="outline" dot={PRIORITY_META[p].color} className="shrink-0">
                          {locale === "ar" ? PRIORITY_META[p].ar : PRIORITY_META[p].en}
                        </Badge>
                        <span className="hidden shrink-0 text-xs text-[var(--muted-foreground)] sm:inline">
                          {formatDate(d.createdAt)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
