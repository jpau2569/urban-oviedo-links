import type { PortalProperty } from "@/types/portal";

/**
 * Arte cálido de propiedad para el mock (sin fotos de terceros):
 * degradado de la paleta + line-art arquitectónico. En producción se
 * sustituye por la imagen de portada del reportaje.
 */
export function PropertyArt({ accent }: { accent: PortalProperty["accent"] }) {
  return (
    <div className={`art art-${accent}`} aria-hidden="true">
      <svg className="lineart" viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M10 74 L10 40 L38 18 L66 40 L66 74" strokeLinejoin="round" />
        <path d="M22 74 L22 52 L34 52 L34 74" />
        <path d="M44 46 h12 v12 h-12 z" />
        <path d="M66 52 h34 v22" />
        <path d="M74 60 h8 v14 h-8 z" />
        <path d="M88 60 h8 v8 h-8 z" />
        <path d="M2 74 h116" strokeLinecap="round" />
        <path d="M100 52 L100 34 L110 34 L110 52" />
      </svg>
    </div>
  );
}

/** Pill de estado de comercialización. */
export function StatusPill({ status }: { status: PortalProperty["status"] }) {
  const map: Record<PortalProperty["status"], { label: string; cls: string }> = {
    disponible: { label: "Disponible", cls: "pill-ok" },
    reservado: { label: "Reservado", cls: "pill-warn" },
    vendido: { label: "Vendido", cls: "pill-mut" },
    alquilado: { label: "Alquilado", cls: "pill-mut" },
  };
  const s = map[status];
  return <span className={`pill ${s.cls}`}>{s.label}</span>;
}
