/**
 * Dataset mock del ecosistema Castresana para desarrollo de los portales.
 * Estructura idéntica a las colecciones Firestore previstas:
 *   portalTokens, properties, sharedSelections, visits, timeline,
 *   communications, documents, ownerMetrics, nextSteps.
 *
 * Tokens de demostración:
 *   /client-portal/demo-cliente   → Lucía Álvarez (compradora)
 *   /owner-portal/demo-propietario → Javier Solís (propietario AC-0012)
 */

import type {
  ClientSearchSummary,
  CommunicationSummaryEntry,
  NextStep,
  OwnerMetrics,
  PortalAccessToken,
  PortalAgent,
  PortalDocument,
  PortalProperty,
  PortalTimelineEvent,
  PortalVisit,
  SharedPropertySelection,
} from "@/types/portal";

/* ── Utilidades de fechas relativas (mock estable pero "vivo") ── */
const daysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};
const dateIn = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

/* ── Agente concierge ── */
export const AGENT_MARTA: PortalAgent = {
  name: "Marta Castresana",
  role: "Asesora personal",
  phone: "+34 984 000 000",
  email: "marta@asesoriacastresana.com",
  initials: "MC",
};

/* ── Tokens de acceso ── */
export const mockTokens: Record<string, PortalAccessToken> = {
  "demo-cliente": {
    token: "demo-cliente",
    role: "client",
    subjectId: "cl-001",
    createdAt: daysAgo(6),
    expiresAt: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString(),
    revoked: false,
    accessCount: 4,
    lastAccessAt: daysAgo(1),
  },
  "demo-propietario": {
    token: "demo-propietario",
    role: "owner",
    subjectId: "ow-001",
    createdAt: daysAgo(21),
    expiresAt: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    revoked: false,
    accessCount: 11,
    lastAccessAt: daysAgo(2),
  },
  "demo-caducado": {
    token: "demo-caducado",
    role: "client",
    subjectId: "cl-002",
    createdAt: daysAgo(60),
    expiresAt: daysAgo(10),
    revoked: false,
  },
};

/* ── Clientes / propietarios (subset portal) ── */
export interface MockClient {
  id: string;
  name: string;
  firstName: string;
  search: ClientSearchSummary;
}

export interface MockOwner {
  id: string;
  name: string;
  firstName: string;
  propertyIds: string[];
}

export const mockClients: Record<string, MockClient> = {
  "cl-001": {
    id: "cl-001",
    name: "Lucía Álvarez Pendás",
    firstName: "Lucía",
    search: {
      operation: "compra",
      propertyTypes: ["Piso", "Ático"],
      zones: ["Centro", "Uría", "Milán"],
      budgetMax: 320000,
      bedroomsMin: 3,
      mustHaves: ["Ascensor", "Exterior", "Garaje cerca"],
      updatedAt: daysAgo(6),
    },
  },
};

export const mockOwners: Record<string, MockOwner> = {
  "ow-001": {
    id: "ow-001",
    name: "Javier Solís Noriega",
    firstName: "Javier",
    propertyIds: ["p-012"],
  },
};

