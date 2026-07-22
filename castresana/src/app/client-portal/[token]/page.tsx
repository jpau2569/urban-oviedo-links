import Link from "next/link";
import { resolveClientPortal, fmtWeekday } from "@/lib/portal/portalViewModels";
import { daysUntilExpiry } from "@/lib/portal/accessTokens";
import { PortalShell } from "@/components/portal/PortalShell";
import { ClientWelcomeCard } from "@/components/portal/ClientWelcomeCard";
import { RecommendedPropertiesGrid } from "@/components/portal/RecommendedPropertiesGrid";
import { SecureAccessError, SecureAccessNotice } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Tu espacio privado" };

export default async function ClientPortalHome({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const res = await resolveClientPortal(token);
  if (!res.ok) return <SecureAccessError reason={res.reason} />;
  const vm = res.data;
  const base = `/client-portal/${token}`;
  const nextVisit = vm.upcomingVisits[0];
  const pendingSteps = vm.nextSteps.filter((s) => !s.done);

  return (
    <PortalShell role="client" token={token} active={base} bandText={`Espacio de ${vm.session.clientName}`}>
      <ClientWelcomeCard vm={vm} />

      {/* Próxima visita + siguientes pasos, arriba: lo accionable primero */}
      {(nextVisit || pendingSteps.length > 0) && (
        <section className="section" style={{ display: "grid", gap: 22, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {nextVisit && (
            <div className="card card-pad">
              <p className="eyebrow" style={{ marginBottom: 12 }}>Tu próxima visita</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600 }}>
                {vm.propertyIndex[nextVisit.propertyId]?.title}
              </p>
              <p style={{ color: "var(--copper)", fontWeight: 700, marginTop: 6, fontSize: 14 }}>
                {fmtWeekday(nextVisit.date)} · {nextVisit.time} h
              </p>
              <div style={{ marginTop: 16 }}>
                <Link className="btn btn-sm btn-carbon" href={`${base}/visits`}>
                  Ver todas las visitas
                </Link>
              </div>
            </div>
          )}
          {pendingSteps.length > 0 && (
            <div className="card card-pad">
              <p className="eyebrow" style={{ marginBottom: 12 }}>Siguientes pasos</p>
              <div className="steps">
                {pendingSteps.slice(0, 2).map((s) => (
                  <div key={s.id} className="step" style={{ border: "none", padding: "6px 0", background: "transparent" }}>
                    <span className="step-check" aria-hidden="true" />
                    <span>
                      <b>{s.label}</b>
                      {s.detail && <small>{s.detail}</small>}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                <Link className="btn btn-sm btn-ghost" href={`${base}/messages`}>
                  Ver seguimiento completo
                </Link>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <h2 className="display">Seleccionadas para ti</h2>
          <span className="count">{vm.recommendations.length} propiedades · curadas a mano</span>
        </div>
        <RecommendedPropertiesGrid recommendations={vm.recommendations} token={token} />
      </section>

      <section className="section">
        <div className="agent-card">
          <div className="agent-av">{vm.session.agent.initials}</div>
          <div>
            <b>{vm.session.agent.name}</b>
            <small>
              {vm.session.agent.role} · siempre a un mensaje de distancia
            </small>
          </div>
          <div className="acts">
            <a className="btn btn-sm btn-copper" href={`https://wa.me/${vm.session.agent.phone.replace(/\D/g, "")}`}>
              💬 WhatsApp
            </a>
            <a className="btn btn-sm btn-ghost" style={{ color: "#c9976f", borderColor: "#4a3b30" }} href={`tel:${vm.session.agent.phone}`}>
              📞 Llamar
            </a>
          </div>
        </div>
        <SecureAccessNotice expiresInDays={daysUntilExpiry(vm.session.expiresAt)} />
      </section>
    </PortalShell>
  );
}
