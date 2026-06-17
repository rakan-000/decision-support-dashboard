"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  FileText,
  ArrowRight,
  Library,
  AlertTriangle,
  X,
  SlidersHorizontal,
  Sparkles,
  Info,
} from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { PageHeader } from "@/components/layout/page-header";
import { Stagger, StaggerItem, HoverLift } from "@/components/motion/primitives";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  departmentName,
  PRIORITY_META,
  PRIORITIES,
  DEPARTMENTS,
  DOC_STATUSES,
  type Priority,
} from "@/lib/constants";
import { formatDate, formatPercent, formatNumber, cn } from "@/lib/utils";

type Item = {
  id: string;
  filename: string;
  fileType: string;
  status: string;
  priority: string | null;
  departmentCode: string | null;
  detectedOwner: string | null;
  confidenceScore: number | null;
  complianceScore: number | null;
  governanceScore: number | null;
  isDemo: boolean | null;
  summary: string | null;
  createdAt: string;
  kbSourceCount: number;
  riskCount: number;
};

type Sort = "newest" | "priority" | "compliance" | "risk" | "confidence";

const PRIORITY_RANK: Record<Priority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function AnalysisWorkspace({ items }: { items: Item[] }) {
  const { t, locale } = useLocale();

  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("all");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [fileType, setFileType] = useState("all");
  const [aiType, setAiType] = useState("all"); // all | demo | real
  const [kbFilter, setKbFilter] = useState("all"); // all | with | without
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  const hasFilters =
    search ||
    dept !== "all" ||
    priority !== "all" ||
    status !== "all" ||
    fileType !== "all" ||
    aiType !== "all" ||
    kbFilter !== "all" ||
    dateFrom ||
    dateTo ||
    sort !== "newest";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = items.filter((it) => {
      if (q) {
        const deptN = departmentName(it.departmentCode, locale).toLowerCase();
        const hay = `${it.filename} ${deptN} ${it.detectedOwner ?? ""} ${
          it.summary ?? ""
        }`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (dept !== "all" && it.departmentCode !== dept) return false;
      if (priority !== "all" && it.priority !== priority) return false;
      if (status !== "all" && it.status !== status) return false;
      if (fileType !== "all" && it.fileType !== fileType) return false;
      if (aiType === "demo" && it.isDemo !== true) return false;
      if (aiType === "real" && it.isDemo !== false) return false;
      if (kbFilter === "with" && it.kbSourceCount === 0) return false;
      if (kbFilter === "without" && it.kbSourceCount > 0) return false;
      const day = it.createdAt.slice(0, 10);
      if (dateFrom && day < dateFrom) return false;
      if (dateTo && day > dateTo) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "priority":
          return (
            (PRIORITY_RANK[(b.priority as Priority) ?? "low"] ?? 0) -
            (PRIORITY_RANK[(a.priority as Priority) ?? "low"] ?? 0)
          );
        case "compliance":
          return (a.complianceScore ?? 999) - (b.complianceScore ?? 999);
        case "risk":
          return b.riskCount - a.riskCount;
        case "confidence":
          return (b.confidenceScore ?? -1) - (a.confidenceScore ?? -1);
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });
    return list;
  }, [items, search, dept, priority, status, fileType, aiType, kbFilter, dateFrom, dateTo, sort, locale]);

  function clearAll() {
    setSearch("");
    setDept("all");
    setPriority("all");
    setStatus("all");
    setFileType("all");
    setAiType("all");
    setKbFilter("all");
    setDateFrom("");
    setDateTo("");
    setSort("newest");
  }

  const selectClass =
    "h-8 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-2 text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <div>
      <PageHeader title={t("analysis.title")} />

      {/* Search */}
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute top-1/2 -translate-y-1/2 size-4 text-[var(--muted-foreground)] ltr:left-3 rtl:right-3" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("ws.searchPlaceholder")}
          className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3"
        />
      </div>

      {/* Filters */}
      <Card className="mb-4 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="size-4 text-[var(--muted-foreground)]" />
          <select value={dept} onChange={(e) => setDept(e.target.value)} className={selectClass} aria-label={t("common.department")}>
            <option value="all">{t("common.department")}</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.code} value={d.code}>{locale === "ar" ? d.name_ar : d.name_en}</option>
            ))}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className={selectClass} aria-label={t("common.priority")}>
            <option value="all">{t("common.priority")}</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{locale === "ar" ? PRIORITY_META[p].ar : PRIORITY_META[p].en}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass} aria-label={t("common.status")}>
            <option value="all">{t("common.status")}</option>
            {DOC_STATUSES.map((s) => (
              <option key={s} value={s}>{t(`docstatus.${s}`)}</option>
            ))}
          </select>
          <select value={fileType} onChange={(e) => setFileType(e.target.value)} className={selectClass} aria-label={t("ws.fileType")}>
            <option value="all">{t("ws.fileType")}</option>
            <option value="pdf">PDF</option>
            <option value="word">DOCX</option>
            <option value="excel">XLSX</option>
          </select>
          <select value={aiType} onChange={(e) => setAiType(e.target.value)} className={selectClass} aria-label={t("ws.analysisType")}>
            <option value="all">{t("ws.analysisType")}</option>
            <option value="real">{t("ws.realAi")}</option>
            <option value="demo">{t("ws.demo")}</option>
          </select>
          <select value={kbFilter} onChange={(e) => setKbFilter(e.target.value)} className={selectClass} aria-label={t("ws.kbFilter")}>
            <option value="all">{t("ws.kbFilter")}</option>
            <option value="with">{t("ws.withKb")}</option>
            <option value="without">{t("ws.withoutKb")}</option>
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={selectClass} aria-label={t("ws.dateFrom")} />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={selectClass} aria-label={t("ws.dateTo")} />
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={selectClass} aria-label={t("ws.sortBy")}>
            <option value="newest">{t("ws.sortNewest")}</option>
            <option value="priority">{t("ws.sortPriority")}</option>
            <option value="compliance">{t("ws.sortCompliance")}</option>
            <option value="risk">{t("ws.sortRisk")}</option>
            <option value="confidence">{t("ws.sortConfidence")}</option>
          </select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <X className="size-3.5" />
              {t("ws.clear")}
            </Button>
          )}
        </div>
      </Card>

      <p className="mb-3 text-xs text-[var(--muted-foreground)]">
        {t("ws.results")}: {formatNumber(filtered.length)}
      </p>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <FileText className="size-8 text-[var(--muted-foreground)]" />
          <p className="text-sm text-[var(--muted-foreground)]">{t("ws.noResults")}</p>
        </Card>
      ) : (
        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((it) => (
            <StaggerItem key={it.id}>
              <HoverLift>
                <DocCard item={it} />
              </HoverLift>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}

function DocCard({ item }: { item: Item }) {
  const { t, locale } = useLocale();
  const p = (item.priority ?? "medium") as Priority;
  const complete = item.status === "complete";
  const failed = item.status === "failed";

  return (
    <Card className="flex h-full flex-col p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--muted)] text-[var(--muted-foreground)]">
          <FileText className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[var(--foreground)]" title={item.filename}>
            {item.filename}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--muted-foreground)]">
            <span className="rounded bg-[var(--muted)] px-1.5 py-0.5 font-medium uppercase">
              {item.fileType === "excel" ? "XLSX" : item.fileType === "word" ? "DOCX" : "PDF"}
            </span>
            <span>{departmentName(item.departmentCode, locale)}</span>
            <span>·</span>
            <span>{formatDate(item.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" dot={PRIORITY_META[p].color}>
          {locale === "ar" ? PRIORITY_META[p].ar : PRIORITY_META[p].en}
        </Badge>
        <Badge variant={failed ? "danger" : complete ? "success" : "neutral"}>
          {t(`docstatus.${item.status}`)}
        </Badge>
        {item.isDemo === true && (
          <Badge variant="warning">
            <Info className="size-3" />
            {t("ws.demo")}
          </Badge>
        )}
        {item.isDemo === false && (
          <Badge variant="primary">
            <Sparkles className="size-3" />
            {t("ws.realAi")}
          </Badge>
        )}
      </div>

      {/* Scores */}
      {complete && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          <ScorePill label={t("common.confidence")} value={item.confidenceScore} accent="var(--primary-500)" />
          <ScorePill label={t("metric.complianceScore")} value={item.complianceScore} accent="var(--ok)" />
          <ScorePill label={t("metric.governanceScore")} value={item.governanceScore} accent="var(--risk-info)" />
        </div>
      )}

      {/* Footer meta + open */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
        <div className="flex items-center gap-3 text-[11px] text-[var(--muted-foreground)]">
          <span className="inline-flex items-center gap-1">
            <Library className="size-3.5" />
            {formatNumber(item.kbSourceCount)} {t("ws.sources")}
          </span>
          <span className="inline-flex items-center gap-1">
            <AlertTriangle className="size-3.5" />
            {formatNumber(item.riskCount)} {t("ws.risks")}
          </span>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link href={`/analysis/${item.id}`}>
            {t("ws.openAnalysis")}
            <ArrowRight className="size-3.5 flip-rtl" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

function ScorePill({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | null;
  accent: string;
}) {
  const v = value == null ? null : Math.round(value);
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--muted)] p-2 text-center">
      <p className="truncate text-[10px] text-[var(--muted-foreground)]">{label}</p>
      <p className={cn("text-sm font-semibold")} style={{ color: accent }}>
        {v == null ? "-" : formatPercent(v)}
      </p>
    </div>
  );
}
