"use client";

import { Languages } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="inline-flex items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-0.5 text-xs">
      <Languages className="mx-1.5 size-3.5 text-[var(--muted-foreground)]" aria-hidden />
      <button
        type="button"
        onClick={() => setLocale("ar")}
        className={cn(
          "rounded-[var(--radius-sm)] px-2.5 py-1 font-medium transition-colors",
          locale === "ar"
            ? "bg-[var(--primary-500)] text-white"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
        )}
        aria-pressed={locale === "ar"}
      >
        العربية
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-[var(--radius-sm)] px-2.5 py-1 font-medium transition-colors",
          locale === "en"
            ? "bg-[var(--primary-500)] text-white"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
        )}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
    </div>
  );
}
