"use client";

import { Search, Orbit } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function TopBar({ onOpenEcosystem }: { onOpenEcosystem: () => void }) {
  const { t } = useLocale();

  return (
    <header className="glass sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-[var(--border)] px-4 sm:px-6">
      {/* Ecosystem trigger — the primary spatial navigation */}
      <button
        type="button"
        onClick={onOpenEcosystem}
        className="group inline-flex h-9 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--muted)] px-3.5 text-xs font-medium text-[var(--muted-foreground)] transition-all duration-300 hover:border-[var(--primary-500)]/50 hover:text-[var(--foreground)] hover:shadow-[var(--glow-primary)]"
      >
        <Orbit className="size-4 text-[var(--primary-500)] transition-transform duration-500 group-hover:rotate-90" />
        <span className="hidden sm:inline">{t("eco.open")}</span>
      </button>

      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)] ltr:left-3 rtl:right-3" />
        <input
          type="search"
          placeholder={t("common.searchPlaceholder")}
          aria-label={t("common.search")}
          className="h-9 w-full rounded-full border border-[var(--border)] bg-[var(--muted)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ltr:pl-9 ltr:pr-4 rtl:pr-9 rtl:pl-4"
        />
      </div>

      <div className="ms-auto flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
        <div className="ms-1 flex items-center gap-2 border-s border-[var(--border)] ps-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-600)] to-[var(--aurora-violet)] text-xs font-semibold text-white">
            EX
          </div>
        </div>
      </div>
    </header>
  );
}
