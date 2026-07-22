import type { WeeklyPoint } from "@/types/analytics";

/**
 * Doble serie semanal en barras CSS: leads captados y minutos de
 * respuesta (menos es mejor — se enseña invertido en verde).
 */
export function LeadPerformanceChart({
  leads,
  response,
}: {
  leads: WeeklyPoint[];
  response: WeeklyPoint[];
}) {
  const maxLeads = Math.max(1, ...leads.map((p) => p.value));
  const maxResp = Math.max(1, ...response.map((p) => p.value));
  return (
    <div className="s-card s-card-pad">
      <p className="eyebrow" style={{ marginBottom: 16 }}>Leads y velocidad de respuesta · por semana</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <div className="spark" style={{ height: 90 }}>
            {leads.map((p) => (
              <div key={p.label} className="bar" style={{ height: `${(p.value / maxLeads) * 100}%` }} title={`${p.value} leads`} />
            ))}
          </div>
          <div className="spark-labels">{leads.map((p) => <span key={p.label}>{p.label}</span>)}</div>
          <p className="muted" style={{ fontSize: 11.5, marginTop: 6, textAlign: "center" }}>Leads nuevos</p>
        </div>
        <div>
          <div className="spark" style={{ height: 90 }}>
            {response.map((p) => (
              <div
                key={p.label}
                className="bar"
                style={{ height: `${(p.value / maxResp) * 100}%`, background: "linear-gradient(180deg, #a8c297, #5e7d4f)" }}
                title={`${p.value} min`}
              />
            ))}
          </div>
          <div className="spark-labels">{response.map((p) => <span key={p.label}>{p.label}</span>)}</div>
          <p className="muted" style={{ fontSize: 11.5, marginTop: 6, textAlign: "center" }}>Minutos hasta responder (bajando ✓)</p>
        </div>
      </div>
    </div>
  );
}
