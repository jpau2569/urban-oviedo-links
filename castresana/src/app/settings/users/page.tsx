import { guardPage } from "@/lib/auth/roleGuards";
import { OS_INVITATIONS, OS_USERS } from "@/lib/os/mockOs";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { UserManagementPanel } from "@/components/settings/UserManagementPanel";
import { RoleMatrix } from "@/components/settings/RoleMatrix";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Equipo y roles" };

export default async function UsersSettingsPage() {
  const guard = await guardPage("usuarios:admin");
  if (!guard.allowed) return <SecureAccessError reason="wrong_role" />;

  return (
    <SettingsShell
      active="/settings/users"
      user={guard.user}
      title="Equipo y roles"
      intro="Quién entra, con qué rol y qué puede hacer. La matriz se genera desde la definición real de permisos."
    >
      <div style={{ display: "grid", gap: 22 }}>
        <UserManagementPanel initialUsers={OS_USERS} initialInvitations={OS_INVITATIONS} />
        <RoleMatrix />
      </div>
    </SettingsShell>
  );
}