/* ── Propiedades ── */
export const mockProperties: Record<string, PortalProperty> = {
  "p-001": {
    id: "p-001",
    ref: "AC-0001",
    title: "Ático reformado con terraza sobre Uría",
    operation: "venta",
    status: "disponible",
    price: 298000,
    location: "Uría · Centro, Oviedo",
    type: "Ático",
    bedrooms: 3,
    bathrooms: 2,
    area: 112,
    highlights: ["Terraza 28 m²", "Reformado 2023", "Ascensor", "Orientación sur"],
    description:
      "Ático luminoso en pleno eje de Uría, con reforma integral de calidades altas, cocina abierta y terraza orientada a sur con vistas despejadas al Naranco. Edificio clásico con ascensor y portero.",
    videoUrl: "https://youtu.be/dQw4w9WgXcQ",
    accent: "copper",
    publishedAt: daysAgo(18),
  },
  "p-002": {
    id: "p-002",
    ref: "AC-0007",
    title: "Piso señorial junto al Campo San Francisco",
    operation: "venta",
    status: "disponible",
    price: 315000,
    location: "Milán · Centro, Oviedo",
    type: "Piso",
    bedrooms: 4,
    bathrooms: 2,
    area: 138,
    highlights: ["Techos altos", "Galería acristalada", "Dos plazas de garaje opcionales"],
    description:
      "Vivienda de carácter en finca señorial, con techos de 3 metros, carpintería original restaurada y galería acristalada al parque. Ideal para quien busca amplitud sin renunciar al centro.",
    accent: "walnut",
    publishedAt: daysAgo(31),
  },
  "p-003": {
    id: "p-003",
    ref: "AC-0015",
    title: "Piso a estrenar en Montecerrao",
    operation: "venta",
    status: "reservado",
    price: 289000,
    location: "Montecerrao, Oviedo",
    type: "Piso",
    bedrooms: 3,
    bathrooms: 2,
    area: 104,
    highlights: ["Obra nueva", "Garaje y trastero", "Piscina comunitaria"],
    description:
      "Promoción recién entregada con calidades contemporáneas, cocina amueblada y urbanización con piscina. Garaje y trastero incluidos en el precio.",
    accent: "olive",
    publishedAt: daysAgo(44),
  },
  "p-004": {
    id: "p-004",
    ref: "AC-0019",
    title: "Ático dúplex con dos terrazas en La Ería",
    operation: "venta",
    status: "disponible",
    price: 305000,
    location: "La Ería, Oviedo",
    type: "Ático",
    bedrooms: 3,
    bathrooms: 2,
    area: 121,
    highlights: ["Dúplex", "Terrazas este y oeste", "Vistas al Naranco"],
    description:
      "Dúplex en planta alta con doble terraza, salón de doble altura y dormitorio principal en suite. Zona tranquila y bien conectada, a diez minutos del centro.",
    accent: "slate",
    publishedAt: daysAgo(9),
  },
  "p-012": {
    id: "p-012",
    ref: "AC-0012",
    title: "Chalet de piedra con finca en Latores",
    operation: "venta",
    status: "disponible",
    price: 465000,
    location: "Latores, Oviedo",
    type: "Chalet",
    bedrooms: 4,
    bathrooms: 3,
    area: 260,
    highlights: ["Finca 1.200 m²", "Piedra vista", "Garaje doble", "Hórreo tradicional"],
    description:
      "Chalet independiente de piedra con finca ajardinada, hórreo restaurado y garaje doble. Privacidad total a cinco minutos de Oviedo, con orientación sur y vistas limpias.",
    videoUrl: "https://youtu.be/dQw4w9WgXcQ",
    accent: "walnut",
    publishedAt: daysAgo(35),
  },
};

/* ── Selección compartida con la clienta (escaparate curado) ── */
export const mockSelections: SharedPropertySelection[] = [
  {
    id: "sel-1",
    clientId: "cl-001",
    propertyId: "p-001",
    sharedAt: daysAgo(5),
    agentNote:
      "Lucía, esta es la terraza de la que te hablé: sur puro y sin edificios delante. Creo que es tu casa.",
    status: "interesa",
    favorite: true,
  },
  {
    id: "sel-2",
    clientId: "cl-001",
    propertyId: "p-004",
    sharedAt: daysAgo(2),
    agentNote: "Acaba de entrar en cartera. Doble terraza y entra dentro de presupuesto con margen.",
    status: "nueva",
    favorite: false,
  },
  {
    id: "sel-3",
    clientId: "cl-001",
    propertyId: "p-002",
    sharedAt: daysAgo(4),
    agentNote: "Más metros de los que pedías por si valoráis espacio sobre terraza.",
    status: "vista",
    favorite: true,
  },
  {
    id: "sel-4",
    clientId: "cl-001",
    propertyId: "p-003",
    sharedAt: daysAgo(12),
    agentNote: "Se ha reservado esta semana — la dejo visible para comparar precios de la zona.",
    status: "descartada",
    favorite: false,
  },
];

