import { HomeView } from "@/components/dashboard/home-view";
import { providerStatus } from "@/lib/config";
import { getDashboardMetrics, getRecentDocuments } from "@/lib/db";

export default async function ExecutiveHomePage() {
  const [metrics, recent] = await Promise.all([
    getDashboardMetrics(),
    getRecentDocuments(5),
  ]);
  return <HomeView status={providerStatus()} metrics={metrics} recent={recent} />;
}
