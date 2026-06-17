"use client";

import {
  UploadCloud,
  Sparkles,
  Library,
  FileDown,
  Activity as ActivityIcon,
} from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { departmentName, PRIORITY_META, type Priority } from "@/lib/constants";
import { formatNumber, formatPercent, formatDate, cn } from "@/lib/utils";

// ---- Radial score gauge ----------------------------------------------------

export function ScoreGauge({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - v / 100);
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-2">
      <div className="relative size-32">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--muted)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={accent}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-semibold" style={{ color: accent }}>
            {formatPercent(v)}
          </span>
        </div>
      </div>
      <p className="text-xs font-medium text-[var(--muted-foreground)]">{label}</p>
    </div>
  );
}

// ---- Generic horizontal bars ----------------------------------------------

export function HBars({
  items,
}: {
  items: { label: string; value: number; color?: string; suffix?: string }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (items.every((i) => i.value === 0)) {
    return <EmptyMini />;
  }
  return (
    <div className="space-y-2.5">
      {items.map((it, i) => (
        <div key={i}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="truncate text-[var(--foreground)]">{it.label}</span>
            <span className="font-medium text-[var(--muted-foreground)]">
              {it.suffix ? it.suffix : formatNumber(it.value)}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(it.value / max) * 100}%`,
                backgroundColor: it.color ?? "var(--primary-500)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Department distribution ----------------------------------------------

type Stat = {
  code: string;
  nameEn: string;
  nameAr: string;
  documents: number;
  activeRisks: number;
  openActions: number;
  compliance: number;
  governance: number;
};

export function DepartmentDistribution({ stats }: { stats: Stat[] }) {
  const { t, locale } = useLocale();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.deptDistribution")}</CardTitle>
      </CardHeader>
      <CardContent>
        <HBars
          items={stats.map((s) => ({
            label: locale === "ar" ? s.nameAr : s.nameEn,
            value: s.documents,
          }))}
        />
      </CardContent>
    </Card>
  );
}

export function DepartmentComparison({ stats }: { stats: Stat[] }) {
  const { t, locale } = useLocale();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.deptComparison")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((s) => (
            <div key={s.code}>
              <p className="mb-1.5 text-xs font-medium text-[var(--foreground)]">
                {locale === "ar" ? s.nameAr : s.nameEn}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <MiniMeter label={t("metric.complianceScore")} value={s.compliance} color="var(--ok)" />
                <MiniMeter label={t("metric.governanceScore")} value={s.governance} color="var(--risk-info)" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MiniMeter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] text-[var(--muted-foreground)]">
        <span className="truncate">{label}</span>
        <span>{formatPercent(value)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ---- Risk heatmap ----------------------------------------------------------

export function RiskHeatmap({
  data,
}: {
  data: { severity: string; status: string; c: number }[];
}) {
  const { t, locale } = useLocale();
  const severities: Priority[] = ["critical", "high", "medium", "low"];
  const statuses = ["open", "in_progress", "mitigated", "closed"] as const;
  const statusLabels: Record<string, { en: string; ar: string }> = {
    open: { en: "Open", ar: "مفتوح" },
    in_progress: { en: "In Progress", ar: "قيد التنفيذ" },
    mitigated: { en: "Mitigated", ar: "تمت المعالجة" },
    closed: { en: "Closed", ar: "مغلق" },
  };
  const lookup = new Map(data.map((d) => [`${d.severity}|${d.status}`, d.c]));
  const max = Math.max(1, ...data.map((d) => d.c));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.riskHeatmap")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-1 text-center text-xs">
            <thead>
              <tr>
                <th />
                {statuses.map((s) => (
                  <th key={s} className="px-1 pb-1 font-medium text-[var(--muted-foreground)]">
                    {locale === "ar" ? statusLabels[s].ar : statusLabels[s].en}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {severities.map((sev) => (
                <tr key={sev}>
                  <td className="pe-2 text-end font-medium text-[var(--muted-foreground)]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full" style={{ backgroundColor: PRIORITY_META[sev].color }} />
                      {locale === "ar" ? PRIORITY_META[sev].ar : PRIORITY_META[sev].en}
                    </span>
                  </td>
                  {statuses.map((st) => {
                    const c = lookup.get(`${sev}|${st}`) ?? 0;
                    const intensity = c === 0 ? 0 : 0.15 + 0.85 * (c / max);
                    return (
                      <td key={st}>
                        <div
                          className="flex h-10 items-center justify-center rounded-[var(--radius-sm)] text-sm font-semibold"
                          style={{
                            backgroundColor:
                              c === 0
                                ? "var(--muted)"
                                : `color-mix(in srgb, ${PRIORITY_META[sev].color} ${Math.round(
                                    intensity * 100,
                                  )}%, transparent)`,
                            color: c === 0 ? "var(--muted-foreground)" : "#fff",
                          }}
                        >
                          {formatNumber(c)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Priority matrix -------------------------------------------------------

export function PriorityMatrix({
  dist,
}: {
  dist: { critical: number; high: number; medium: number; low: number };
}) {
  const { t, locale } = useLocale();
  const cells: Priority[] = ["critical", "high", "medium", "low"];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.priorityMatrix")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {cells.map((p) => (
            <div
              key={p}
              className="flex flex-col items-start justify-between rounded-[var(--radius-md)] border p-4"
              style={{ borderColor: `color-mix(in srgb, ${PRIORITY_META[p].color} 40%, var(--border))` }}
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
                <span className="size-2 rounded-full" style={{ backgroundColor: PRIORITY_META[p].color }} />
                {locale === "ar" ? PRIORITY_META[p].ar : PRIORITY_META[p].en}
              </span>
              <span className="mt-2 text-2xl font-semibold" style={{ color: PRIORITY_META[p].color }}>
                {formatNumber(dist[p])}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Recommendation status -------------------------------------------------

export function RecommendationStatus({
  counts,
}: {
  counts: { pending: number; accepted: number; implemented: number; rejected: number };
}) {
  const { t } = useLocale();
  const items = [
    { key: "pending", label: t("rec.status.pending"), value: counts.pending, color: "var(--warn)" },
    { key: "accepted", label: t("rec.status.accepted"), value: counts.accepted, color: "var(--risk-info)" },
    { key: "implemented", label: t("rec.status.implemented"), value: counts.implemented, color: "var(--ok)" },
    { key: "rejected", label: t("rec.status.rejected"), value: counts.rejected, color: "var(--danger)" },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.recommendationStatus")}</CardTitle>
      </CardHeader>
      <CardContent>
        <HBars items={items} />
      </CardContent>
    </Card>
  );
}

// ---- Activity feed ---------------------------------------------------------

const ACTION_META: Record<string, { icon: React.ComponentType<{ className?: string }>; en: string; ar: string }> = {
  UPLOAD: { icon: UploadCloud, en: "Document uploaded", ar: "تم رفع وثيقة" },
  ANALYZE: { icon: Sparkles, en: "Analysis completed", ar: "اكتمل التحليل" },
  KB_ADD: { icon: Library, en: "Knowledge base updated", ar: "تحديث قاعدة المعرفة" },
  EXPORT: { icon: FileDown, en: "Report exported", ar: "تم تصدير تقرير" },
  SEED: { icon: ActivityIcon, en: "Demo data seeded", ar: "تحميل بيانات تجريبية" },
};

export function ActivityFeed({
  items,
  hideHeader = false,
}: {
  items: { action: string; title: string; at: string }[];
  hideHeader?: boolean;
}) {
  const { t, locale } = useLocale();
  return (
    <Card>
      {!hideHeader && (
        <CardHeader>
          <CardTitle>{t("history.title")}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {items.length === 0 ? (
          <EmptyMini />
        ) : (
          <ul className="space-y-3">
            {items.map((it, i) => {
              const meta = ACTION_META[it.action] ?? ACTION_META.SEED;
              const Icon = meta.icon;
              return (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--foreground)]">
                      {locale === "ar" ? meta.ar : meta.en}
                    </p>
                    <p className="truncate text-xs text-[var(--muted-foreground)]">
                      {it.title} · {formatDate(it.at)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyMini() {
  const { t } = useLocale();
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] py-8 text-center text-xs text-[var(--muted-foreground)]">
      {t("common.noData")}
    </div>
  );
}

// Helper re-exported for module pages that show dept names.
export { departmentName, cn };
