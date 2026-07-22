/**
 * Módulo Resultados — datos mock con la forma de los agregados reales.
 * En producción estos agregados se calculan con Cloud Functions programadas
 * y se guardan en tenants/{id}/analytics/{period} para lecturas baratas.
 */

import type {
  AgentPerformance,
  BusinessKpis,
  ChannelPerformance,
  MediaPieceUsage,
  PropertyInterestRow,
  WeeklyPoint,
} from "@/types/analytics";

export const KPIS: BusinessKpis = {
  periodLabel: "Últimos 30 días",
  newLeads: 47,
  hotLeads: 9,
  avgResponseMinutes: 11,
  visitsDone: 21,
  closings: 3,
  followUpRate: 86,
};

export const LEADS_WEEKLY: WeeklyPoint[] = [
  { label: "S1", value: 8 },
  { label: "S2", value: 12 },
  { label: "S3", value: 9 },
  { label: "S4", value: 18 },
];

export const RESPONSE_WEEKLY: WeeklyPoint[] = [
  { label: "S1", value: 19 },
  { label: "S2", value: 14 },
  { label: "S3", value: 12 },
  { label: "S4", value: 8 },
];

export const AGENT_PERFORMANCE: AgentPerformance[] = [
  { userId: "u-1", name: "Marta Castresana", initials: "MC", leadsAttended: 21, avgResponseMinutes: 7, visitsDone: 11, closings: 2, followUpRate: 94 },
  { userId: "u-2", name: "Diego Fernández", initials: "DF", leadsAttended: 16, avgResponseMinutes: 13, visitsDone: 7, closings: 1, followUpRate: 84 },
  { userId: "u-3", name: "Sara Llanos", initials: "SL", leadsAttended: 10, avgResponseMinutes: 16, visitsDone: 3, closings: 0, followUpRate: 71 },
];

export const CHANNEL_PERFORMANCE: ChannelPerformance[] = [
  { channel: "whatsapp", label: "WhatsApp", leads: 19, visits: 11, closings: 2 },
  { channel: "web", label: "Web / Portales", leads: 14, visits: 6, closings: 1 },
  { channel: "reels", label: "Instagram", leads: 8, visits: 2, closings: 0 },
  { channel: "telefono", label: "Teléfono", leads: 4, visits: 2, closings: 0 },
  { channel: "oficina", label: "Oficina", leads: 2, visits: 0, closings: 0 },
];

export const PROPERTY_INTEREST: PropertyInterestRow[] = [
  { propertyId: "p-001", ref: "AC-0001", title: "Ático reformado con terraza sobre Uría", views: 480, leads: 12, visits: 6 },
  { propertyId: "p-012", ref: "AC-0012", title: "Chalet de piedra con finca en Latores", views: 412, leads: 9, visits: 3 },
  { propertyId: "p-002", ref: "AC-0007", title: "Piso señorial junto al Campo San Francisco", views: 301, leads: 7, visits: 4 },
  { propertyId: "p-004", ref: "AC-0019", title: "Ático dúplex con dos terrazas en La Ería", views: 268, leads: 6, visits: 3 },
];

export const MEDIA_USAGE: MediaPieceUsage[] = [
  { label: "Reel lanzamiento Uría", channel: "reels", uses: 14 },
  { label: "Paquete WhatsApp AC-0001", channel: "whatsapp", uses: 11 },
  { label: "Ficha visual PDF AC-0001", channel: "client-portal", uses: 8 },
  { label: "Vídeo dron Latores", channel: "shorts", uses: 6 },
];
