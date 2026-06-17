"use client";

import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CountUp } from "@/components/motion/primitives";
import { Sparkline, seedFrom } from "@/components/dashboard/sparkline";

/**
 * Intelligence KPI module — the number dominates.
 * Mono readout label, large animated value, accent glyph, and a sparkline
 * trend signal. Hover lifts the module border + glow.
 */
export function KpiCard({
  label,
  value,
  count,
  suffix = "",
  icon: Icon,
  accent = "var(--primary-500)",
  spark = true,
}: {
  label: string;
  /** Preformatted display value (used when `count` is not provided). */
  value?: string;
  /** Numeric value enabling the count-up animation. */
  count?: number;
  suffix?: string;
  icon?: LucideIcon;
  accent?: string;
  spark?: boolean;
}) {
  return (
    <Card className="group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--glow-primary)]">
      <div className="flex items-start justify-between gap-2">
        <p className="micro-label !text-[10px] text-[var(--text-muted)]">{label}</p>
        {Icon && (
          <span
            className="flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)]"
            style={{ backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`, color: accent }}
          >
            <Icon className="size-4" />
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl">
          {typeof count === "number" ? <CountUp value={count} suffix={suffix} /> : value}
        </span>
        {typeof count !== "number" && suffix && (
          <span className="text-base text-[var(--muted-foreground)]">{suffix}</span>
        )}
      </div>

      {spark && (
        <div className="mt-4 -mb-1 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
          <Sparkline seed={seedFrom(label)} color={accent} height={34} />
        </div>
      )}
    </Card>
  );
}
