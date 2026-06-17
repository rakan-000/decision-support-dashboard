import { notFound } from "next/navigation";
import { getDocumentDetail } from "@/lib/db";
import { AnalysisDetail } from "@/components/analysis/analysis-detail";

export const runtime = "nodejs";

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getDocumentDetail(id);
  if (!detail) notFound();

  return (
    <AnalysisDetail
      doc={detail.doc}
      analysis={detail.analysis}
      risks={detail.risks}
      actions={detail.actions}
      recommendations={detail.recommendations}
    />
  );
}
