/**
 * POST /api/documents/upload
 * Accepts multipart form-data with one or more files plus an optional
 * departmentId pre-tag. Files are stored on the local private storage provider
 * and a `documents` record is created per file (status: queued).
 *
 * Files are NEVER sent to any external service here.
 */
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { documents, users, departments, type FileType } from "@/lib/db/schema";
import { storage } from "@/lib/storage";
import { config } from "@/lib/config";
import { FILE_TYPE_BY_EXT } from "@/lib/constants";

export const runtime = "nodejs";

const MAX_BYTES = config.platform.maxUploadMb * 1024 * 1024;

function detectFileType(filename: string): FileType | null {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return FILE_TYPE_BY_EXT[ext] ?? null;
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  const departmentId = (form.get("departmentId") as string | null) || null;

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  // Validate department pre-tag if supplied.
  let validatedDept: string | null = null;
  if (departmentId) {
    const dept = db
      .select({ id: departments.id })
      .from(departments)
      .where(eq(departments.id, departmentId))
      .get();
    validatedDept = dept?.id ?? null;
  }

  // MVP: attribute uploads to the executive user when present (no auth yet).
  const exec = db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, "executive"))
    .get();

  const created: { id: string; filename: string; status: string }[] = [];
  const rejected: { filename: string; reason: string }[] = [];

  for (const file of files) {
    const fileType = detectFileType(file.name);
    if (!fileType) {
      rejected.push({ filename: file.name, reason: "Unsupported file type" });
      continue;
    }
    if (file.size > MAX_BYTES) {
      rejected.push({
        filename: file.name,
        reason: `Exceeds ${config.platform.maxUploadMb} MB limit`,
      });
      continue;
    }
    if (file.size === 0) {
      rejected.push({ filename: file.name, reason: "Empty file" });
      continue;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stored = await storage.save(buffer, file.name);

    const row = db
      .insert(documents)
      .values({
        filename: file.name,
        fileType,
        storageKey: stored.key,
        fileSizeKb: Math.round(stored.size / 1024),
        status: "queued",
        departmentId: validatedDept,
        uploadedBy: exec?.id ?? null,
        queuedAt: new Date().toISOString(),
      })
      .returning({ id: documents.id, filename: documents.filename, status: documents.status })
      .get();

    created.push(row);
  }

  if (created.length === 0) {
    return NextResponse.json(
      { error: "No valid files", rejected },
      { status: 400 },
    );
  }

  return NextResponse.json({ documents: created, rejected }, { status: 201 });
}
