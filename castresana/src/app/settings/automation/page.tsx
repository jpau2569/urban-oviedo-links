import { guardPage } from "@/lib/auth/roleGuards";
import { AUTOMATION_RULES } from "@/lib/os/mockOs";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { AutomationSettings } from "@/components/settings/AutomationSettings";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Autopiloto" };

export default async function AutomationSettingsPage() {
  const guard = await guardPage("autopiloto:view");
  if (!guard.allowed) return <SecureAccessError reason="wrong_role" />;

  return (
    <SettingsShell
      active="/settings/automation"
      user={guard.user}
      title="Autopiloto"
      intro="El trabajo repetitivo, solo: primeras respuestas, rescate de leads, recordatorios e informes."
    >
      <AutomationSettings initialRules={AUTOMATION_RULES} />
    </SettingsShell>
  );
}
