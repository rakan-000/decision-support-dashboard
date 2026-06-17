"use client";

import {
  FileStack,
  AlertTriangle,
  ListTodo,
  CheckCircle2,
  ShieldCheck,
  Landmark,
  Lightbulb,
  Building2,
} from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ScoreGauge,
  RiskHeatmap,
  PriorityMatrix,
  DepartmentDistribution,
  DepartmentComparison,
  RecommendationStatus,
  ActivityFeed,
} from "@/components/dashboard/charts";
import { formatNumber, formatPercent } from "@/lib/utils";
import type { DashboardMetrics, DepartmentStat, ActivityItem } from "@/lib/db";

export function DashboardView({
  metrics,
  deptStats,
  riskSeverity,
  priorityDist,
  recStatus,
  activity,
}: {
  metrics: DashboardMetrics;
  deptStats: DepartmentStat[];
  riskSeverity: { severity: string; status: string; c: number }[];
  priorityDist: { critical: number; high: number; medium: number; low: number };
  recStatus: { pending: number; accepted: number; implemented: number; rejected: number };
  activity: ActivityItem[];
}) {
  const { t } = useLocale();

  return (
    <div>
      <PageHeader title={t("dashboard.title")} />

      {/* KPI grid (8) */}
      <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: t("metric.totalDocuments"), count: metrics.totalDocuments, suffix: "", icon: FileStack, accent: "var(--primary-500)" },
          { label: t("metric.activeRisks"), count: metrics.activeRisks, suffix: "", icon: AlertTriangle, accent: "var(--risk-high)" },
          { label: t("metric.openActions"), count: metrics.openActions, suffix: "", icon: ListTodo, accent: "var(--risk-medium)" },
          { label: t("metric.closedActions"), count: metrics.closedActions, suffix: "", icon: CheckCircle2, accent: "var(--ok)" },
          { label: t("metric.complianceScore"), count: metrics.complianceScore, suffix: "%", icon: ShieldCheck, accent: "var(--ok)" },
          { label: t("metric.governanceScore"), count: metrics.governanceScore, suffix: "%", icon: Landmark, accent: "var(--risk-info)" },
          { label: t("metric.recommendations"), count: metrics.recommendations, suffix: "", icon: Lightbulb, accent: "var(--primary-500)" },
          { label: t("metric.departments"), count: metrics.departments, suffix: "", icon: Building2, accent: "var(--accent)" },
        ].map((k) => (
          <StaggerItem key={k.label}>
            <KpiCard label={k.label} count={k.count} suffix={k.suffix} icon={k.icon} accent={k.accent} />
          </StaggerItem>
        ))}
      </Stagger>

      {/* Row 1 */}
      <Reveal className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RiskHeatmap data={riskSeverity} />
        <DepartmentDistribution stats={deptStats} />
      </Reveal>

      {/* Row 2 */}
      <Reveal className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PriorityMatrix dist={priorityDist} />
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.scores")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <ScoreGauge label={t("metric.complianceScore")} value={metrics.complianceScore} accent="var(--ok)" />
              <ScoreGauge label={t("metric.governanceScore")} value={metrics.governanceScore} accent="var(--risk-info)" />
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Row 3 */}
      <Reveal className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecommendationStatus counts={recStatus} />
        <ActivityFeed items={activity} />
      </Reveal>

      {/* Row 4 */}
      <Reveal className="mt-4">
        <DepartmentComparison stats={deptStats} />
      </Reveal>
    </div>
  );
}
