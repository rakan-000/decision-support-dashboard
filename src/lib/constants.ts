/** Domain constants shared across the platform. */

export const DEPARTMENTS = [
  { code: "HR", name_en: "Human Resources", name_ar: "الموارد البشرية" },
  { code: "DT", name_en: "Digital Transformation", name_ar: "التحول الرقمي" },
  { code: "CC", name_en: "Corporate Communications", name_ar: "الاتصال المؤسسي" },
  { code: "SS", name_en: "Support Services", name_ar: "الخدمات المساندة" },
  { code: "CP", name_en: "Contracts & Procurement", name_ar: "العقود والمشتريات" },
  { code: "CS", name_en: "Cybersecurity", name_ar: "الأمن السيبراني" },
] as const;

export type DepartmentCode = (typeof DEPARTMENTS)[number]["code"];

export function departmentName(code: string | null | undefined, locale: "ar" | "en") {
  const d = DEPARTMENTS.find((x) => x.code === code);
  if (!d) return locale === "ar" ? "غير محدد" : "Unassigned";
  return locale === "ar" ? d.name_ar : d.name_en;
}

export const PRIORITIES = ["critical", "high", "medium", "low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_META: Record<Priority, { en: string; ar: string; color: string }> = {
  critical: { en: "Critical", ar: "حرجة", color: "var(--risk-critical)" },
  high: { en: "High", ar: "عالية", color: "var(--risk-high)" },
  medium: { en: "Medium", ar: "متوسطة", color: "var(--risk-medium)" },
  low: { en: "Low", ar: "منخفضة", color: "var(--risk-low)" },
};

export const DOC_STATUSES = [
  "queued",
  "extracting",
  "classifying",
  "analyzing",
  "complete",
  "failed",
] as const;
export type DocStatus = (typeof DOC_STATUSES)[number];

export const PROCESSING_STAGES: { key: DocStatus; en: string; ar: string }[] = [
  { key: "queued", en: "Queued", ar: "في الانتظار" },
  { key: "extracting", en: "Extracting content", ar: "استخراج المحتوى" },
  { key: "classifying", en: "Classifying", ar: "التصنيف" },
  { key: "analyzing", en: "Analyzing with AI", ar: "التحليل بالذكاء الاصطناعي" },
  { key: "complete", en: "Complete", ar: "اكتمل" },
];

export const KB_TYPES = [
  { code: "policy", en: "Policy", ar: "سياسة" },
  { code: "procedure", en: "Procedure", ar: "إجراء" },
  { code: "governance_manual", en: "Governance Manual", ar: "دليل الحوكمة" },
  { code: "delegation_authority", en: "Delegation of Authority", ar: "تفويض الصلاحيات" },
  { code: "guideline", en: "Guideline", ar: "إرشادات" },
  { code: "org_structure", en: "Org Structure", ar: "الهيكل التنظيمي" },
  { code: "dept_manual", en: "Department Manual", ar: "دليل الإدارة" },
  { code: "compliance", en: "Compliance", ar: "وثيقة امتثال" },
] as const;
export type KbType = (typeof KB_TYPES)[number]["code"];

export function kbTypeName(code: string | null | undefined, locale: "ar" | "en") {
  const t = KB_TYPES.find((x) => x.code === code);
  if (!t) return code ?? "-";
  return locale === "ar" ? t.ar : t.en;
}

export const RISK_SEVERITIES = ["critical", "high", "medium", "low"] as const;
export const ACTION_STATUSES = ["open", "in_progress", "complete", "overdue"] as const;
export const RECOMMENDATION_STATUSES = ["pending", "accepted", "rejected", "implemented"] as const;

export const FILE_TYPE_BY_EXT: Record<string, "pdf" | "excel" | "word"> = {
  pdf: "pdf",
  xlsx: "excel",
  xls: "excel",
  csv: "excel",
  docx: "word",
  doc: "word",
};
