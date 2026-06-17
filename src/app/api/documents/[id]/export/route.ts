/**
 * POST /api/documents/[id]/export
 * Body: { format: "pdf" | "pptx" | "summary_pdf", locale?: "ar" | "en" }
 *
 * Generates an executive export, stores it in private local storage, and wires
 * the export_jobs lifecycle (pending -> generating -> complete | failed).
 * Returns a download URL. Nothing is sent to any external service.
 */
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { exportJobs, users, type ExportFormat } from "@/lib/db/schema";
import { getDocumentDetail } from "@/lib/db";
import { storage } from "@/lib/storage";
import { assembleReport } from "@/lib/export/report";
import { renderReportHtml } from "@/lib/export/html";
import { buildPptx } from "@/lib/export/pptx";

export const runtime = "nodejs";

const VALID: ExportFormat[] = ["pdf", "pptx", "summary_pdf"];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    format?: ExportFormat;
    locale?: "ar" | "en";
  };
  const format = body.format ?? "pdf";
  const locale = body.locale === "ar" ? "ar" : "en";

  if (!VALID.includes(format)) {
    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  }

  const detail = await getDocumentDetail(id);
  if (!detail) return NextResponse.json({ error: "Document not found" }, { status: 404 });
  if (detail.doc.status !== "complete" || !detail.analysis) {
    return NextResponse.json({ error: "Document analysis is not complete" }, { status: 409 });
  }

  const exec = db.select({ id: users.id }).from(users).where(eq(users.role, "executive")).get();

  const job = db
    .insert(exportJobs)
    .values({ documentId: id, requestedBy: exec?.id ?? null, format, status: "pending" })
    .returning({ id: exportJobs.id })
    .get();

  try {
    db.update(exportJobs).set({ status: "generating" }).where(eq(exportJobs.id, job.id)).run();

    const report = assembleReport(detail, locale);
    const base = detail.doc.filename.replace(/\.[^.]+$/, "");

    let buffer: Buffer;
    let storedName: string;
    if (format === "pptx") {
      buffer = await buildPptx(report);
      storedName = `${base}-executive.pptx`;
    } else {
      const html = renderReportHtml(report, { summaryOnly: format === "summary_pdf" });
      buffer = Buffer.from(html, "utf-8");
      storedName = `${base}-${format === "summary_pdf" ? "summary" : "report"}.html`;
    }

    const stored = await storage.save(buffer, storedName);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    db.update(exportJobs)
      .set({ status: "complete", outputKey: stored.key, expiresAt })
      .where(eq(exportJobs.id, job.id))
      .run();

    return NextResponse.json({
      jobId: job.id,
      format,
      downloadUrl: `/api/exports/${job.id}/download`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed";
    db.update(exportJobs).set({ status: "failed" }).where(eq(exportJobs.id, job.id)).run();
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
