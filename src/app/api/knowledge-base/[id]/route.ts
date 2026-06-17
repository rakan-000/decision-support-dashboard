/**
 * PATCH  /api/knowledge-base/[id]  — toggle active status ({ isActive: boolean }).
 * DELETE /api/knowledge-base/[id]  — remove the KB document, its chunks, and file.
 */
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { knowledgeBaseDocuments, knowledgeBaseChunks } from "@/lib/db/schema";
import { storage } from "@/lib/storage";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { isActive?: boolean };

  const doc = db
    .select({ id: knowledgeBaseDocuments.id })
    .from(knowledgeBaseDocuments)
    .where(eq(knowledgeBaseDocuments.id, id))
    .get();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (typeof body.isActive === "boolean") {
    db.update(knowledgeBaseDocuments)
      .set({ isActive: body.isActive })
      .where(eq(knowledgeBaseDocuments.id, id))
      .run();
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const doc = db
    .select({ storageKey: knowledgeBaseDocuments.storageKey })
    .from(knowledgeBaseDocuments)
    .where(eq(knowledgeBaseDocuments.id, id))
    .get();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  db.delete(knowledgeBaseChunks).where(eq(knowledgeBaseChunks.kbDocumentId, id)).run();
  db.delete(knowledgeBaseDocuments).where(eq(knowledgeBaseDocuments.id, id)).run();
  await storage.remove(doc.storageKey).catch(() => {});

  return NextResponse.json({ ok: true });
}
