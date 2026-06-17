"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileType2,
  X,
  Play,
  ArrowRight,
  Terminal,
} from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProcessingTimeline, type TimelineStatus } from "@/components/upload/processing-timeline";
import { cn, formatBytes } from "@/lib/utils";
import { FILE_TYPE_BY_EXT } from "@/lib/constants";

type Dept = { id: string; code: string; nameEn: string; nameAr: string };

type QueueItem = {
  localId: string;
  file: File;
  status: TimelineStatus;
  docId?: string;
  error?: string | null;
};

const ACCEPT = ".pdf,.docx,.xlsx,.xls,.csv,.doc";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const type = FILE_TYPE_BY_EXT[ext];
  if (type === "excel") return FileSpreadsheet;
  if (type === "word") return FileType2;
  return FileText;
}

function isSupported(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return Boolean(FILE_TYPE_BY_EXT[ext]);
}

export function UploadCenter({ departments }: { departments: Dept[] }) {
  const { t, locale } = useLocale();
  const [items, setItems] = useState<QueueItem[]>([]);
  const [departmentId, setDepartmentId] = useState<string>("");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const incoming = Array.from(fileList).map((file) => ({
      localId: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      status: (isSupported(file.name) ? "pending" : "failed") as TimelineStatus,
      error: isSupported(file.name) ? null : t("upload.supported"),
    }));
    setItems((prev) => [...prev, ...incoming]);
  }, [t]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const update = useCallback((localId: string, patch: Partial<QueueItem>) => {
    setItems((prev) => prev.map((it) => (it.localId === localId ? { ...it, ...patch } : it)));
  }, []);

  const removeItem = useCallback((localId: string) => {
    setItems((prev) => prev.filter((it) => it.localId !== localId));
  }, []);

  const pollUntilDone = useCallback(
    async (localId: string, docId: string) => {
      for (let i = 0; i < 60; i++) {
        await sleep(700);
        try {
          const res = await fetch(`/api/documents/${docId}`, { cache: "no-store" });
          if (!res.ok) continue;
          const { document } = await res.json();
          const status = document.status as TimelineStatus;
          update(localId, { status, error: document.errorMessage ?? null });
          if (status === "complete" || status === "failed") return;
        } catch {
          // transient; keep polling
        }
      }
    },
    [update],
  );

  const processOne = useCallback(
    async (item: QueueItem) => {
      // 1) Upload
      update(item.localId, { status: "uploading" });
      const form = new FormData();
      form.append("files", item.file);
      if (departmentId) form.append("departmentId", departmentId);

      const uploadRes = await fetch("/api/documents/upload", { method: "POST", body: form });
      if (!uploadRes.ok) {
        const body = await uploadRes.json().catch(() => ({}));
        update(item.localId, { status: "failed", error: body.error ?? "Upload failed" });
        return;
      }
      const { documents } = await uploadRes.json();
      const docId: string | undefined = documents?.[0]?.id;
      if (!docId) {
        update(item.localId, { status: "failed", error: "Upload failed" });
        return;
      }
      update(item.localId, { status: "queued", docId });

      // 2) Kick off processing (server updates status per stage) and poll.
      void fetch(`/api/documents/${docId}/process`, { method: "POST" }).catch(() => {});
      await pollUntilDone(item.localId, docId);
    },
    [departmentId, pollUntilDone, update],
  );

  const start = useCallback(async () => {
    setBusy(true);
    const pending = items.filter((it) => it.status === "pending");
    // Process sequentially to keep the timeline readable and the DB calm.
    for (const item of pending) {
      // Read the latest copy from state by localId.
      await processOne(item);
    }
    setBusy(false);
  }, [items, processOne]);

  const pendingCount = items.filter((it) => it.status === "pending").length;
  const completeCount = items.filter((it) => it.status === "complete").length;

  return (
    <div className="space-y-6">
      {/* Intelligence Intake Terminal */}
      <div className="scan-corners panel relative overflow-hidden">
        {/* Module header bar */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
          <span className="micro-label inline-flex items-center gap-2 text-[var(--primary-500)]">
            <Terminal className="size-3.5" />
            {t("upload.terminal")}
          </span>
          <span className="micro-label inline-flex items-center gap-1.5 !text-[10px] text-[var(--text-muted)]">
            <span className="size-1.5 rounded-full bg-[var(--ok)] animate-pulse-glow" />
            {t("upload.ready")}
          </span>
        </div>

        <div className="p-5">
          <div
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "group relative flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-[var(--radius-lg)] border px-6 py-20 text-center transition-all duration-300",
              dragging
                ? "border-[var(--primary-500)] bg-[var(--primary-100)] shadow-[var(--glow-primary)]"
                : "border-dashed border-[var(--border-strong)] bg-[var(--surface-50)] hover:border-[var(--primary-500)]/60 hover:shadow-[var(--glow-soft)]",
            )}
          >
            {/* Scanning grid texture */}
            <span
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
                maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)",
              }}
              aria-hidden
            />
            <span
              className={cn(
                "relative flex size-16 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--primary-500)]/30 bg-[var(--surface-0)] text-[var(--primary-500)] shadow-[var(--glow-primary)] transition-transform duration-300",
                dragging ? "scale-110" : "group-hover:scale-105",
              )}
            >
              <UploadCloud className={cn("size-8 transition-transform duration-300", dragging && "-translate-y-0.5")} />
            </span>
            <p className="relative text-lg font-semibold text-[var(--foreground)]">{t("upload.dropHere")}</p>
            <p className="micro-label relative !tracking-[0.2em] text-[var(--text-muted)]">{t("upload.supported")}</p>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {/* Department pre-tag + actions */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2.5 text-sm">
              <span className="micro-label !text-[10px] text-[var(--text-muted)]">{t("upload.preTag")}</span>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="h-10 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-50)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                <option value="">{t("common.all")}</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {locale === "ar" ? d.nameAr : d.nameEn}
                  </option>
                ))}
              </select>
            </label>
            <Button onClick={start} disabled={busy || pendingCount === 0} size="lg">
              <Play className="size-4" />
              {t("upload.startAnalysis")}
            </Button>
          </div>
        </div>
      </div>

      {/* Queue */}
      {items.length > 0 && (
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{t("upload.queue")}</CardTitle>
            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
              <Badge variant="outline">{completeCount}</Badge>
              <span>/</span>
              <span>{items.length}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {items.map((item) => {
              const Icon = fileIcon(item.file.name);
              const showTimeline =
                Boolean(item.docId) ||
                ["queued", "extracting", "classifying", "complete"].includes(item.status);
              return (
                <div
                  key={item.localId}
                  className="rounded-[var(--radius-md)] border border-[var(--border)] p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--muted)] text-[var(--muted-foreground)]">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--foreground)]">
                        {item.file.name}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {formatBytes(item.file.size / 1024)}
                      </p>
                    </div>
                    {item.status === "uploading" && (
                      <Badge variant="primary">{t("upload.processing")}</Badge>
                    )}
                    {item.status === "complete" && item.docId && (
                      <Button asChild variant="secondary" size="sm">
                        <Link href={`/analysis/${item.docId}`}>
                          {t("common.viewAnalysis")}
                          <ArrowRight className="size-3.5 flip-rtl" />
                        </Link>
                      </Button>
                    )}
                    {(item.status === "pending" || item.status === "failed") && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.localId)}
                        className="rounded-[var(--radius-sm)] p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                        aria-label={t("common.delete")}
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>

                  {showTimeline && (
                    <ProcessingTimeline status={item.status} error={item.error} />
                  )}
                  {item.status === "failed" && !showTimeline && item.error && (
                    <p className="mt-2 text-xs text-[var(--danger)]">{item.error}</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
