import type { OwnerPortalVM } from "@/lib/portal/portalViewModels";
import { fmtPrice, fmtDate } from "@/lib/portal/portalViewModels";
import { StatusPill } from "./PropertyArt";

/**
 * Hero del propietario: su inmueble, estado y las cifras que importan.
 * Transmite control y transparencia desde el primer scroll.
 */
export function OwnerPerformanceCard({ vm }: { vm: OwnerPortalVM }) {
  const { session, property: p, metrics: m } = vm;
  return (
    <section className="welcome">
      <p className="eyebrow">La comercialización de tu inmueble</p>
      <h1>Hola, {session.firstName}. Así avanza tu venta.</h1>
      <p className="lede">
        <strong style={{ color: "var(--copper-pale)" }}>{p.title}</strong> · {p.location} · Ref. {p.ref}
        <br />
        En cartera desde el {fmtDate(p.publishedAt)} — precio actual{" "}
        <strong style={{ color: "var(--copper-soft)" }}>{fmtPrice(p.price)}</strong> ·{" "}
        <StatusPill status={p.status} />
      </p>
      <div className="facts">
        <div className="fact">
          <b>{m.views}</b>
          <span>Visualizaciones</span>
        </div>
        <div className="fact">
          <b>{m.qualifiedLeads}</b>
          <span>Leads cualificados</span>
        </div>
        <div className="fact">
          <b>{m.visitsDone}</b>
          <span>Visitas hechas</span>
        </div>
        <div className="fact">
          <b>{m.visitsPending}</b>
          <span>Visitas agendadas</span>
        </div>
        <div className="fact">
          <b>{m.daysOnMarket}</b>
          <span>Días en mercado</span>
        </div>
      </div>
    </section>
  );
}
