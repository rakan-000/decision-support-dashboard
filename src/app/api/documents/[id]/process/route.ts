/**
 * POST /api/documents/[id]/process
 * Runs the local extraction + classification pipeline for a document.
 * No external AI is invoked in this task.
 */
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { documents } from "@/lib/db/schema";
import { processDocument } from "@/lib/pipeline/process";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const doc = db
    .select({ id: documents.id, status: documents.status })
    .from(documents)
    .where(eq(documents.id, id))
    .get();

  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  try {
    await processDocument(id);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Processing failed";
    return NextResponse.json({ error: message, status: "failed" }, { status: 500 });
  }

  const updated = db.select().from(documents).where(eq(documents.id, id)).get();
  return NextResponse.json({ document: updated });
}
