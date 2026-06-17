/**
 * GET /api/documents/[id]
 * Lightweight status + summary endpoint used by the UI to poll processing
 * progress and render the timeline. Heavy fields (full text) are omitted.
 */
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { documents, departments } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const row = db
    .select({
      id: documents.id,
      filename: documents.filename,
      fileType: documents.fileType,
      status: documents.status,
      priority: documents.priority,
      departmentId: documents.departmentId,
      departmentCode: departments.code,
      detectedOwner: documents.detectedOwner,
      detectedDates: documents.detectedDates,
      language: documents.language,
      fileSizeKb: documents.fileSizeKb,
      metadata: documents.metadata,
      processingLog: documents.processingLog,
      errorMessage: documents.errorMessage,
      processedAt: documents.processedAt,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .leftJoin(departments, eq(documents.departmentId, departments.id))
    .where(eq(documents.id, id))
    .get();

  if (!row) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json({ document: row });
}
