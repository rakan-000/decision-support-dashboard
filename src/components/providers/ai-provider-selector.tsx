"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useLocale } from "@/components/providers/locale-provider";
import { AI_PROVIDER_STORAGE_KEY, isAiProvider, type AiProvider } from "@/lib/ai/provider-selection";
import { cn } from "@/lib/utils";
import type { ProviderStatus } from "@/components/shared/privacy-notice";

export function useAiProvider(status: ProviderStatus) {
  const fallback = status.defaultProvider;
  const provider = useSyncExternalStore(
    subscribe,
    useCallback(() => {
      const saved = window.localStorage.getItem(AI_PROVIDER_STORAGE_KEY);
      return isAiProvider(saved) ? saved : fallback;
    }, [fallback]),
    () => fallback,
  );

  function setProvider(next: AiProvider) {
    window.localStorage.setItem(AI_PROVIDER_STORAGE_KEY, next);
    window.dispatchEvent(new Event("ai-provider-change"));
  }

  return { provider, setProvider };
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("ai-provider-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ai-provider-change", callback);
  };
}

export function AiProviderSelector({
  status,
  provider,
  onChange,
}: {
  status: ProviderStatus;
  provider: AiProvider;
  onChange: (provider: AiProvider) => void;
}) {
  const { t } = useLocale();
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-[var(--foreground)]">{t("settings.chooseProvider")}</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {([...status.providers, { id: "demo" as const, name: t("settings.demoMode"), configured: true, model: "" }]).map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={provider === option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "group min-w-0 rounded-[var(--radius-md)] border p-3 text-start transition-[border-color,background-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[var(--primary-500)] motion-reduce:transform-none",
              provider === option.id
                ? "border-[var(--primary-500)] bg-[var(--primary-100)] shadow-[var(--glow-soft)]"
                : "border-[var(--border)] bg-[var(--surface-50)] hover:border-[var(--primary-500)]/60",
            )}
          >
            <span className="block text-base font-semibold text-[var(--foreground)]">{option.name}</span>
            <span className="mt-1 block text-xs leading-snug text-[var(--muted-foreground)]">
              {option.id === "demo" ? t("settings.localDemo") : option.configured ? t("settings.ready") : t("settings.notConfigured")}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
        {provider === "demo"
          ? t("settings.demoExplainer")
          : status.providers.find((item) => item.id === provider)?.configured
            ? t("settings.externalExplainer")
            : t("settings.missingProviderConfig")}
      </p>
    </fieldset>
  );
}
