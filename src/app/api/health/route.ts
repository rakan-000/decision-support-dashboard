import { NextResponse } from "next/server";
import { count } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  departments,
  documents,
  documentAnalyses,
  knowledgeBaseDocuments,
} from "@/lib/db/schema";
import { providerStatus } from "@/lib/config";

export const runtime = "nodejs";

export async function GET() {
  const [deptCount] = db.select({ c: count() }).from(departments).all();
  const [docCount] = db.select({ c: count() }).from(documents).all();
  const [analysisCount] = db.select({ c: count() }).from(documentAnalyses).all();
  const [kbCount] = db.select({ c: count() }).from(knowledgeBaseDocuments).all();

  return NextResponse.json({
    ok: true,
    service: "decision-intelligence",
    timestamp: new Date().toISOString(),
    providers: providerStatus(),
    database: {
      connected: true,
      departments: deptCount?.c ?? 0,
      documents: docCount?.c ?? 0,
      analyses: analysisCount?.c ?? 0,
      knowledgeBaseDocuments: kbCount?.c ?? 0,
    },
  });
}
