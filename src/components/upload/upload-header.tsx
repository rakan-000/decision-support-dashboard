"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { PageHeader } from "@/components/layout/page-header";
import { PrivacyNotice, type ProviderStatus } from "@/components/shared/privacy-notice";

export function UploadHeader({ status }: { status: ProviderStatus }) {
  const { t } = useLocale();
  return (
    <>
      <PageHeader title={t("upload.title")} description={t("upload.subtitle")} />
      <PrivacyNotice status={status} />
    </>
  );
}
