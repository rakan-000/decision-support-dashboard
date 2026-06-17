"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { PageHeader } from "@/components/layout/page-header";
import { ActivityFeed } from "@/components/dashboard/charts";
import type { ActivityItem } from "@/lib/db";

export function HistoryView({ items }: { items: ActivityItem[] }) {
  const { t } = useLocale();
  return (
    <div>
      <PageHeader title={t("history.title")} />
      <ActivityFeed items={items} hideHeader />
    </div>
  );
}
