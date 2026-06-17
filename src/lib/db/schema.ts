/**
 * Database schema (Drizzle ORM, SQLite dialect for the local MVP).
 *
 * Design notes for enterprise upgrade-readiness:
 * - Enums are modeled as TypeScript union types on `text` columns. Postgres
 *   native enums can be introduced later without changing application code.
 * - JSON payloads use `{ mode: "json" }` and are fully typed via `$type<>()`.
 * - Vector embeddings are stored as JSON number[] for the MVP. The retrieval
 *   layer is abstracted so this maps directly onto pgvector `vector(N)` later.
 * - Timestamps are ISO-8601 strings (UTC), portable across SQLite and Postgres.
 */

import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { randomUUID } from "node:crypto";

// ---- Shared column helpers ------------------------------------------------

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID());

const createdAt = () =>
  text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString());

// ---- Enum union types (documented, enforced at the app layer) -------------

export type UserRole = "executive" | "dept_lead" | "analyst" | "admin";
export type FileType = "pdf" | "excel" | "word";
export type DocStatus =
  | "queued"
  | "extracting"
  | "classifying"
  | "analyzing"
  | "complete"
  | "failed";
export type Priority = "critical" | "high" | "medium" | "low";
export type Language = "ar" | "en" | "mixed";
export type RiskSeverity = "critical" | "high" | "medium" | "low";
export type RiskStatus = "open" | "in_progress" | "mitigated" | "closed";
export type ActionStatus = "open" | "in_progress" | "complete" | "overdue";
export type RecommendationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "implemented";
export type Specificity = "specific" | "general" | "insufficient_evidence";
export type KbType =
  | "policy"
  | "procedure"
  | "governance_manual"
  | "delegation_authority"
  | "guideline"
  | "org_structure"
  | "dept_manual"
  | "compliance";
export type ExportFormat = "pdf" | "pptx" | "summary_pdf";
export type ExportStatus = "pending" | "generating" | "complete" | "failed";

// ---- Structured JSON payload shapes ---------------------------------------

export type Insight = { title: string; detail: string };
export type SwotAnalysis = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
} | null;
export type PestelAnalysis = {
  political: string[];
  economic: string[];
  social: string[];
  technological: string[];
  environmental: string[];
  legal: string[];
} | null;
export type GapItem = { area: string; current: string; expected: string; kbSource?: string };
export type KpiOpportunity = { name: string; target: string; rationale: string };
export type KbSourceRef = { kbDocumentId: string; title: string; score: number };

// ---- Tables ----------------------------------------------------------------

