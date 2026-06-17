"use client";

/**
 * Next-chapter progression — every chapter ends by inviting the next.
 * A full-width editorial closing: mono label, massive masked statement link,
 * and a long hairline. Section-to-section storytelling in one component.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { nextChapter } from "@/lib/chapters";
import { MaskText, MaskRise } from "@/components/motion/mask-text";

export function NextChapter() {
  const pathname = usePathname();
  const { t } = useLocale();
  const next = nextChapter(pathname);

  if (!next) return null;

  return (
    <div className="mt-24 pb-16">
      <div className="hairline" />
      <Link href={next.href} className="group block pt-10">
        <MaskRise mode="view">
          <span className="micro-label">
            {t("ch.next")} · {next.number}
          </span>
        </MaskRise>
        <div className="mt-4 flex items-end justify-between gap-6">
          <h2 className="display-statement text-3xl text-[var(--muted-foreground)] transition-colors duration-500 group-hover:text-[var(--foreground)] sm:text-5xl lg:text-6xl">
            <MaskText mode="view" text={t(next.statementKey)} />
          </h2>
          <ArrowRight className="mb-1 size-8 shrink-0 text-[var(--muted-foreground)] transition-all duration-500 group-hover:translate-x-2 group-hover:text-[var(--primary-500)] flip-rtl rtl:group-hover:-translate-x-2" />
        </div>
        <p className="mt-3 text-xs text-[var(--text-muted)]">{t("ch.continue")}</p>
      </Link>
    </div>
  );
}
