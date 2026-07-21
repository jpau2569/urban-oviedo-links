/**
 * Guards de acceso por página/acción.
 *
 * Mock: el usuario actual es fijo. En producción, `getCurrentUser` leerá la
 * sesión de Firebase Auth + el doc users/{uid} del tenant, y los guards se
 * ejecutarán en Server Components y Route Handlers (nunca solo en cliente).
 */

import type { OsUser } from "@/types/roles";
import type { Permission } from "@/types/roles";
import { can } from "./permissions";

const MOCK_CURRENT_USER: OsUser = {
  id: "u-1",
  name: "Marta Castresana",
  initials: "MC",
  email: "marta@asesoriacastresana.com",
  role: "super-admin",
  active: true,
  lastActiveAt: new Date().toISOString(),
  onboardedAt: "2025-01-10T09:00:00.000Z",
};

export async function getCurrentUser(): Promise<OsUser> {
  return MOCK_CURRENT_USER;
}

export type GuardResult = { allowed: true; user: OsUser } | { allowed: false; reason: string };

/** Guard de página: la ruta lo llama antes de renderizar contenido sensible. */
export async function guardPage(required: Permission): Promise<GuardResult> {
  const user = await getCurrentUser();
  if (!user.active) return { allowed: false, reason: "Cuenta desactivada." };
  if (!can(user.role, required)) {
    return { allowed: false, reason: `Tu rol no tiene acceso a esta sección (${required}).` };
  }
  return { allowed: true, user };
}

/** Guard de acción (para handlers de escritura). */
export async function assertPermission(required: Permission): Promise<OsUser> {
  const res = await guardPage(required);
  if (!res.allowed) throw new Error(`403: ${res.reason}`);
  return res.user;
}
