/**
 * Castresana OS — roles y permisos.
 *
 * Modelo área:acción — cada permiso es "area:accion" (p. ej. "cartera:edit").
 * Los roles internos operan el OS; los externos (portal) solo ven su espacio.
 */

export type RoleId =
  | "super-admin"
  | "director"
  | "agente"
  | "asistente"
  | "colaborador"
  | "propietario-portal"
  | "cliente-portal";

export type PermissionArea =
  | "pulso" // dashboard
  | "conversaciones" // inbox
  | "cartera" // properties
  | "oportunidades" // leads
  | "media" // media studio
  | "portales"
  | "archivo" // documents
  | "resultados" // analytics
  | "autopiloto" // automation
  | "inteligencia" // AI
  | "ajustes"
  | "usuarios"
  | "sistema"; // admin / torre de control

export type PermissionAction = "view" | "edit" | "export" | "automate" | "share" | "admin";

export type Permission = `${PermissionArea}:${PermissionAction}`;

export interface RoleDefinition {
  id: RoleId;
  name: string;
  description: string;
  /** internal = opera el OS; external = solo su portal privado. */
  scope: "internal" | "external";
  permissions: Permission[];
}

/** Usuario del OS (colección users del tenant). */
export interface OsUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: RoleId;
  active: boolean;
  lastActiveAt: string;
  /** Vacío hasta que el usuario complete el onboarding. */
  onboardedAt?: string;
}

export interface UserInvitation {
  id: string;
  email: string;
  role: RoleId;
  invitedBy: string;
  invitedAt: string;
  status: "pendiente" | "aceptada" | "caducada";
}
