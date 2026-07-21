import { guardPage } from "@/lib/auth/roleGuards";
import { AI_SETTINGS } from "@/lib/os/mockOs";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { AISettingsPanel } from "@/components/settings/AISettingsPanel";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Inteligencia" };

export default async function AISettingsPage() {
  const guard = await guardPage("inteligencia:view");
  if (!guard.allowed) return <SecureAccessError reason="wrong_role" />;

  return (
    <SettingsShell
      active="/settings/ai"
      user={guard.user}
      title="Inteligencia"
      intro="Vende Todo piensa contigo: borradores, scoring y recomendaciones — siempre con revisión humana."
    >
      <AISettingsPanel initial={AI_SETTINGS} />
    </SettingsShell>
  );
}