export const departments = sqliteTable("departments", {
  id: id(),
  code: text("code").notNull().unique(), // HR, DT, CC, SS, CP, CS
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  descriptionEn: text("description_en"),
  descriptionAr: text("description_ar"),
  headUserId: text("head_user_id"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: createdAt(),
});

export const users = sqliteTable("users", {
  id: id(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").$type<UserRole>().notNull().default("analyst"),
  departmentId: text("department_id").references(() => departments.id),
  languagePref: text("language_pref").$type<"ar" | "en">().notNull().default("ar"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  lastLoginAt: text("last_login_at"),
  createdAt: createdAt(),
});

export const documents = sqliteTable("documents", {
  id: id(),
  filename: text("filename").notNull(),
  fileType: text("file_type").$type<FileType>().notNull(),
  storageKey: text("storage_key").notNull(), // opaque key resolved by the storage provider
  fileSizeKb: integer("file_size_kb").notNull().default(0),
  status: text("status").$type<DocStatus>().notNull().default("queued"),
  departmentId: text("department_id").references(() => departments.id),
  uploadedBy: text("uploaded_by").references(() => users.id),
  priority: text("priority").$type<Priority>(),
  detectedOwner: text("detected_owner"),
  detectedDates: text("detected_dates", { mode: "json" }).$type<string[]>(),
  language: text("language").$type<Language>(),
  extractedText: text("extracted_text"),
  extractedTables: text("extracted_tables", { mode: "json" }).$type<unknown[]>(),
  metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>(),
  processingLog: text("processing_log", { mode: "json" }).$type<
    { stage: DocStatus; at: string; note?: string }[]
  >(),
  errorMessage: text("error_message"),
  queuedAt: text("queued_at"),
  processedAt: text("processed_at"),
  createdAt: createdAt(),
});

export const documentAnalyses = sqliteTable("document_analyses", {
  id: id(),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id)
    .unique(),
  executiveSummary: text("executive_summary"),
  keyInsights: text("key_insights", { mode: "json" }).$type<Insight[]>(),
  governanceReview: text("governance_review"),
  complianceReview: text("compliance_review"),
  gapAnalysis: text("gap_analysis", { mode: "json" }).$type<GapItem[]>(),
  rootCauseAnalysis: text("root_cause_analysis"),
  swotAnalysis: text("swot_analysis", { mode: "json" }).$type<SwotAnalysis>(),
  pestelAnalysis: text("pestel_analysis", { mode: "json" }).$type<PestelAnalysis>(),
  kpiOpportunities: text("kpi_opportunities", { mode: "json" }).$type<KpiOpportunity[]>(),
  deptClassification: text("dept_classification"),
  priorityLevel: text("priority_level").$type<Priority>(),
  confidenceScore: real("confidence_score"), // 0..100
  complianceScore: real("compliance_score"), // 0..100
  governanceScore: real("governance_score"), // 0..100
  kbSourcesUsed: text("kb_sources_used", { mode: "json" }).$type<KbSourceRef[]>(),
  analysisModel: text("analysis_model"),
  isDemo: integer("is_demo", { mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
});

export const risks = sqliteTable("risks", {
  id: id(),
  documentId: text("document_id").references(() => documents.id),
  title: text("title").notNull(),
  titleAr: text("title_ar"),
  description: text("description"),
  severity: text("severity").$type<RiskSeverity>().notNull().default("medium"),
  category: text("category"),
  status: text("status").$type<RiskStatus>().notNull().default("open"),
  departmentId: text("department_id").references(() => departments.id),
  ownerUserId: text("owner_user_id").references(() => users.id),
  dueDate: text("due_date"),
  evidence: text("evidence"),
  createdAt: createdAt(),
});

export const actions = sqliteTable("actions", {
  id: id(),
  documentId: text("document_id").references(() => documents.id),
  riskId: text("risk_id").references(() => risks.id),
  title: text("title").notNull(),
  titleAr: text("title_ar"),
  description: text("description"),
  status: text("status").$type<ActionStatus>().notNull().default("open"),
  priority: text("priority").$type<Priority>().notNull().default("medium"),
  departmentId: text("department_id").references(() => departments.id),
  ownerUserId: text("owner_user_id").references(() => users.id),
  dueDate: text("due_date"),
  completedAt: text("completed_at"),
  createdAt: createdAt(),
});

export const recommendations = sqliteTable("recommendations", {
  id: id(),
  documentId: text("document_id").references(() => documents.id),
  title: text("title").notNull(),
  titleAr: text("title_ar"),
  body: text("body").notNull(),
  evidence: text("evidence"), // exact quote OR "Insufficient Evidence Found"
  isEvidenceSufficient: integer("is_evidence_sufficient", { mode: "boolean" })
    .notNull()
    .default(true),
  specificity: text("specificity").$type<Specificity>().notNull().default("specific"),
  status: text("status").$type<RecommendationStatus>().notNull().default("pending"),
  departmentId: text("department_id").references(() => departments.id),
  createdAt: createdAt(),
});

export const knowledgeBaseDocuments = sqliteTable("knowledge_base_documents", {
  id: id(),
  filename: text("filename").notNull(),
  storageKey: text("storage_key").notNull(),
  documentType: text("document_type").$type<KbType>().notNull(),
  departmentId: text("department_id").references(() => departments.id), // null = org-wide
  language: text("language").$type<Language>(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  version: text("version"),
  effectiveDate: text("effective_date"),
  description: text("description"),
  uploadedBy: text("uploaded_by").references(() => users.id),
  chunkCount: integer("chunk_count").notNull().default(0),
  createdAt: createdAt(),
});

export const knowledgeBaseChunks = sqliteTable("knowledge_base_chunks", {
  id: id(),
  kbDocumentId: text("kb_document_id")
    .notNull()
    .references(() => knowledgeBaseDocuments.id),
  chunkText: text("chunk_text").notNull(),
  chunkIndex: integer("chunk_index").notNull().default(0),
  // MVP: JSON number[]. Enterprise: maps to pgvector vector(N).
  embedding: text("embedding", { mode: "json" }).$type<number[]>(),
  tokenCount: integer("token_count").notNull().default(0),
  createdAt: createdAt(),
});

export const documentChunks = sqliteTable("document_chunks", {
  id: id(),
  documentId: text("document_id")
    .notNull()
    .references(() => documents.id),
  chunkText: text("chunk_text").notNull(),
  chunkIndex: integer("chunk_index").notNull().default(0),
  embedding: text("embedding", { mode: "json" }).$type<number[]>(),
  tokenCount: integer("token_count").notNull().default(0),
  createdAt: createdAt(),
});

export const activityLog = sqliteTable("activity_log", {
  id: id(),
  userId: text("user_id").references(() => users.id),
  action: text("action").notNull(), // UPLOAD, ANALYZE, EXPORT, KB_ADD, ...
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>(),
  ipAddress: text("ip_address"),
  createdAt: createdAt(),
});

export const exportJobs = sqliteTable("export_jobs", {
  id: id(),
  documentId: text("document_id").references(() => documents.id),
  requestedBy: text("requested_by").references(() => users.id),
  format: text("format").$type<ExportFormat>().notNull(),
  status: text("status").$type<ExportStatus>().notNull().default("pending"),
  outputKey: text("output_key"),
  expiresAt: text("expires_at"),
  createdAt: createdAt(),
});

// ---- Inferred types (single source of truth for the app) -------------------

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type DocumentAnalysis = typeof documentAnalyses.$inferSelect;
export type NewDocumentAnalysis = typeof documentAnalyses.$inferInsert;
export type Risk = typeof risks.$inferSelect;
export type NewRisk = typeof risks.$inferInsert;
export type Action = typeof actions.$inferSelect;
export type NewAction = typeof actions.$inferInsert;
export type Recommendation = typeof recommendations.$inferSelect;
export type NewRecommendation = typeof recommendations.$inferInsert;
export type KnowledgeBaseDocument = typeof knowledgeBaseDocuments.$inferSelect;
export type NewKnowledgeBaseDocument = typeof knowledgeBaseDocuments.$inferInsert;
export type KnowledgeBaseChunk = typeof knowledgeBaseChunks.$inferSelect;
export type NewKnowledgeBaseChunk = typeof knowledgeBaseChunks.$inferInsert;
export type DocumentChunk = typeof documentChunks.$inferSelect;
export type NewDocumentChunk = typeof documentChunks.$inferInsert;
export type ActivityLog = typeof activityLog.$inferSelect;
export type NewActivityLog = typeof activityLog.$inferInsert;
export type ExportJob = typeof exportJobs.$inferSelect;
export type NewExportJob = typeof exportJobs.$inferInsert;

export const schema = {
  departments,
  users,
  documents,
  documentAnalyses,
  risks,
  actions,
  recommendations,
  knowledgeBaseDocuments,
  knowledgeBaseChunks,
  documentChunks,
  activityLog,
  exportJobs,
};
