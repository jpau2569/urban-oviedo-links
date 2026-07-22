import Link from "next/link";
import type { PortalProperty } from "@/types/portal";

/**
 * Envoltorio del Media Studio: cabecera de estudio (carbón + cobre),
 * navegación contextual del inmueble y firma "Vende Todo".
 */
export function MediaStudioShell({
  property,
  active,
  children,
}: {
  /** Inmueble en contexto; null en la home del Studio. */
  property: PortalProperty | null;
  active: "home" | "library" | "storyboard" | "exports";
  children: React.ReactNode;
}) {
  const base = property ? `/media-studio/${property.id}` : "/media-studio";
  return (
    <div className="studio">
      <header className="st-head">
        <div className="st-head-in">
          <Link href="/media-studio" style={{ display: "flex", gap: 13, alignItems: "center", textDecoration: "none" }}>
            <span className="st-badge">🎬</span>
            <span className="st-title">
              <b>Media Studio</b>
              <small>Vende Todo · Castresana</small>
            </span>
          </Link>
          {property && (
            <span className="s-chip dim" title={property.title}>
              {property.ref} · {property.title.length > 34 ? property.title.slice(0, 34) + "…" : property.title}
            </span>
          )}
          <nav className="st-nav" aria-label="Secciones del estudio">
            <Link href="/media-studio" className={active === "home" ? "active" : ""}>Estudio</Link>
            {property && (
              <>
                <Link href={base} className={active === "library" ? "active" : ""}>Biblioteca</Link>
                <Link href={`${base}/storyboard`} className={active === "storyboard" ? "active" : ""}>Storyboard</Link>
                <Link href={`${base}/exports`} className={active === "exports" ? "active" : ""}>Exportar y publicar</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="studio-main">{children}</main>
      <footer className="p-footer" style={{ background: "transparent", borderTop: "1px solid rgba(226,215,196,.1)" }}>
        <b>Castresana Media Studio</b>
        <p style={{ marginTop: 6 }}>Fábrica de contenido inmobiliario · cada inmueble, presentado para vender.</p>
      </footer>
    </div>
  );
}
