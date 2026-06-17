"use client";

/**
 * Sparkline — a compact intelligence trend signal.
 *
 * Renders a smooth area+line micro-chart. When no real series is supplied it
 * synthesizes a stable, deterministic shape from a seed (a visual signal, not
 * a quantified claim) so KPI modules read as live readouts rather than flat
 * numbers. Pure SVG; no dependency.
 */

import { useId } from "react";

function seededSeries(seed: number, n = 24): number[] {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const out: number[] = [];
  let v = 0.5;
  for (let i = 0; i < n; i++) {
    v += (rand() - 0.45) * 0.22;
    v = Math.max(0.08, Math.min(0.95, v));
    out.push(v);
  }
  return out;
}

export function Sparkline({
  seed = 7,
  data,
  color = "var(--primary-500)",
  className,
  height = 40,
}: {
  seed?: number;
  data?: number[];
  color?: string;
  className?: string;
  height?: number;
}) {
  const id = useId().replace(/:/g, "");
  const series = data && data.length > 1 ? data : seededSeries(seed);
  const w = 100;
  const h = height;
  const max = Math.max(...series);
  const min = Math.min(...series);
  const range = max - min || 1;
  const step = w / (series.length - 1);

  const pts = series.map((d, i) => {
    const x = i * step;
    const y = h - 6 - ((d - min) / range) * (h - 12);
    return [x, y] as const;
  });

  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={className}
      style={{ width: "100%", height }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2" fill={color} />
    </svg>
  );
}

/** Stable seed from a string label, so each KPI keeps a consistent shape. */
export function seedFrom(label: string): number {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) >>> 0;
  return h || 1;
}
