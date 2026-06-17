"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Lightbulb, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { PageHeader } from "@/components/layout/page-header";
import { Stagger, StaggerItem } from "@/components/motion/primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { departmentName, DEPARTMENTS, RECOMMENDATION_STATUSES } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import type { RecommendationRow } from "@/lib/db";

const STATUS_VARIANT: Record<string, "neutral" | "primary" | "success" | "warning" | "danger"> = {
  pending: "warning",
  accepted: "primary",
  implemented: "success",
  rejected: "danger",
};

export function RecommendationsView({ items }: { items: RecommendationRow[] }) {
  const { t, locale } = useLocale();
  const [status, setStatus] = useState("all");
  const [dept, setDept] = useState("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { pending: 0, accepted: 0, implemented: 0, rejected: 0 };
    for (const r of items) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [items]);

  const filtered = items.filter((r) => {
    if (status !== "all" && r.status !== status) return false;
    if (dept !== "all" && r.departmentCode !== dept) return false;
    return true;
  });

  const selectClass =
    "h-8 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-2 text-xs text-[var(--foreground)]";

  return (
    <div>
      <PageHeader title={t("recommendations.title")} />

      {/* Stats strip */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {RECOMMENDATION_STATUSES.map((s) => (
          <Card key={s} className="p-4">
            <p className="text-xs text-[var(--muted-foreground)]">{t(`rec.status.${s}`)}</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--foreground)]">
              {formatNumber(counts[s] ?? 0)}
            </p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass} aria-label={t("common.status")}>
          <option value="all">{t("common.status")}</option>
          {RECOMMENDATION_STATUSES.map((s) => (
            <option key={s} value={s}>{t(`rec.status.${s}`)}</option>
          ))}
        </select>
        <select value={dept} onChange={(e) => setDept(e.target.value)} className={selectClass} aria-label={t("common.department")}>
          <option value="all">{t("common.department")}</option>
          {DEPARTMENTS.map((d) => (
            <option key={d.code} value={d.code}>{locale === "ar" ? d.name_ar : d.name_en}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <Lightbulb className="size-8 text-[var(--muted-foreground)]" />
          <p className="text-sm text-[var(--muted-foreground)]">{t("common.noData")}</p>
        </Card>
      ) : (
        <Stagger className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((r) => {
            const insufficient =
              !r.isEvidenceSufficient || r.specificity === "insufficient_evidence";
            return (
              <StaggerItem key={r.id}>
              <Card className="h-full p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{r.title}</p>
                  <Badge variant={STATUS_VARIANT[r.status] ?? "neutral"} className="shrink-0">
                    {t(`rec.status.${r.status}`)}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">{r.body}</p>

                {insufficient ? (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                    <AlertTriangle className="size-3.5" />
                    {t("analysis.insufficientEvidence")}
                  </div>
                ) : (
                  r.evidence && (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--ok)]">
                      <CheckCircle2 className="size-3.5" />
                      {t("common.evidence")}
                    </p>
                  )
                )}

                <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs text-[var(--muted-foreground)]">
                  <span>{departmentName(r.departmentCode, locale)}</span>
                  {r.documentId && (
                    <Link
                      href={`/analysis/${r.documentId}`}
                      className="inline-flex items-center gap-1 text-[var(--primary-700)] hover:underline"
                    >
                      <FileText className="size-3.5" />
                      {t("common.source")}
                    </Link>
                  )}
                </div>
              </Card>
              </StaggerItem>
            );
          })}
        </Stagger>
      )}
    </div>
  );
}