/* ── Visitas ── */
export const mockVisits: PortalVisit[] = [
  {
    id: "v-1",
    propertyId: "p-001",
    clientId: "cl-001",
    date: dateIn(2),
    time: "17:30",
    status: "confirmada",
    note: "Os espero en el portal. Veremos también el trastero.",
  },
  {
    id: "v-2",
    propertyId: "p-004",
    clientId: "cl-001",
    date: dateIn(4),
    time: "11:00",
    status: "propuesta",
    proposedSlots: [
      { date: dateIn(4), time: "11:00" },
      { date: dateIn(4), time: "18:00" },
      { date: dateIn(5), time: "10:30" },
    ],
  },
  {
    id: "v-3",
    propertyId: "p-002",
    clientId: "cl-001",
    date: dateIn(-3).slice(0, 10),
    time: "18:00",
    status: "realizada",
    feedbackSummary: "Os encantó la galería; dudas con la reforma de la cocina.",
  },
  /* Visitas del inmueble del propietario (clientes anonimizados) */
  {
    id: "v-21",
    propertyId: "p-012",
    date: dateIn(-9).slice(0, 10),
    time: "12:00",
    status: "realizada",
    feedbackSummary: "Pareja joven. Encaja la finca; el precio les parece ajustado pero siguen interesados.",
  },
  {
    id: "v-22",
    propertyId: "p-012",
    date: dateIn(-4).slice(0, 10),
    time: "17:00",
    status: "realizada",
    feedbackSummary: "Familia con dos hijos. Muy buena impresión; piden segunda visita con arquitecto.",
  },
  {
    id: "v-23",
    propertyId: "p-012",
    date: dateIn(3),
    time: "12:30",
    status: "confirmada",
    note: "Segunda visita de la familia interesada, acompañados de su arquitecto.",
  },
];

/* ── Timeline comercial del inmueble del propietario ── */
export const mockTimeline: PortalTimelineEvent[] = [
  { id: "t-1", date: daysAgo(35), kind: "publicacion", title: "Inmueble publicado", description: "Alta en cartera con reportaje fotográfico profesional y plano." },
  { id: "t-2", date: daysAgo(33), kind: "marketing", title: "Campaña en portales", description: "Publicación destacada en los principales portales inmobiliarios." },
  { id: "t-3", date: daysAgo(28), kind: "marketing", title: "Vídeo + difusión en redes", description: "Tour en vídeo publicado en Instagram y YouTube de Castresana." },
  { id: "t-4", date: daysAgo(24), kind: "lead", title: "6 contactos la primera quincena", description: "4 cualificados tras filtro telefónico." },
  { id: "t-5", date: daysAgo(9), kind: "visita", title: "Visita realizada", description: "Pareja joven — interés real, sensibilidad a precio." },
  { id: "t-6", date: daysAgo(4), kind: "visita", title: "Visita realizada", description: "Familia con dos hijos — muy buena impresión." },
  { id: "t-7", date: daysAgo(3), kind: "feedback", title: "Feedback consolidado", description: "El jardín y el hórreo destacan; alguna consulta recurrente por la cocina." },
  { id: "t-8", date: daysAgo(1), kind: "hito", title: "Segunda visita agendada", description: "La familia interesada vuelve con su arquitecto — buena señal." },
];

/* ── Comunicaciones resumidas ── */
export const mockCommunications: Record<string, CommunicationSummaryEntry[]> = {
  "cl-001": [
    { id: "c-1", date: daysAgo(6), channel: "presencial", from: "agent", summary: "Reunión inicial: definimos búsqueda (centro, 3+ hab, terraza deseable, hasta 320.000 €)." },
    { id: "c-2", date: daysAgo(5), channel: "whatsapp", from: "agent", summary: "Enviada selección inicial de 3 inmuebles con notas personales." },
    { id: "c-3", date: daysAgo(4), channel: "whatsapp", from: "client", summary: "Lucía descarta Montecerrao por zona; prioriza terraza y luz." },
    { id: "c-4", date: daysAgo(3), channel: "llamada", from: "agent", summary: "Visita al piso de Milán realizada; feedback positivo con dudas de cocina." },
    { id: "c-5", date: daysAgo(1), channel: "whatsapp", from: "agent", summary: "Confirmada visita al ático de Uría y propuesta de horarios para La Ería." },
  ],
  "ow-001": [
    { id: "c-21", date: daysAgo(7), channel: "email", from: "agent", summary: "Informe quincenal enviado: 41 visualizaciones, 6 contactos, 2 visitas agendadas." },
    { id: "c-22", date: daysAgo(3), channel: "llamada", from: "agent", summary: "Comentado el feedback de las visitas; acordado mantener precio 3 semanas más." },
    { id: "c-23", date: daysAgo(1), channel: "whatsapp", from: "agent", summary: "Segunda visita de la familia interesada confirmada para esta semana." },
  ],
};

