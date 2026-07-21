/**
 * Castresana OS — analytics de negocio, auditoría y salud del sistema.
 */

import type { PublishingChannelId } from "./media";

/** KPIs de cabecera del módulo Resultados. */
export interface BusinessKpis {
  periodLabel: string;
  newLeads: number;
  hotLeads: number;
  avgResponseMinutes: number;
  visitsDone: number;
  closings: number;
  /** % de leads con seguimiento activo (< 72 h desde último contacto). */
  followUpRate: number;
}

export interface WeeklyPoint {
  label: string;
  value: number;
}

export interface AgentPerformance {
  userId: string;
  name: string;
  initials: string;
  leadsAttended: number;
  avgResponseMinutes: number;
  visitsDone: number;
  closings: number;
  followUpRate: number;
}

export interface ChannelPerformance {
  channel: PublishingChannelId | "telefono" | "oficina";
  label: string;
  leads: number;
  visits: number;
  closings: number;
}

export interface PropertyInterestRow {
  propertyId: string;
  ref: string;
  title: string;
  views: number;
  leads: number;
  visits: number;
}

export interface MediaPieceUsage {
  label: string;
  channel: PublishingChannelId;
  uses: number;
}

/* ── Auditoría ── */

export type AuditKind =
  | "auth"
  | "propiedad"
  | "lead"
  | "visita"
  | "export"
  | "portal"
  | "ajustes"
  | "automatizacion"
  | "error";

export interface AuditEvent {
  id: string;
  at: string;
  kind: AuditKind;
  actor: string;
  summary: string;
  severity: "info" | "aviso" | "critico";
}

/* ── Salud del sistema ── */

export interface SystemService {
  id: string;
  name: string;
  status: "operativo" | "degradado" | "caido";
  latencyMs: number;
  note?: string;
}

export interface QueueJobSummary {
  id: string;
  queue: "render" | "notificaciones" | "sincronizacion" | "informes";
  label: string;
  status: "en-cola" | "procesando" | "completado" | "fallido";
  at: string;
}
