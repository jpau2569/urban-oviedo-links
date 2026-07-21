import { guardPage } from "@/lib/auth/roleGuards";
import { resolveTenant } from "@/lib/tenancy/tenants";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { BrandingSettings } from "@/components/settings/BrandingSettings";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Marca" };

export default async function BrandingSettingsPage() {
  const guard = await guardPage("ajustes:edit");
  if (!guard.allowed) return <SecureAccessError reason="wrong_role" />;
  const tenant = await resolveTenant();

  return (
    <SettingsShell
      active="/settings/branding"
      user={guard.user}
      title="Marca"
      intro="La identidad visual de la agencia. En modo multi-agencia, cada tenant define aquí la suya."
    >
      <BrandingSettings tenant={tenant} />
    </SettingsShell>
  );
}
