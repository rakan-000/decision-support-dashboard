import { AnalysisWorkspace } from "@/components/analysis/analysis-workspace";
import { getAnalysisDocuments } from "@/lib/db";

export const runtime = "nodejs";

export default async function AnalysisWorkspacePage() {
  const items = await getAnalysisDocuments();
  return <AnalysisWorkspace items={items} />;
}
