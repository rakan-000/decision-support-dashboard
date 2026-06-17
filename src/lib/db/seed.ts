/**
 * Seed script: `npm run db:seed` (add `--reset` to wipe first).
 *
 * Seeds the 6 Shared Services departments (always), plus a small set of
 * clearly-labeled DEMO records so the executive dashboard is not empty before
 * real documents are uploaded. Demo analyses carry `isDemo = true`.
 *
 * Runs standalone (tsx) — does not import the server-only runtime client.
 */
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import {
  schema,
  departments,
  users,
  documents,
  documentAnalyses,
  risks,
  actions,
  recommendations,
  activityLog,
} from "./schema";

const reset = process.argv.includes("--reset");

const dbUrl = process.env.DATABASE_URL ?? "./data/app.db";
const dbPath = path.isAbsolute(dbUrl)
  ? dbUrl
  : path.join(process.cwd(), dbUrl.replace(/^file:/, ""));
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite, { schema });

// Ensure schema exists before seeding.
migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });

function iso(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}
function isoFuture(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const DEPARTMENTS = [
  { code: "HR", nameEn: "Human Resources", nameAr: "الموارد البشرية" },
  { code: "DT", nameEn: "Digital Transformation", nameAr: "التحول الرقمي" },
  { code: "CC", nameEn: "Corporate Communications", nameAr: "الاتصال المؤسسي" },
  { code: "SS", nameEn: "Support Services", nameAr: "الخدمات المساندة" },
  { code: "CP", nameEn: "Contracts & Procurement", nameAr: "العقود والمشتريات" },
  { code: "CS", nameEn: "Cybersecurity", nameAr: "الأمن السيبراني" },
] as const;

function main() {
  if (reset) {
    console.log("[seed] resetting tables...");
    // Delete in FK-safe order.
    db.delete(activityLog).run();
    db.delete(recommendations).run();
    db.delete(actions).run();
    db.delete(risks).run();
    db.delete(documentAnalyses).run();
    db.delete(documents).run();
    db.delete(users).run();
    db.delete(departments).run();
  }

  // --- Departments (idempotent) ---
  const existingDepts = db.select().from(departments).all();
  const deptByCode = new Map(existingDepts.map((d) => [d.code, d]));

  for (const d of DEPARTMENTS) {
    if (!deptByCode.has(d.code)) {
      const id = randomUUID();
      db.insert(departments)
        .values({
          id,
          code: d.code,
          nameEn: d.nameEn,
          nameAr: d.nameAr,
          isActive: true,
        })
        .run();
      deptByCode.set(d.code, { ...(d as object) } as never);
    }
  }
  // Refresh map with persisted rows (to get ids).
  const allDepts = db.select().from(departments).all();
  const deptId = (code: string) => allDepts.find((d) => d.code === code)!.id;
  console.log(`[seed] departments: ${allDepts.length}`);

  // --- Users (idempotent on email) ---
  const seedUsers = [
    {
      email: "exec@org.sa",
      nameEn: "Executive Leadership",
      nameAr: "القيادة التنفيذية",
      role: "executive" as const,
      departmentId: null,
    },
    {
      email: "hr.lead@org.sa",
      nameEn: "HR Lead",
      nameAr: "قائد الموارد البشرية",
      role: "dept_lead" as const,
      departmentId: deptId("HR"),
    },
    {
      email: "analyst@org.sa",
      nameEn: "Shared Services Analyst",
      nameAr: "محلل الخدمات المشتركة",
      role: "analyst" as const,
      departmentId: null,
    },
  ];
  const existingUsers = db.select().from(users).all();
  const userByEmail = new Map(existingUsers.map((u) => [u.email, u]));
  for (const u of seedUsers) {
    if (!userByEmail.has(u.email)) {
      db.insert(users).values({ id: randomUUID(), ...u }).run();
    }
  }
  const allUsers = db.select().from(users).all();
  const execId = allUsers.find((u) => u.role === "executive")?.id ?? null;
  console.log(`[seed] users: ${allUsers.length}`);

  // Only seed demo content if there are no documents yet.
  const docCount = db.select().from(documents).all().length;
  if (docCount > 0 && !reset) {
    console.log(`[seed] documents already present (${docCount}); skipping demo content.`);
    sqlite.close();
    return;
  }

  // --- Demo documents + analyses (clearly labeled isDemo) ---
  type DemoDoc = {
    filename: string;
    fileType: "pdf" | "excel" | "word";
    dept: string;
    priority: "critical" | "high" | "medium" | "low";
    owner: string;
    daysAgo: number;
    confidence: number;
    compliance: number;
    governance: number;
    summary: string;
  };

  const demoDocs: DemoDoc[] = [
    {
      filename: "HR_Annual_Workforce_Report_2026.pdf",
      fileType: "pdf",
      dept: "HR",
      priority: "high",
      owner: "Human Resources Department",
      daysAgo: 2,
      confidence: 88,
      compliance: 82,
      governance: 79,
      summary:
        "The annual workforce report indicates strong Saudization performance but flags gaps in succession planning for critical leadership roles relative to the internal governance manual.",
    },
    {
      filename: "Procurement_Vendor_Audit_Q1.xlsx",
      fileType: "excel",
      dept: "CP",
      priority: "critical",
      owner: "Contracts & Procurement",
      daysAgo: 5,
      confidence: 91,
      compliance: 68,
      governance: 72,
      summary:
        "Vendor audit reveals three contracts exceeding the delegation-of-authority approval thresholds, requiring executive ratification and a documented exception process.",
    },
    {
      filename: "Cybersecurity_Risk_Posture_Review.docx",
      fileType: "word",
      dept: "CS",
      priority: "critical",
      owner: "Cybersecurity Office",
      daysAgo: 1,
      confidence: 85,
      compliance: 74,
      governance: 80,
      summary:
        "Risk posture review highlights unremediated access-control findings and recommends aligning incident response with the organization's approved governance framework.",
    },
    {
      filename: "Digital_Transformation_Roadmap.pdf",
      fileType: "pdf",
      dept: "DT",
      priority: "medium",
      owner: "Digital Transformation",
      daysAgo: 8,
      confidence: 90,
      compliance: 86,
      governance: 88,
      summary:
        "The transformation roadmap is well aligned with strategic objectives; minor gaps exist in measurable KPI definitions for two initiatives.",
    },
    {
      filename: "Corporate_Comms_Policy_Update.docx",
      fileType: "word",
      dept: "CC",
      priority: "low",
      owner: "Corporate Communications",
      daysAgo: 12,
      confidence: 83,
      compliance: 90,
      governance: 85,
      summary:
        "The communications policy update is compliant with internal procedures; recommend formal sign-off and version control in the knowledge base.",
    },
    {
      filename: "Support_Services_SLA_Report.xlsx",
      fileType: "excel",
      dept: "SS",
      priority: "medium",
      owner: "Support Services",
      daysAgo: 6,
      confidence: 87,
      compliance: 78,
      governance: 76,
      summary:
        "SLA performance is broadly on target; two service categories breach response-time thresholds defined in the internal service procedures.",
    },
  ];

  let createdDocs = 0;
  for (const d of demoDocs) {
    const docId = randomUUID();
    db.insert(documents)
      .values({
        id: docId,
        filename: d.filename,
        fileType: d.fileType,
        storageKey: `demo/${d.filename}`,
        fileSizeKb: 120 + createdDocs * 40,
        status: "complete",
        departmentId: deptId(d.dept),
        uploadedBy: execId,
        priority: d.priority,
        detectedOwner: d.owner,
        language: "mixed",
        processedAt: iso(d.daysAgo),
        createdAt: iso(d.daysAgo),
      })
      .run();

    db.insert(documentAnalyses)
      .values({
        id: randomUUID(),
        documentId: docId,
        executiveSummary: d.summary,
        keyInsights: [
          { title: "Primary finding", detail: d.summary },
          {
            title: "Governance alignment",
            detail:
              "Assessed against the internal governance manual and delegation-of-authority matrix.",
          },
        ],
        governanceReview:
          "Reviewed against internal governance manual and Saudi nonprofit sector requirements.",
        complianceReview:
          "Compared with internal policies and procedures held in the private knowledge base.",
        priorityLevel: d.priority,
        confidenceScore: d.confidence,
        complianceScore: d.compliance,
        governanceScore: d.governance,
        analysisModel: "demo",
        isDemo: true,
        createdAt: iso(d.daysAgo),
      })
      .run();

    createdDocs++;
  }
  console.log(`[seed] demo documents + analyses: ${createdDocs}`);

  // --- Demo risks ---
  const demoRisks = [
    { title: "Contracts exceed delegation-of-authority thresholds", dept: "CP", severity: "critical" as const, status: "open" as const },
    { title: "Unremediated access-control findings", dept: "CS", severity: "critical" as const, status: "in_progress" as const },
    { title: "Succession plan gaps for critical roles", dept: "HR", severity: "high" as const, status: "open" as const },
    { title: "SLA response-time breaches in two categories", dept: "SS", severity: "high" as const, status: "open" as const },
    { title: "Undefined KPIs for two transformation initiatives", dept: "DT", severity: "medium" as const, status: "open" as const },
    { title: "Policy version control not enforced", dept: "CC", severity: "low" as const, status: "mitigated" as const },
    { title: "Incident response not aligned to governance framework", dept: "CS", severity: "high" as const, status: "open" as const },
  ];
  for (const r of demoRisks) {
    db.insert(risks)
      .values({
        id: randomUUID(),
        title: r.title,
        severity: r.severity,
        status: r.status,
        departmentId: deptId(r.dept),
        dueDate: isoFuture(21),
        createdAt: iso(3),
      })
      .run();
  }
  console.log(`[seed] demo risks: ${demoRisks.length}`);

  // --- Demo actions ---
  const demoActions = [
    { title: "Obtain executive ratification for over-threshold contracts", dept: "CP", status: "open" as const, priority: "critical" as const },
    { title: "Remediate access-control findings", dept: "CS", status: "in_progress" as const, priority: "critical" as const },
    { title: "Draft succession plan for leadership roles", dept: "HR", status: "open" as const, priority: "high" as const },
    { title: "Define KPIs for transformation initiatives", dept: "DT", status: "open" as const, priority: "medium" as const },
    { title: "Publish updated communications policy to knowledge base", dept: "CC", status: "complete" as const, priority: "low" as const },
    { title: "Review breached SLA categories with vendors", dept: "SS", status: "open" as const, priority: "high" as const },
  ];
  for (const a of demoActions) {
    db.insert(actions)
      .values({
        id: randomUUID(),
        title: a.title,
        status: a.status,
        priority: a.priority,
        departmentId: deptId(a.dept),
        dueDate: isoFuture(14),
        completedAt: a.status === "complete" ? iso(1) : null,
        createdAt: iso(3),
      })
      .run();
  }
  console.log(`[seed] demo actions: ${demoActions.length}`);

  // --- Demo recommendations ---
  const demoRecs = [
    {
      title: "Establish a documented exception process for DoA breaches",
      dept: "CP",
      body: "Implement a formal, logged exception workflow requiring executive sign-off for any contract exceeding delegation-of-authority thresholds, with quarterly review.",
      status: "pending" as const,
    },
    {
      title: "Prioritize remediation of critical access-control findings",
      dept: "CS",
      body: "Close the identified access-control gaps within thirty days and align the incident response procedure with the approved internal governance framework.",
      status: "accepted" as const,
    },
    {
      title: "Define measurable KPIs for transformation initiatives",
      dept: "DT",
      body: "Add specific, time-bound KPIs to the two initiatives currently lacking measurable targets to enable executive tracking.",
      status: "pending" as const,
    },
    {
      title: "Enforce version control for organizational policies",
      dept: "CC",
      body: "Adopt mandatory versioning and effective-date tracking for all policies stored in the private knowledge base.",
      status: "implemented" as const,
    },
  ];
  for (const r of demoRecs) {
    db.insert(recommendations)
      .values({
        id: randomUUID(),
        title: r.title,
        body: r.body,
        evidence: "Derived from demo analysis; replace with real document evidence on upload.",
        isEvidenceSufficient: true,
        specificity: "specific",
        status: r.status,
        departmentId: deptId(r.dept),
        createdAt: iso(2),
      })
      .run();
  }
  console.log(`[seed] demo recommendations: ${demoRecs.length}`);

  // --- Activity log entries ---
  db.insert(activityLog)
    .values({
      id: randomUUID(),
      userId: execId,
      action: "SEED",
      entityType: "system",
      metadata: { note: "Demo data seeded for dashboard preview" },
      createdAt: iso(0),
    })
    .run();

  console.log("[seed] done.");
  sqlite.close();
}

main();
