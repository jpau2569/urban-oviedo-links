/**
 * Registro maestro de módulos de Castresana OS — naming final.
 *
 * Única fuente de verdad de nombres, claims y rutas. La home, la
 * navegación y la documentación se derivan de aquí: si un módulo cambia
 * de nombre, cambia en todo el producto a la vez.
 */

import type { PermissionArea } from "@/types/roles";

export interface OsModule {
  id: PermissionArea;
  /** Nombre de producto (premium, en castellano). */
  name: string;
  /** Nombre técnico/heredado entre fases. */
  codename: string;
  icon: string;
  claim: string;
  href: string;
  /** activo = construido en este repo; en-camino = fase anterior pendiente de integrar. */
  status: "activo" | "en-camino";
}

export const OS_NAME = "Castresana OS";
export const OS_DESCRIPTOR = "Sistema operativo inmobiliario premium";
export const OS_CLAIM = "Capta, responde, organiza, recomienda, automatiza, vende — y enseña resultados.";

export const OS_MODULES: OsModule[] = [
  { id: "pulso", name: "Pulso", codename: "Dashboard", icon: "📊", claim: "El estado del negocio de un vistazo.", href: "/analytics", status: "en-camino" },
  { id: "conversaciones", name: "Conversaciones", codename: "Inbox", icon: "💬", claim: "Cada mensaje, respondido a tiempo.", href: "#", status: "en-camino" },
  { id: "cartera", name: "Cartera", codename: "Properties", icon: "🏛️", claim: "Tus inmuebles, impecables y al día.", href: "#", status: "en-camino" },
  { id: "oportunidades", name: "Oportunidades", codename: "Leads", icon: "🔥", claim: "Ningún interesado se enfría.", href: "#", status: "en-camino" },
  { id: "media", name: "Media Studio", codename: "Vende Todo", icon: "🎬", claim: "Cada inmueble, presentado para vender.", href: "/media-studio", status: "activo" },
  { id: "portales", name: "Portales privados", codename: "Client & Owner Portals", icon: "🔐", claim: "Clientes y propietarios, a otro nivel.", href: "/client-portal/demo-cliente", status: "activo" },
  { id: "archivo", name: "Archivo", codename: "Documents", icon: "🗂️", claim: "Todo documento, en su sitio y firmable.", href: "#", status: "en-camino" },
  { id: "resultados", name: "Resultados", codename: "Analytics", icon: "📈", claim: "Decisiones con números, no sensaciones.", href: "/analytics", status: "activo" },
  { id: "autopiloto", name: "Autopiloto", codename: "Automation", icon: "⚙️", claim: "El trabajo repetitivo, solo.", href: "/settings/automation", status: "activo" },
  { id: "inteligencia", name: "Inteligencia", codename: "AI Insights", icon: "✨", claim: "Vende Todo piensa contigo.", href: "/settings/ai", status: "activo" },
  { id: "ajustes", name: "Ajustes", codename: "Settings", icon: "🎛️", claim: "El OS, a la medida de tu agencia.", href: "/settings", status: "activo" },
  { id: "sistema", name: "Torre de control", codename: "Admin", icon: "🗼", claim: "Salud, auditoría y lanzamiento.", href: "/admin", status: "activo" },
];

export function getModule(id: PermissionArea): OsModule | null {
  return OS_MODULES.find((m) => m.id === id) ?? null;
}
