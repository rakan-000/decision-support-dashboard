/**
 * Executive PowerPoint generator (server-only).
 *
 * Builds a real .pptx deck with pptxgenjs. PowerPoint shapes Arabic text
 * correctly; we set rtlMode + right alignment for Arabic locale. English
 * numerals only; no emojis.
 */
import "server-only";
import { type ReportModel, reportLabels } from "./report";

const NAVY = "0F172A";
const BLUE = "0EA5E9";
const SLATE = "475569";
const MUTED = "94A3B8";
const GREEN = "16A34A";

function clamp(s: string, n = 600): string {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

export async function buildPptx(r: ReportModel): Promise<Buffer> {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const pptx = new PptxGenJS();
  type Slide = ReturnType<typeof pptx.addSlide>;
  type AddTextArg = Parameters<Slide["addText"]>[0];
  const L = reportLabels(r.locale);
  const rtl = r.locale === "ar";
  const align = rtl ? "right" : "left";

  pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
  pptx.layout = "WIDE";
  pptx.author = L.appName;

  const titleOpts = {
    fontFace: "Arial",
    bold: true,
    color: NAVY,
    rtlMode: rtl,
    align: align as "left" | "right",
  };
  const bodyOpts = {
    fontFace: "Arial",
    color: SLATE,
    fontSize: 14,
    rtlMode: rtl,
    align: align as "left" | "right",
  };

  const addHeading = (slide: Slide, text: string) => {
    slide.addText(text, { x: 0.6, y: 0.4, w: 12.1, h: 0.7, fontSize: 24, ...titleOpts });
    slide.addShape(pptx.ShapeType.line, {
      x: 0.6,
      y: 1.15,
      w: 12.1,
      h: 0,
      line: { color: BLUE, width: 2 },
    });
  };

  const bulletSlide = (slide: Slide, items: string[]) => {
    const data = (items.length ? items : [L.none]).map((t) => ({
      text: clamp(t, 280),
      options: { bullet: true, ...bodyOpts, breakLine: true, paraSpaceAfter: 6 },
    }));
    slide.addText(data as unknown as AddTextArg, { x: 0.6, y: 1.4, w: 12.1, h: 5.5, valign: "top" });
  };

  // 1. Cover
  const cover = pptx.addSlide();
  cover.background = { color: NAVY };
  cover.addText(L.reportTitle, { x: 0.7, y: 2.4, w: 12, h: 0.5, fontSize: 16, color: BLUE, bold: true, rtlMode: rtl, align });
  cover.addText(clamp(r.filename, 120), { x: 0.7, y: 2.9, w: 12, h: 1.2, fontSize: 32, color: "FFFFFF", bold: true, rtlMode: rtl, align });
  cover.addText(
    `${L.department}: ${r.department}   |   ${L.priority}: ${r.priority}   |   ${L.status}: ${r.status}`,
    { x: 0.7, y: 4.2, w: 12, h: 0.5, fontSize: 13, color: "CBD5E1", rtlMode: rtl, align },
  );
  cover.addText(`${L.appName}${r.isDemo ? `   ·   ${L.demo}` : ""}`, {
    x: 0.7,
    y: 6.7,
    w: 12,
    h: 0.4,
    fontSize: 11,
    color: MUTED,
    rtlMode: rtl,
    align,
  });

  // 2. Executive Summary
  const sum = pptx.addSlide();
  addHeading(sum, L.executiveSummary);
  sum.addText(clamp(r.executiveSummary, 1400), { x: 0.6, y: 1.4, w: 12.1, h: 5.5, ...bodyOpts, valign: "top" });

  // 3. Scores
  const sc = pptx.addSlide();
  addHeading(sc, L.confidence + " · " + L.compliance + " · " + L.governance);
  const scoreData: [string, number, string][] = [
    [L.confidence, r.confidence, BLUE],
    [L.compliance, r.compliance, GREEN],
    [L.governance, r.governance, "0284C7"],
  ];
  scoreData.forEach(([label, val, color], i) => {
    const x = 0.9 + i * 4.0;
    sc.addText(`${val}%`, { x, y: 2.4, w: 3.4, h: 1.4, fontSize: 60, bold: true, color, align: "center", fontFace: "Arial" });
    sc.addText(label, { x, y: 3.9, w: 3.4, h: 0.6, fontSize: 16, color: SLATE, align: "center", fontFace: "Arial", rtlMode: rtl });
  });

  // 4. Risks
  const rk = pptx.addSlide();
  addHeading(rk, L.risks);
  bulletSlide(rk, r.risks.map((x) => `[${x.severity}] ${x.title}`));

  // 5. Governance & Compliance
  const gc = pptx.addSlide();
  addHeading(gc, `${L.governanceReview} · ${L.complianceReview}`);
  gc.addText(L.governanceReview, { x: 0.6, y: 1.4, w: 6, h: 0.4, bold: true, ...bodyOpts });
  gc.addText(clamp(r.governanceReview || L.none, 600), { x: 0.6, y: 1.9, w: 6, h: 4.8, ...bodyOpts, fontSize: 12, valign: "top" });
  gc.addText(L.complianceReview, { x: 6.9, y: 1.4, w: 5.8, h: 0.4, bold: true, ...bodyOpts });
  gc.addText(clamp(r.complianceReview || L.none, 600), { x: 6.9, y: 1.9, w: 5.8, h: 4.8, ...bodyOpts, fontSize: 12, valign: "top" });

  // 6. Recommendations
  const rc = pptx.addSlide();
  addHeading(rc, L.recommendations);
  bulletSlide(
    rc,
    r.recommendations.map((x) => `${x.title}${x.insufficient ? ` (${L.insufficient})` : ""}`),
  );

  // 7. Executive Actions
  const ac = pptx.addSlide();
  addHeading(ac, L.executiveActions);
  bulletSlide(ac, r.executiveActions.map((a) => `[${a.priority}] ${a.title}`));

  // 8. Knowledge Sources
  const ks = pptx.addSlide();
  addHeading(ks, L.sources);
  bulletSlide(ks, r.sources.map((s) => s.title));

  const out = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;
  return out;
}
