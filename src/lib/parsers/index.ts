/**
 * Real file parsing (server-only). No external services are contacted.
 *
 *   PDF  -> pdf-parse
 *   DOCX -> mammoth
 *   XLSX -> SheetJS (patched build from cdn.sheetjs.com)
 *
 * Returns normalized, typed content the analysis pipeline can consume.
 */
import "server-only";
import type { FileType } from "@/lib/db/schema";

export type ParsedTable = {
  /** Sheet name (Excel) or a synthetic label (Word table index). */
  name: string;
  /** Row-major cell values. */
  rows: (string | number | null)[][];
};

export type ParsedDocument = {
  text: string;
  tables: ParsedTable[];
  /** Free-form, parser-specific metadata (page count, sheet names, etc.). */
  metadata: Record<string, unknown>;
  /** Excel sheet names (empty for non-spreadsheet types). */
  sheetNames: string[];
  /** Rough character count of extracted text. */
  charCount: number;
};

function detectLanguage(text: string): "ar" | "en" | "mixed" {
  const arabic = (text.match(/[؀-ۿ]/g) ?? []).length;
  const latin = (text.match(/[A-Za-z]/g) ?? []).length;
  if (arabic === 0 && latin === 0) return "en";
  const ratio = arabic / (arabic + latin);
  if (ratio > 0.7) return "ar";
  if (ratio < 0.15) return "en";
  return "mixed";
}

// ---- PDF -------------------------------------------------------------------

async function parsePdf(buffer: Buffer): Promise<ParsedDocument> {
  // pdf-parse v2 exposes a class-based API with native text + table extraction.
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });

  try {
    const textResult = await parser.getText();
    const text = (textResult.text ?? "").trim();

    // Native table detection (vector-grid analysis). Best-effort.
    const tables: ParsedTable[] = [];
    try {
      const tableResult = await parser.getTable();
      tableResult.pages.forEach((page) => {
        page.tables.forEach((grid, idx) => {
          if (grid.length) {
            tables.push({ name: `Page ${page.num} · Table ${idx + 1}`, rows: grid });
          }
        });
      });
    } catch {
      // Table extraction is optional; ignore if the PDF has no detectable grids.
    }

    // Document metadata (page count, info dictionary).
    let pages: number | null = textResult.total ?? null;
    let info: unknown = null;
    try {
      const infoResult = await parser.getInfo();
      pages = (infoResult as { total?: number }).total ?? pages;
      info = (infoResult as { info?: unknown }).info ?? null;
    } catch {
      // Info is optional.
    }

    return {
      text,
      tables,
      metadata: {
        pages,
        info,
        tableCount: tables.length,
        language: detectLanguage(text),
      },
      sheetNames: [],
      charCount: text.length,
    };
  } finally {
    await parser.destroy().catch(() => {});
  }
}

// ---- DOCX ------------------------------------------------------------------

async function parseDocx(buffer: Buffer): Promise<ParsedDocument> {
  const mammoth = await import("mammoth");
  const [{ value: text }, { value: html }] = await Promise.all([
    mammoth.extractRawText({ buffer }),
    mammoth.convertToHtml({ buffer }),
  ]);

  // Lightweight table extraction from the generated HTML.
  const tables: ParsedTable[] = [];
  const tableBlocks = html.match(/<table[\s\S]*?<\/table>/gi) ?? [];
  tableBlocks.forEach((block, i) => {
    const rows: string[][] = [];
    const trs = block.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];
    for (const tr of trs) {
      const cells = (tr.match(/<t[dh][\s\S]*?<\/t[dh]>/gi) ?? []).map((c) =>
        c.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim(),
      );
      if (cells.length) rows.push(cells);
    }
    if (rows.length) tables.push({ name: `Table ${i + 1}`, rows });
  });

  const clean = (text ?? "").trim();
  return {
    text: clean,
    tables,
    metadata: {
      tableCount: tables.length,
      language: detectLanguage(clean),
    },
    sheetNames: [],
    charCount: clean.length,
  };
}

// ---- XLSX ------------------------------------------------------------------

async function parseXlsx(buffer: Buffer): Promise<ParsedDocument> {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(buffer, { type: "buffer" });
  const sheetNames = wb.SheetNames ?? [];
  const tables: ParsedTable[] = [];
  const textParts: string[] = [];

  for (const name of sheetNames) {
    const sheet = wb.Sheets[name];
    if (!sheet) continue;
    const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
      header: 1,
      blankrows: false,
      defval: null,
    });
    tables.push({ name, rows });
    const csv = XLSX.utils.sheet_to_csv(sheet);
    textParts.push(`# ${name}\n${csv}`);
  }

  const text = textParts.join("\n\n").trim();
  return {
    text,
    tables,
    metadata: {
      sheetCount: sheetNames.length,
      language: detectLanguage(text),
    },
    sheetNames,
    charCount: text.length,
  };
}

// ---- Public API ------------------------------------------------------------

export async function parseFile(
  buffer: Buffer,
  fileType: FileType,
): Promise<ParsedDocument> {
  switch (fileType) {
    case "pdf":
      return parsePdf(buffer);
    case "word":
      return parseDocx(buffer);
    case "excel":
      return parseXlsx(buffer);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

export { detectLanguage };
