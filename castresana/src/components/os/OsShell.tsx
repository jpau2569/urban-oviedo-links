import Link from "next/link";
import { OS_DESCRIPTOR, OS_NAME } from "@/lib/os/modules";
import type { OsUser } from "@/types/roles";

/**
 * Shell interno de Castresana OS (launcher, ajustes, admin, resultados).
 * Comparte lenguaje visual con el Media Studio: carbón + cobre.
 */
export function OsShell({
  active,
  user,
  children,
}: {
  active: "os" | "settings" | "admin" | "analytics" | "onboarding";
  user: OsUser | null;
  children: React.ReactNode;
}) {
  return (
    <div className="studio">
      <header className="st-head">
        <div className="st-head-in">
          <Link href="/" style={{ display: "flex", gap: 13, alignItems: "center", textDecoration: "none" }}>
            <span className="st-badge" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22 }}>C</span>
            <span className="st-title">
              <b>{OS_NAME}</b>
              <small>{OS_DESCRIPTOR}</small>
            </span>
          </Link>
          <nav className="st-nav" aria-label="Navegación del OS">
            <Link href="/" className={active === "os" ? "active" : ""}>Módulos</Link>
            <Link href="/analytics" className={active === "analytics" ? "active" : ""}>Resultados</Link>
            <Link href="/settings" className={active === "settings" ? "active" : ""}>Ajustes</Link>
            <Link href="/admin" className={active === "admin" ? "active" : ""}>Torre de control</Link>
          </nav>
          {user && (
            <span className="s-chip dim" title={user.email}>
              <span aria-hidden="true">👤</span> {user.name.split(" ")[0]} · {user.role}
            </span>
          )}
        </div>
      </header>
      <main className="studio-main">{children}</main>
      <footer className="p-footer" style={{ background: "transparent", borderTop: "1px solid rgba(226,215,196,.1)" }}>
        <b>{OS_NAME}</b>
        <p style={{ marginTop: 6 }}>Capta · responde · organiza · recomienda · automatiza · vende · demuestra.</p>
      </footer>
    </div>
  );
}
