import { DashboardView } from "@/components/dashboard/dashboard-view";
import {
  getDashboardMetrics,
  getDepartmentStats,
  getRiskSeverityCounts,
  getPriorityDistribution,
  getRecommendationStatusCounts,
  getActivityFeed,
} from "@/lib/db";

export const runtime = "nodejs";

export default async function DashboardPage() {
  const [metrics, deptStats, riskSeverity, priorityDist, recStatus, activity] =
    await Promise.all([
      getDashboardMetrics(),
      getDepartmentStats(),
      getRiskSeverityCounts(),
      getPriorityDistribution(),
      getRecommendationStatusCounts(),
      getActivityFeed(8),
    ]);

  return (
    <DashboardView
      metrics={metrics}
      deptStats={deptStats}
      riskSeverity={riskSeverity}
      priorityDist={priorityDist}
      recStatus={recStatus}
      activity={activity}
    />
  );
}
