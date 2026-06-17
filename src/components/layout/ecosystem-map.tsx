"use client";

/**
 * Ecosystem Map — the intelligence network.
 *
 * A spatial node graph connecting every module of the platform around the
 * Analysis Engine. Used both as an immersive navigation overlay and as an
 * embedded overview on the Executive Home. Lines carry flowing pulses;
 * nodes glow on hover; clicking a node travels to that chapter.
 */

import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  X,
  ArrowUpRight,
  UploadCloud,
  Library,
  FlaskConical,
  Landmark,
  Lightbulb,
  Compass,
  Building2,
  LayoutDashboard,
  Cpu,
} from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { CHAPTERS as CHAPTER_INDEX } from "@/lib/chapters";

type Node = {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  x: number;
  y: number;
  core?: boolean;
};

const NODES: Node[] = [
  { href: "/analysis", labelKey: "eco.engine", icon: Cpu, x: 500, y: 320, core: true },
  { href: "/upload", labelKey: "nav.upload", icon: UploadCloud, x: 230, y: 140 },
  { href: "/knowledge-base", labelKey: "nav.knowledge", icon: Library, x: 200, y: 480 },
  { href: "/governance", labelKey: "nav.governance", icon: Landmark, x: 500, y: 80 },
  { href: "/recommendations", labelKey: "nav.recommendations", icon: Lightbulb, x: 780, y: 150 },
  { href: "/decisions", labelKey: "nav.decisions", icon: Compass, x: 800, y: 470 },
  { href: "/departments", labelKey: "nav.departments", icon: Building2, x: 95, y: 310 },
  { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard, x: 905, y: 310 },
  { href: "/analysis", labelKey: "nav.analysis", icon: FlaskConical, x: 500, y: 560 },
];

/** Connections: hub-and-spoke plus cross-links that tell the data story. */
const LINKS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [0, 8],
  [1, 2], // intake feeds knowledge
  [2, 3], // knowledge grounds governance
  [4, 5], // recommendations drive decisions
  [6, 7], // departments roll up to dashboard
];

export function EcosystemGraph({
  onNavigate,
  compact = false,
}: {
  onNavigate?: () => void;
  compact?: boolean;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const reduce = useReducedMotion();

  const go = (href: string) => {
    onNavigate?.();
    router.push(href);
  };

  return (
    <div className="relative w-full" dir="ltr">
      <svg
        viewBox="0 0 1000 640"
        className="h-auto w-full select-none"
        role="navigation"
        aria-label="Intelligence ecosystem map"
      >
        <defs>
          <radialGradient id="eco-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary-500)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary-500)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Connections */}
        {LINKS.map(([a, b], i) => {
          const na = NODES[a];
          const nb = NODES[b];
          return (
            <g key={i}>
              <line
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke="var(--border-strong)"
                strokeWidth="1"
              />
              {!reduce && (
                <line
                  x1={na.x}
                  y1={na.y}
                  x2={nb.x}
                  y2={nb.y}
                  stroke="var(--primary-500)"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                  strokeDasharray="3 21"
                  className="animate-dash-flow"
                />
              )}
            </g>
          );
        })}

        {/* Core glow */}
        <circle cx="500" cy="320" r="120" fill="url(#eco-core)" className="animate-pulse-glow" />

        {/* Nodes */}
        {NODES.map((n, i) => {
          const Icon = n.icon;
          const r = n.core ? 46 : 34;
          return (
            <motion.g
              key={`${n.href}-${i}`}
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
              style={{ cursor: "pointer", transformOrigin: `${n.x}px ${n.y}px` }}
              whileHover={reduce ? undefined : { scale: 1.08 }}
              onClick={() => go(n.href)}
              role="link"
              aria-label={t(n.labelKey)}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={r}
                fill="var(--glass-strong)"
                stroke={n.core ? "var(--primary-500)" : "var(--border-strong)"}
                strokeWidth={n.core ? 1.5 : 1}
              />
              {n.core && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r + 10}
                  fill="none"
                  stroke="var(--primary-500)"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                  className={reduce ? undefined : "animate-dash-flow"}
                />
              )}
              <foreignObject
                x={n.x - 14}
                y={n.y - (compact ? 14 : 22)}
                width="28"
                height="28"
                style={{ pointerEvents: "none" }}
              >
                <div className="flex h-full w-full items-center justify-center">
                  <Icon
                    className={
                      n.core
                        ? "size-6 text-[var(--primary-500)]"
                        : "size-5 text-[var(--muted-foreground)]"
                    }
                  />
                </div>
              </foreignObject>
              {!compact && (
                <text
                  x={n.x}
                  y={n.y + 16}
                  textAnchor="middle"
                  fill={n.core ? "var(--foreground)" : "var(--muted-foreground)"}
                  fontSize="12"
                  fontWeight={n.core ? 600 : 500}
                  style={{ pointerEvents: "none" }}
                >
                  {t(n.labelKey)}
                </text>
              )}
              {compact && (
                <text
                  x={n.x}
                  y={n.y + r + 22}
                  textAnchor="middle"
                  fill="var(--muted-foreground)"
                  fontSize="13"
                  style={{ pointerEvents: "none" }}
                >
                  {t(n.labelKey)}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Full-screen typographic chapter index — the immersive navigation.
 * A numbered editorial list: mono labels, massive statements, hover slide.
 */
export function EcosystemOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const reduce = useReducedMotion();

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[var(--background)]/97 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8">
            <span className="micro-label text-[var(--primary-500)]">{t("eco.eyebrow")}</span>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("common.cancel")}
              className="flex size-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16">
            <ul>
              {CHAPTER_INDEX.map((ch, i) => (
                <motion.li
                  key={ch.href}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-[var(--border)]"
                >
                  <button
                    type="button"
                    onClick={() => go(ch.href)}
                    className="group flex w-full items-baseline gap-5 py-5 text-start transition-colors sm:gap-8 sm:py-6"
                  >
                    <span className="micro-label w-10 shrink-0 text-[var(--text-muted)] transition-colors group-hover:text-[var(--primary-500)]">
                      {ch.number}
                    </span>
                    <span className="display-statement flex-1 text-2xl text-[var(--muted-foreground)] transition-all duration-300 group-hover:translate-x-2 group-hover:text-[var(--foreground)] sm:text-4xl rtl:group-hover:-translate-x-2">
                      {t(ch.nameKey)}
                    </span>
                    <ArrowUpRight className="size-5 shrink-0 self-center text-[var(--text-muted)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 flip-rtl" />
                  </button>
                </motion.li>
              ))}
            </ul>
            <p className="mt-8 text-xs text-[var(--text-muted)]">{t("eco.hint")}</p>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
