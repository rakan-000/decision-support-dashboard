"use client";

/**
 * Navigation rail — a slim glass spine of the intelligence system.
 * Icons with labels-on-hover, an active glow indicator, and the brand mark.
 * The full spatial picture lives in the Ecosystem Map overlay.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { NAV_SECTIONS } from "@/lib/nav";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { t } = useLocale();

  const items = NAV_SECTIONS.flatMap((s) => s.items);

  return (
    <aside
      className={cn(
        "glass-strong z-30 flex h-full w-[68px] shrink-0 flex-col items-center border-e border-[var(--border)] py-4",
        className,
      )}
    >
      {/* Brand */}
      <Link
        href="/"
        className="mb-6 flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--primary-500)] to-[var(--aurora-violet)] text-white shadow-[var(--glow-primary)]"
        aria-label={t("app.short")}
      >
        <ShieldCheck className="size-5" />
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto">
        {items.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <div key={item.href} className="group relative">
              <Link
                href={item.href}
                aria-label={t(item.labelKey)}
                className={cn(
                  "relative flex size-10 items-center justify-center rounded-[var(--radius-md)] transition-all duration-300",
                  active
                    ? "text-[var(--primary-500)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="rail-active"
                    className="absolute inset-0 rounded-[var(--radius-md)] bg-[var(--primary-100)] shadow-[var(--glow-primary)]"
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                {/* Cyan edge indicator — expands on hover/active */}
                <span
                  className={cn(
                    "absolute top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-[var(--primary-500)] transition-all duration-300 ltr:left-[-10px] rtl:right-[-10px]",
                    active ? "opacity-100" : "h-1 opacity-0 group-hover:h-4 group-hover:opacity-70",
                  )}
                  aria-hidden
                />
                <Icon className="relative size-[19px] transition-transform duration-300 group-hover:scale-110" />
              </Link>
              {/* Tooltip label */}
              <span className="glass-strong pointer-events-none absolute top-1/2 z-50 hidden -translate-y-1/2 whitespace-nowrap rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] opacity-0 transition-opacity duration-150 group-hover:opacity-100 ltr:left-[calc(100%+10px)] rtl:right-[calc(100%+10px)] md:block">
                {t(item.labelKey)}
              </span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
