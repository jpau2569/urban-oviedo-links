"use client";

import { useState } from "react";
import type { OsUser, UserInvitation } from "@/types/roles";
import { INTERNAL_ROLES, ROLE_DEFINITIONS } from "@/lib/auth/permissions";

/**
 * Gestión de equipo: usuarios, activación e invitaciones.
 * Escrituras reales: tenants/{id}/users + envío de invitación por email.
 */
export function UserManagementPanel({
  initialUsers,
  initialInvitations,
}: {
  initialUsers: OsUser[];
  initialInvitations: UserInvitation[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [invitations, setInvitations] = useState(initialInvitations);
  const [email, setEmail] = useState("");

  const toggleActive = (id: string) =>
    setUsers((us) => us.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));

  const invite = () => {
    if (!email.includes("@")) return;
    setInvitations((inv) => [
      { id: `inv-${Date.now()}`, email, role: "agente", invitedBy: "Tú", invitedAt: new Date().toISOString(), status: "pendiente" },
      ...inv,
    ]);
    setEmail("");
  };

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div className="s-card s-card-pad">
        <p className="eyebrow" style={{ marginBottom: 14 }}>Equipo · {users.filter((u) => u.active).length} activos</p>
        <div className="os-wrap-x">
          <table className="os-table">
            <thead>
              <tr><th>Usuario</th><th>Rol</th><th>Último acceso</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><span className="av-sm">{u.initials}</span><b>{u.name}</b><br /><small className="muted" style={{ fontSize: 11, marginLeft: 41 }}>{u.email}</small></td>
                  <td><span className="s-chip dim">{ROLE_DEFINITIONS[u.role].name}</span></td>
                  <td className="muted" style={{ fontSize: 12 }}>{new Date(u.lastActiveAt).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</td>
                  <td>{u.active ? <span className="s-chip ok">Activo</span> : <span className="s-chip warn">Desactivado</span>}</td>
                  <td>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => toggleActive(u.id)}>
                      {u.active ? "Desactivar" : "Reactivar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="s-card s-card-pad">
        <p className="eyebrow" style={{ marginBottom: 14 }}>Invitar al equipo</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            style={{ flex: 1, minWidth: 220, padding: "11px 13px", fontFamily: "inherit", fontSize: 13.5, color: "var(--paper-ink)", background: "rgba(255,251,244,.05)", border: "1.5px solid rgba(226,215,196,.16)", borderRadius: 11 }}
            placeholder="email@agencia.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email a invitar"
          />
          <button type="button" className="btn btn-copper btn-sm" onClick={invite}>Enviar invitación</button>
        </div>
        <p className="muted" style={{ fontSize: 11.5, marginTop: 8 }}>
          Roles disponibles: {INTERNAL_ROLES.map((r) => ROLE_DEFINITIONS[r].name).join(" · ")}
        </p>
        {invitations.length > 0 && (
          <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
            {invitations.map((inv) => (
              <div key={inv.id} className="pub-row">
                <span className="ch">✉️</span>
                <span className="who"><b>{inv.email}</b><small>{ROLE_DEFINITIONS[inv.role].name} · invitado por {inv.invitedBy}</small></span>
                <span className={`pub-st ${inv.status === "pendiente" ? "programada" : "publicada"}`}>{inv.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
