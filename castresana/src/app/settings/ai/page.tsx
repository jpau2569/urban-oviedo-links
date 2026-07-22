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
      intro="Preferencias del equipo de agentes IA: tono, capacidades y consumo. Conoce al equipo y revisa sus propuestas en el módulo Inteligencia (/agents)."
    >
      <AISettingsPanel initial={AI_SETTINGS} />
    </SettingsShell>
  );
}
