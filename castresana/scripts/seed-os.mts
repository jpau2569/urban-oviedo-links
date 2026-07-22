/**
 * Genera el seed de la tabla castresana_os desde los datos mock del OS.
 * Uso: npx tsx scripts/seed-os.mts > seed.json
 * Cada fila: { id: "kind:rawId", kind, data } — el SupabaseRepository lee por kind.
 */
import {
  AGENT_MARTA,
  mockClients,
  mockCommunications,
  mockDocuments,
  mockNextSteps,
  mockOwnerMetrics,
  mockOwners,
  mockProperties,
  mockSelections,
  mockTimeline,
  mockTokens,
  mockVisits,
} from "../src/lib/portal/mockData";

const rows: { id: string; kind: string; data: unknown }[] = [];
const add = (kind: string, rawId: string, data: unknown) => rows.push({ id: `${kind}:${rawId}`, kind, data });

Object.values(mockProperties).forEach((p) => add("property", p.id, p));
Object.values(mockClients).forEach((c) => add("portal-client", c.id, c));
Object.values(mockOwners).forEach((o) => add("owner", o.id, o));
Object.values(mockTokens).forEach((t) => add("token", t.token, t));
mockSelections.forEach((s) => add("selection", s.id, s));
mockVisits.forEach((v) => add("visit", v.id, v));
mockTimeline.forEach((e) => add("timeline", e.id, { ...e, propertyId: "p-012" }));
Object.entries(mockCommunications).forEach(([subjectId, entries]) =>
  entries.forEach((e) => add("communication", e.id, { ...e, subjectId })),
);
Object.entries(mockNextSteps).forEach(([clientId, steps]) =>
  steps.forEach((s) => add("nextstep", s.id, { ...s, clientId })),
);
mockDocuments.forEach((d) => add("document", d.id, d));
Object.values(mockOwnerMetrics).forEach((m) => add("owner-metrics", m.propertyId, m));
add("agent", "marta", AGENT_MARTA);

process.stdout.write(JSON.stringify(rows));
