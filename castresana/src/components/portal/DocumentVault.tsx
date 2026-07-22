import type { PortalDocument } from "@/types/portal";
import { fmtDate } from "@/lib/portal/portalViewModels";

const KIND_META: Record<PortalDocument["kind"], { icon: string; label: string }> = {
  dossier: { icon: "📕", label: "Dossier" },
  plano: { icon: "📐", label: "Plano" },
  contrato: { icon: "✒️", label: "Contrato" },
  certificado: { icon: "🏅", label: "Certificado" },
  informe: { icon: "📈", label: "Informe" },
  otro: { icon: "🗂️", label: "Archivo" },
};

/**
 * Biblioteca de documentos del portal. En producción `url` será una URL
 * firmada de Storage generada por el servidor tras validar el token.
 */
export function DocumentVault({ documents }: { documents: PortalDocument[] }) {
  if (documents.length === 0) {
    return (
      <div className="card card-pad" style={{ textAlign: "center" }}>
        <p className="muted">Cuando haya dosieres, planos o informes disponibles, aparecerán aquí.</p>
      </div>
    );
  }
  return (
    <div className="doc-list">
      {documents.map((d) => {
        const meta = KIND_META[d.kind];
        return (
          <div key={d.id} className="doc">
            <div className="doc-ic" aria-hidden="true">
              {meta.icon}
            </div>
            <div className="doc-body">
              <b>{d.title}</b>
              <small>
                {meta.label} · {d.sizeLabel} · actualizado el {fmtDate(d.updatedAt)}
              </small>
            </div>
            <a className="btn btn-sm btn-ghost" href={d.url} aria-label={`Descargar ${d.title}`}>
              ↓ Descargar
            </a>
          </div>
        );
      })}
    </div>
  );
}
