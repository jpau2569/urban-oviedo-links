/**
 * Gestión de tokens de acceso a los portales (enlace mágico).
 *
 * Modelo de seguridad:
 *  - El token es un identificador opaco largo (128 bits) — imposible de adivinar.
 *  - Vive en `portalTokens/{token}` con rol, sujeto, expiración y revocación.
 *  - Toda página de portal lo valida en servidor antes de renderizar nada.
 *  - Solo lectura por defecto; las escrituras (interés, visitas) pasan por
 *    endpoints que re-validan el token y sus scopes.
 *
 * En producción (Firestore):
 *  - creación desde el panel interno del agente ("Compartir portal con…"),
 *  - regla de seguridad: los documentos de portal solo se leen vía servidor
 *    (Route Handlers / Server Components), nunca directamente desde el cliente.
 */

import type { PortalAccessToken, PortalRole, TokenValidation } from "@/types/portal";
import { mockTokens } from "./mockData";

const DEFAULT_TTL_DAYS = 30;

/** Genera un token opaco con entropía suficiente para enlace mágico. */
export function generateTokenValue(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Crea el documento de token (persistencia a cargo del repositorio). */
export function createAccessToken(
  role: PortalRole,
  subjectId: string,
  ttlDays: number = DEFAULT_TTL_DAYS,
): PortalAccessToken {
  const now = new Date();
  const expires = new Date(now.getTime() + ttlDays * 24 * 60 * 60 * 1000);
  return {
    token: generateTokenValue(),
    role,
    subjectId,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    revoked: false,
    accessCount: 0,
  };
}

export function isExpired(access: PortalAccessToken, at: Date = new Date()): boolean {
  return new Date(access.expiresAt).getTime() <= at.getTime();
}

/**
 * Valida un token contra el almacén.
 * Cloud-first: busca en la tabla castresana_os (kind=token) de Supabase;
 * si la nube no responde, cae al diccionario local sin interrumpir acceso.
 */
export async function validateToken(token: string): Promise<TokenValidation> {
  let access = null;
  try {
    const { fetchCloudToken } = await import("./supabaseRepository");
    access = await fetchCloudToken(token);
  } catch {
    /* nube inaccesible → respaldo local */
  }
  access = access ?? mockTokens[token] ?? null;
  if (!access) return { status: "not_found" };
  if (access.revoked) return { status: "revoked", access };
  if (isExpired(access)) return { status: "expired", access };
  return { status: "ok", access };
}

/** Días restantes de validez (para el aviso de acceso seguro). */
export function daysUntilExpiry(expiresAt: string): number {
  const ms = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}
