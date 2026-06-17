import { notFound } from "next/navigation";
import { DepartmentDetailView } from "@/components/departments/department-detail-view";
import { getDepartmentIntelligence } from "@/lib/db";

export const runtime = "nodejs";

export default async function DepartmentDetailPage({
  params,
}: {
  params: Promise<{ dept: string }>;
}) {
  const { dept } = await params;
  const data = await getDepartmentIntelligence(dept.toUpperCase());
  if (!data) notFound();
  return <DepartmentDetailView data={data} />;
}
