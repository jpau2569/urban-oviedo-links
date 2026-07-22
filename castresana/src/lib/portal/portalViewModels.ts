/**
 * View-models de portal: transforman datos crudos (repo) en estructuras
 * listas para renderizar. Toda la lógica de composición vive aquí para que
 * las páginas sean triviales y los componentes puramente presentacionales.
 */

import type {
  ClientPortalSession,
  CommunicationSummaryEntry,
  NextStep,
  OwnerMetrics,
  OwnerPortalSession,
  PortalDocument,
  PortalProperty,
  PortalTimelineEvent,
  PortalVisit,
  SharedPropertySelection,
} from "@/types/portal";
import { validateToken } from "./accessTokens";
import { effectivePermissions } from "./portalPermissions";
import { AGENT_MARTA } from "./mockData";
import { repo } from "./portalQueries";

/* ─────────────── Resultado de resolución de portal ─────────────── */

export type PortalResolution<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "not_found" | "expired" | "revoked" | "wrong_role" };

/* ─────────────── Cliente ─────────────── */

export interface RecommendationVM {
  selection: SharedPropertySelection;
  property: PortalProperty;
}

export interface ClientPortalVM {
  session: ClientPortalSession;
  recommendations: RecommendationVM[];
  /** Nuevas desde el último acceso (para el hero de bienvenida). */
  freshCount: number;
  favoriteCount: number;
  visits: PortalVisit[];
  upcomingVisits: PortalVisit[];
  communications: CommunicationSummaryEntry[];
  nextSteps: NextStep[];
  documents: PortalDocument[];
  /** Índice propertyId → propiedad para visitas/documentos. */
  propertyIndex: Record<string, PortalProperty>;
}

export async function resolveClientPortal(token: string): Promise<PortalResolution<ClientPortalVM>> {
  const validation = await validateToken(token);
  if (validation.status === "not_found") return { ok: false, reason: "not_found" };
  if (validation.status === "expired") return { ok: false, reason: "expired" };
  if (validation.status === "revoked") return { ok: false, reason: "revoked" };
  const access = validation.access;
  if (access.role !== "client") return { ok: false, reason: "wrong_role" };

  const client = await repo.getClient(access.subjectId);
  if (!client) return { ok: false, reason: "not_found" };

  const session: ClientPortalSession = {
    token: access.token,
    clientId: client.id,
    clientName: client.name,
    firstName: client.firstName,
    agent: AGENT_MARTA,
    searchSummary: client.search,
    permissions: effectivePermissions(access),
    expiresAt: access.expiresAt,
  };

  const selections = await repo.getSelectionsForClient(client.id);
  const recommendations: RecommendationVM[] = [];
  const propertyIndex: Record<string, PortalProperty> = {};
  for (const selection of selections) {
    const property = await repo.getProperty(selection.propertyId);
    if (property) {
      recommendations.push({ selection, property });
      propertyIndex[property.id] = property;
    }
  }

  const visits = await repo.getVisitsForClient(client.id);
  for (const v of visits) {
    if (!propertyIndex[v.propertyId]) {
      const p = await repo.getProperty(v.propertyId);
      if (p) propertyIndex[p.id] = p;
    }
  }
  const today = new Date().toISOString().slice(0, 10);
  const upcomingVisits = visits.filter(
    (v) => v.date >= today && (v.status === "confirmada" || v.status === "propuesta"),
  );

  return {
    ok: true,
    data: {
      session,
      recommendations,
      freshCount: recommendations.filter((r) => r.selection.status === "nueva").length,
      favoriteCount: recommendations.filter((r) => r.selection.favorite).length,
      visits,
      upcomingVisits,
      communications: await repo.getCommunications(client.id),
      nextSteps: await repo.getNextSteps(client.id),
      documents: await repo.getDocumentsFor("client", Object.keys(propertyIndex)),
      propertyIndex,
    },
  };
}

/** Detalle de una propiedad dentro del portal cliente. */
export interface ClientPropertyDetailVM {
  session: ClientPortalSession;
  property: PortalProperty;
  selection: SharedPropertySelection | null;
  visitsForProperty: PortalVisit[];
  documents: PortalDocument[];
}

