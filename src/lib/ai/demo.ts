/**
 * Demo analysis generator (server-only).
 *
 * Produces a VALID `Analysis` object without contacting any AI provider, used
 * when ANTHROPIC_API_KEY is not configured. It is deliberately honest:
 * - It is clearly labeled as demo (the pipeline stores isDemo = true).
 * - It never fabricates risks, evidence, or specific findings.
 * - Recommendations are marked "insufficient_evidence" and explain that a real
 *   AI provider must be connected for evidence-based analysis.
 *
 * It is grounded in real, locally-computed signals from the document
 * (length, detected department, detected dates) so the UI is populated
 * truthfully rather than with invented content.
 */
import { type Analysis, INSUFFICIENT_EVIDENCE } from "./schema";
import type { Classification } from "@/lib/parsers/classify";
import type { KbSourceRef } from "@/lib/db/schema";
import { departmentName } from "@/lib/constants";

export function demoAnalysis({
  filename,
  text,
  classification,
  kbSources = [],
}: {
  filename: string;
  text: string;
  classification: Classification;
  kbSources?: KbSourceRef[];
}): Analysis {
  const words = text.trim().length ? text.trim().split(/\s+/).length : 0;
  const deptEn = departmentName(classification.departmentCode, "en");
  const datesNote =
    classification.dates.length > 0
      ? `Detected dates: ${classification.dates.join(", ")}.`
      : "No structured dates were detected in the document.";

  const kbNote =
    kbSources.length > 0
      ? `Retrieved ${kbSources.length.toLocaleString(
          "en-US",
        )} relevant internal knowledge base document(s): ${kbSources
          .map((s) => s.title)
          .join(", ")}. A connected AI provider will assess this document against them.`
      : "No internal knowledge base documents were matched. Index policies, procedures, and governance manuals in the Knowledge Base to enable grounded review.";

  return {
    executiveSummary:
      `This is a demonstration analysis generated without a connected AI provider. ` +
      `The document "${filename}" was read and classified locally. It contains approximately ` +
      `${words.toLocaleString("en-US")} words and was associated with the ${deptEn} department. ` +
      `${datesNote} Connect an Anthropic API key to produce a full, evidence-based executive analysis.`,
    keyInsights: [
      {
        title: "Local extraction succeeded",
        detail: `The file was parsed and its text content was extracted (${words.toLocaleString(
          "en-US",
        )} words). No content was sent to any external service.`,
      },
      {
        title: "Department classification (heuristic)",
        detail: `Classified to ${deptEn} using local keyword heuristics. A connected AI model will refine this against internal policy.`,
      },
    ],
    risks: [],
    governanceReview:
      `Not assessed in demo mode. ${kbNote} Governance review against the internal governance manual and delegation-of-authority matrix requires a connected AI provider.`,
    complianceReview:
      `Not assessed in demo mode. ${kbNote} Compliance alignment against internal policies and procedures requires a connected AI provider.`,
    gapAnalysis: [
      {
        area: "AI provider configuration",
        current: "No Anthropic API key configured; running in demo mode.",
        expected:
          "A configured AI provider to enable evidence-based governance and compliance review against the indexed knowledge base.",
        kbSource: kbSources[0]?.title,
      },
    ],
    rootCauseAnalysis:
      "Not assessed in demo mode. Root cause analysis requires a connected AI provider.",
    swot: null,
    pestel: null,
    kpiOpportunities: [],
    recommendations: [
      {
        title: "Connect an AI provider to enable evidence-based analysis",
        body:
          "The platform is operating in demo mode. To produce specific, measurable, evidence-backed recommendations grounded in this document and the organization's internal policies, configure ANTHROPIC_API_KEY and index the private knowledge base. Until then, document-specific findings cannot be produced.",
        evidence: INSUFFICIENT_EVIDENCE,
        isEvidenceSufficient: false,
        specificity: "insufficient_evidence",
      },
    ],
    executiveActions: [
      {
        title: "Configure the Anthropic API key",
        description:
          "Set ANTHROPIC_API_KEY in the environment to switch the platform from demo mode to real Claude analysis.",
        priority: "medium",
      },
    ],
    departmentClassification: classification.departmentCode ?? "",
    priorityLevel: classification.priority,
    confidenceScore: 35,
    complianceScore: 0,
    governanceScore: 0,
  };
}
