"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Library,
  ShieldCheck,
  UploadCloud,
  Trash2,
  FileText,
  Layers,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { PageHeader } from "@/components/layout/page-header";
import { Stagger, StaggerItem } from "@/components/motion/primitives";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  KB_TYPES,
  kbTypeName,
  departmentName,
  type KbType,
} from "@/lib/constants";
import { formatNumber, formatDate, cn } from "@/lib/utils";
import type { ProviderStatus } from "@/components/shared/privacy-notice";

type Dept = { id: string; code: string; nameEn: string; nameAr: string };
type KbDoc = {
  id: string;
  filename: string;
  documentType: string;
  departmentId: string | null;
  departmentCode: string | null;
  isActive: boolean;
  version: string | null;
  effectiveDate: string | null;
  description: string | null;
  chunkCount: number;
  createdAt: string;
};

export function KbView({
  documents,
  stats,
  departments,
  status,
}: {
  documents: KbDoc[];
  stats: { total: number; active: number; chunks: number };
  departments: Dept[];
  status: ProviderStatus;
}) {
  const { t, locale } = useLocale();
  const router = useRouter();

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      if (typeFilter !== "all" && d.documentType !== typeFilter) return false;
      if (deptFilter === "org" && d.departmentId) return false;
      if (deptFilter !== "all" && deptFilter !== "org" && d.departmentId !== deptFilter)
        return false;
      return true;
    });
  }, [documents, typeFilter, deptFilter]);

  return (
    <div>
      <PageHeader title={t("kb.title")} description={t("kb.subtitle")} />

      {/* Privacy messaging */}
      <div className="mb-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--muted)]/40 p-4">
        <div className="flex gap-3">
          <Lock className="mt-0.5 size-5 shrink-0 text-[var(--primary-500)]" />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {t("kb.privacyTitle")}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--muted-foreground)]">
              {t("kb.privacyBody")}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--ok)]">
              <ShieldCheck className="size-3.5" />
              {status.embeddingsExternal ? t("kb.retrievalExternal") : t("kb.retrievalLocal")}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StaggerItem>
          <KpiCard label={t("kb.total")} count={stats.total} icon={Library} />
        </StaggerItem>
        <StaggerItem>
          <KpiCard label={t("kb.activeCount")} count={stats.active} icon={CheckCircle2} accent="var(--ok)" />
        </StaggerItem>
        <StaggerItem>
          <KpiCard label={t("kb.chunks")} count={stats.chunks} icon={Layers} accent="var(--risk-info)" />
        </StaggerItem>
      </Stagger>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Uploader */}
        <div className="lg:col-span-1">
          <KbUploader departments={departments} onDone={() => router.refresh()} />
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
              <CardTitle>{t("nav.knowledge")}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  aria-label={t("kb.filterType")}
                  className="h-8 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-2 text-xs text-[var(--foreground)]"
                >
                  <option value="all">{t("common.all")}</option>
                  {KB_TYPES.map((tp) => (
                    <option key={tp.code} value={tp.code}>
                      {locale === "ar" ? tp.ar : tp.en}
                    </option>
                  ))}
                </select>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  aria-label={t("kb.filterDept")}
                  className="h-8 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-2 text-xs text-[var(--foreground)]"
                >
                  <option value="all">{t("common.all")}</option>
                  <option value="org">{t("kb.orgWide")}</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {locale === "ar" ? d.nameAr : d.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] py-12 text-center">
                  <Library className="size-7 text-[var(--muted-foreground)]" />
                  <p className="text-sm text-[var(--muted-foreground)]">{t("kb.empty")}</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {filtered.map((d) => (
                    <KbCard key={d.id} doc={d} onChange={() => router.refresh()} />
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ---- Uploader --------------------------------------------------------------

function KbUploader({
  departments,
  onDone,
}: {
  departments: Dept[];
  onDone: () => void;
}) {
  const { t, locale } = useLocale();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  const [scope, setScope] = useState<string>("org");
  const [version, setVersion] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit = file && documentType && !busy;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !documentType) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("documentType", documentType);
      if (scope !== "org") fd.append("departmentId", scope);
      if (version) fd.append("version", version);
      if (effectiveDate) fd.append("effectiveDate", effectiveDate);
      if (description) fd.append("description", description);

      const res = await fetch("/api/knowledge-base/upload", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");

      setFile(null);
      setDocumentType("");
      setVersion("");
      setEffectiveDate("");
      setDescription("");
      (e.target as HTMLFormElement).reset();
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "h-9 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("kb.addDocument")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
              {t("kb.selectFile")}
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.xlsx,.xls,.csv"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-xs text-[var(--muted-foreground)] file:me-3 file:rounded-[var(--radius-md)] file:border-0 file:bg-[var(--primary-500)] file:px-3 file:py-2 file:text-xs file:font-medium file:text-white hover:file:bg-[var(--primary-400)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
              {t("kb.type")}
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className={inputClass}
              required
            >
              <option value="" disabled>
                {t("kb.selectType")}
              </option>
              {KB_TYPES.map((tp) => (
                <option key={tp.code} value={tp.code}>
                  {locale === "ar" ? tp.ar : tp.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
              {t("kb.scope")}
            </label>
            <select value={scope} onChange={(e) => setScope(e.target.value)} className={inputClass}>
              <option value="org">{t("kb.orgWide")}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {locale === "ar" ? d.nameAr : d.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
                {t("kb.version")}
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder={t("kb.versionPlaceholder")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
                {t("kb.effectiveDate")}
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--muted-foreground)]">
              {t("kb.description")}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("kb.descriptionPlaceholder")}
              className={inputClass}
            />
          </div>

          {error && <p className="text-xs text-[var(--danger)]">{error}</p>}

          <Button type="submit" disabled={!canSubmit} className="w-full">
            <UploadCloud className="size-4" />
            {busy ? t("kb.uploading") : t("kb.upload")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ---- KB document card ------------------------------------------------------

function KbCard({ doc, onChange }: { doc: KbDoc; onChange: () => void }) {
  const { t, locale } = useLocale();
  const [busy, setBusy] = useState(false);

  async function toggleActive() {
    setBusy(true);
    await fetch(`/api/knowledge-base/${doc.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !doc.isActive }),
    }).catch(() => {});
    setBusy(false);
    onChange();
  }

  async function remove() {
    setBusy(true);
    await fetch(`/api/knowledge-base/${doc.id}`, { method: "DELETE" }).catch(() => {});
    setBusy(false);
    onChange();
  }

  return (
    <li className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border)] p-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--muted)] text-[var(--muted-foreground)]">
        <FileText className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[var(--foreground)]">
          {doc.description?.trim() || doc.filename}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <Badge variant="primary">{kbTypeName(doc.documentType, locale)}</Badge>
          <span>
            {doc.departmentId
              ? departmentName(doc.departmentCode, locale)
              : t("kb.orgWide")}
          </span>
          {doc.version && (
            <span>
              · {t("kb.version")} {doc.version}
            </span>
          )}
          {doc.effectiveDate && <span>· {formatDate(doc.effectiveDate)}</span>}
          <span>· {formatNumber(doc.chunkCount)} {t("kb.chunks")}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={toggleActive}
          disabled={busy}
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors",
            doc.isActive
              ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
              : "bg-[var(--muted)] text-[var(--muted-foreground)]",
          )}
        >
          {doc.isActive ? t("kb.active") : t("kb.inactive")}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={busy}
          aria-label={t("common.delete")}
          className="rounded-[var(--radius-sm)] p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--danger)]"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </li>
  );
}
