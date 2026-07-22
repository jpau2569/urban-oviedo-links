/**
 * Tenancy: resolución de agencia y planes.
 *
 * Estrategia multi-tenant (modo SaaS futuro):
 *  - Datos: TODO bajo tenants/{tenantId}/... en Firestore → las security
 *    rules exigen `request.auth.token.tenantId == tenantId` (custom claim).
 *  - Resolución: subdominio (agencia.castresana.app) o dominio propio →
 *    tenantId; en desarrollo, tenant fijo.
 *  - Branding: el layout lee tenant.branding y pinta variables CSS.
 *  - Límites: el plan se comprueba en servidor al crear recursos.
 */

import type { Tenant, TenantPlan, TenantPlanId } from "@/types/tenant";

export const TENANT_PLANS: Record<TenantPlanId, TenantPlan> = {
  estudio: {
    id: "estudio",
    name: "Estudio",
    maxUsers: 3,
    maxActiveProperties: 40,
    maxStorageGb: 20,
    aiCredits: 500,
    features: ["Cartera y oportunidades", "Portales privados", "Media Studio básico"],
  },
  agencia: {
    id: "agencia",
    name: "Agencia",
    maxUsers: 10,
    maxActiveProperties: 200,
    maxStorageGb: 100,
    aiCredits: 2500,
    features: ["Todo Estudio", "Autopiloto completo", "Inteligencia comercial", "Informes a propietarios"],
  },
  grupo: {
    id: "grupo",
    name: "Grupo",
    maxUsers: 50,
    maxActiveProperties: 1000,
    maxStorageGb: 500,
    aiCredits: 12000,
    features: ["Todo Agencia", "Multi-oficina", "Dominio propio", "Soporte prioritario"],
  },
};

/** Tenant de desarrollo: la propia Asesoría Castresana. */
export const CASTRESANA_TENANT: Tenant = {
  id: "t-castresana",
  slug: "castresana",
  branding: {
    displayName: "Asesoría Castresana",
    monogram: "C",
    colorPrimary: "#191512",
    colorAccent: "#b0764f",
  },
  city: "Oviedo",
  country: "ES",
  language: "es",
  planId: "agencia",
  createdAt: "2025-01-01T00:00:00.000Z",
  active: true,
  operations: ["venta", "alquiler"],
};

/**
 * Resuelve el tenant activo. Mock: siempre Castresana.
 * Producción: por hostname (subdominio/dominio propio) con caché.
 */
export async function resolveTenant(): Promise<Tenant> {
  return CASTRESANA_TENANT;
}

export function planFor(tenant: Tenant): TenantPlan {
  return TENANT_PLANS[tenant.planId];
}
