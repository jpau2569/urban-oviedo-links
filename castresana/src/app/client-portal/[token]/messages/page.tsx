import { resolveClientPortal } from "@/lib/portal/portalViewModels";
import { PortalShell } from "@/components/portal/PortalShell";
import { CommunicationSummary } from "@/components/portal/CommunicationSummary";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";
import { fmtDateShort } from "@/lib/portal/portalViewModels";

export const metadata = { title: "Seguimiento" };

export default async function ClientMessagesPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const res = await resolveClientPortal(token);
  if (!res.ok) return <SecureAccessError reason={res.reason} />;
  const vm = res.data;

  return (
    <PortalShell
      role="client"
      token={token}
      active={`/client-portal/${token}/messages`}
      bandText={`Espacio de ${vm.session.clientName}`}
    >
      <p className="eyebrow">Seguimiento comercial</p>
      <h1 className="display" style={{ fontSize: "clamp(28px, 4vw, 40px)", marginTop: 6 }}>
        Dónde estamos y qué toca ahora
      </h1>

      <section className="section">
        <div className="section-head"><h2 className="display">Siguientes pasos</h2></div>
        <div className="steps">
          {vm.nextSteps.map((s) => (
            <div key={s.id} className={`step ${s.done ? "done" : ""}`}>
              <span className="step-check">{s.done ? "✓" : ""}</span>
              <span>
                <b>{s.label}</b>
                {s.detail && <small>{s.detail}</small>}
              </span>
              {s.due && !s.done && <span className="due">{fmtDateShort(s.due)}</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="display">Resumen de conversaciones</h2>
          <span className="count">lo importante, sin ruido</span>
        </div>
        <CommunicationSummary entries={vm.communications} />
      </section>
    </PortalShell>
  );
}
