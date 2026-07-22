import type { QueueJobSummary } from "@/types/analytics";

const QUEUE_ICON: Record<QueueJobSummary["queue"], string> = {
  render: "🎬",
  notificaciones: "🔔",
  sincronizacion: "🔄",
  informes: "📈",
};

const STATUS_CHIP: Record<QueueJobSummary["status"], string> = {
  "en-cola": "dim",
  procesando: "",
  completado: "ok",
  fallido: "warn",
};

/** Monitor de colas y jobs del sistema. */
export function QueueMonitor({ jobs }: { jobs: QueueJobSummary[] }) {
  const failing = jobs.filter((j) => j.status === "fallido").length;
  return (
    <div className="s-card s-card-pad">
      <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap", marginBottom: 14 }}>
        <p className="eyebrow">Colas y trabajos</p>
        {failing > 0 && <span className="s-chip warn">{failing} fallido{failing > 1 ? "s" : ""} — revisar</span>}
      </div>
      <div style={{ display: "grid", gap: 9 }}>
        {jobs.map((j) => (
          <div key={j.id} className="pub-row">
            <span className="ch" aria-hidden="true">{QUEUE_ICON[j.queue]}</span>
            <span className="who">
              <b>{j.label}</b>
              <small>Cola: {j.queue}</small>
            </span>
            <span className={`s-chip ${STATUS_CHIP[j.status]}`}>{j.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
