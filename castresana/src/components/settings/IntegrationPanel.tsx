import type { IntegrationStatus } from "@/types/settings";

const CATEGORY_LABEL: Record<IntegrationStatus["category"], string> = {
  mensajeria: "Mensajería",
  portales: "Portales inmobiliarios",
  productividad: "Productividad",
  media: "Media y redes",
  infraestructura: "Infraestructura",
};

/** Panel de integraciones agrupado por categoría. */
export function IntegrationPanel({ integrations }: { integrations: IntegrationStatus[] }) {
  const categories = [...new Set(integrations.map((i) => i.category))];
  return (
    <div style={{ display: "grid", gap: 22 }}>
      {categories.map((cat) => (
        <div key={cat} className="s-card s-card-pad">
          <p className="eyebrow" style={{ marginBottom: 14 }}>{CATEGORY_LABEL[cat]}</p>
          <div style={{ display: "grid", gap: 10 }}>
            {integrations.filter((i) => i.category === cat).map((i) => (
              <div key={i.id} className="pub-row">
                <span className="ch">{i.connected ? "🔌" : "⭕"}</span>
                <span className="who">
                  <b>{i.name}</b>
                  <small>{i.account ?? i.note ?? "Sin conectar"}</small>
                </span>
                {i.connected
                  ? <span className="s-chip ok">Conectada</span>
                  : <button type="button" className="btn btn-sm btn-ghost">Conectar</button>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
