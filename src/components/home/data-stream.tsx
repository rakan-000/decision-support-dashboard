"use client";

/**
 * DataStream — the living intelligence network.
 *
 * A Canvas 2D field of particles flowing along curved streams that converge
 * into a glowing intelligence core, with travelling light pulses and a faint
 * constellation. Reacts to the pointer (parallax) for a dynamic, alive feel.
 * Performance-guarded: DPR capped, particle budget scaled to area, single rAF,
 * static single-frame fallback under prefers-reduced-motion.
 */

import { useEffect, useRef } from "react";

type P = { curve: number; t: number; speed: number; size: number; bright: boolean };

export function DataStream({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    // Focal core (fraction of canvas). Slightly off-center toward the inner edge.
    const coreF = { x: 0.62, y: 0.5 };

    // Stream guide curves (quadratic beziers) from edges → core, set on resize.
    let curves: { p0: [number, number]; p1: [number, number]; p2: [number, number] }[] = [];
    let particles: P[] = [];

    const buildScene = () => {
      const core: [number, number] = [w * coreF.x, h * coreF.y];
      const origins: [number, number][] = [
        [-0.05 * w, 0.12 * h],
        [-0.05 * w, 0.4 * h],
        [-0.05 * w, 0.72 * h],
        [0.1 * w, -0.05 * h],
        [0.3 * w, 1.05 * h],
        [0.05 * w, 0.95 * h],
        [-0.05 * w, 0.9 * h],
        [0.2 * w, -0.05 * h],
      ];
      curves = origins.map((o, i) => {
        const midX = (o[0] + core[0]) / 2 + (i % 2 ? 1 : -1) * 0.08 * w;
        const midY = (o[1] + core[1]) / 2 + (i % 3 ? -1 : 1) * 0.12 * h;
        return { p0: o, p1: [midX, midY], p2: core };
      });

      const budget = Math.min(150, Math.max(50, Math.round((w * h) / 5200)));
      particles = Array.from({ length: budget }, () => ({
        curve: Math.floor(Math.random() * curves.length),
        t: Math.random(),
        speed: 0.0014 + Math.random() * 0.0042,
        size: 0.8 + Math.random() * 1.8,
        bright: Math.random() < 0.14,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildScene();
    };

    const bezier = (
      c: { p0: [number, number]; p1: [number, number]; p2: [number, number] },
      t: number,
    ): [number, number] => {
      const mt = 1 - t;
      return [
        mt * mt * c.p0[0] + 2 * mt * t * c.p1[0] + t * t * c.p2[0],
        mt * mt * c.p0[1] + 2 * mt * t * c.p1[1] + t * t * c.p2[1],
      ];
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Pointer easing → parallax offset
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      const px = (pointer.x - 0.5) * 26;
      const py = (pointer.y - 0.5) * 26;

      const core: [number, number] = [w * coreF.x + px, h * coreF.y + py];

      // Faint guide streams
      ctx.lineWidth = 1;
      for (const c of curves) {
        ctx.beginPath();
        ctx.moveTo(c.p0[0] + px, c.p0[1] + py);
        ctx.quadraticCurveTo(c.p1[0] + px, c.p1[1] + py, core[0], core[1]);
        ctx.strokeStyle = "rgba(56,189,248,0.05)";
        ctx.stroke();
      }

      // Particles
      for (const p of particles) {
        if (!reduce) {
          p.t += p.speed;
          if (p.t >= 1) {
            p.t = 0;
            p.curve = Math.floor(Math.random() * curves.length);
          }
        }
        const c = curves[p.curve];
        const cc = { p0: c.p0, p1: c.p1, p2: core };
        const [x0, y0] = bezier(cc, p.t);
        const x = x0 + px;
        const y = y0 + py;
        const fade = Math.sin(p.t * Math.PI); // dim at ends, bright mid
        const alpha = (p.bright ? 0.9 : 0.5) * fade;
        const size = p.size * (p.bright ? 1.7 : 1) * (0.5 + fade);

        if (p.bright) {
          ctx.beginPath();
          ctx.arc(x, y, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56,189,248,${alpha * 0.18})`;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.bright
          ? `rgba(125,211,252,${alpha})`
          : `rgba(56,189,248,${alpha})`;
        ctx.fill();
      }

      // Intelligence core glow
      const g = ctx.createRadialGradient(core[0], core[1], 0, core[0], core[1], 90);
      g.addColorStop(0, "rgba(125,211,252,0.5)");
      g.addColorStop(0.25, "rgba(56,189,248,0.22)");
      g.addColorStop(1, "rgba(56,189,248,0)");
      ctx.beginPath();
      ctx.arc(core[0], core[1], 90, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(core[0], core[1], 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(186,230,253,0.95)";
      ctx.fill();

      // Core ring
      ctx.beginPath();
      ctx.arc(core[0], core[1], 26, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56,189,248,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (e.clientX - rect.left) / rect.width;
      pointer.ty = (e.clientY - rect.top) / rect.height;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    window.addEventListener("pointermove", onPointer);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
