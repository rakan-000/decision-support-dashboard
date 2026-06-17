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
  const deptAr = departmentName(classification.departmentCode, "ar");
  const datesNote =
    classification.dates.length > 0
      ? `تم رصد تواريخ داخل الوثيقة: ${classification.dates.join(", ")}.`
      : "لم يتم رصد تواريخ منظمة داخل الوثيقة.";

  const kbNote =
    kbSources.length > 0
      ? `تم استرجاع ${kbSources.length.toLocaleString(
          "en-US",
        )} مصدر داخلي ذي صلة من قاعدة المعرفة: ${kbSources
          .map((s) => s.title)
          .join(", ")}. عند تفعيل مزود الذكاء الاصطناعي سيتم تقييم الوثيقة مقابل هذه المصادر.`
      : "لم تتم مطابقة مصادر داخلية من قاعدة المعرفة. أضف السياسات والإجراءات وأدلة الحوكمة إلى قاعدة المعرفة لتمكين مراجعة مستندة إلى مصادر داخلية.";

  return {
    executiveSummary:
      `هذا تحليل تجريبي تم إنشاؤه دون اتصال بمزود ذكاء اصطناعي خارجي. ` +
      `تمت قراءة الوثيقة "${filename}" وتصنيفها محلياً. تحتوي الوثيقة على نحو ` +
      `${words.toLocaleString("en-US")} كلمة، وتم ربطها بإدارة ${deptAr}. ` +
      `${datesNote} أضف مفتاح Anthropic API لإنتاج تحليل تنفيذي كامل مستند إلى الأدلة.`,
    keyInsights: [
      {
        title: "اكتمل الاستخراج المحلي",
        detail: `تمت قراءة الملف واستخراج محتواه النصي محلياً (${words.toLocaleString(
          "en-US",
        )} كلمة). لم يتم إرسال أي محتوى إلى خدمة خارجية.`,
      },
      {
        title: "تصنيف الإدارة وفق مؤشرات محلية",
        detail: `تم تصنيف الوثيقة ضمن إدارة ${deptAr} باستخدام مؤشرات كلمات مفتاحية محلية. عند تفعيل نموذج الذكاء الاصطناعي سيتم تحسين التصنيف مقابل السياسات الداخلية.`,
      },
    ],
    risks: [],
    governanceReview:
      `لم يتم إجراء تقييم حوكمي كامل في وضع العرض التجريبي. ${kbNote} تتطلب مراجعة الحوكمة مقابل دليل الحوكمة ومصفوفة تفويض الصلاحيات تفعيل مزود ذكاء اصطناعي.`,
    complianceReview:
      `لم يتم إجراء تقييم امتثال كامل في وضع العرض التجريبي. ${kbNote} يتطلب قياس التوافق مع السياسات والإجراءات الداخلية تفعيل مزود ذكاء اصطناعي.`,
    gapAnalysis: [
      {
        area: "تهيئة مزود الذكاء الاصطناعي",
        current: "لم يتم إعداد مفتاح Anthropic API؛ النظام يعمل حالياً في وضع العرض التجريبي.",
        expected:
          "تهيئة مزود ذكاء اصطناعي لتمكين مراجعة الحوكمة والامتثال المستندة إلى الأدلة وقاعدة المعرفة المفهرسة.",
        kbSource: kbSources[0]?.title,
      },
    ],
    rootCauseAnalysis:
      "لم يتم إجراء تحليل السبب الجذري في وضع العرض التجريبي. يتطلب هذا النوع من التحليل تفعيل مزود ذكاء اصطناعي.",
    swot: null,
    pestel: null,
    kpiOpportunities: [],
    recommendations: [
      {
        title: "تفعيل مزود ذكاء اصطناعي لإنتاج تحليل مستند إلى الأدلة",
        body:
          "تعمل المنصة حالياً في وضع العرض التجريبي. لإنتاج توصيات محددة وقابلة للقياس ومستندة إلى أدلة من الوثيقة وسياسات المؤسسة الداخلية، يجب إعداد ANTHROPIC_API_KEY وفهرسة قاعدة المعرفة الخاصة. إلى ذلك الحين، لا يمكن إنتاج نتائج تفصيلية خاصة بالوثيقة.",
        evidence: INSUFFICIENT_EVIDENCE,
        isEvidenceSufficient: false,
        specificity: "insufficient_evidence",
      },
    ],
    executiveActions: [
      {
        title: "إعداد مفتاح Anthropic API",
        description:
          "أضف ANTHROPIC_API_KEY في متغيرات البيئة لتحويل المنصة من وضع العرض التجريبي إلى تحليل Claude الحقيقي.",
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
