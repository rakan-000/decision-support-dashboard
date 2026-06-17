"use client";

import Link from "next/link";
import { Building2, FileStack, AlertTriangle, ListTodo, ArrowRight } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { PageHeader } from "@/components/layout/page-header";
import { Stagger, StaggerItem, HoverLift } from "@/components/motion/primitives";
import { Card } from "@/components/ui/card";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { DepartmentStat } from "@/lib/db";

export function DepartmentsView({ stats }: { stats: DepartmentStat[] }) {
  const { t, locale } = useLocale();

  return (
    <div>
      <PageHeader title={t("departments.title")} />
      <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <StaggerItem key={s.code}>
            <HoverLift>
              <Link href={`/departments/${s.code}`} className="block h-full">
                <Card className="h-full p-5 transition-shadow hover:shadow-[var(--glow-primary)]">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--primary-100)] text-[var(--primary-700)]">
                  <Building2 className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                    {locale === "ar" ? s.nameAr : s.nameEn}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">{s.code}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Stat icon={FileStack} label={t("dept.documents")} value={s.documents} />
                <Stat icon={AlertTriangle} label={t("dept.risks")} value={s.activeRisks} />
                <Stat icon={ListTodo} label={t("dept.actions")} value={s.openActions} />
              </div>

              <div className="mt-4 space-y-2">
                <Meter label={t("metric.complianceScore")} value={s.compliance} color="var(--ok)" />
                <Meter label={t("metric.governanceScore")} value={s.governance} color="var(--risk-info)" />
              </div>

              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--primary-700)]">
                {t("dept.view")}
                <ArrowRight className="size-3.5 flip-rtl" />
              </div>
                </Card>
              </Link>
            </HoverLift>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--muted)] p-2">
      <Icon className="mx-auto size-4 text-[var(--muted-foreground)]" />
      <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">{formatNumber(value)}</p>
      <p className="truncate text-[10px] text-[var(--muted-foreground)]">{label}</p>
    </div>
  );
}

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] text-[var(--muted-foreground)]">
        <span>{label}</span>
        <span>{formatPercent(value)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
