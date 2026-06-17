/**
 * Print-ready executive HTML report (server-only).
 *
 * Produces a self-contained, RTL-aware HTML document optimized for printing to
 * PDF (the browser's "Save as PDF" yields a clean executive PDF, and Arabic is
 * shaped correctly by the system font). English numerals only; no emojis.
 */
import "server-only";
import { type ReportModel, reportLabels } from "./report";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function section(title: string, body: string): string {
  if (!body.trim()) return "";
  return `<section><h2>${esc(title)}</h2>${body}</section>`;
}

function scoreRow(L: ReturnType<typeof reportLabels>, r: ReportModel): string {
  const item = (label: string, v: number, color: string) => `
    <div class="score">
      <div class="score-val" style="color:${color}">${v}%</div>
      <div class="score-label">${esc(label)}</div>
    </div>`;
  return `<div class="scores">
    ${item(L.confidence, r.confidence, "#0ea5e9")}
    ${item(L.compliance, r.compliance, "#16a34a")}
    ${item(L.governance, r.governance, "#0284c7")}
  </div>`;
}

export function renderReportHtml(
  r: ReportModel,
  opts: { summaryOnly?: boolean } = {},
): string {
  const L = reportLabels(r.locale);
  const dir = r.locale === "ar" ? "rtl" : "ltr";
  const summaryOnly = opts.summaryOnly ?? false;

  const meta = `<div class="meta">
    <span><strong>${esc(L.department)}:</strong> ${esc(r.department)}</span>
    <span><strong>${esc(L.priority)}:</strong> ${esc(r.priority)}</span>
    <span><strong>${esc(L.status)}:</strong> ${esc(r.status)}</span>
  </div>`;

  const insights = r.keyInsights.length
    ? `<ul>${r.keyInsights.map((i) => `<li><strong>${esc(i.title)}.</strong> ${esc(i.detail)}</li>`).join("")}</ul>`
    : `<p class="muted">${esc(L.none)}</p>`;

  const risks = r.risks.length
    ? r.risks
        .map(
          (x) =>
            `<div class="card"><div class="card-head"><strong>${esc(x.title)}</strong><span class="pill">${esc(x.severity)}</span></div>${
              x.description ? `<p>${esc(x.description)}</p>` : ""
            }${x.evidence && x.evidence !== "Insufficient Evidence Found" ? `<p class="ev">${esc(L.evidence)}: ${esc(x.evidence)}</p>` : ""}</div>`,
        )
        .join("")
    : `<p class="muted">${esc(L.none)}</p>`;

  const gaps = r.gapAnalysis.length
    ? `<table><thead><tr><th>${esc(r.locale === "ar" ? "المجال" : "Area")}</th><th>${esc(r.locale === "ar" ? "الحالي" : "Current")}</th><th>${esc(r.locale === "ar" ? "المتوقع" : "Expected")}</th></tr></thead><tbody>${r.gapAnalysis
        .map((g) => `<tr><td>${esc(g.area)}</td><td>${esc(g.current)}</td><td>${esc(g.expected)}</td></tr>`)
        .join("")}</tbody></table>`
    : `<p class="muted">${esc(L.none)}</p>`;

  const kpis = r.kpiOpportunities.length
    ? `<ul>${r.kpiOpportunities.map((k) => `<li><strong>${esc(k.name)}</strong>${k.target ? ` — ${esc(k.target)}` : ""}${k.rationale ? `<br><span class="muted">${esc(k.rationale)}</span>` : ""}</li>`).join("")}</ul>`
    : `<p class="muted">${esc(L.none)}</p>`;

  const recs = r.recommendations.length
    ? r.recommendations
        .map(
          (x) =>
            `<div class="card"><strong>${esc(x.title)}</strong><p>${esc(x.body)}</p>${
              x.insufficient
                ? `<p class="warn">${esc(L.insufficient)}</p>`
                : x.evidence
                  ? `<p class="ev">${esc(L.evidence)}: ${esc(x.evidence)}</p>`
                  : ""
            }</div>`,
        )
        .join("")
    : `<p class="muted">${esc(L.none)}</p>`;

  const actions = r.executiveActions.length
    ? `<table><thead><tr><th>${esc(L.executiveActions)}</th><th>${esc(L.priority)}</th></tr></thead><tbody>${r.executiveActions
        .map((a) => `<tr><td>${esc(a.title)}${a.description ? `<br><span class="muted">${esc(a.description)}</span>` : ""}</td><td>${esc(a.priority)}</td></tr>`)
        .join("")}</tbody></table>`
    : `<p class="muted">${esc(L.none)}</p>`;

  const sources = r.sources.length
    ? `<ul>${r.sources.map((s) => `<li>${esc(s.title)}</li>`).join("")}</ul>`
    : `<p class="muted">${esc(L.none)}</p>`;

  const fullSections =
    section(L.executiveSummary, `<p>${esc(r.executiveSummary)}</p>`) +
    section(L.keyInsights, insights) +
    section(L.risks, risks) +
    section(L.governanceReview, `<p>${esc(r.governanceReview) || `<span class="muted">${esc(L.none)}</span>`}</p>`) +
    section(L.complianceReview, `<p>${esc(r.complianceReview) || `<span class="muted">${esc(L.none)}</span>`}</p>`) +
    section(L.gapAnalysis, gaps) +
    section(L.kpi, kpis) +
    section(L.recommendations, recs) +
    section(L.executiveActions, actions) +
    section(L.sources, sources);

  const summarySections =
    section(L.executiveSummary, `<p>${esc(r.executiveSummary)}</p>`) +
    section(L.recommendations, recs) +
    section(L.executiveActions, actions);

  const body = summaryOnly ? summarySections : fullSections;
  const titleLine = summaryOnly ? L.summaryTitle : L.reportTitle;

  return `<!DOCTYPE html>
<html lang="${r.locale}" dir="${dir}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(titleLine)} - ${esc(r.filename)}</title>
<style>
  * { font-variant-numeric: lining-nums tabular-nums; font-feature-settings: "lnum"; box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: "IBM Plex Sans Arabic", "Segoe UI", Tahoma, Arial, sans-serif; color: #0f172a; margin: 0; padding: 32px 36px; line-height: 1.6; }
  header { border-bottom: 2px solid #0ea5e9; padding-bottom: 14px; margin-bottom: 18px; }
  .eyebrow { color: #0ea5e9; font-size: 12px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; }
  h1 { font-size: 22px; margin: 6px 0 4px; }
  .app { color: #64748b; font-size: 12px; }
  .meta { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 10px; font-size: 13px; color: #475569; }
  .demo { display: inline-block; margin-top: 8px; background: #fef3c7; color: #92400e; font-size: 11px; padding: 2px 8px; border-radius: 999px; }
  .scores { display: flex; gap: 12px; margin: 16px 0 8px; }
  .score { flex: 1; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; text-align: center; }
  .score-val { font-size: 26px; font-weight: 700; }
  .score-label { font-size: 11px; color: #64748b; margin-top: 2px; }
  section { margin-top: 18px; page-break-inside: avoid; }
  h2 { font-size: 14px; color: #0f172a; border-${dir === "rtl" ? "right" : "left"}: 3px solid #0ea5e9; padding-${dir === "rtl" ? "right" : "left"}: 8px; margin-bottom: 8px; }
  p { margin: 6px 0; font-size: 13px; }
  ul { margin: 6px 0; padding-${dir === "rtl" ? "right" : "left"}: 18px; font-size: 13px; }
  li { margin: 4px 0; }
  .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; margin: 8px 0; }
  .card-head { display: flex; justify-content: space-between; gap: 8px; }
  .pill { font-size: 11px; background: #f1f5f9; border-radius: 999px; padding: 1px 8px; color: #475569; }
  .ev { font-size: 12px; color: #64748b; font-style: italic; border-${dir === "rtl" ? "right" : "left"}: 2px solid #cbd5e1; padding-${dir === "rtl" ? "right" : "left"}: 8px; }
  .warn { font-size: 12px; color: #92400e; background: #fef3c7; display: inline-block; padding: 2px 8px; border-radius: 6px; }
  .muted { color: #94a3b8; font-size: 12px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 6px; }
  th, td { border: 1px solid #e2e8f0; padding: 6px 8px; text-align: ${dir === "rtl" ? "right" : "left"}; vertical-align: top; }
  th { background: #f8fafc; font-weight: 600; }
  footer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 11px; color: #94a3b8; }
  @page { margin: 16mm; }
</style>
</head>
<body>
  <header>
    <div class="eyebrow">${esc(titleLine)}</div>
    <h1>${esc(r.filename)}</h1>
    <div class="app">${esc(L.appName)}</div>
    ${meta}
    ${r.isDemo ? `<div class="demo">${esc(L.demo)}</div>` : ""}
  </header>
  ${scoreRow(L, r)}
  ${body}
  <footer>${esc(L.generated)}: ${esc(r.generatedAt)} · ${esc(L.appName)}</footer>
  <script>window.addEventListener("load", function(){ setTimeout(function(){ try { window.print(); } catch(e){} }, 300); });</script>
</body>
</html>`;
}
