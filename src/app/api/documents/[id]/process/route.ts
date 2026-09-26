/**
 * POST /api/documents/[id]/process
 * Runs extraction, classification, and selected AI analysis for a document.
 */
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { documents } from "@/lib/db/schema";
import { processDocument } from "@/lib/pipeline/process";
import { isAiProvider } from "@/lib/ai/provider-selection";

export const runtime = "nodejs";

export async function POST(
  request: Request,
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

  let provider: import("@/lib/ai/provider-selection").AiProvider | undefined;
  try {
    const body = await request.json() as { provider?: unknown };
    if (body.provider !== undefined) {
      if (!isAiProvider(body.provider)) return NextResponse.json({ error: "Invalid AI provider" }, { status: 400 });
      provider = body.provider;
    }
  } catch {
    // Existing clients may send no JSON body; use the configured default.
  }

  try {
    await processDocument(id, provider);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Processing failed";
    return NextResponse.json({ error: message, status: "failed" }, { status: 500 });
  }

  const updated = db.select().from(documents).where(eq(documents.id, id)).get();
  return NextResponse.json({ document: updated });
}