export async function resolveClientPropertyDetail(
  token: string,
  propertyId: string,
): Promise<PortalResolution<ClientPropertyDetailVM>> {
  const base = await resolveClientPortal(token);
  if (!base.ok) return base;
  const property = base.data.propertyIndex[propertyId] ?? (await repo.getProperty(propertyId));
  // Seguridad: solo propiedades explícitamente compartidas con este cliente.
  const selection = base.data.recommendations.find((r) => r.property.id === propertyId)?.selection ?? null;
  if (!property || !selection) return { ok: false, reason: "not_found" };
  return {
    ok: true,
    data: {
      session: base.data.session,
      property,
      selection,
      visitsForProperty: base.data.visits.filter((v) => v.propertyId === propertyId),
      documents: base.data.documents.filter((d) => d.propertyId === propertyId),
    },
  };
}

/* ─────────────── Propietario ─────────────── */

export interface OwnerFunnelStep {
  label: string;
  value: number;
}

export interface OwnerPortalVM {
  session: OwnerPortalSession;
  property: PortalProperty;
  metrics: OwnerMetrics;
  /** Embudo comercial derivado de las métricas. */
  funnel: OwnerFunnelStep[];
  visits: PortalVisit[];
  upcomingVisits: PortalVisit[];
  completedVisits: PortalVisit[];
  timeline: PortalTimelineEvent[];
  communications: CommunicationSummaryEntry[];
  documents: PortalDocument[];
}

export async function resolveOwnerPortal(token: string): Promise<PortalResolution<OwnerPortalVM>> {
  const validation = await validateToken(token);
  if (validation.status === "not_found") return { ok: false, reason: "not_found" };
  if (validation.status === "expired") return { ok: false, reason: "expired" };
  if (validation.status === "revoked") return { ok: false, reason: "revoked" };
  const access = validation.access;
  if (access.role !== "owner") return { ok: false, reason: "wrong_role" };

  const owner = await repo.getOwner(access.subjectId);
  if (!owner) return { ok: false, reason: "not_found" };
  const propertyId = owner.propertyIds[0];
  if (!propertyId) return { ok: false, reason: "not_found" };
  const property = await repo.getProperty(propertyId);
  const metrics = await repo.getOwnerMetrics(propertyId);
  if (!property || !metrics) return { ok: false, reason: "not_found" };

  const session: OwnerPortalSession = {
    token: access.token,
    ownerId: owner.id,
    ownerName: owner.name,
    firstName: owner.firstName,
    agent: AGENT_MARTA,
    propertyIds: [...owner.propertyIds],
    permissions: effectivePermissions(access),
    expiresAt: access.expiresAt,
  };

  const visits = await repo.getVisitsForProperty(propertyId);
  const today = new Date().toISOString().slice(0, 10);

  return {
    ok: true,
    data: {
      session,
      property,
      metrics,
      funnel: [
        { label: "Visualizaciones", value: metrics.views },
        { label: "Favoritos", value: metrics.favorites },
        { label: "Contactos", value: metrics.contacts },
        { label: "Leads cualificados", value: metrics.qualifiedLeads },
        { label: "Visitas", value: metrics.visitsDone + metrics.visitsPending },
      ],
      visits,
      upcomingVisits: visits.filter((v) => v.date >= today && v.status !== "cancelada" && v.status !== "realizada"),
      completedVisits: visits.filter((v) => v.status === "realizada"),
      timeline: await repo.getTimelineForProperty(propertyId),
      communications: await repo.getCommunications(owner.id),
      documents: await repo.getDocumentsFor("owner", owner.propertyIds ? [...owner.propertyIds] : undefined),
    },
  };
}

/* ─────────────── Formateadores compartidos ─────────────── */

export const fmtPrice = (n: number): string => n.toLocaleString("es-ES") + " €";

export const fmtDate = (iso: string): string =>
  new Date(iso.length === 10 ? iso + "T12:00:00" : iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
  });

export const fmtDateShort = (iso: string): string =>
  new Date(iso.length === 10 ? iso + "T12:00:00" : iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });

export const fmtWeekday = (iso: string): string =>
  new Date(iso + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
