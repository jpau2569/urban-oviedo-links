/**
 * Castresana OS — configuración del tenant y preferencias.
 * Documentos bajo tenants/{id}/settings/*.
 */

import type { PublishingChannelId } from "./media";

export interface AgencyProfile {
  legalName: string;
  displayName: string;
  taxId: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  /** Horario visible en portales y firmas. */
  officeHours: string;
}

export interface ChannelConfig {
  id: PublishingChannelId;
  enabled: boolean;
  handle?: string;
  note?: string;
}

export interface NotificationPrefs {
  newLead: boolean;
  hotLeadInactivity: boolean;
  visitReminders: boolean;
  ownerWeeklyReport: boolean;
  exportReady: boolean;
  dailyDigestHour: number;
  channels: ("push" | "email" | "whatsapp")[];
}

export interface AISettings {
  assistantName: string;
  tone: "cercano" | "profesional" | "premium";
  autoDraftReplies: boolean;
  autoScoreLeads: boolean;
  mediaRecommendations: boolean;
  /** Las respuestas IA siempre se revisan antes de enviarse. */
  humanReviewRequired: boolean;
  monthlyCreditBudget: number;
}

export interface AutomationRuleConfig {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
  lastRunAt?: string;
  runsThisMonth: number;
}

export type IntegrationId =
  | "whatsapp-business"
  | "gmail"
  | "google-calendar"
  | "idealista"
  | "fotocasa"
  | "firebase-storage"
  | "meta-business"
  | "youtube";

export interface IntegrationStatus {
  id: IntegrationId;
  name: string;
  category: "mensajeria" | "portales" | "productividad" | "media" | "infraestructura";
  connected: boolean;
  account?: string;
  note?: string;
}

/** Objetivos comerciales que el onboarding pide al agente. */
export interface CommercialGoals {
  monthlyValuations: number;
  monthlyVisits: number;
  quarterlyClosings: number;
  maxResponseMinutes: number;
}
