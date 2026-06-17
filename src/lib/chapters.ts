/**
 * The narrative spine of the platform.
 *
 * Every primary module is a numbered chapter in the intelligence story.
 * Consumed by the statement header, the next-chapter progression footer,
 * and the typographic navigation index.
 */

export type Chapter = {
  href: string;
  number: string;
  nameKey: string;
  statementKey: string;
};

export const CHAPTERS: Chapter[] = [
  { href: "/upload", number: "01", nameKey: "ch.upload.name", statementKey: "ch.upload.statement" },
  { href: "/knowledge-base", number: "02", nameKey: "ch.kb.name", statementKey: "ch.kb.statement" },
  { href: "/analysis", number: "03", nameKey: "ch.analysis.name", statementKey: "ch.analysis.statement" },
  { href: "/governance", number: "04", nameKey: "ch.governance.name", statementKey: "ch.governance.statement" },
  { href: "/recommendations", number: "05", nameKey: "ch.recommendations.name", statementKey: "ch.recommendations.statement" },
  { href: "/decisions", number: "06", nameKey: "ch.decisions.name", statementKey: "ch.decisions.statement" },
  { href: "/departments", number: "07", nameKey: "ch.departments.name", statementKey: "ch.departments.statement" },
  { href: "/dashboard", number: "08", nameKey: "ch.dashboard.name", statementKey: "ch.dashboard.statement" },
  { href: "/history", number: "09", nameKey: "ch.history.name", statementKey: "ch.history.statement" },
];

export function chapterForPath(pathname: string): Chapter | null {
  const root = "/" + (pathname.split("/")[1] ?? "");
  return CHAPTERS.find((c) => c.href === root) ?? null;
}

export function nextChapter(pathname: string): Chapter | null {
  const current = chapterForPath(pathname);
  if (!current) return null;
  const idx = CHAPTERS.indexOf(current);
  return CHAPTERS[idx + 1] ?? null;
}
