import { KbView } from "@/components/knowledge-base/kb-view";
import { getKbDocuments, getKbStats, getDepartments } from "@/lib/db";
import { providerStatus } from "@/lib/config";

export const runtime = "nodejs";

export default async function KnowledgeBasePage() {
  const [documents, stats, departments] = await Promise.all([
    getKbDocuments(),
    getKbStats(),
    getDepartments(),
  ]);

  const depts = departments.map((d) => ({
    id: d.id,
    code: d.code,
    nameEn: d.nameEn,
    nameAr: d.nameAr,
  }));

  return (
    <KbView
      documents={documents}
      stats={stats}
      departments={depts}
      status={providerStatus()}
    />
  );
}
