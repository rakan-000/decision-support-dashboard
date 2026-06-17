import { GovernanceView } from "@/components/governance/governance-view";
import {
  getDashboardMetrics,
  getDepartmentStats,
  getLowScoreDocuments,
  getGapItems,
} from "@/lib/db";

export const runtime = "nodejs";

export default async function GovernancePage() {
  const [metrics, deptStats, lowScoreDocs, gaps] = await Promise.all([
    getDashboardMetrics(),
    getDepartmentStats(),
    getLowScoreDocuments(70),
    getGapItems(12),
  ]);

  return (
    <GovernanceView
      compliance={metrics.complianceScore}
      governance={metrics.governanceScore}
      lowScoreDocs={lowScoreDocs}
      gaps={gaps}
      deptStats={deptStats}
    />
  );
}
