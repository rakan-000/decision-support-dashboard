"use client";

import { useState } from "react";
import {
  Languages,
  Moon,
  Sun,
  Sparkles,
  HardDrive,
  Lock,
  KeyRound,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProviderStatus } from "@/components/shared/privacy-notice";

export function SettingsView({ status }: { status: ProviderStatus }) {
  const { t, locale, setLocale } = useLocale();
  const { theme, toggle } = useTheme();
  const [aiCheck, setAiCheck] = useState<{
    loading: boolean;
    ok?: boolean;
    message?: string;
    mode?: string;
  }>({ loading: false });

  async function testAiConnection() {
    setAiCheck({ loading: true });
    try {
      const response = await fetch("/api/ai/status", { cache: "no-store" });
      const payload = (await response.json()) as {
        ok: boolean;
        connected: boolean;
        mode: string;
        message?: string;
      };
      setAiCheck({
        loading: false,
        ok: response.ok && payload.connected,
        mode: payload.mode,
        message: payload.message,
      });
    } catch (error) {
      setAiCheck({
        loading: false,
        ok: false,
        mode: "error",
        message: error instanceof Error ? error.message : t("settings.aiTestFailed"),
      });
    }
  }

  return (
    <div>
      <PageHeader title={t("settings.title")} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Language */}
        <Card>
          <CardHeader className="flex-row items-center gap-2">
            <Languages className="size-4 text-[var(--muted-foreground)]" />
            <CardTitle>{t("settings.language")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="inline-flex rounded-[var(--radius-md)] border border-[var(--border)] p-0.5">
              <Toggle active={locale === "ar"} onClick={() => setLocale("ar")} label="العربية" />
              <Toggle active={locale === "en"} onClick={() => setLocale("en")} label="English" />
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader className="flex-row items-center gap-2">
            {theme === "light" ? (
              <Sun className="size-4 text-[var(--muted-foreground)]" />
            ) : (
              <Moon className="size-4 text-[var(--muted-foreground)]" />
            )}
            <CardTitle>{t("settings.theme")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="inline-flex rounded-[var(--radius-md)] border border-[var(--border)] p-0.5">
              <Toggle active={theme === "light"} onClick={() => theme !== "light" && toggle()} label={t("settings.themeLight")} />
              <Toggle active={theme === "dark"} onClick={() => theme !== "dark" && toggle()} label={t("settings.themeDark")} />
            </div>
          </CardContent>
        </Card>

        {/* AI provider status */}
        <Card>
          <CardHeader className="flex-row items-center gap-2">
            <Sparkles className="size-4 text-[var(--muted-foreground)]" />
            <CardTitle>{t("settings.aiStatus")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Row
              label={status.aiConfigured ? status.aiModel : t("settings.demoMode")}
              ok={status.aiConfigured}
              okText={t("settings.configured")}
              warnText={t("settings.notConfigured")}
            />
            {status.aiConfigured && status.aiEffort ? (
              <Row
                label={`${t("settings.aiEffort")}: ${status.aiEffort}`}
                ok
                okText={t("settings.configured")}
              />
            ) : null}
            <Row
              label={t("settings.embeddings")}
              ok={!status.embeddingsExternal}
              okText={t("kb.retrievalLocal")}
              warnText={t("kb.retrievalExternal")}
              neutralWhenWarn
            />
            <div className="pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={testAiConnection}
                disabled={aiCheck.loading}
                className="w-full justify-center"
              >
                {aiCheck.loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {t("settings.aiTest")}
              </Button>
              {aiCheck.message ? (
                <p
                  className={cn(
                    "mt-2 rounded-[var(--radius-md)] border px-3 py-2 text-xs leading-relaxed",
                    aiCheck.ok
                      ? "border-[color-mix(in_srgb,var(--ok)_30%,var(--border))] text-[var(--ok)]"
                      : "border-[color-mix(in_srgb,var(--warn)_30%,var(--border))] text-[var(--warn)]",
                  )}
                >
                  {aiCheck.ok
                    ? t("settings.aiTestConnected")
                    : aiCheck.mode === "demo"
                      ? t("settings.aiTestDemo")
                      : t("settings.aiTestFailed")}
                  {aiCheck.message ? ` · ${aiCheck.message}` : ""}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Storage + privacy */}
        <Card>
          <CardHeader className="flex-row items-center gap-2">
            <HardDrive className="size-4 text-[var(--muted-foreground)]" />
            <CardTitle>{t("settings.storageMode")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Row label={t("settings.storageLocal")} ok okText={t("settings.configured")} />
            <div className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <Lock className="size-4 text-[var(--ok)]" />
              {t("settings.privacyMode")}:{" "}
              <span className="text-[var(--ok)]">{t("settings.privacyOn")}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Future configuration */}
      <Card className="mt-4">
        <CardHeader className="flex-row items-center gap-2">
          <KeyRound className="size-4 text-[var(--muted-foreground)]" />
          <CardTitle>{t("settings.future")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs text-[var(--muted-foreground)]">{t("settings.futureDesc")}</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {["ANTHROPIC_API_KEY", "ANTHROPIC_MODEL", "ANTHROPIC_MAX_OUTPUT_TOKENS", "ANTHROPIC_EFFORT", "EMBEDDINGS_PROVIDER", "OPENAI_API_KEY", "DATABASE_URL", "STORAGE_DIR"].map(
              (k) => (
                <div
                  key={k}
                  className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--muted)] px-3 py-2 font-mono text-xs text-[var(--muted-foreground)]"
                >
                  {k}
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Toggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-[var(--primary-500)] text-white" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
      )}
    >
      {label}
    </button>
  );
}

function Row({
  label,
  ok,
  okText,
  warnText,
  neutralWhenWarn,
}: {
  label: string;
  ok: boolean;
  okText: string;
  warnText?: string;
  neutralWhenWarn?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-[var(--foreground)]">{label}</span>
      {ok ? (
        <Badge variant="success">
          <CheckCircle2 className="size-3" />
          {okText}
        </Badge>
      ) : (
        <Badge variant={neutralWhenWarn ? "warning" : "danger"}>
          <XCircle className="size-3" />
          {warnText ?? okText}
        </Badge>
      )}
    </div>
  );
}
