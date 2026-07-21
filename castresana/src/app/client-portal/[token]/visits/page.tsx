import { resolveClientPortal } from "@/lib/portal/portalViewModels";
import { PortalShell } from "@/components/portal/PortalShell";
import { VisitPlanner } from "@/components/portal/VisitPlanner";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Tus visitas" };

export default async function ClientVisitsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const res = await resolveClientPortal(token);
  if (!res.ok) return <SecureAccessError reason={res.reason} />;
  const vm = res.data;
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = vm.visits.filter((v) => v.date >= today && v.status !== "cancelada");
  const past = vm.visits.filter((v) => v.date < today || v.status === "cancelada").reverse();

  return (
    <PortalShell
      role="client"
      token={token}
      active={`/client-portal/${token}/visits`}
      bandText={`Espacio de ${vm.session.clientName}`}
    >
      <p className="eyebrow">Agenda</p>
      <h1 className="display" style={{ fontSize: "clamp(28px, 4vw, 40px)", marginTop: 6 }}>Tus visitas</h1>
      <p className="muted" style={{ marginTop: 10, maxWidth: "60ch", lineHeight: 1.65 }}>
        Aquí tienes todo lo agendado. Si una visita está “Elige horario”, marca la franja que
        mejor te venga y {vm.session.agent.name.split(" ")[0]} la confirmará.
      </p>

      <section className="section">
        <div className="section-head"><h2 className="display">Próximas</h2><span className="count">{upcoming.length}</span></div>
        <VisitPlanner visits={upcoming} propertyIndex={vm.propertyIndex} />
      </section>

      {past.length > 0 && (
        <section className="section">
          <div className="section-head"><h2 className="display">Anteriores</h2><span className="count">{past.length}</span></div>
          <VisitPlanner visits={past} propertyIndex={vm.propertyIndex} />
        </section>
      )}
    </PortalShell>
  );
}
