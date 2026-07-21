import type { PortalRole } from "@/types/portal";
import { PortalHeader } from "./PortalHeader";

/**
 * Envoltorio común de todas las páginas de portal:
 * cabecera carbón + contenido + pie institucional.
 */
export function PortalShell({
  role,
  token,
  active,
  bandText,
  children,
}: {
  role: PortalRole;
  token: string;
  active: string;
  bandText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="shell">
      <PortalHeader role={role} token={token} active={active} bandText={bandText} />
      <main className="shell-main">{children}</main>
      <footer className="p-footer">
        <b>Castresana</b>
        <p style={{ marginTop: 6 }}>
          Asesoría inmobiliaria · Oviedo · Este espacio es personal e intransferible.
        </p>
      </footer>
    </div>
  );
}
