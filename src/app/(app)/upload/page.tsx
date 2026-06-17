import { UploadCenter } from "@/components/upload/upload-center";
import { UploadHeader } from "@/components/upload/upload-header";
import { getDepartments } from "@/lib/db";
import { providerStatus } from "@/lib/config";

export default async function Page() {
  const departments = await getDepartments();
  const depts = departments.map((d) => ({
    id: d.id,
    code: d.code,
    nameEn: d.nameEn,
    nameAr: d.nameAr,
  }));

  return (
    <div>
      <UploadHeader status={providerStatus()} />
      <UploadCenter departments={depts} />
    </div>
  );
}
