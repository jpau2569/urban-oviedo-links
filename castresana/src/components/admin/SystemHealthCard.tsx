import type { SystemService } from "@/types/analytics";

/** Salud de servicios del sistema. */
export function SystemHealthCard({ services }: { services: SystemService[] }) {
  const degraded = services.filter((s) => s.status !== "operativo").length;
  return (
    <div className="s-card s-card-pad">
      <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap", marginBottom: 14 }}>
        <p className="eyebrow">Salud del sistema</p>
        {degraded === 0
          ? <span className="s-chip ok">Todo operativo</span>
          : <span className="s-chip warn">{degraded} servicio{degraded > 1 ? "s" : ""} con avisos</span>}
      </div>
      <div style={{ display: "grid", gap: 9 }}>
        {services.map((s) => (
          <div key={s.id} className="svc">
            <span className={`dot ${s.status}`} aria-hidden="true" />
            <b>{s.name}</b>
            <small>{s.latencyMs} ms{s.note ? ` · ${s.note}` : ""}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
