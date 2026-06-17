import { SettingsView } from "@/components/settings/settings-view";
import { providerStatus } from "@/lib/config";

export default function SettingsPage() {
  return <SettingsView status={providerStatus()} />;
}
