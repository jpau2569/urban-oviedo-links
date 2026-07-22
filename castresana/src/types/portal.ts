/**
 * Tipos del ecosistema de portales externos de Castresana.
 *
 * Dos audiencias:
 *  - Cliente (comprador / demandante): escaparate privado y seguimiento.
 *  - Propietario (vendedor / captación): transparencia comercial.
 *
 * Los tipos están pensados para mapear 1:1 con documentos de Firestore
 * (ids string, fechas ISO string para serialización server → client).
 */

/* ─────────────────────────── Acceso y sesiones ─────────────────────────── */

export type PortalRole = "client" | "owner";

export type PortalPermission =
  | "view:properties"
  | "view:visits"
  | "view:messages"
  | "view:documents"
  | "view:metrics"
  | "view:timeline"
  | "mark:interest"
  | "request:visit"
  | "download:documents"
  /** Reservado para fase futura: el propietario aprueba cambios (precio, marketing…). */
  | "approve:actions";

/** Token de acceso privado (enlace mágico). Documento en `portalTokens/{token}`. */
export interface PortalAccessToken {
  token: string;
  role: PortalRole;
  /** clientId u ownerId según el rol. */
  subjectId: string;
  createdAt: string;
  /** ISO — pasado este instante el enlace queda inválido. */
  expiresAt: string;
  revoked: boolean;
  /** Permisos concedidos; si se omite se aplican los del rol. */
  scopes?: PortalPermission[];
  /** Auditoría ligera. */
  lastAccessAt?: string;
  accessCount?: number;
}

export type TokenValidation =
  | { status: "ok"; access: PortalAccessToken }
  | { status: "expired"; access: PortalAccessToken }
  | { status: "revoked"; access: PortalAccessToken }
  | { status: "not_found" };

/** Agente de Castresana visible en el portal (concierge asignado). */
export interface PortalAgent {
  name: string;
  role: string;
  phone: string;
  email: string;
  /** Iniciales para el avatar (sin fotos de terceros). */
  initials: string;
}

/** Sesión resuelta para un cliente demandante. */
export interface ClientPortalSession {
  token: string;
  clientId: string;
  clientName: string;
  /** Nombre de pila para saludos ("Lucía"). */
  firstName: string;
  agent: PortalAgent;
  /** Resumen legible de su búsqueda activa. */
  searchSummary: ClientSearchSummary;
  permissions: PortalPermission[];
  expiresAt: string;
}

export interface ClientSearchSummary {
  operation: "compra" | "alquiler";
  propertyTypes: string[];
  zones: string[];
  budgetMax: number;
  bedroomsMin?: number;
  mustHaves: string[];
  updatedAt: string;
}

/** Sesión resuelta para un propietario. */
export interface OwnerPortalSession {
  token: string;
  ownerId: string;
  ownerName: string;
  firstName: string;
  agent: PortalAgent;
  /** Inmuebles del propietario visibles en el portal. */
  propertyIds: string[];
  permissions: PortalPermission[];
  expiresAt: string;
}

/* ─────────────────────────── Propiedades ─────────────────────────── */

export type PropertyOperation = "venta" | "alquiler";
export type PropertyStatus = "disponible" | "reservado" | "vendido" | "alquilado";

/** Vista pública/portal de un inmueble (subset seguro del Property interno). */
export interface PortalProperty {
  id: string;
  ref: string;
  title: string;
  operation: PropertyOperation;
  status: PropertyStatus;
  price: number;
  location: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  highlights: string[];
  description: string;
  videoUrl?: string;
  /** Tono cálido para el arte de la tarjeta (sin fotos externas en mock). */
  accent: "walnut" | "copper" | "olive" | "slate";
  publishedAt: string;
}

/** Estado de una propiedad compartida con un cliente concreto. */
export type SelectionStatus = "nueva" | "vista" | "interesa" | "descartada";

/** Documento `sharedSelections/{id}`: el agente comparte un inmueble con un cliente. */
export interface SharedPropertySelection {
  id: string;
  clientId: string;
  propertyId: string;
  sharedAt: string;
  /** Nota personal del agente: por qué encaja. */
  agentNote?: string;
  status: SelectionStatus;
  favorite: boolean;
}

/* ─────────────────────────── Visitas ─────────────────────────── */

export type VisitStatus = "propuesta" | "confirmada" | "realizada" | "cancelada";

export interface PortalVisit {
  id: string;
  propertyId: string;
  clientId?: string;
  /** YYYY-MM-DD */
  date: string;
  /** HH:MM */
  time: string;
  status: VisitStatus;
  /** Franjas alternativas ofrecidas al cliente. */
  proposedSlots?: { date: string; time: string }[];
  note?: string;
  /** Feedback resumido tras la visita (visible para el propietario, anonimizado). */
  feedbackSummary?: string;
}

/* ─────────────────────────── Comunicación y actividad ─────────────────────────── */

export type TimelineEventKind =
  | "publicacion"
  | "marketing"
  | "lead"
  | "visita"
  | "feedback"
  | "precio"
  | "documento"
  | "mensaje"
  | "hito";

export interface PortalTimelineEvent {
  id: string;
  date: string;
  kind: TimelineEventKind;
  title: string;
  description?: string;
}

/** Resumen de conversación mostrado en el portal (no el hilo crudo del Inbox). */
export interface CommunicationSummaryEntry {
  id: string;
  date: string;
  channel: "whatsapp" | "email" | "llamada" | "presencial";
  summary: string;
  from: "agent" | "client" | "owner";
}

/** Próximo paso comercial acordado (visible en el portal cliente). */
export interface NextStep {
  id: string;
  label: string;
  detail?: string;
  due?: string;
  done: boolean;
}

/* ─────────────────────────── Documentos ─────────────────────────── */

export type DocumentKind = "dossier" | "plano" | "contrato" | "certificado" | "informe" | "otro";

export interface PortalDocument {
  id: string;
  title: string;
  kind: DocumentKind;
  sizeLabel: string;
  updatedAt: string;
  /** URL firmada / storage path. En mock: '#'. */
  url: string;
  /** A quién se muestra. */
  audience: PortalRole[];
  propertyId?: string;
}

/* ─────────────────────────── Métricas propietario ─────────────────────────── */

export interface OwnerMetrics {
  propertyId: string;
  periodLabel: string;
  views: number;
  favorites: number;
  contacts: number;
  visitRequests: number;
  qualifiedLeads: number;
  visitsDone: number;
  visitsPending: number;
  daysOnMarket: number;
  /** Interés semanal (impresiones/contactos) para el sparkline, más antiguo → más reciente. */
  weeklyInterest: number[];
  /** Acciones de marketing ejecutadas. */
  marketingActions: MarketingAction[];
}

export interface MarketingAction {
  id: string;
  label: string;
  channel: string;
  date: string;
  status: "activa" | "completada" | "programada";
}
