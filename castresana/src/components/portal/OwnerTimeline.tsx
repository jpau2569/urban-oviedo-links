import type { PortalTimelineEvent, TimelineEventKind } from "@/types/portal";
import { fmtDateShort } from "@/lib/portal/portalViewModels";

/** Hitos que se marcan con nodo cobre destacado. */
const MAJOR: ReadonlySet<TimelineEventKind> = new Set(["publicacion", "visita", "hito", "precio"]);

const KIND_LABEL: Record<TimelineEventKind, string> = {
  publicacion: "Publicación",
  marketing: "Marketing",
  lead: "Interés",
  visita: "Visita",
  feedback: "Feedback",
  precio: "Precio",
  documento: "Documento",
  mensaje: "Comunicación",
  hito: "Hito",
};

/**
 * Línea de tiempo comercial del inmueble: qué se ha hecho, cuándo y con
 * qué resultado. La prueba tangible del trabajo de la agencia.
 */
export function OwnerTimeline({ events }: { events: PortalTimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="card card-pad" style={{ textAlign: "center" }}>
        <p className="muted">La actividad comercial de tu inmueble aparecerá aquí paso a paso.</p>
      </div>
    );
  }
  return (
    <div className="timeline">
      {events.map((e) => (
        <div key={e.id} className={`tl-item ${MAJOR.has(e.kind) ? "" : "minor"}`}>
          <p className="tl-date">
            {fmtDateShort(e.date)} · {KIND_LABEL[e.kind]}
          </p>
          <p className="tl-title">{e.title}</p>
          {e.description && <p className="tl-desc">{e.description}</p>}
        </div>
      ))}
    </div>
  );
}
