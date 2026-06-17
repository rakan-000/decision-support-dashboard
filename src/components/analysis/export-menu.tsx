"use client";

import { useState } from "react";
import { FileDown, Presentation, FileText, Loader2, AlertTriangle } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";

type Format = "pdf" | "pptx" | "summary_pdf";

export function ExportMenu({ documentId }: { documentId: string }) {
  const { t, locale } = useLocale();
  const [busy, setBusy] = useState<Format | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(format: Format) {
    setBusy(format);
    setError(null);
    try {
      const res = await fetch(`/api/documents/${documentId}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format, locale }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Export failed");

      if (format === "pptx") {
        // Trigger attachment download.
        window.location.href = json.downloadUrl;
      } else {
        // Open the print-ready report (auto-prints -> Save as PDF).
        window.open(json.downloadUrl, "_blank", "noopener");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.exportFailed"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => run("pdf")} disabled={busy !== null}>
          {busy === "pdf" ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
          {t("common.exportPdf")}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => run("pptx")} disabled={busy !== null}>
          {busy === "pptx" ? <Loader2 className="size-4 animate-spin" /> : <Presentation className="size-4" />}
          {t("common.exportPptx")}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => run("summary_pdf")} disabled={busy !== null}>
          {busy === "summary_pdf" ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
          {t("common.exportSummary")}
        </Button>
      </div>
      {error && (
        <p className="inline-flex items-center gap-1 text-xs text-[var(--danger)]">
          <AlertTriangle className="size-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
