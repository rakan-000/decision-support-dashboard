"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, X, Lock } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

export type ProviderStatus = {
  aiConfigured: boolean;
  aiModel: string;
  embeddingsExternal: boolean;
  storageLocal: boolean;
};

/**
 * Security Notice — a premium vault-terminal status panel (not a warning block).
 * Surface + cyan accent, a mono SECURE header, and live channel readouts.
 */
export function PrivacyNotice({
  status,
  dismissible = true,
}: {
  status: ProviderStatus;
  dismissible?: boolean;
}) {
  const { t } = useLocale();
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div
      className="panel relative overflow-hidden p-5"
      role="note"
      style={{ borderColor: "color-mix(in srgb, var(--primary-500) 22%, var(--border))" }}
    >
      {/* Cyan signal edge */}
      <span
        className="absolute inset-y-0 ltr:left-0 rtl:right-0 w-[2px]"
        style={{ background: "linear-gradient(to bottom, var(--primary-500), transparent)" }}
        aria-hidden
      />
      {/* Ambient corner glow */}
      <span
        className="pointer-events-none absolute -top-16 size-40 rounded-full ltr:-left-10 rtl:-right-10"
        style={{ background: "radial-gradient(circle, rgba(14,165,233,0.12), transparent 70%)" }}
        aria-hidden
      />

      <div className="relative flex gap-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-50)] text-[var(--primary-500)] shadow-[var(--glow-primary)]">
          <ShieldCheck className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="micro-label inline-flex items-center gap-1.5 text-[var(--primary-500)]">
              <Lock className="size-3" />
              {t("privacy.secureLabel")}
            </span>
          </div>
          <p className="mt-1.5 text-base font-semibold text-[var(--foreground)]">
            {t("privacy.title")}
          </p>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-[var(--muted-foreground)]">
            {t("privacy.body")}
          </p>

          {/* Channel readouts */}
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Channel
              ok={status.aiConfigured}
              okLabel={`${t("privacy.aiReady")} · ${status.aiModel}`}
              warnLabel={t("privacy.aiNotReady")}
              neutralWhenWarn
            />
            <Channel ok={status.storageLocal} okLabel={t("privacy.storageLocal")} />
            <Channel
              ok={!status.embeddingsExternal}
              okLabel={t("privacy.embeddingsLocal")}
              warnLabel={t("privacy.embeddingsExternal")}
              neutralWhenWarn
            />
          </div>
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="size-7 shrink-0 rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            aria-label="Dismiss"
          >
            <X className="mx-auto size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function Channel({
  ok,
  okLabel,
  warnLabel,
  neutralWhenWarn,
}: {
  ok: boolean;
  okLabel: string;
  warnLabel?: string;
  neutralWhenWarn?: boolean;
}) {
  const color = ok
    ? "var(--ok)"
    : neutralWhenWarn
      ? "var(--warn)"
      : "var(--danger)";
  return (
    <div className="subsurface flex items-center gap-2.5 px-3 py-2.5">
      <span
        className={cn("relative flex size-2 shrink-0 rounded-full")}
        style={{ backgroundColor: color }}
        aria-hidden
      >
        <span
          className="absolute inset-0 rounded-full opacity-60 animate-pulse-glow"
          style={{ backgroundColor: color }}
        />
      </span>
      {ok ? (
        <CheckCircle2 className="size-3.5 shrink-0" style={{ color }} />
      ) : (
        <AlertTriangle className="size-3.5 shrink-0" style={{ color }} />
      )}
      <span className="truncate text-xs text-[var(--foreground)]">{ok ? okLabel : warnLabel ?? okLabel}</span>
    </div>
  );
}
