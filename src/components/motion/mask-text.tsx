"use client";

/**
 * MaskText — editorial masked text reveal.
 *
 * Each word sits inside an overflow-hidden mask and rises into place.
 * Document order is preserved so RTL Arabic flows correctly.
 *
 * mode:
 *   "mount" — plays immediately on mount (above-the-fold statements)
 *   "view"  — plays when scrolled into view (below-the-fold sections)
 *
 * In view mode the IntersectionObserver lives on the UNCLIPPED wrapper and
 * variants propagate to the clipped children — observing the clipped child
 * directly would never intersect (it has zero visible area while hidden).
 */

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

type Mode = "mount" | "view";

const wordVariants = (delay: number, duration: number): Variants => ({
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration, delay, ease: EASE } },
});

export function MaskText({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  duration = 0.8,
  as: Tag = "span",
  mode = "mount",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  mode?: Mode;
}) {
  const reduce = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);

  if (reduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = motion[Tag === "span" ? "span" : Tag] as typeof motion.span;

  return (
    <MotionTag
      className={cn("inline-block", className)}
      aria-label={text}
      initial="hidden"
      {...(mode === "mount"
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, margin: "-40px" } })}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden="true">
          <span className="relative inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={wordVariants(delay + i * stagger, duration)}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </MotionTag>
  );
}

/** Masked rise for arbitrary block content (numbers, lines, links). */
export function MaskRise({
  children,
  className,
  delay = 0,
  duration = 0.9,
  mode = "mount",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  mode?: Mode;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial="hidden"
      {...(mode === "mount"
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, margin: "-40px" } })}
    >
      <motion.div
        className=""
        variants={{
          hidden: { y: "105%" },
          show: { y: "0%", transition: { duration, delay, ease: EASE } },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
