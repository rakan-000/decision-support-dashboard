import { HistoryView } from "@/components/history/history-view";
import { getActivityFeed } from "@/lib/db";

export const runtime = "nodejs";

export default async function HistoryPage() {
  const items = await getActivityFeed(50);
  return <HistoryView items={items} />;
}
