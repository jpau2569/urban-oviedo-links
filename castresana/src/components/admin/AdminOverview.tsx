import type { OsUser } from "@/types/roles";
import type { Tenant } from "@/types/tenant";
import { planFor } from "@/lib/tenancy/tenants";
import { ROLE_DEFINITIONS } from "@/lib/auth/permissions";

/** Cabecera de la Torre de control: tenant, plan y equipo. */
export function AdminOverview({ tenant, users }: { tenant: Tenant; users: OsUser[] }) {
  const plan = planFor(tenant);
  const active = users.filter((u) => u.active);
  return (
    <section className="welcome" style={{ background: "linear-gradient(150deg, #241e19, #3d2f24 70%, #5a4331)" }}>
      <p className="eyebrow">Torre de control</p>
      <h1>{tenant.branding.displayName}</h1>
      <p className="lede">
        Plan <strong style={{ color: "var(--copper-soft)" }}>{plan.name}</strong> · {tenant.city} ·{" "}
        {active.length}/{plan.maxUsers} usuarios · tenant <code style={{ fontSize: 13 }}>{tenant.slug}</code>. Desde aquí se
        administra el sistema: equipo, salud, auditoría y lanzamiento.
      </p>
      <div className="facts">
        <div className="fact"><b>{active.length}</b><span>Usuarios activos</span></div>
        <div className="fact"><b>{plan.maxActiveProperties}</b><span>Límite inmuebles</span></div>
        <div className="fact"><b>{plan.aiCredits.toLocaleString("es-ES")}</b><span>Créditos IA/mes</span></div>
        <div className="fact"><b>{plan.maxStorageGb} GB</b><span>Storage</span></div>
      </div>
      <div className="search-summary">
        {active.map((u) => (
          <span key={u.id} className="tag">{u.initials} · {ROLE_DEFINITIONS[u.role].name}</span>
        ))}
      </div>
    </section>
  );
}
