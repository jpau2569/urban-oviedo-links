import type { BusinessKpis, MediaPieceUsage, PropertyInterestRow } from "@/types/analytics";
import { CHANNEL_ICON } from "@/lib/media/mediaTypes";
import { KPISection } from "./KPISection";

/** Bloques de cabecera + rankings del módulo Resultados. */
export function AnalyticsOverview({
  kpis,
  properties,
  mediaUsage,
}: {
  kpis: BusinessKpis;
  properties: PropertyInterestRow[];
  mediaUsage: MediaPieceUsage[];
}) {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <KPISection kpis={kpis} />

      <div className="grid-2col">
        <div className="s-card s-card-pad">
          <p className="eyebrow" style={{ marginBottom: 14 }}>Inmuebles con más interés</p>
          <div className="os-wrap-x">
            <table className="os-table">
              <thead><tr><th>Inmueble</th><th>Vistas</th><th>Leads</th><th>Visitas</th></tr></thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.propertyId}>
                    <td><b>{p.ref}</b><br /><small className="muted" style={{ fontSize: 11.5 }}>{p.title}</small></td>
                    <td className="num">{p.views}</td>
                    <td className="num">{p.leads}</td>
                    <td className="num">{p.visits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="s-card s-card-pad">
          <p className="eyebrow" style={{ marginBottom: 14 }}>Piezas visuales más usadas</p>
          <div style={{ display: "grid", gap: 9 }}>
            {mediaUsage.map((m) => (
              <div key={m.label} className="pub-row">
                <span className="ch" aria-hidden="true">{CHANNEL_ICON[m.channel]}</span>
                <span className="who"><b>{m.label}</b></span>
                <span className="s-chip">{m.uses} usos</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
