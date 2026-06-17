"use client";

/**
 * ChapterGlyph — abstract architectural line symbols for each journey chapter.
 *
 * Editorial, geometric, monochrome-with-accent line art. No 3D, no neon, no
 * illustrations — the visual language of strategy decks (McKinsey / Palantir):
 * precise strokes, restrained, symbolic.
 */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden>
      {children}
    </svg>
  );
}

const GLYPHS: Record<string, React.ReactNode> = {
  // 01 Intake — convergence into a slot
  "/upload": (
    <Frame>
      <g {...STROKE}>
        <path d="M24 8 L24 26" />
        <path d="M18 20 L24 26 L30 20" />
        <path d="M10 32 L38 32" strokeWidth={1.5} />
        <path d="M14 38 L34 38" opacity={0.5} />
        <circle cx="24" cy="14" r="1.4" fill="currentColor" stroke="none" />
      </g>
    </Frame>
  ),
  // 02 Knowledge — strata / ledger
  "/knowledge-base": (
    <Frame>
      <g {...STROKE}>
        <rect x="10" y="12" width="28" height="24" rx="2" />
        <path d="M10 19 L38 19" />
        <path d="M10 26 L38 26" opacity={0.6} />
        <path d="M10 32 L30 32" opacity={0.4} />
        <path d="M16 12 L16 36" opacity={0.5} />
      </g>
    </Frame>
  ),
  // 03 Analysis — radiating hub
  "/analysis": (
    <Frame>
      <g {...STROKE}>
        <circle cx="24" cy="24" r="5" />
        <path d="M24 6 L24 13" />
        <path d="M24 35 L24 42" />
        <path d="M6 24 L13 24" />
        <path d="M35 24 L42 24" />
        <path d="M12 12 L17 17" opacity={0.6} />
        <path d="M31 31 L36 36" opacity={0.6} />
        <path d="M36 12 L31 17" opacity={0.6} />
        <path d="M17 31 L12 36" opacity={0.6} />
      </g>
    </Frame>
  ),
  // 04 Governance — architectural columns
  "/governance": (
    <Frame>
      <g {...STROKE}>
        <path d="M8 16 L24 9 L40 16" strokeWidth={1.5} />
        <path d="M11 16 L11 34" />
        <path d="M19 16 L19 34" />
        <path d="M29 16 L29 34" />
        <path d="M37 16 L37 34" />
        <path d="M8 34 L40 34" strokeWidth={1.5} />
      </g>
    </Frame>
  ),
  // 05 Recommendations — directed beam
  "/recommendations": (
    <Frame>
      <g {...STROKE}>
        <circle cx="16" cy="32" r="3" />
        <path d="M18 30 L36 14" strokeWidth={1.5} />
        <path d="M30 12 L37 13 L36 20" />
        <path d="M12 38 L24 38" opacity={0.4} />
      </g>
    </Frame>
  ),
  // 06 Decisions — fork / chosen path
  "/decisions": (
    <Frame>
      <g {...STROKE}>
        <path d="M24 40 L24 26" strokeWidth={1.5} />
        <path d="M24 26 C24 18 14 18 12 10" />
        <path d="M24 26 C24 18 34 18 36 10" opacity={0.45} />
        <circle cx="12" cy="9" r="2" />
        <circle cx="36" cy="9" r="2" opacity={0.45} />
        <circle cx="24" cy="40" r="2" fill="currentColor" stroke="none" />
      </g>
    </Frame>
  ),
  // 07 Departments — node lattice
  "/departments": (
    <Frame>
      <g {...STROKE}>
        <circle cx="14" cy="14" r="2.2" />
        <circle cx="34" cy="14" r="2.2" />
        <circle cx="14" cy="34" r="2.2" />
        <circle cx="34" cy="34" r="2.2" />
        <circle cx="24" cy="24" r="2.6" />
        <path d="M16 14 L32 14" opacity={0.5} />
        <path d="M14 16 L14 32" opacity={0.5} />
        <path d="M16 16 L22 22" />
        <path d="M32 16 L26 22" />
        <path d="M16 32 L22 26" opacity={0.6} />
        <path d="M32 32 L26 26" opacity={0.6} />
      </g>
    </Frame>
  ),
  // 08 Command — concentric command rings
  "/dashboard": (
    <Frame>
      <g {...STROKE}>
        <circle cx="24" cy="24" r="14" opacity={0.4} />
        <circle cx="24" cy="24" r="9" />
        <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" />
        <path d="M24 10 L24 14" />
        <path d="M24 34 L24 38" />
        <path d="M10 24 L14 24" />
        <path d="M34 24 L38 24" />
      </g>
    </Frame>
  ),
};

export function ChapterGlyph({ href, className }: { href: string; className?: string }) {
  return <div className={className}>{GLYPHS[href] ?? GLYPHS["/analysis"]}</div>;
}
