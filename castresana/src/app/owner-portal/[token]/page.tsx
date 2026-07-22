import Link from "next/link";
import { resolveOwnerPortal, fmtWeekday } from "@/lib/portal/portalViewModels";
import { daysUntilExpiry } from "@/lib/portal/accessTokens";
import { PortalShell } from "@/components/portal/PortalShell";
import { OwnerPerformanceCard } from "@/components/portal/OwnerPerformanceCard";
import { MetricsPanel } from "@/components/portal/MetricsPanel";
import { SecureAccessError, SecureAccessNotice } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Portal del propietario" };

export default async function OwnerPortalHome({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const res = await resolveOwnerPortal(token);
  if (!res.ok) return <SecureAccessError reason={res.reason} />;
  const vm = res.data;
  const base = `/owner-portal/${token}`;

  return (
    <PortalShell role="owner" token={token} active={base} bandText={`Propietario: ${vm.session.ownerName}`}>
      <OwnerPerformanceCard vm={vm} />

      {vm.upcomingVisits.length > 0 && (
        <section className="section">
          <div className="card card-pad" style={{ borderLeft: "3px solid var(--copper)" }}>
            <p className="eyebrow" style={{ marginBottom: 10 }}>Próxima visita a tu inmueble</p>
            {vm.upcomingVisits.map((v) => (
              <div key={v.id}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 600 }}>
                  {fmtWeekday(v.date)} · {v.time} h
                </p>
                {v.note && <p className="muted" style={{ marginTop: 6, fontSize: 13.5 }}>💬 {v.note}</p>}
              </div>
            ))}
            <div style={{ marginTop: 14 }}>
              <Link className="btn btn-sm btn-ghost" href={`${base}/activity`}>Ver toda la actividad</Link>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <h2 className="display">Interés en tu inmueble</h2>
          <span className="count">{vm.metrics.periodLabel}</span>
          <span className="right">
            <Link href={`${base}/activity`} style={{ color: "var(--copper)", fontWeight: 700, textDecoration: "none" }}>
              Timeline completo →
            </Link>
          </span>
        </div>
        <MetricsPanel metrics={vm.metrics} funnel={vm.funnel} />
      </section>

      {vm.completedVisits.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="display">Qué dicen quienes la visitan</h2>
            <span className="count">feedback real, resumido</span>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {vm.completedVisits.map((v) => (
              <div key={v.id} className="card card-pad" style={{ padding: "18px 22px" }}>
                <p className="comm-meta" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-mut)" }}>
                  Visita · {fmtWeekday(v.date)}
                </p>
                <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6, color: "var(--ink-soft)", fontStyle: "italic" }}>
                  “{v.feedbackSummary}”
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="agent-card">
          <div className="agent-av">{vm.session.agent.initials}</div>
          <div>
            <b>{vm.session.agent.name}</b>
            <small>{vm.session.agent.role} · cualquier duda sobre tu venta, directa a mí</small>
          </div>
          <div className="acts">
            <a className="btn btn-sm btn-copper" href={`https://wa.me/${vm.session.agent.phone.replace(/\D/g, "")}`}>💬 WhatsApp</a>
            <a className="btn btn-sm btn-ghost" style={{ color: "#c9976f", borderColor: "#4a3b30" }} href={`tel:${vm.session.agent.phone}`}>📞 Llamar</a>
          </div>
        </div>
        <SecureAccessNotice expiresInDays={daysUntilExpiry(vm.session.expiresAt)} />
      </section>
    </PortalShell>
  );
}
