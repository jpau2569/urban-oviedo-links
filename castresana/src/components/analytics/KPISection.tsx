import type { BusinessKpis } from "@/types/analytics";

/** KPIs de cabecera del módulo Resultados. */
export function KPISection({ kpis }: { kpis: BusinessKpis }) {
  const cells = [
    { v: String(kpis.newLeads), l: "Leads nuevos" },
    { v: String(kpis.hotLeads), l: "Leads calientes" },
    { v: `${kpis.avgResponseMinutes} min`, l: "Respuesta media" },
    { v: String(kpis.visitsDone), l: "Visitas hechas" },
    { v: String(kpis.closings), l: "Cierres" },
    { v: `${kpis.followUpRate}%`, l: "Tasa de seguimiento" },
  ];
  return (
    <div className="metrics-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
      {cells.map((c) => (
        <div key={c.l} className="metric" style={{ background: "rgba(255,251,244,.045)", borderColor: "rgba(226,215,196,.13)" }}>
          <b style={{ color: "var(--copper-soft)" }}>{c.v}</b>
          <span style={{ color: "var(--paper-soft)" }}>{c.l}</span>
        </div>
      ))}
    </div>
  );
}
