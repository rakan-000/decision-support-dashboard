/**
 * Heuristic, fully-local document classification (no external AI).
 *
 * This runs in the "classifying" stage to populate sensible defaults
 * (department, priority, dates, owner, language). The AI pipeline in the next
 * task can refine or override these with evidence-based reasoning.
 */
import "server-only";
import type { Priority } from "@/lib/db/schema";

type DeptHint = { code: string; keywords: string[] };

const DEPT_HINTS: DeptHint[] = [
  { code: "HR", keywords: ["human resources", "workforce", "employee", "recruit", "saudization", "الموارد البشرية", "التوطين", "الموظف"] },
  { code: "DT", keywords: ["digital", "transformation", "technology roadmap", "it strategy", "التحول الرقمي", "رقمي"] },
  { code: "CC", keywords: ["communications", "media", "branding", "public relations", "الاتصال", "الإعلام", "العلاقات العامة"] },
  { code: "SS", keywords: ["support services", "facilities", "sla", "service level", "الخدمات المساندة", "اتفاقية مستوى الخدمة"] },
  { code: "CP", keywords: ["procurement", "contract", "vendor", "tender", "purchase", "العقود", "المشتريات", "المورد", "المناقصة"] },
  { code: "CS", keywords: ["cyber", "security", "incident", "threat", "access control", "الأمن السيبراني", "الأمن", "الحادث"] },
];

const PRIORITY_HINTS: { priority: Priority; keywords: string[] }[] = [
  { priority: "critical", keywords: ["critical", "urgent", "breach", "violation", "immediately", "حرج", "عاجل", "خرق", "مخالفة"] },
  { priority: "high", keywords: ["high", "risk", "non-compliance", "deadline", "عالية", "مخاطر", "عدم الامتثال"] },
  { priority: "low", keywords: ["informational", "fyi", "minor", "للعلم", "بسيط"] },
];

export type Classification = {
  departmentCode: string | null;
  priority: Priority;
  dates: string[];
  owner: string | null;
  language: "ar" | "en" | "mixed";
};

function scoreKeywords(haystack: string, keywords: string[]): number {
  let score = 0;
  for (const kw of keywords) {
    if (haystack.includes(kw)) score += 1;
  }
  return score;
}

function extractDates(text: string): string[] {
  const found = new Set<string>();
  // ISO: 2026-06-08
  for (const m of text.matchAll(/\b(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b/g)) {
    found.add(m[0]);
  }
  // DD/MM/YYYY or MM/DD/YYYY -> normalize to original token
  for (const m of text.matchAll(/\b(\d{1,2})[/.](\d{1,2})[/.](20\d{2})\b/g)) {
    found.add(m[0]);
  }
  // Year only
  for (const m of text.matchAll(/\b(20\d{2})\b/g)) {
    found.add(m[1]);
  }
  return Array.from(found).slice(0, 12);
}

export function classifyDocument(
  text: string,
  filename: string,
  fallbackLanguage: "ar" | "en" | "mixed",
): Classification {
  const haystack = `${filename}\n${text}`.toLowerCase();

  // Department
  let bestDept: string | null = null;
  let bestScore = 0;
  for (const hint of DEPT_HINTS) {
    const s = scoreKeywords(haystack, hint.keywords);
    if (s > bestScore) {
      bestScore = s;
      bestDept = hint.code;
    }
  }

  // Priority (default medium)
  let priority: Priority = "medium";
  for (const hint of PRIORITY_HINTS) {
    if (scoreKeywords(haystack, hint.keywords) > 0) {
      priority = hint.priority;
      break;
    }
  }

  // Owner: first meaningful non-empty line, capped.
  const firstLine = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l.length > 3 && l.length < 120);

  return {
    departmentCode: bestDept,
    priority,
    dates: extractDates(`${filename} ${text}`),
    owner: firstLine ?? null,
    language: fallbackLanguage,
  };
}
