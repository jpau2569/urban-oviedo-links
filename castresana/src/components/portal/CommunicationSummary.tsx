import type { CommunicationSummaryEntry } from "@/types/portal";
import { fmtDate } from "@/lib/portal/portalViewModels";

const CHANNEL_ICON: Record<CommunicationSummaryEntry["channel"], string> = {
  whatsapp: "💬",
  email: "✉️",
  llamada: "📞",
  presencial: "🤝",
};

const FROM_LABEL: Record<CommunicationSummaryEntry["from"], string> = {
  agent: "Castresana",
  client: "Tú",
  owner: "Tú",
};

/**
 * Historial de comunicaciones en formato resumen editorial — no el hilo
 * crudo del Inbox interno. Transmite: "estamos encima de tu caso".
 */
export function CommunicationSummary({ entries }: { entries: CommunicationSummaryEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="card card-pad" style={{ textAlign: "center" }}>
        <p className="muted">Aquí verás un resumen de cada conversación y acuerdo.</p>
      </div>
    );
  }
  return (
    <div className="comm-list">
      {entries.map((e) => (
        <div key={e.id} className="comm">
          <div className="comm-ic" aria-hidden="true">
            {CHANNEL_ICON[e.channel]}
          </div>
          <div className="comm-body">
            <p className="comm-meta">
              {fmtDate(e.date)} · {e.channel} · {FROM_LABEL[e.from]}
            </p>
            <p className="comm-text">{e.summary}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
