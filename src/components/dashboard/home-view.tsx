"use client";

/**
 * Executive Home — the prologue of the intelligence story.
 *
 * Editorial pacing: one idea per section, typography leads, cards support.
 * Statement -> live state of the system -> the network -> the journey ->
 * the latest intelligence -> invitation to begin.
 */

import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText, Activity } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { PrivacyNotice, type ProviderStatus } from "@/components/shared/privacy-notice";
import { EcosystemGraph } from "@/components/layout/ecosystem-map";
import { DataStream } from "@/components/home/data-stream";
import { ChapterGlyph } from "@/components/home/chapter-glyph";
import { Sparkline } from "@/components/dashboard/sparkline";
import { MaskText, MaskRise } from "@/components/motion/mask-text";
import { Reveal, Stagger, StaggerItem, CountUp, motion } from "@/components/motion/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatPercent } from "@/lib/utils";
import { departmentName, DEPARTMENTS, PRIORITY_META, type Priority } from "@/lib/constants";
import { CHAPTERS } from "@/lib/chapters";

type Metrics = {
  totalDocuments: number;
  activeRisks: number;
  openActions: number;
  complianceScore: number;
  governanceScore: number;
};

type RecentDoc = {
  id: string;
  filename: string;
  status: string;
  priority: string | null;
  departmentCode: string | null;
  confidenceScore: number | null;
  createdAt: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function HomeView({
  status,
  metrics,
  recent,
}: {
  status: ProviderStatus;
  metrics: Metrics;
  recent: RecentDoc[];
}) {
  const { t, locale } = useLocale();

  const stats = [
    { label: t("metric.totalDocuments"), value: metrics.totalDocuments, suffix: "" },
    { label: t("metric.activeRisks"), value: metrics.activeRisks, suffix: "" },
    { label: t("metric.openActions"), value: metrics.openActions, suffix: "" },
    { label: t("metric.complianceScore"), value: metrics.complianceScore, suffix: "%" },
  ];

  const journey = CHAPTERS.slice(0, 8);

  // Composite executive performance index from real metrics (no fabricated value).
  const performanceIndex = Math.round(
    (metrics.complianceScore + metrics.governanceScore) / 2,
  );

  return (
    <div className="space-y-20 pb-12 sm:space-y-24">
      {/* ===== Prologue: the living intelligence network ===== */}
      <section className="relative pt-4">
        {/* Status row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex items-center justify-between"
        >
          <span className="micro-label text-[var(--primary-500)]">{t("hero.eyebrow")}</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-50)] px-3 py-1.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-pulse-glow rounded-full bg-[var(--ok)]" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--ok)]" />
            </span>
            <span className="micro-label !text-[10px] text-[var(--text-secondary)]">
              {t("hero.connected")}
            </span>
          </span>
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Text column */}
          <div className="relative z-10">
            <h1 className="display-statement text-5xl text-[var(--foreground)] sm:text-6xl lg:text-7xl">
              <MaskText text={t("hero.h1a")} delay={0.1} />
              <br />
              <span className="text-[var(--primary-500)]">
                <MaskText text={t("hero.h1b")} delay={0.28} />
              </span>
              <br />
              <MaskText text={t("hero.h1c")} delay={0.46} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
              className="mt-7 max-w-xl text-base leading-relaxed text-[var(--muted-foreground)]"
            >
              {t("hero.sub")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" className="shadow-[var(--glow-primary)]">
                <Link href="/upload">
                  {t("hero.explore")}
                  <ArrowRight className="size-4 flip-rtl" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard">
                  {t("hero.report")}
                  <ArrowUpRight className="size-4 flip-rtl" />
                </Link>
              </Button>
            </motion.div>

            {/* Performance index panel */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.0, ease: EASE }}
              className="panel scan-corners mt-10 max-w-md p-5"
            >
              <div className="flex items-start justify-between">
                <p className="micro-label !text-[10px] text-[var(--text-muted)]">
                  {t("hero.indexLabel")}
                </p>
                <Activity className="size-4 text-[var(--primary-500)]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight text-[var(--foreground)] sm:text-6xl">
                  <CountUp value={performanceIndex} />
                </span>
                <span className="text-2xl font-semibold text-[var(--primary-500)]">%</span>
              </div>
              <div className="mt-2 -mb-1">
                <Sparkline seed={4242} color="var(--primary-500)" height={36} />
              </div>
              <p className="mt-2 text-xs text-[var(--text-muted)]">{t("hero.indexCaption")}</p>
            </motion.div>
          </div>

          {/* Department network: six equal, navigable intelligence hubs. */}
          <div className="relative min-h-[420px] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-50)] p-4 sm:min-h-[460px] sm:p-6 lg:min-h-[520px]">
            <DataStream className="absolute inset-0 size-full" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--surface-50)]/40 via-transparent to-[var(--surface-50)]/90" />
            <div className="relative flex h-full min-h-[388px] flex-col sm:min-h-[412px] lg:min-h-[472px]">
              <div className="flex items-center justify-between gap-4">
                <span className="micro-label text-[var(--primary-500)]">{t("hero.network")}</span>
                <span dir="ltr" className="font-mono text-sm text-[var(--text-muted)]">01 / 06</span>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-2 sm:gap-3">
                {DEPARTMENTS.map((d, i) => (
                  <motion.div
                    key={d.code}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.7 + i * 0.07, ease: EASE }}
                  >
                    <Link
                      href={`/departments/${d.code}`}
                      className="group/node flex min-h-24 flex-col justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-0)]/90 p-3 backdrop-blur-md transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-[var(--primary-500)] hover:bg-[var(--surface-100)] hover:shadow-[var(--glow-soft)] focus-visible:outline-2 focus-visible:outline-[var(--primary-500)] motion-reduce:transform-none sm:min-h-28 sm:p-4"
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold text-[var(--primary-500)]">{d.code}</span>
                        <ArrowUpRight className="size-4 text-[var(--text-muted)] transition-[transform,color] duration-300 group-hover/node:-translate-y-0.5 group-hover/node:translate-x-0.5 group-hover/node:text-[var(--primary-500)] flip-rtl" />
                      </span>
                      <span className="text-sm font-semibold leading-snug text-[var(--foreground)] sm:text-base">
                        {locale === "ar" ? d.name_ar : d.name_en}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== The state of the system: editorial numbers, no boxes ===== */}
      <section>
        <div className="hairline" />
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="group min-w-0 border-[var(--border)] px-3 py-7 first:ps-0 last:pe-0 sm:px-5 lg:px-8 lg:py-8 lg:first:ps-0 lg:last:pe-0 ltr:border-r ltr:last:border-r-0 rtl:border-l rtl:last:border-l-0"
            >
              <MaskRise delay={0.08 * i}>
                <p className="display-statement break-words text-4xl tabular-nums text-[var(--foreground)] transition-colors duration-300 group-hover:text-[var(--primary-500)] sm:text-5xl xl:text-6xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
              </MaskRise>
              <p className="micro-label mt-3">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="hairline" />
        <Reveal delay={0.2} className="mt-8">
          <PrivacyNotice status={status} />
        </Reveal>
      </section>

      {/* ===== The network ===== */}
      <section>
        <MaskRise mode="view">
          <span className="micro-label">{t("eco.eyebrow")}</span>
        </MaskRise>
        <h2 className="display-statement mt-4 max-w-4xl text-4xl text-[var(--foreground)] sm:text-5xl">
          <MaskText mode="view" text={t("home.ecoTitle")} />
        </h2>
        <Reveal delay={0.2} className="mt-8">
          <div className="reg-marks p-2 sm:p-6">
            <EcosystemGraph />
          </div>
        </Reveal>
        <p className="mt-4 text-xs text-[var(--text-muted)]">{t("eco.hint")}</p>
      </section>

      {/* ===== The journey: luxury editorial chapters ===== */}
      <section>
        <MaskRise mode="view">
          <span className="micro-label">{t("home.journeyTitle")}</span>
        </MaskRise>
        <h2 className="display-statement mt-4 max-w-4xl text-4xl text-[var(--foreground)] sm:text-5xl">
          <MaskText mode="view" text={t("home.journeySub")} />
        </h2>

        <Stagger className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((ch) => (
            <StaggerItem key={ch.href}>
              <Link
                href={ch.href}
                className="group relative flex h-full flex-col justify-between gap-8 bg-[var(--card-solid)] p-6 transition-colors duration-500 hover:bg-[var(--surface-100)]"
              >
                {/* top: number + glyph */}
                <div className="flex items-start justify-between">
                  <span className="font-mono text-sm font-semibold tracking-[0.2em] text-[var(--text-muted)] transition-colors duration-300 group-hover:text-[var(--primary-500)]">
                    {ch.number}
                  </span>
                  <ChapterGlyph
                    href={ch.href}
                    className="size-12 text-[var(--text-secondary)] transition-all duration-500 group-hover:scale-105 group-hover:text-[var(--primary-500)]"
                  />
                </div>

                {/* body: name + descriptor */}
                <div>
                  <h3 className="text-lg font-semibold leading-tight text-[var(--foreground)]">
                    {t(ch.nameKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {t(ch.statementKey)}
                  </p>
                  {/* hover underline expansion */}
                  <span className="mt-4 block h-px w-8 bg-[var(--primary-500)] transition-all duration-500 group-hover:w-full" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ===== Latest intelligence: editorial ledger ===== */}
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <MaskRise mode="view">
              <span className="micro-label">{t("home.liveTitle")}</span>
            </MaskRise>
            <h2 className="display-statement mt-5 text-3xl text-[var(--foreground)] sm:text-5xl">
              <MaskText mode="view" text={t("home.recent")} />
            </h2>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/analysis">
              {t("common.viewAll")}
              <ArrowRight className="size-3.5 flip-rtl" />
            </Link>
          </Button>
        </div>

        <div className="mt-10">
          {recent.length === 0 ? (
            <div className="border-y border-[var(--border)] py-16 text-center">
              <p className="text-sm text-[var(--muted-foreground)]">{t("common.noData")}</p>
              <Button asChild size="sm" className="mt-4">
                <Link href="/upload">{t("home.quickUpload")}</Link>
              </Button>
            </div>
          ) : (
            <ul>
              {recent.map((doc, i) => {
                const p = (doc.priority ?? "medium") as Priority;
                return (
                  <Reveal key={doc.id} y={16}>
                    <li className="border-b border-[var(--border)] first:border-t">
                      <Link
                        href={`/analysis/${doc.id}`}
                        className="group flex items-center gap-4 py-5 transition-colors hover:bg-[var(--muted)] sm:gap-6"
                      >
                        <span className="micro-label w-8 shrink-0 text-[var(--text-muted)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <FileText className="size-4 shrink-0 text-[var(--text-muted)]" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[var(--foreground)] transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                            {doc.filename}
                          </p>
                          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                            {departmentName(doc.departmentCode, locale)} · {formatDate(doc.createdAt)}
                          </p>
                        </div>
                        <Badge dot={PRIORITY_META[p].color} variant="outline" className="shrink-0">
                          {locale === "ar" ? PRIORITY_META[p].ar : PRIORITY_META[p].en}
                        </Badge>
                        {doc.confidenceScore != null && (
                          <span className="micro-label hidden shrink-0 sm:inline">
                            {formatPercent(doc.confidenceScore)}
                          </span>
                        )}
                      </Link>
                    </li>
                  </Reveal>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ===== Invitation: begin ===== */}
      <section className="pb-4">
        <div className="hairline" />
        <Link href="/upload" className="group block pt-10">
          <MaskRise mode="view">
            <span className="micro-label">01 — {t("ch.upload.name")}</span>
          </MaskRise>
          <div className="mt-4 flex items-end justify-between gap-6">
            <h2 className="display-statement text-4xl text-[var(--muted-foreground)] transition-colors duration-500 group-hover:text-[var(--foreground)] sm:text-6xl">
              <MaskText mode="view" text={t("ch.upload.statement")} />
            </h2>
            <ArrowRight className="mb-2 size-8 shrink-0 text-[var(--muted-foreground)] transition-all duration-500 group-hover:translate-x-2 group-hover:text-[var(--primary-500)] flip-rtl rtl:group-hover:-translate-x-2" />
          </div>
        </Link>
      </section>
    </div>
  );
}
