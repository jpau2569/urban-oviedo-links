import type { AuditEvent } from "@/types/analytics";

const KIND_ICON: Record<AuditEvent["kind"], string> = {
  auth: "🔐",
  propiedad: "🏛️",
  lead: "🔥",
  visita: "📅",
  export: "📦",
  portal: "🚪",
  ajustes: "🎛️",
  automatizacion: "⚙️",
  error: "⛑️",
};

function timeAgo(iso: string): string {
  const h = Math.round((Date.now() - new Date(iso).getTime()) / 3600_000);
  if (h < 1) return "hace minutos";
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.round(h / 24)} d`;
}

/** Timeline global de auditoría del sistema. */
export function ActivityAuditTable({ events }: { events: AuditEvent[] }) {
  return (
    <div className="s-card s-card-pad">
      <p className="eyebrow" style={{ marginBottom: 14 }}>Auditoría · timeline global</p>
      <div style={{ display: "grid", gap: 9 }}>
        {events.map((e) => (
          <div key={e.id} className="pub-row">
            <span className="ch" aria-hidden="true">{KIND_ICON[e.kind]}</span>
            <span className="who">
              <b>{e.summary}</b>
              <small>{e.actor} · {timeAgo(e.at)}</small>
            </span>
            <span className={`s-chip ${e.severity === "critico" ? "warn" : e.severity === "aviso" ? "" : "dim"}`}>
              {e.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
