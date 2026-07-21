/**
 * Matriz de permisos de Castresana OS.
 * Única fuente de verdad: la UI, los guards y (en producción) las
 * security rules de Firestore se derivan de aquí.
 */

import type { Permission, PermissionAction, PermissionArea, RoleDefinition, RoleId } from "@/types/roles";

const ALL_AREAS: PermissionArea[] = [
  "pulso", "conversaciones", "cartera", "oportunidades", "media", "portales",
  "archivo", "resultados", "autopiloto", "inteligencia", "ajustes", "usuarios", "sistema",
];

const p = (area: PermissionArea, ...actions: PermissionAction[]): Permission[] =>
  actions.map((a) => `${area}:${a}` as Permission);

const everything = (...actions: PermissionAction[]): Permission[] =>
  ALL_AREAS.flatMap((area) => p(area, ...actions));

export const ROLE_DEFINITIONS: Record<RoleId, RoleDefinition> = {
  "super-admin": {
    id: "super-admin",
    name: "Super admin",
    description: "Control total del sistema, incluida la administración técnica y multi-agencia.",
    scope: "internal",
    permissions: everything("view", "edit", "export", "automate", "share", "admin"),
  },
  director: {
    id: "director",
    name: "Director/a",
    description: "Dirige la agencia: todo el negocio, usuarios y configuración. Sin administración técnica profunda.",
    scope: "internal",
    permissions: [
      ...everything("view"),
      ...p("cartera", "edit", "export", "share"),
      ...p("oportunidades", "edit", "export", "share", "automate"),
      ...p("conversaciones", "edit", "share"),
      ...p("media", "edit", "export", "share"),
      ...p("portales", "edit", "share"),
      ...p("archivo", "edit", "export", "share"),
      ...p("resultados", "export"),
      ...p("autopiloto", "edit", "automate"),
      ...p("inteligencia", "edit"),
      ...p("ajustes", "edit"),
      ...p("usuarios", "edit", "admin"),
    ],
  },
  agente: {
    id: "agente",
    name: "Agente",
    description: "Opera el día a día: cartera, leads, conversaciones, media y portales de sus clientes.",
    scope: "internal",
    permissions: [
      ...p("pulso", "view"),
      ...p("conversaciones", "view", "edit", "share"),
      ...p("cartera", "view", "edit", "export", "share"),
      ...p("oportunidades", "view", "edit", "share"),
      ...p("media", "view", "edit", "export", "share"),
      ...p("portales", "view", "edit", "share"),
      ...p("archivo", "view", "edit"),
      ...p("resultados", "view"),
      ...p("inteligencia", "view"),
      ...p("autopiloto", "view"),
    ],
  },
  asistente: {
    id: "asistente",
    name: "Asistente",
    description: "Apoyo operativo: prepara material y documentos, agenda visitas. No exporta ni comparte fuera.",
    scope: "internal",
    permissions: [
      ...p("pulso", "view"),
      ...p("conversaciones", "view", "edit"),
      ...p("cartera", "view", "edit"),
      ...p("oportunidades", "view"),
      ...p("media", "view", "edit"),
      ...p("archivo", "view", "edit"),
    ],
  },
  colaborador: {
    id: "colaborador",
    name: "Colaborador externo",
    description: "Fotógrafo, homestager u otra agencia: solo ve lo que se le comparte, sin datos de clientes.",
    scope: "internal",
    permissions: [...p("cartera", "view"), ...p("media", "view", "edit")],
  },
  "propietario-portal": {
    id: "propietario-portal",
    name: "Propietario (portal)",
    description: "Acceso externo de solo lectura a la comercialización de su inmueble vía enlace privado.",
    scope: "external",
    permissions: [...p("portales", "view")],
  },
  "cliente-portal": {
    id: "cliente-portal",
    name: "Cliente (portal)",
    description: "Acceso externo a su selección, visitas y documentos vía enlace privado.",
    scope: "external",
    permissions: [...p("portales", "view", "share")],
  },
};

export function can(role: RoleId, permission: Permission): boolean {
  return ROLE_DEFINITIONS[role].permissions.includes(permission);
}

export function permissionsFor(role: RoleId): Permission[] {
  return [...ROLE_DEFINITIONS[role].permissions];
}

/** Roles internos ordenados por nivel de acceso (para selects de invitación). */
export const INTERNAL_ROLES: RoleId[] = ["super-admin", "director", "agente", "asistente", "colaborador"];
