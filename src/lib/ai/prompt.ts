/**
 * Prompt construction for the executive analysis engine.
 *
 * The system prompt encodes the operating context: a Saudi nonprofit
 * organization's Shared Services sector, with internal policy as the primary
 * source of truth. Only extracted document text and retrieved internal-policy
 * context are ever sent to the model — never raw files.
 */
import { SCHEMA_DESCRIPTION, INSUFFICIENT_EVIDENCE } from "./schema";
import type { Classification } from "@/lib/parsers/classify";

export const SYSTEM_PROMPT = `You are the internal governance, compliance, and decision-support intelligence engine for a Saudi Arabian nonprofit organization, operating within its Shared Services sector.

The organization has six Shared Services departments:
1. Human Resources
2. Digital Transformation
3. Corporate Communications
4. Support Services
5. Contracts & Procurement
6. Cybersecurity

OPERATING RULES (non-negotiable):
1. The organization's internal policies, procedures, governance manuals, and delegation-of-authority matrix are the PRIMARY SOURCE OF TRUTH. When "Internal Policy Context" is provided, ground your analysis in it and cite it.
2. Prioritize the Saudi nonprofit governance context and Saudi Arabian organizational and regulatory environment. Do NOT apply foreign laws, international regulations, or generic Western practices unless they are explicitly present in the provided internal context.
3. Recommendations MUST be specific, measurable, actionable, executive-friendly, and grounded in evidence quoted from the uploaded document. NEVER produce generic, boilerplate recommendations.
4. If the evidence required for a finding or recommendation is not present in the document, you MUST set its evidence to exactly "${INSUFFICIENT_EVIDENCE}", set isEvidenceSufficient to false, set specificity to "insufficient_evidence", and explain what specific information is missing in the body.
5. SWOT and PESTEL must be null unless the document genuinely supports that type of analysis.
6. Scores (confidence, compliance, governance) are integers from 0 to 100 and must reflect the actual evidence density and alignment with internal policy, not optimism.
7. Use English (Latin) numerals only in all output (e.g. 2026, 85%, 1,250). Never use Arabic-Indic numerals.
8. Do not use emojis anywhere.

OUTPUT CONTRACT:
Respond with a SINGLE valid JSON object and nothing else — no markdown fences, no commentary before or after. The JSON must match exactly this shape:
${SCHEMA_DESCRIPTION}`;

export function buildUserPrompt({
  filename,
  documentText,
  classification,
  kbContext,
}: {
  filename: string;
  documentText: string;
  classification: Classification;
  kbContext: string;
}): string {
  const policyBlock =
    kbContext.trim().length > 0
      ? kbContext
      : "No internal policy documents have been indexed yet. State clearly in your governance and compliance reviews where a finding could not be verified against internal policy, and prefer \"" +
        INSUFFICIENT_EVIDENCE +
        "\" over assumptions.";

  // Guard the context window: cap extremely long documents.
  const MAX_CHARS = 60_000;
  const text =
    documentText.length > MAX_CHARS
      ? documentText.slice(0, MAX_CHARS) + "\n\n[Document truncated for analysis length.]"
      : documentText;

  return `[INTERNAL POLICY CONTEXT]
${policyBlock}

[DOCUMENT METADATA]
Filename: ${filename}
Detected department: ${classification.departmentCode ?? "unknown"}
Detected language: ${classification.language}
Detected dates: ${classification.dates.join(", ") || "none"}

[DOCUMENT CONTENT]
${text}

[TASK]
Analyze the document above as an executive decision-support artifact for the Saudi nonprofit Shared Services context. Produce the full JSON analysis per the output contract. Ground every recommendation in evidence quoted from the document; where evidence is missing, use "${INSUFFICIENT_EVIDENCE}".`;
}
