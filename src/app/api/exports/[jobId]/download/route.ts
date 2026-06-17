/**
 * GET /api/exports/[jobId]/download
 * Streams a completed export from private local storage.
 *   - pptx  -> downloaded as an attachment
 *   - html  -> served inline (opens and auto-triggers print -> Save as PDF)
 */
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { exportJobs } from "@/lib/db/schema";
import { storage } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;

  const job = db.select().from(exportJobs).where(eq(exportJobs.id, jobId)).get();
  if (!job || job.status !== "complete" || !job.outputKey) {
    return NextResponse.json({ error: "Export not available" }, { status: 404 });
  }

  let bytes: Buffer;
  try {
    bytes = await storage.read(job.outputKey);
  } catch {
    return NextResponse.json({ error: "Export file missing" }, { status: 404 });
  }

  const name = job.outputKey.replace(/^[^_]*__/, "");
  const isPptx = job.format === "pptx";
  const contentType = isPptx
    ? "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    : "text/html; charset=utf-8";
  const disposition = isPptx ? `attachment; filename="${name}"` : "inline";

  return new NextResponse(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": disposition,
      "Cache-Control": "private, no-store",
    },
  });
}
