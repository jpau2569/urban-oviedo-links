/**
 * Matriz de permisos por rol de portal.
 *
 * Filosofía: solo-lectura por defecto. Las pocas acciones de escritura del
 * cliente (marcar interés, pedir visita) son explícitas. El propietario es
 * 100% lectura en esta fase; `approve:actions` queda declarado para la
 * ampliación futura (aprobar cambio de precio, campañas…).
 */

import type { PortalAccessToken, PortalPermission, PortalRole } from "@/types/portal";

export const ROLE_PERMISSIONS: Record<PortalRole, readonly PortalPermission[]> = {
  client: [
    "view:properties",
    "view:visits",
    "view:messages",
    "view:documents",
    "mark:interest",
    "request:visit",
    "download:documents",
  ],
  owner: [
    "view:properties",
    "view:visits",
    "view:messages",
    "view:documents",
    "view:metrics",
    "view:timeline",
    "download:documents",
    // "approve:actions" — se activará por token cuando llegue la fase de aprobaciones.
  ],
} as const;

/** Permisos efectivos: los del rol, o los scopes explícitos del token si existen. */
export function effectivePermissions(access: PortalAccessToken): PortalPermission[] {
  return [...(access.scopes ?? ROLE_PERMISSIONS[access.role])];
}

export function can(permissions: readonly PortalPermission[], perm: PortalPermission): boolean {
  return permissions.includes(perm);
}
