import { guardPage } from "@/lib/auth/roleGuards";
import { INTEGRATIONS } from "@/lib/os/mockOs";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { IntegrationPanel } from "@/components/settings/IntegrationPanel";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Integraciones" };

export default async function IntegrationsSettingsPage() {
  const guard = await guardPage("ajustes:edit");
  if (!guard.allowed) return <SecureAccessError reason="wrong_role" />;

  return (
    <SettingsShell
      active="/settings/integrations"
      user={guard.user}
      title="Integraciones"
      intro="Mensajería, portales, productividad y media. Cada conexión amplía lo que el Autopiloto puede hacer solo."
    >
      <IntegrationPanel integrations={INTEGRATIONS} />
    </SettingsShell>
  );
}
