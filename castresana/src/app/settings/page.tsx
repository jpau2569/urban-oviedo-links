import Link from "next/link";
import { guardPage } from "@/lib/auth/roleGuards";
import { resolveTenant, planFor } from "@/lib/tenancy/tenants";
import { OS_USERS, INTEGRATIONS, AUTOMATION_RULES } from "@/lib/os/mockOs";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Ajustes" };

export default async function SettingsHome() {
  const guard = await guardPage("ajustes:view");
  if (!guard.allowed) return <SecureAccessError reason="wrong_role" />;
  const tenant = await resolveTenant();
  const plan = planFor(tenant);

  const cards = [
    { href: "/settings/agency", icon: "🏢", title: "Agencia", desc: `${tenant.branding.displayName} · ${tenant.city}` },
    { href: "/settings/users", icon: "👥", title: "Equipo y roles", desc: `${OS_USERS.filter((u) => u.active).length} usuarios activos · matriz de permisos` },
    { href: "/settings/branding", icon: "🎨", title: "Marca", desc: "Identidad que heredan portales y piezas" },
    { href: "/settings/integrations", icon: "🔌", title: "Integraciones", desc: `${INTEGRATIONS.filter((i) => i.connected).length}/${INTEGRATIONS.length} conectadas` },
    { href: "/settings/automation", icon: "⚙️", title: "Autopiloto", desc: `${AUTOMATION_RULES.filter((r) => r.enabled).length} reglas activas` },
    { href: "/settings/ai", icon: "✨", title: "Inteligencia", desc: "Vende Todo · tono premium · revisión humana" },
  ];

  return (
    <SettingsShell
      active="/settings"
      user={guard.user}
      title="Ajustes"
      intro={`Plan ${plan.name} · hasta ${plan.maxUsers} usuarios y ${plan.maxActiveProperties} inmuebles activos. Todo lo configurable del OS, en un solo sitio.`}
    >
      <div className="os-modules">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="os-mod">
            <span className="ic" aria-hidden="true">{c.icon}</span>
            <b>{c.title}</b>
            <small>{c.desc}</small>
          </Link>
        ))}
      </div>
    </SettingsShell>
  );
}
