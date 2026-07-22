import Link from "next/link";
import type { PortalRole } from "@/types/portal";

interface NavItem {
  href: string;
  label: string;
}

function navFor(role: PortalRole, token: string): NavItem[] {
  if (role === "client") {
    const base = `/client-portal/${token}`;
    return [
      { href: base, label: "Inicio" },
      { href: `${base}/visits`, label: "Visitas" },
      { href: `${base}/messages`, label: "Seguimiento" },
      { href: `${base}/documents`, label: "Documentos" },
    ];
  }
  const base = `/owner-portal/${token}`;
  return [
    { href: base, label: "Resumen" },
    { href: `${base}/activity`, label: "Actividad" },
    { href: `${base}/documents`, label: "Documentos" },
  ];
}

/**
 * Cabecera carbón compartida de ambos portales. `active` es el href exacto
 * de la sección actual (server component: sin usePathname para mantener
 * las páginas 100% estáticas por token).
 */
export function PortalHeader({
  role,
  token,
  active,
  bandText,
}: {
  role: PortalRole;
  token: string;
  active: string;
  bandText: string;
}) {
  const items = navFor(role, token);
  return (
    <>
      <header className="p-header">
        <div className="p-header-in">
          <Link href={items[0]?.href ?? "#"} className="p-mark">
            <span className="p-mark-badge">C</span>
            <span>
              <b>Castresana</b>
              <small>{role === "client" ? "Portal privado del cliente" : "Portal del propietario"}</small>
            </span>
          </Link>
          <nav className="p-nav" aria-label="Secciones del portal">
            {items.map((it) => (
              <Link key={it.href} href={it.href} className={it.href === active ? "active" : ""}>
                {it.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-band">
          <div className="p-band-in">
            <span>🔐 Acceso privado</span>
            <span className="dot">·</span>
            <span>{bandText}</span>
          </div>
        </div>
      </header>
    </>
  );
}
