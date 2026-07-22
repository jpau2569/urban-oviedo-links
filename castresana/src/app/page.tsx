import Link from "next/link";
import { OS_CLAIM, OS_MODULES } from "@/lib/os/modules";
import { getCurrentUser } from "@/lib/auth/roleGuards";
import { resolveTenant } from "@/lib/tenancy/tenants";
import { OsShell } from "@/components/os/OsShell";

export const metadata = { title: "Castresana OS" };

/**
 * Launcher de Castresana OS: todos los módulos, con su naming final.
 * Los módulos de fases previas aún no integradas se muestran "en camino".
 */
export default async function OsHome() {
  const [user, tenant] = await Promise.all([getCurrentUser(), resolveTenant()]);
  const active = OS_MODULES.filter((m) => m.status === "activo");
  const coming = OS_MODULES.filter((m) => m.status === "en-camino");

  return (
    <OsShell active="os" user={user}>
      <section className="welcome" style={{ background: "linear-gradient(150deg, #241e19, #3d2f24 70%, #5a4331)" }}>
        <p className="eyebrow">{tenant.branding.displayName} · {tenant.city}</p>
        <h1>Buenos días, {user.name.split(" ")[0]}.</h1>
        <p className="lede">{OS_CLAIM}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
          <Link className="btn btn-copper" href="/agents">🎩 Revisar propuestas del equipo IA</Link>
          <Link className="btn btn-ghost" style={{ color: "#c9976f", borderColor: "rgba(201,151,111,.35)" }} href="/analytics">📈 Resultados del mes</Link>
          <Link className="btn btn-ghost" style={{ color: "#c9976f", borderColor: "rgba(201,151,111,.35)" }} href="/media-studio">🎬 Media Studio</Link>
          <Link className="btn btn-ghost" style={{ color: "#c9976f", borderColor: "rgba(201,151,111,.35)" }} href="/onboarding">✨ Onboarding</Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2 className="display" style={{ color: "var(--paper-ink)" }}>Módulos</h2></div>
        <div className="os-modules">
          {active.map((m) => (
            <Link key={m.id} href={m.href} className="os-mod">
              <span className="ic" aria-hidden="true">{m.icon}</span>
              <b>{m.name}</b>
              <small>{m.claim}</small>
              <span className="code">{m.codename}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="display" style={{ color: "var(--paper-ink)" }}>En camino</h2>
          <span className="count" style={{ color: "var(--paper-soft)" }}>fases anteriores pendientes de integrar en este repositorio</span>
        </div>
        <div className="os-modules">
          {coming.map((m) => (
            <div key={m.id} className="os-mod dim">
              <span className="soon s-chip warn">En camino</span>
              <span className="ic" aria-hidden="true">{m.icon}</span>
              <b>{m.name}</b>
              <small>{m.claim}</small>
              <span className="code">{m.codename}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="s-card s-card-pad">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Accesos de demostración de portales</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link className="btn btn-sm btn-ghost" href="/client-portal/demo-cliente">👤 Portal cliente (Lucía)</Link>
            <Link className="btn btn-sm btn-ghost" href="/owner-portal/demo-propietario">🏠 Portal propietario (Javier)</Link>
            <Link className="btn btn-sm btn-ghost" href="/client-portal/demo-caducado">⏳ Enlace caducado</Link>
            <a className="btn btn-sm btn-ghost" href="/suite.html">🏙️ Suite clásica (un archivo)</a>
          </div>
        </div>
      </section>
    </OsShell>
  );
}
