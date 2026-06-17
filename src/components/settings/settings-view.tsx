"use client";

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
} from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProviderStatus } from "@/components/shared/privacy-notice";

export function SettingsView({ status }: { status: ProviderStatus }) {
  const { t, locale, setLocale } = useLocale();
  const { theme, toggle } = useTheme();

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
            <Row
              label={t("settings.embeddings")}
              ok={!status.embeddingsExternal}
              okText={t("kb.retrievalLocal")}
              warnText={t("kb.retrievalExternal")}
              neutralWhenWarn
            />
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
            {["ANTHROPIC_API_KEY", "ANTHROPIC_MODEL", "EMBEDDINGS_PROVIDER", "OPENAI_API_KEY", "DATABASE_URL", "STORAGE_DIR"].map(
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
