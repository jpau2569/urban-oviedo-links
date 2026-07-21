/**
 * Capa de acceso a datos de los portales.
 *
 * `PortalRepository` es el contrato; `mockRepository` la implementación de
 * desarrollo. Para producción, crear `firestoreRepository` con la misma
 * interfaz (getDoc/getDocs sobre las colecciones homónimas) y cambiar el
 * export de `repo` — las páginas y view-models no se tocan.
 */

import type {
  CommunicationSummaryEntry,
  NextStep,
  OwnerMetrics,
  PortalDocument,
  PortalProperty,
  PortalTimelineEvent,
  PortalVisit,
  SharedPropertySelection,
} from "@/types/portal";
import type { MockClient, MockOwner } from "./mockData";
import {
  mockClients,
  mockCommunications,
  mockDocuments,
  mockNextSteps,
  mockOwnerMetrics,
  mockOwners,
  mockProperties,
  mockSelections,
  mockTimeline,
  mockVisits,
} from "./mockData";

export interface PortalRepository {
  getClient(clientId: string): Promise<MockClient | null>;
  getOwner(ownerId: string): Promise<MockOwner | null>;
  getProperty(propertyId: string): Promise<PortalProperty | null>;
  getSelectionsForClient(clientId: string): Promise<SharedPropertySelection[]>;
  getVisitsForClient(clientId: string): Promise<PortalVisit[]>;
  getVisitsForProperty(propertyId: string): Promise<PortalVisit[]>;
  getTimelineForProperty(propertyId: string): Promise<PortalTimelineEvent[]>;
  getCommunications(subjectId: string): Promise<CommunicationSummaryEntry[]>;
  getNextSteps(clientId: string): Promise<NextStep[]>;
  getDocumentsFor(audience: "client" | "owner", subjectPropertyIds?: string[]): Promise<PortalDocument[]>;
  getOwnerMetrics(propertyId: string): Promise<OwnerMetrics | null>;
}

const mockRepository: PortalRepository = {
  async getClient(clientId) {
    return mockClients[clientId] ?? null;
  },
  async getOwner(ownerId) {
    return mockOwners[ownerId] ?? null;
  },
  async getProperty(propertyId) {
    return mockProperties[propertyId] ?? null;
  },
  async getSelectionsForClient(clientId) {
    return mockSelections
      .filter((s) => s.clientId === clientId)
      .sort((a, b) => b.sharedAt.localeCompare(a.sharedAt));
  },
  async getVisitsForClient(clientId) {
    return mockVisits
      .filter((v) => v.clientId === clientId)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  },
  async getVisitsForProperty(propertyId) {
    return mockVisits
      .filter((v) => v.propertyId === propertyId)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  },
  async getTimelineForProperty(propertyId) {
    // Mock: un único timeline; en Firestore, subcolección properties/{id}/timeline.
    return propertyId === "p-012"
      ? [...mockTimeline].sort((a, b) => b.date.localeCompare(a.date))
      : [];
  },
  async getCommunications(subjectId) {
    return (mockCommunications[subjectId] ?? []).slice().sort((a, b) => b.date.localeCompare(a.date));
  },
  async getNextSteps(clientId) {
    return mockNextSteps[clientId] ?? [];
  },
  async getDocumentsFor(audience, subjectPropertyIds) {
    return mockDocuments.filter(
      (d) =>
        d.audience.includes(audience) &&
        (!d.propertyId || !subjectPropertyIds || subjectPropertyIds.includes(d.propertyId) ||
          // los documentos generales del cliente (sin propertyId) siempre pasan;
          // los de propiedad se muestran si la propiedad le fue compartida
          audience === "client"),
    );
  },
  async getOwnerMetrics(propertyId) {
    return mockOwnerMetrics[propertyId] ?? null;
  },
};

/** Repositorio activo. Cambiar aquí a `firestoreRepository` en producción. */
export const repo: PortalRepository = mockRepository;
