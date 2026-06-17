/**
 * Strict Zod schema for the executive analysis output.
 *
 * This schema is the single source of truth for what the AI (or the demo
 * analyzer) must return. Every AI response is validated against it with
 * `AnalysisSchema.safeParse(...)` before anything is persisted — malformed or
 * partial model output is rejected rather than written to the database.
 */
import { z } from "zod";

export const PriorityEnum = z.enum(["critical", "high", "medium", "low"]);
export const SeverityEnum = z.enum(["critical", "high", "medium", "low"]);
export const SpecificityEnum = z.enum([
  "specific",
  "general",
  "insufficient_evidence",
]);

export const INSUFFICIENT_EVIDENCE = "Insufficient Evidence Found";

const Insight = z.object({
  title: z.string().min(1),
  detail: z.string().min(1),
});

const RiskItem = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  severity: SeverityEnum,
  category: z.string().default("operational"),
  evidence: z.string().default(""),
});

const GapItem = z.object({
  area: z.string().min(1),
  current: z.string().default(""),
  expected: z.string().default(""),
  kbSource: z.string().optional(),
});

const KpiOpportunity = z.object({
  name: z.string().min(1),
  target: z.string().default(""),
  rationale: z.string().default(""),
});

const Recommendation = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  // Exact supporting quote from the document, OR the literal
  // "Insufficient Evidence Found" string.
  evidence: z.string().default(""),
  isEvidenceSufficient: z.boolean(),
  specificity: SpecificityEnum,
});

const ExecutiveAction = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
  priority: PriorityEnum,
  owner: z.string().optional(),
});

const Swot = z
  .object({
    strengths: z.array(z.string()).default([]),
    weaknesses: z.array(z.string()).default([]),
    opportunities: z.array(z.string()).default([]),
    threats: z.array(z.string()).default([]),
  })
  .nullable();

const Pestel = z
  .object({
    political: z.array(z.string()).default([]),
    economic: z.array(z.string()).default([]),
    social: z.array(z.string()).default([]),
    technological: z.array(z.string()).default([]),
    environmental: z.array(z.string()).default([]),
    legal: z.array(z.string()).default([]),
  })
  .nullable();

export const AnalysisSchema = z.object({
  executiveSummary: z.string().min(1),
  keyInsights: z.array(Insight).default([]),
  risks: z.array(RiskItem).default([]),
  governanceReview: z.string().default(""),
  complianceReview: z.string().default(""),
  gapAnalysis: z.array(GapItem).default([]),
  rootCauseAnalysis: z.string().default(""),
  swot: Swot.default(null),
  pestel: Pestel.default(null),
  kpiOpportunities: z.array(KpiOpportunity).default([]),
  recommendations: z.array(Recommendation).default([]),
  executiveActions: z.array(ExecutiveAction).default([]),
  departmentClassification: z.string().default(""),
  priorityLevel: PriorityEnum,
  confidenceScore: z.number().min(0).max(100),
  complianceScore: z.number().min(0).max(100),
  governanceScore: z.number().min(0).max(100),
});

export type Analysis = z.infer<typeof AnalysisSchema>;
export type AnalysisRisk = z.infer<typeof RiskItem>;
export type AnalysisRecommendation = z.infer<typeof Recommendation>;
export type AnalysisAction = z.infer<typeof ExecutiveAction>;

/** JSON shape description injected into the prompt so the model knows the contract. */
export const SCHEMA_DESCRIPTION = `{
  "executiveSummary": string,
  "keyInsights": [{ "title": string, "detail": string }],
  "risks": [{ "title": string, "description": string, "severity": "critical"|"high"|"medium"|"low", "category": string, "evidence": string }],
  "governanceReview": string,
  "complianceReview": string,
  "gapAnalysis": [{ "area": string, "current": string, "expected": string, "kbSource": string (optional) }],
  "rootCauseAnalysis": string,
  "swot": { "strengths": string[], "weaknesses": string[], "opportunities": string[], "threats": string[] } | null,
  "pestel": { "political": string[], "economic": string[], "social": string[], "technological": string[], "environmental": string[], "legal": string[] } | null,
  "kpiOpportunities": [{ "name": string, "target": string, "rationale": string }],
  "recommendations": [{ "title": string, "body": string, "evidence": string, "isEvidenceSufficient": boolean, "specificity": "specific"|"general"|"insufficient_evidence" }],
  "executiveActions": [{ "title": string, "description": string, "priority": "critical"|"high"|"medium"|"low", "owner": string (optional) }],
  "departmentClassification": string,
  "priorityLevel": "critical"|"high"|"medium"|"low",
  "confidenceScore": number (0-100),
  "complianceScore": number (0-100),
  "governanceScore": number (0-100)
}`;
