import Link from "next/link";
import type { OsUser } from "@/types/roles";
import { OsShell } from "@/components/os/OsShell";

const SECTIONS = [
  { href: "/settings", label: "Resumen" },
  { href: "/settings/agency", label: "Agencia" },
  { href: "/settings/users", label: "Equipo y roles" },
  { href: "/settings/branding", label: "Marca" },
  { href: "/settings/integrations", label: "Integraciones" },
  { href: "/settings/automation", label: "Autopiloto" },
  { href: "/settings/ai", label: "Inteligencia" },
] as const;

/** Shell de Ajustes: OsShell + subnavegación de secciones. */
export function SettingsShell({
  active,
  user,
  title,
  intro,
  children,
}: {
  active: (typeof SECTIONS)[number]["href"];
  user: OsUser;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <OsShell active="settings" user={user}>
      <p className="eyebrow">Ajustes</p>
      <h1 className="display" style={{ fontSize: "clamp(26px, 4vw, 38px)", color: "var(--paper-ink)", marginTop: 6 }}>
        {title}
      </h1>
      <p className="muted" style={{ marginTop: 8, maxWidth: "64ch", lineHeight: 1.6, fontSize: 13.5 }}>{intro}</p>
      <nav className="set-nav" aria-label="Secciones de ajustes">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className={s.href === active ? "active" : ""}>
            {s.label}
          </Link>
        ))}
      </nav>
      {children}
    </OsShell>
  );
}
