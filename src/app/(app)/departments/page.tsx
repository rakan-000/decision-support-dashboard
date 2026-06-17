import { DepartmentsView } from "@/components/departments/departments-view";
import { getDepartmentStats } from "@/lib/db";

export const runtime = "nodejs";

export default async function DepartmentsPage() {
  const stats = await getDepartmentStats();
  return <DepartmentsView stats={stats} />;
}
