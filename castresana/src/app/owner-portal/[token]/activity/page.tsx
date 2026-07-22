import { resolveOwnerPortal, fmtWeekday } from "@/lib/portal/portalViewModels";
import { PortalShell } from "@/components/portal/PortalShell";
import { OwnerTimeline } from "@/components/portal/OwnerTimeline";
import { CommunicationSummary } from "@/components/portal/CommunicationSummary";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Actividad comercial" };

export default async function OwnerActivityPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const res = await resolveOwnerPortal(token);
  if (!res.ok) return <SecureAccessError reason={res.reason} />;
  const vm = res.data;

  return (
    <PortalShell
      role="owner"
      token={token}
      active={`/owner-portal/${token}/activity`}
      bandText={`Propietario: ${vm.session.ownerName}`}
    >
      <p className="eyebrow">Transparencia total</p>
      <h1 className="display" style={{ fontSize: "clamp(28px, 4vw, 40px)", marginTop: 6 }}>
        Todo lo que estamos haciendo por tu venta
      </h1>
      <p className="muted" style={{ marginTop: 10, maxWidth: "62ch", lineHeight: 1.65 }}>
        Cada acción, visita y comunicación queda registrada aquí. Sin humo: hechos y fechas.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 26, marginTop: 34, alignItems: "start" }}>
        <div className="card card-pad">
          <p className="eyebrow" style={{ marginBottom: 20 }}>Línea de tiempo comercial</p>
          <OwnerTimeline events={vm.timeline} />
        </div>

        <div style={{ display: "grid", gap: 26 }}>
          <div>
            <div className="section-head"><h2 className="display">Visitas</h2><span className="count">{vm.visits.length}</span></div>
            <div style={{ display: "grid", gap: 12 }}>
              {vm.visits.map((v) => (
                <div key={v.id} className="visit-row" style={{ padding: "16px 18px" }}>
                  <div className="visit-cal" aria-hidden="true">
                    <span className="m">{new Date(v.date + "T12:00:00").toLocaleDateString("es-ES", { month: "short" }).replace(".", "")}</span>
                    <span className="d">{new Date(v.date + "T12:00:00").getDate()}</span>
                  </div>
                  <div className="visit-main">
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: 14 }}>{fmtWeekday(v.date)} · {v.time} h</h3>
                      <span className={`pill ${v.status === "realizada" ? "pill-mut" : v.status === "confirmada" ? "pill-ok" : "pill-new"}`}>{v.status}</span>
                    </div>
                    {v.feedbackSummary && <p className="note">📝 {v.feedbackSummary}</p>}
                    {v.note && <p className="note">💬 {v.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="section-head"><h2 className="display">Comunicaciones</h2></div>
            <CommunicationSummary entries={vm.communications} />
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
