"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { PageHeader } from "@/components/layout/page-header";
import { Stagger, StaggerItem, HoverLift } from "@/components/motion/primitives";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { DepartmentStat } from "@/lib/db";

export function DepartmentsView({ stats }: { stats: DepartmentStat[] }) {
  const { t, locale } = useLocale();

  return (
    <div>
      <PageHeader title={t("departments.title")} />
      <Stagger className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {stats.map((department, index) => (
          <StaggerItem key={department.code}>
            <HoverLift>
              <Link
                href={`/departments/${department.code}`}
                className="group relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card-solid)] p-6 transition-[border-color,background-color,box-shadow] duration-300 hover:border-[var(--primary-500)] hover:bg-[var(--surface-100)] hover:shadow-[var(--glow-soft)] focus-visible:outline-2 focus-visible:outline-[var(--primary-500)] sm:p-7"
              >
                <span className="pointer-events-none absolute inset-y-0 w-1 bg-[var(--primary-500)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 ltr:left-0 rtl:right-0" />
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="font-mono text-sm tracking-widest text-[var(--primary-500)]">{String(index + 1).padStart(2, "0")} / {department.code}</span>
                    <h2 className="mt-4 text-2xl font-semibold leading-snug text-[var(--foreground)] sm:text-3xl">
                      {locale === "ar" ? department.nameAr : department.nameEn}
                    </h2>
                  </div>
                  <ArrowUpRight className="size-5 shrink-0 text-[var(--text-muted)] transition-[transform,color] duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[var(--primary-500)] flip-rtl" />
                </div>

                <div className="mt-auto pt-7">
                  <div className="grid grid-cols-3 gap-3 border-y border-[var(--border)] py-5">
                    <Metric label={t("dept.documents")} value={department.documents} />
                    <Metric label={t("dept.risks")} value={department.activeRisks} />
                    <Metric label={t("dept.actions")} value={department.openActions} />
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Meter label={t("metric.complianceScore")} value={department.compliance} />
                    <Meter label={t("metric.governanceScore")} value={department.governance} />
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary-500)]">
                    {t("dept.view")}
                    <span className="h-px w-5 bg-current transition-[width] duration-300 group-hover:w-10" />
                  </span>
                </div>
              </Link>
            </HoverLift>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-0">
      <p className="text-3xl font-semibold tabular-nums leading-none text-[var(--foreground)] sm:text-4xl">{formatNumber(value)}</p>
      <p className="mt-2 text-xs leading-snug text-[var(--muted-foreground)] sm:text-sm">{label}</p>
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs text-[var(--muted-foreground)] sm:text-sm">
        <span>{label}</span>
        <span className="shrink-0 font-semibold tabular-nums text-[var(--foreground)]">{formatPercent(value)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
        <div className="h-full rounded-full bg-[var(--primary-500)] transition-[width] duration-700" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
