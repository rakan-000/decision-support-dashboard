/**
 * POST /api/knowledge-base/upload
 * Multipart form-data: file, documentType, departmentId (optional, org-wide if
 * omitted), version, effectiveDate, description.
 *
 * Stores the file on the local private storage provider, creates a
 * knowledge_base_documents row, then runs the ingestion pipeline (parse ->
 * chunk -> embed[optional] -> store chunks). Files are never sent externally;
 * embeddings are only computed if EMBEDDINGS_PROVIDER=openai is configured.
 */
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  knowledgeBaseDocuments,
  departments,
  users,
  type KbType,
} from "@/lib/db/schema";
import { storage } from "@/lib/storage";
import { config } from "@/lib/config";
import { FILE_TYPE_BY_EXT, KB_TYPES } from "@/lib/constants";
import { ingestKbDocument } from "@/lib/rag/ingest";

export const runtime = "nodejs";

const MAX_BYTES = config.platform.maxUploadMb * 1024 * 1024;
const VALID_TYPES = new Set(KB_TYPES.map((t) => t.code));

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const documentType = String(form.get("documentType") ?? "");
  if (!VALID_TYPES.has(documentType as KbType)) {
    return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!FILE_TYPE_BY_EXT[ext]) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `Exceeds ${config.platform.maxUploadMb} MB limit` },
      { status: 400 },
    );
  }

  // Optional department scope (org-wide when omitted).
  const departmentIdRaw = (form.get("departmentId") as string | null) || null;
  let departmentId: string | null = null;
  if (departmentIdRaw) {
    const dept = db
      .select({ id: departments.id })
      .from(departments)
      .where(eq(departments.id, departmentIdRaw))
      .get();
    departmentId = dept?.id ?? null;
  }

  const version = ((form.get("version") as string | null) || "").trim() || null;
  const effectiveDate = ((form.get("effectiveDate") as string | null) || "").trim() || null;
  const description = ((form.get("description") as string | null) || "").trim() || null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const stored = await storage.save(buffer, file.name);

  const exec = db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, "executive"))
    .get();

  const row = db
    .insert(knowledgeBaseDocuments)
    .values({
      filename: file.name,
      storageKey: stored.key,
      documentType: documentType as KbType,
      departmentId,
      isActive: true,
      version,
      effectiveDate,
      description,
      uploadedBy: exec?.id ?? null,
      chunkCount: 0,
    })
    .returning({ id: knowledgeBaseDocuments.id })
    .get();

  let chunkCount = 0;
  try {
    chunkCount = await ingestKbDocument(row.id);
  } catch (err) {
    // Roll back the document if ingestion fails so we don't leave an empty entry.
    db.delete(knowledgeBaseDocuments).where(eq(knowledgeBaseDocuments.id, row.id)).run();
    await storage.remove(stored.key).catch(() => {});
    const message = err instanceof Error ? err.message : "Ingestion failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ id: row.id, chunkCount }, { status: 201 });
}
