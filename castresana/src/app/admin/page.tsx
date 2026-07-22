import { guardPage } from "@/lib/auth/roleGuards";
import { resolveTenant } from "@/lib/tenancy/tenants";
import { OS_USERS } from "@/lib/os/mockOs";
import { AUDIT_EVENTS, QUEUE_JOBS, SYSTEM_SERVICES } from "@/lib/audit/auditLog";
import { PRODUCTION_CHECKLIST, ROADMAP } from "@/lib/deployment/productionChecklist";
import { OsShell } from "@/components/os/OsShell";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { SystemHealthCard } from "@/components/admin/SystemHealthCard";
import { ActivityAuditTable } from "@/components/admin/ActivityAuditTable";
import { QueueMonitor } from "@/components/admin/QueueMonitor";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Torre de control" };

export default async function AdminPage() {
  const guard = await guardPage("sistema:admin");
  if (!guard.allowed) return <SecureAccessError reason="wrong_role" />;
  const tenant = await resolveTenant();

  const done = PRODUCTION_CHECKLIST.filter((c) => c.status === "hecho").length;

  return (
    <OsShell active="admin" user={guard.user}>
      <AdminOverview tenant={tenant} users={OS_USERS} />

      <section className="section grid-2col">
        <div style={{ display: "grid", gap: 22 }}>
          <SystemHealthCard services={SYSTEM_SERVICES} />
          <QueueMonitor jobs={QUEUE_JOBS} />
        </div>
        <ActivityAuditTable events={AUDIT_EVENTS} />
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="display" style={{ color: "var(--paper-ink)" }}>Camino a producción</h2>
          <span className="count" style={{ color: "var(--paper-soft)" }}>{done}/{PRODUCTION_CHECKLIST.length} completado</span>
        </div>
        <div className="s-card s-card-pad">
          <div className="qual-row" style={{ marginBottom: 18 }}>
            <span className="lbl">Progreso</span>
            <div className="track"><div className="fill" style={{ width: `${Math.round((done / PRODUCTION_CHECKLIST.length) * 100)}%` }} /></div>
            <span className="val">{Math.round((done / PRODUCTION_CHECKLIST.length) * 100)}%</span>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {PRODUCTION_CHECKLIST.map((c) => (
              <div key={c.area + c.item} className="chk">
                <span className={`st ${c.status}`}>{c.status}</span>
                <span><b>{c.area} — {c.item}</b>{c.note && <small>{c.note}</small>}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2 className="display" style={{ color: "var(--paper-ink)" }}>Roadmap del producto</h2></div>
        <div className="road">
          {ROADMAP.map((r) => (
            <div key={r.version} className="road-card">
              <span className="v">{r.version}</span>
              <b className="t">{r.title}</b>
              <p>{r.goal}</p>
              <ul>{r.scopeIn.slice(0, 4).map((s) => <li key={s}>{s}</li>)}</ul>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "auto" }}>
                <span className={`s-chip ${r.risk === "bajo" ? "ok" : r.risk === "medio" ? "" : "warn"}`}>riesgo {r.risk}</span>
              </div>
              <p style={{ fontSize: 11.5 }}>{r.impact}</p>
            </div>
          ))}
        </div>
      </section>
    </OsShell>
  );
}
