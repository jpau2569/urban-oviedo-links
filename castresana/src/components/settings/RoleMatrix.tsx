import { OS_MODULES } from "@/lib/os/modules";
import { ROLE_DEFINITIONS, can } from "@/lib/auth/permissions";
import type { RoleId } from "@/types/roles";

const SHOWN_ROLES: RoleId[] = ["super-admin", "director", "agente", "asistente", "colaborador", "cliente-portal", "propietario-portal"];

/**
 * Matriz de permisos rol × módulo (acción "view" + señal de edición).
 * Derivada en vivo de la matriz real: la tabla nunca miente.
 */
export function RoleMatrix() {
  return (
    <div className="s-card s-card-pad">
      <p className="eyebrow" style={{ marginBottom: 6 }}>Matriz de acceso por rol</p>
      <p className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
        ● ver y editar · ○ solo ver · — sin acceso. Generada desde la matriz real de permisos.
      </p>
      <div className="os-wrap-x">
        <table className="os-table role-matrix">
          <thead>
            <tr>
              <th>Módulo</th>
              {SHOWN_ROLES.map((r) => (
                <th key={r} style={{ textAlign: "center" }}>{ROLE_DEFINITIONS[r].name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {OS_MODULES.map((m) => (
              <tr key={m.id}>
                <td>{m.icon} <b>{m.name}</b></td>
                {SHOWN_ROLES.map((r) => {
                  const view = can(r, `${m.id}:view`);
                  const edit = can(r, `${m.id}:edit`) || can(r, `${m.id}:admin`);
                  return (
                    <td key={r} className={view ? "yes" : "no"}>
                      {edit ? "●" : view ? "○" : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
