"use client";

/**
 * Chapter opening — every module begins with a statement.
 *
 * Editorial hierarchy: mono chapter label -> massive masked statement ->
 * concise supporting line -> hairline. Typography leads; everything below
 * supports. The statement comes from the chapter registry; the `title` prop
 * remains as the functional subtitle so all existing views keep working.
 */

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { useLocale } from "@/components/providers/locale-provider";
import { chapterForPath } from "@/lib/chapters";
import { MaskText } from "@/components/motion/mask-text";

const EASE = [0.16, 1, 0.3, 1] as const;

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useLocale();
  const reduce = useReducedMotion();
  const chapter = chapterForPath(pathname);

  const statement = chapter ? t(chapter.statementKey) : title;
  const support = chapter ? title : undefined;

  return (
    <div className="reg-marks relative mb-8 pt-2 sm:mb-10 sm:pt-4">
      <div className="stage-light" aria-hidden />
      {/* Mono chapter label */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mb-5 flex items-center gap-4"
      >
        {chapter && (
          <span className="micro-label text-[var(--primary-500)]">
            {chapter.number} — {t(chapter.nameKey)}
          </span>
        )}
        <span className="hairline flex-1" />
      </motion.div>

      {/* Statement */}
      <h1 className="display-statement max-w-5xl text-4xl text-[var(--foreground)] sm:text-6xl lg:text-7xl">
        <MaskText text={statement} />
      </h1>

      {/* Supporting line + actions */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 max-w-2xl">
          {support && (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              {support}
              {description ? <span className="text-[var(--text-muted)]"> — {description}</span> : null}
            </motion.p>
          )}
          {!support && description && (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
              className="text-sm leading-relaxed text-[var(--muted-foreground)]"
            >
              {description}
            </motion.p>
          )}
        </div>
        {actions && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex shrink-0 items-center gap-2"
          >
            {actions}
          </motion.div>
        )}
      </div>
    </div>
  );
}
