/**
 * Castresana OS — modelo multi-tenant.
 *
 * Cada agencia es un tenant con branding, límites y datos aislados.
 * En Firestore: colección raíz `tenants/{tenantId}` y TODAS las demás
 * colecciones anidadas bajo ella (tenants/{id}/properties, /users, …),
 * de modo que las security rules aíslan por construcción.
 */

export type TenantPlanId = "estudio" | "agencia" | "grupo";

export interface TenantPlan {
  id: TenantPlanId;
  name: string;
  maxUsers: number;
  maxActiveProperties: number;
  maxStorageGb: number;
  aiCredits: number;
  features: string[];
}

export interface TenantBranding {
  displayName: string;
  /** Iniciales/monograma mientras no haya logo subido. */
  monogram: string;
  logoUrl?: string;
  /** Paleta: por defecto la de Castresana; personalizable por agencia. */
  colorPrimary: string;
  colorAccent: string;
  /** Dominio propio futuro (agencia.castresana.os). */
  customDomain?: string;
}

export interface Tenant {
  id: string;
  slug: string;
  branding: TenantBranding;
  city: string;
  country: string;
  language: "es" | "en";
  planId: TenantPlanId;
  createdAt: string;
  active: boolean;
  /** Operaciones que trabaja la agencia. */
  operations: ("venta" | "alquiler" | "obra-nueva" | "traspaso")[];
}
