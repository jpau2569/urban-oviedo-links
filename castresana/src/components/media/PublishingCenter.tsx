"use client";

import { useState } from "react";
import type { PublishingRecord } from "@/types/media";
import { isDone, nextStatus, summarize, workOrder } from "@/lib/media/publishingManager";
import { CHANNEL_ICON, CHANNEL_LABEL, PUBLISHING_STATUS_LABEL, fmtShortDate } from "@/lib/media/mediaTypes";

/**
 * Centro de publicación: qué pieza está en qué estado y por qué canal.
 * Avance de estado optimista (real: PATCH /api/media/publishing/{id}).
 */
export function PublishingCenter({ initialRecords }: { initialRecords: PublishingRecord[] }) {
  const [records, setRecords] = useState(initialRecords);
  const summary = summarize(records);

  const advance = (id: string) =>
    setRecords((rs) =>
      rs.map((r) =>
        r.id === id && !isDone(r)
          ? { ...r, status: nextStatus(r), date: r.date ?? new Date().toISOString() }
          : r,
      ),
    );

  return (
    <div className="s-card s-card-pad">
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <p className="eyebrow">Publishing center</p>
        <span className="s-chip ok">{summary.done} publicadas/enviadas</span>
        {summary.pending > 0 && <span className="s-chip warn">{summary.pending} pendientes</span>}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {workOrder(records).map((r) => (
          <div key={r.id} className="pub-row">
            <span className="ch" aria-hidden="true">{CHANNEL_ICON[r.channel]}</span>
            <span className="who">
              <b>{r.pieceLabel}</b>
              <small>
                {CHANNEL_LABEL[r.channel]}
                {r.date ? ` · ${fmtShortDate(r.date)}` : ""}
                {r.sentTo ? ` · → ${r.sentTo}` : ""}
              </small>
            </span>
            <span className={`pub-st ${r.status}`}>{PUBLISHING_STATUS_LABEL[r.status]}</span>
            {!isDone(r) && (
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => advance(r.id)}>
                {r.status === "programada" ? "Publicar ya" : r.channel === "whatsapp" || r.channel.endsWith("-portal") || r.channel === "email" ? "Enviar" : "Avanzar"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
