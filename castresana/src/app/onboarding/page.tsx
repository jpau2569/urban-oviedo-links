import { getCurrentUser } from "@/lib/auth/roleGuards";
import { OsShell } from "@/components/os/OsShell";
import { OnboardingWizard } from "@/components/os/OnboardingWizard";

export const metadata = { title: "Bienvenida" };

/** Onboarding del agente: 5 pasos, menos de 3 minutos. */
export default async function OnboardingPage() {
  const user = await getCurrentUser();
  return (
    <OsShell active="onboarding" user={user}>
      <OnboardingWizard userName={user.name.split(" ")[0] ?? user.name} />
    </OsShell>
  );
}
