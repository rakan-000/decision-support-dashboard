"use client";

import { Construction } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export function ModulePlaceholder({
  titleKey,
  descriptionKey,
}: {
  titleKey: string;
  descriptionKey?: string;
}) {
  const { t } = useLocale();
  return (
    <div>
      <PageHeader
        title={t(titleKey)}
        description={descriptionKey ? t(descriptionKey) : undefined}
      />
      <Card className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <Construction className="size-8 text-[var(--muted-foreground)]" />
        <p className="text-sm text-[var(--muted-foreground)]">
          {t("common.loading")}
        </p>
      </Card>
    </div>
  );
}
