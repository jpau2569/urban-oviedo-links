"use client";

import { useState } from "react";
import type { ExportJob, MediaAsset } from "@/types/media";
import type { PortalProperty } from "@/types/portal";
import { advanceJob, createPackExport, createShareLink } from "@/lib/media/exportManager";
import { EXPORT_KIND_LABEL, EXPORT_STATUS_LABEL, fmtShortDate } from "@/lib/media/mediaTypes";

const KIND_ICON: Record<ExportJob["kind"], string> = {
  mp4: "🎬",
  zip: "🗜️",
  pdf: "📕",
  "pack-whatsapp": "💬",
  "pack-social": "📱",
  "enlace-privado": "🔗",
};

/**
 * Cola de exportación: jobs existentes + creación de nuevos paquetes.
 * El render real lo hará un worker; aquí la cola avanza en local para
 * demostrar el pipeline completo (en-cola → procesando → listo).
 */
export function ExportQueuePanel({
  property,
  assets,
  initialJobs,
}: {
  property: PortalProperty;
  assets: MediaAsset[];
  initialJobs: ExportJob[];
}) {
  const [jobs, setJobs] = useState<ExportJob[]>(initialJobs);

  const enqueue = (job: ExportJob) => setJobs((j) => [job, ...j]);
  const advance = (id: string) => setJobs((j) => j.map((job) => (job.id === id ? advanceJob(job) : job)));

  return (
    <div className="s-card s-card-pad">
      <p className="eyebrow" style={{ marginBottom: 14 }}>Export manager</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => enqueue(createPackExport(property, "pack-whatsapp", assets))}>
          💬 Paquete WhatsApp
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => enqueue(createPackExport(property, "pack-social", assets))}>
          📱 Paquete redes
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => enqueue(createPackExport(property, "pdf", assets))}>
          📕 Ficha PDF
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => enqueue(createPackExport(property, "zip", assets))}>
          🗜️ ZIP completo
        </button>
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => enqueue(createShareLink(property, "biblioteca completa"))}>
          🔗 Enlace privado
        </button>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {jobs.length === 0 && <p className="muted" style={{ fontSize: 13 }}>Nada en cola. Genera tu primera pieza arriba.</p>}
        {jobs.map((job) => (
          <div key={job.id} className="job">
            <span className="job-ic" aria-hidden="true">{KIND_ICON[job.kind]}</span>
            <span className="job-info">
              <b>{job.label}</b>
              <small>
                {EXPORT_KIND_LABEL[job.kind]} · {fmtShortDate(job.createdAt)}
                {job.output ? ` · ${job.output.fileName} (${job.output.sizeLabel}) · ${job.output.note}` : ""}
                {job.output?.shareUrl ? ` · ${job.output.shareUrl}` : ""}
              </small>
              {job.status !== "listo" && (
                <span className="job-bar"><span className="fill" style={{ width: `${job.progress}%`, display: "block", height: "100%" }} /></span>
              )}
            </span>
            {job.status === "listo" ? (
              <span className="s-chip ok">✓ {EXPORT_STATUS_LABEL[job.status]}</span>
            ) : (
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => advance(job.id)}>
                {job.status === "en-cola" ? "Iniciar" : `${job.progress}% · avanzar`}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
