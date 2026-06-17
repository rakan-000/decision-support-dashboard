"use client";

import Link from "next/link";
import { Zap, ListChecks, Lightbulb, FileText } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { departmentName, PRIORITY_META, type Priority } from "@/lib/constants";
import type { ActionRow, RecommendationRow } from "@/lib/db";

export function DecisionsView({
  actions,
  recommended,
}: {
  actions: ActionRow[];
  recommended: RecommendationRow[];
}) {
  const { t, locale } = useLocale();

  const immediate = actions.filter((a) => a.priority === "critical" || a.priority === "high");
  const columns: { key: string; label: string }[] = [
    { key: "open", label: t("status.open") },
    { key: "in_progress", label: t("status.in_progress") },
    { key: "overdue", label: t("status.overdue") },
  ];

  return (
    <div>
      <PageHeader title={t("decisions.title")} />

      {/* Immediate attention */}
      <Card className="mb-4">
        <CardHeader className="flex-row items-center gap-2">
          <Zap className="size-4 text-[var(--risk-high)]" />
          <CardTitle>{t("decisions.immediate")}</CardTitle>
        </CardHeader>
        <CardContent>
          {immediate.length === 0 ? (
            <Empty label={t("decisions.noImmediate")} />
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {immediate.map((a) => {
                const p = (a.priority as Priority) ?? "high";
                return (
                  <div
                    key={a.id}
                    className="rounded-[var(--radius-md)] border p-3"
                    style={{ borderColor: `color-mix(in srgb, ${PRIORITY_META[p].color} 45%, var(--border))` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-[var(--foreground)]">{a.title}</p>
                      <Badge variant="outline" dot={PRIORITY_META[p].color} className="shrink-0">
                        {locale === "ar" ? PRIORITY_META[p].ar : PRIORITY_META[p].en}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      {departmentName(a.departmentCode, locale)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Executive action board */}
      <Card className="mb-4">
        <CardHeader className="flex-row items-center gap-2">
          <ListChecks className="size-4 text-[var(--muted-foreground)]" />
          <CardTitle>{t("decisions.actionBoard")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {columns.map((col) => {
              const colActions = actions.filter((a) => a.status === col.key);
              return (
                <div key={col.key}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                    {col.label} ({colActions.length})
                  </p>
                  <div className="space-y-2">
                    {colActions.length === 0 ? (
                      <Empty label={t("common.noData")} />
                    ) : (
                      colActions.map((a) => {
                        const p = (a.priority as Priority) ?? "medium";
                        return (
                          <div key={a.id} className="rounded-[var(--radius-md)] bg-[var(--muted)] p-3">
                            <p className="text-sm font-medium text-[var(--foreground)]">{a.title}</p>
                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className="size-2 rounded-full"
                                style={{ backgroundColor: PRIORITY_META[p].color }}
                              />
                              <span className="text-xs text-[var(--muted-foreground)]">
                                {departmentName(a.departmentCode, locale)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommended decisions */}
      <Card>
        <CardHeader className="flex-row items-center gap-2">
          <Lightbulb className="size-4 text-[var(--muted-foreground)]" />
          <CardTitle>{t("decisions.recommended")}</CardTitle>
        </CardHeader>
        <CardContent>
          {recommended.length === 0 ? (
            <Empty label={t("common.noData")} />
          ) : (
            <div className="space-y-3">
              {recommended.map((r) => (
                <div key={r.id} className="rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{r.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    {t("decisions.expectedOutcome")}: {r.body}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] py-6 text-center text-xs text-[var(--muted-foreground)]">
      {label}
    </div>
  );
}
