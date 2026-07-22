/**
 * Datos mock del OS: equipo, invitaciones y configuración del tenant.
 * Forma idéntica a los documentos tenants/{id}/users y /settings/*.
 */

import type { OsUser, UserInvitation } from "@/types/roles";
import type {
  AgencyProfile,
  AISettings,
  AutomationRuleConfig,
  ChannelConfig,
  IntegrationStatus,
  NotificationPrefs,
} from "@/types/settings";

const daysAgo = (n: number): string => new Date(Date.now() - n * 86400_000).toISOString();

export const OS_USERS: OsUser[] = [
  { id: "u-1", name: "Marta Castresana", initials: "MC", email: "marta@asesoriacastresana.com", role: "super-admin", active: true, lastActiveAt: daysAgo(0), onboardedAt: daysAgo(180) },
  { id: "u-2", name: "Diego Fernández", initials: "DF", email: "diego@asesoriacastresana.com", role: "agente", active: true, lastActiveAt: daysAgo(0), onboardedAt: daysAgo(120) },
  { id: "u-3", name: "Sara Llanos", initials: "SL", email: "sara@asesoriacastresana.com", role: "asistente", active: true, lastActiveAt: daysAgo(1), onboardedAt: daysAgo(60) },
  { id: "u-4", name: "Foto Norte (externos)", initials: "FN", email: "estudio@fotonorte.es", role: "colaborador", active: false, lastActiveAt: daysAgo(21), onboardedAt: daysAgo(90) },
];

export const OS_INVITATIONS: UserInvitation[] = [
  { id: "inv-1", email: "nuevo.agente@asesoriacastresana.com", role: "agente", invitedBy: "Marta Castresana", invitedAt: daysAgo(2), status: "pendiente" },
];

export const AGENCY_PROFILE: AgencyProfile = {
  legalName: "Asesoría Castresana S.L.",
  displayName: "Asesoría Castresana",
  taxId: "B-33000000",
  address: "C/ Uría 20, 2º",
  city: "Oviedo",
  postalCode: "33003",
  phone: "+34 984 000 000",
  email: "hola@asesoriacastresana.com",
  website: "https://asesoriacastresana.com",
  officeHours: "L–V 9:30–14:00 · 16:30–19:30",
};

export const CHANNELS: ChannelConfig[] = [
  { id: "whatsapp", enabled: true, handle: "+34 984 000 000" },
  { id: "reels", enabled: true, handle: "@asesoriacastresana" },
  { id: "tiktok", enabled: false, note: "Pendiente de estrategia" },
  { id: "shorts", enabled: true, handle: "Asesoría Castresana" },
  { id: "web", enabled: true, handle: "asesoriacastresana.com" },
  { id: "email", enabled: true, handle: "hola@asesoriacastresana.com" },
];

export const NOTIFICATION_PREFS: NotificationPrefs = {
  newLead: true,
  hotLeadInactivity: true,
  visitReminders: true,
  ownerWeeklyReport: true,
  exportReady: false,
  dailyDigestHour: 8,
  channels: ["push", "email"],
};

export const AI_SETTINGS: AISettings = {
  assistantName: "Vende Todo",
  tone: "premium",
  autoDraftReplies: true,
  autoScoreLeads: true,
  mediaRecommendations: true,
  humanReviewRequired: true,
  monthlyCreditBudget: 2500,
};

export const AUTOMATION_RULES: AutomationRuleConfig[] = [
  { id: "au-1", name: "Primera respuesta inmediata", trigger: "Lead nuevo por cualquier canal", action: "Borrador IA + notificación al agente asignado", enabled: true, lastRunAt: daysAgo(0), runsThisMonth: 47 },
  { id: "au-2", name: "Rescate de leads fríos", trigger: "Lead sin contacto 72 h", action: "Tarea de seguimiento + sugerencia de mensaje", enabled: true, lastRunAt: daysAgo(0), runsThisMonth: 18 },
  { id: "au-3", name: "Recordatorio de visita", trigger: "24 h antes de cada visita", action: "WhatsApp a cliente + evento en calendario", enabled: true, lastRunAt: daysAgo(1), runsThisMonth: 21 },
  { id: "au-4", name: "Informe quincenal a propietarios", trigger: "Cada 15 días por inmueble activo", action: "Métricas al portal del propietario + aviso", enabled: true, lastRunAt: daysAgo(3), runsThisMonth: 6 },
  { id: "au-5", name: "Pieza social al publicar", trigger: "Inmueble pasa a Disponible", action: "Storyboard de captación en borrador en Media Studio", enabled: false, runsThisMonth: 0 },
];

export const INTEGRATIONS: IntegrationStatus[] = [
  { id: "whatsapp-business", name: "WhatsApp Business API", category: "mensajeria", connected: true, account: "+34 984 000 000" },
  { id: "gmail", name: "Gmail", category: "productividad", connected: true, account: "hola@asesoriacastresana.com" },
  { id: "google-calendar", name: "Google Calendar", category: "productividad", connected: true, account: "Agenda visitas" },
  { id: "idealista", name: "Idealista", category: "portales", connected: false, note: "API en solicitud" },
  { id: "fotocasa", name: "Fotocasa", category: "portales", connected: false },
  { id: "firebase-storage", name: "Firebase Storage", category: "infraestructura", connected: true, account: "castresana-os.appspot.com" },
  { id: "meta-business", name: "Meta Business (IG/FB)", category: "media", connected: true, account: "@asesoriacastresana" },
  { id: "youtube", name: "YouTube", category: "media", connected: true, account: "Asesoría Castresana" },
];
