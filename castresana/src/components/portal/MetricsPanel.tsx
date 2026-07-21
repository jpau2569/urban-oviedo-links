import type { OwnerMetrics } from "@/types/portal";
import type { OwnerFunnelStep } from "@/lib/portal/portalViewModels";
import { fmtDateShort } from "@/lib/portal/portalViewModels";

/**
 * Panel de métricas del propietario: cifras clave, embudo comercial,
 * interés semanal y acciones de marketing. Todo legible en 10 segundos.
 */
export function MetricsPanel({ metrics, funnel }: { metrics: OwnerMetrics; funnel: OwnerFunnelStep[] }) {
  const maxFunnel = Math.max(1, ...funnel.map((f) => f.value));
  const maxWeek = Math.max(1, ...metrics.weeklyInterest);

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div className="metrics-grid">
        <div className="metric">
          <b>{metrics.views}</b>
          <span>Visualizaciones</span>
        </div>
        <div className="metric">
          <b>{metrics.favorites}</b>
          <span>Favoritos</span>
        </div>
        <div className="metric">
          <b>{metrics.contacts}</b>
          <span>Contactos</span>
        </div>
        <div className="metric">
          <b>{metrics.visitRequests}</b>
          <span>Solicitudes de visita</span>
        </div>
      </div>

      <div className="card card-pad">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Embudo comercial · {metrics.periodLabel}
        </p>
        <div className="funnel">
          {funnel.map((f) => (
            <div key={f.label} className="funnel-row">
              <span className="lbl">{f.label}</span>
              <div className="bar">
                <div className="fill" style={{ width: `${Math.max(3, (f.value / maxFunnel) * 100)}%` }} />
              </div>
              <span className="val">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card card-pad">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Interés semanal
        </p>
        <div className="spark" role="img" aria-label="Evolución del interés en las últimas semanas">
          {metrics.weeklyInterest.map((v, i) => (
            <div key={i} className="bar" style={{ height: `${Math.max(9, (v / maxWeek) * 100)}%` }} title={`${v}`} />
          ))}
        </div>
        <div className="spark-labels">
          {metrics.weeklyInterest.map((_, i) => (
            <span key={i}>S{i + 1}</span>
          ))}
        </div>
      </div>

      <div className="card card-pad">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Acciones de marketing
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {metrics.marketingActions.map((a) => (
            <div key={a.id} style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span
                className={`pill ${
                  a.status === "activa" ? "pill-ok" : a.status === "programada" ? "pill-new" : "pill-mut"
                }`}
              >
                {a.status}
              </span>
              <b style={{ fontSize: 14 }}>{a.label}</b>
              <span className="muted" style={{ fontSize: 12.5, marginLeft: "auto" }}>
                {a.channel} · {fmtDateShort(a.date)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
