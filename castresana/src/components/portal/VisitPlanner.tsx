"use client";

import { useState } from "react";
import type { PortalProperty, PortalVisit } from "@/types/portal";
import { fmtWeekday } from "@/lib/portal/portalViewModels";

/**
 * Visitas del cliente. Para las visitas "propuestas" permite elegir franja
 * (confirmación optimista; la real pasará por POST /api/portal/visits con
 * re-validación de token) y para el resto muestra su estado.
 */

const STATUS_PILL: Record<PortalVisit["status"], { label: string; cls: string }> = {
  confirmada: { label: "Confirmada", cls: "pill-ok" },
  propuesta: { label: "Elige horario", cls: "pill-new" },
  realizada: { label: "Realizada", cls: "pill-mut" },
  cancelada: { label: "Cancelada", cls: "pill-mut" },
};

function VisitRow({ visit, property }: { visit: PortalVisit; property?: PortalProperty }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const pill = confirmed ? STATUS_PILL.confirmada : STATUS_PILL[visit.status];
  const day = new Date(visit.date + "T12:00:00");

  return (
    <div className="visit-row">
      <div className="visit-cal" aria-hidden="true">
        <span className="m">{day.toLocaleDateString("es-ES", { month: "short" }).replace(".", "")}</span>
        <span className="d">{day.getDate()}</span>
      </div>
      <div className="visit-main">
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <h3>{property?.title ?? "Propiedad"}</h3>
          <span className={`pill ${pill.cls}`}>{pill.label}</span>
        </div>
        <p className="when">
          {fmtWeekday(visit.date)} · {confirmed && picked ? picked : visit.time} h
        </p>
        {visit.note && <p className="note">💬 {visit.note}</p>}
        {visit.feedbackSummary && <p className="note">📝 {visit.feedbackSummary}</p>}

        {visit.status === "propuesta" && !confirmed && visit.proposedSlots && (
          <>
            <p className="note" style={{ fontWeight: 600 }}>
              Marta te propone estas franjas — elige la que mejor te venga:
            </p>
            <div className="slots">
              {visit.proposedSlots.map((s) => {
                const key = `${s.date} ${s.time}`;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`slot ${picked === key ? "picked" : ""}`}
                    onClick={() => setPicked(key)}
                  >
                    {fmtWeekday(s.date)} · {s.time} h
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 14 }}>
              <button
                type="button"
                className="btn btn-sm btn-copper"
                disabled={!picked}
                style={picked ? undefined : { opacity: 0.45, cursor: "not-allowed" }}
                onClick={() => picked && setConfirmed(true)}
              >
                Confirmar esta franja
              </button>
            </div>
          </>
        )}
        {confirmed && (
          <p className="note" style={{ color: "var(--ok)", fontWeight: 700 }}>
            ✓ Franja enviada. Marta te confirmará en breve por WhatsApp.
          </p>
        )}
      </div>
    </div>
  );
}

export function VisitPlanner({
  visits,
  propertyIndex,
}: {
  visits: PortalVisit[];
  propertyIndex: Record<string, PortalProperty>;
}) {
  if (visits.length === 0) {
    return (
      <div className="card card-pad" style={{ textAlign: "center" }}>
        <p className="muted">Todavía no hay visitas. Marca “Me interesa” en una propiedad y proponemos horarios.</p>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {visits.map((v) => (
        <VisitRow key={v.id} visit={v} property={propertyIndex[v.propertyId]} />
      ))}
    </div>
  );
}