/* ── Próximos pasos del cliente ── */
export const mockNextSteps: Record<string, NextStep[]> = {
  "cl-001": [
    { id: "n-1", label: "Visita al ático de Uría", detail: "Confirmada — os espero en el portal", due: dateIn(2), done: false },
    { id: "n-2", label: "Elegir horario para La Ería", detail: "Tienes 3 franjas propuestas en Visitas", due: dateIn(3), done: false },
    { id: "n-3", label: "Simulación hipotecaria", detail: "Con vuestra entrada, cuota estimada ≈ 1.030 €/mes", done: true },
    { id: "n-4", label: "Revisar dossier del piso de Milán", detail: "Disponible en Documentos", done: true },
  ],
};

/* ── Documentos ── */
export const mockDocuments: PortalDocument[] = [
  { id: "d-1", title: "Dossier — Ático en Uría (AC-0001)", kind: "dossier", sizeLabel: "4,2 MB", updatedAt: daysAgo(5), url: "#", audience: ["client"], propertyId: "p-001" },
  { id: "d-2", title: "Dossier — Piso en Milán (AC-0007)", kind: "dossier", sizeLabel: "3,8 MB", updatedAt: daysAgo(4), url: "#", audience: ["client"], propertyId: "p-002" },
  { id: "d-3", title: "Guía de compra Castresana", kind: "informe", sizeLabel: "1,1 MB", updatedAt: daysAgo(6), url: "#", audience: ["client"] },
  { id: "d-4", title: "Simulación financiera personalizada", kind: "informe", sizeLabel: "480 KB", updatedAt: daysAgo(3), url: "#", audience: ["client"] },
  { id: "d-11", title: "Dossier comercial — Chalet en Latores", kind: "dossier", sizeLabel: "5,6 MB", updatedAt: daysAgo(30), url: "#", audience: ["owner"], propertyId: "p-012" },
  { id: "d-12", title: "Reportaje fotográfico (alta resolución)", kind: "otro", sizeLabel: "48 MB", updatedAt: daysAgo(33), url: "#", audience: ["owner"], propertyId: "p-012" },
  { id: "d-13", title: "Nota de encargo firmada", kind: "contrato", sizeLabel: "320 KB", updatedAt: daysAgo(35), url: "#", audience: ["owner"], propertyId: "p-012" },
  { id: "d-14", title: "Certificado energético (E)", kind: "certificado", sizeLabel: "610 KB", updatedAt: daysAgo(34), url: "#", audience: ["owner"], propertyId: "p-012" },
  { id: "d-15", title: "Informe quincenal de comercialización", kind: "informe", sizeLabel: "890 KB", updatedAt: daysAgo(7), url: "#", audience: ["owner"], propertyId: "p-012" },
];

/* ── Métricas del propietario ── */
export const mockOwnerMetrics: Record<string, OwnerMetrics> = {
  "p-012": {
    propertyId: "p-012",
    periodLabel: "Últimos 30 días",
    views: 412,
    favorites: 23,
    contacts: 9,
    visitRequests: 5,
    qualifiedLeads: 4,
    visitsDone: 2,
    visitsPending: 1,
    daysOnMarket: 35,
    weeklyInterest: [34, 58, 71, 66, 88, 103],
    marketingActions: [
      { id: "m-1", label: "Publicación destacada en portales", channel: "Portales", date: daysAgo(33), status: "activa" },
      { id: "m-2", label: "Tour en vídeo profesional", channel: "YouTube", date: daysAgo(28), status: "completada" },
      { id: "m-3", label: "Campaña segmentada", channel: "Instagram", date: daysAgo(21), status: "activa" },
      { id: "m-4", label: "Email a cartera de compradores", channel: "CRM Castresana", date: daysAgo(14), status: "completada" },
      { id: "m-5", label: "Open house privado", channel: "Presencial", date: dateIn(10), status: "programada" },
    ],
  },
};
