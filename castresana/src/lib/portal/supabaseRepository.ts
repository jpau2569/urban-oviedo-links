/**
 * Repositorio Supabase del OS — implementación real de PortalRepository.
 *
 * Lee la tabla `castresana_os` (una fila por entidad, payload jsonb) por
 * REST desde el servidor. Caché en memoria por kind con TTL corto para que
 * una página no dispare decenas de peticiones.
 *
 * Config por entorno (con valores del proyecto real como respaldo):
 *   SUPABASE_URL, SUPABASE_ANON_KEY
 */

import type {
  CommunicationSummaryEntry,
  NextStep,
  OwnerMetrics,
  PortalAccessToken,
  PortalDocument,
  PortalProperty,
  PortalTimelineEvent,
  PortalVisit,
  SharedPropertySelection,
} from "@/types/portal";
import type { MockClient, MockOwner } from "./mockData";
import type { PortalRepository } from "./portalQueries";

const URL_ = process.env.SUPABASE_URL ?? "https://qwljkqisnupjgzbdyzym.supabase.co";
const KEY =
  process.env.SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3bGprcWlzbnVwamd6YmR5enltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MzE4MjUsImV4cCI6MjA5NTIwNzgyNX0.Sll2rYf1uYR_Eg3fDH1TkvHKNQFiZiqC7AcZl4Dc5w4";

const TTL_MS = 10_000;
const TIMEOUT_MS = 3_000;

const cache = new Map<string, { at: number; rows: unknown[] }>();

async function fetchKind<T>(kind: string): Promise<T[]> {
  const hit = cache.get(kind);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.rows as T[];
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      `${URL_}/rest/v1/castresana_os?kind=eq.${encodeURIComponent(kind)}&select=data`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` }, signal: ctl.signal, cache: "no-store" },
    );
    if (!res.ok) throw new Error(`castresana_os ${kind}: HTTP ${res.status}`);
    const rows = ((await res.json()) as { data: T }[]).map((r) => r.data);
    cache.set(kind, { at: Date.now(), rows });
    return rows;
  } finally {
    clearTimeout(timer);
  }
}

/** Token de acceso desde la nube (usado por accessTokens con fallback). */
export async function fetchCloudToken(token: string): Promise<PortalAccessToken | null> {
  const rows = await fetchKind<PortalAccessToken>("token");
  return rows.find((t) => t.token === token) ?? null;
}

export const supabaseRepository: PortalRepository = {
  async getClient(clientId) {
    return (await fetchKind<MockClient>("portal-client")).find((c) => c.id === clientId) ?? null;
  },
  async getOwner(ownerId) {
    return (await fetchKind<MockOwner>("owner")).find((o) => o.id === ownerId) ?? null;
  },
  async getProperty(propertyId) {
    return (await fetchKind<PortalProperty>("property")).find((p) => p.id === propertyId) ?? null;
  },
  async getSelectionsForClient(clientId) {
    return (await fetchKind<SharedPropertySelection>("selection"))
      .filter((s) => s.clientId === clientId)
      .sort((a, b) => b.sharedAt.localeCompare(a.sharedAt));
  },
  async getVisitsForClient(clientId) {
    return (await fetchKind<PortalVisit>("visit"))
      .filter((v) => v.clientId === clientId)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  },
  async getVisitsForProperty(propertyId) {
    return (await fetchKind<PortalVisit>("visit"))
      .filter((v) => v.propertyId === propertyId)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  },
  async getTimelineForProperty(propertyId) {
    return (await fetchKind<PortalTimelineEvent & { propertyId?: string }>("timeline"))
      .filter((e) => e.propertyId === propertyId)
      .sort((a, b) => b.date.localeCompare(a.date));
  },
  async getCommunications(subjectId) {
    return (await fetchKind<CommunicationSummaryEntry & { subjectId?: string }>("communication"))
      .filter((c) => c.subjectId === subjectId)
      .sort((a, b) => b.date.localeCompare(a.date));
  },
  async getNextSteps(clientId) {
    return (await fetchKind<NextStep & { clientId?: string }>("nextstep")).filter(
      (n) => n.clientId === clientId,
    );
  },
  async getDocumentsFor(audience, subjectPropertyIds) {
    return (await fetchKind<PortalDocument>("document")).filter(
      (d) =>
        d.audience.includes(audience) &&
        (!d.propertyId || !subjectPropertyIds || subjectPropertyIds.includes(d.propertyId) || audience === "client"),
    );
  },
  async getOwnerMetrics(propertyId) {
    return (await fetchKind<OwnerMetrics>("owner-metrics")).find((m) => m.propertyId === propertyId) ?? null;
  },
};
