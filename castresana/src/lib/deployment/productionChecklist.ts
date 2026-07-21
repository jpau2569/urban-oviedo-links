/**
 * Checklist de producción y roadmap de Castresana OS, como datos.
 * Se renderizan en la Torre de control para que el estado de lanzamiento
 * sea visible dentro del propio producto, no en un documento perdido.
 */

export interface ChecklistItem {
  area: string;
  item: string;
  status: "hecho" | "en-curso" | "pendiente";
  note?: string;
}

export const PRODUCTION_CHECKLIST: ChecklistItem[] = [
  { area: "Auth", item: "Firebase Auth con roles por custom claims (tenantId + role)", status: "pendiente" },
  { area: "Auth", item: "Guards en servidor para todas las rutas internas", status: "en-curso", note: "guardPage listo; falta conectar sesión real" },
  { area: "Permisos", item: "Security rules derivadas de la matriz de permisos", status: "pendiente" },
  { area: "Datos", item: "Colecciones bajo tenants/{id} + índices compuestos", status: "pendiente" },
  { area: "Storage", item: "Reglas de Storage por tenant + URLs firmadas para portales", status: "pendiente" },
  { area: "Portales", item: "Tokens con expiración/revocación validados en servidor", status: "hecho" },
  { area: "Portales", item: "noindex en todas las rutas privadas", status: "hecho" },
  { area: "PWA", item: "Manifest + iconos + service worker con estrategia offline", status: "hecho", note: "instalable; offline con fallback elegante; portales excluidos de caché" },
  { area: "Notificaciones", item: "FCM push + digest diario por email", status: "pendiente" },
  { area: "Rendimiento", item: "Imágenes optimizadas (next/image + Storage CDN)", status: "pendiente" },
  { area: "Rendimiento", item: "Build de producción sin errores TS estrictos", status: "hecho" },
  { area: "Accesibilidad", item: "Focus visible, aria-labels, contraste AA en ambos temas", status: "en-curso" },
  { area: "QA", item: "Suite E2E móvil + desktop (flujos portal, studio, settings)", status: "en-curso", note: "checks Playwright por fase; falta CI" },
  { area: "Textos", item: "Revisión de microcopy y tono en todo el producto", status: "en-curso" },
  { area: "Logs", item: "Auditoría en escrituras + alertas de errores (Sentry o similar)", status: "pendiente" },
  { area: "Legal", item: "Aviso legal, privacidad (RGPD) y consentimiento en portales", status: "pendiente" },
  { area: "Backups", item: "Export diario de Firestore + retención 30 días", status: "pendiente" },
  { area: "Recuperación", item: "Runbook de restauración probado en staging", status: "pendiente" },
];

export interface RoadmapPhase {
  version: string;
  title: string;
  goal: string;
  scopeIn: string[];
  scopeOut: string[];
  dependencies: string;
  risk: "bajo" | "medio" | "alto";
  impact: string;
}

export const ROADMAP: RoadmapPhase[] = [
  {
    version: "V1",
    title: "Usable real en Asesoría Castresana",
    goal: "Operar el día a día con datos reales: cartera, portales y Media Studio conectados a Firebase.",
    scopeIn: [
      "Auth real + roles básicos (director, agente)",
      "Firestore + Storage con datos reales bajo tenant único",
      "Portales cliente/propietario en producción con tokens",
      "Media Studio con fotos reales y export ZIP/PDF funcional",
      "Checklist de producción completada",
    ],
    scopeOut: ["Render de vídeo real", "Multi-agencia", "Integraciones de portales externos"],
    dependencies: "Proyecto Firebase + dominio + cuentas de canal",
    risk: "bajo",
    impact: "La agencia trabaja ya sobre el OS; los clientes perciben el salto de nivel.",
  },
  {
    version: "V2",
    title: "IA e integraciones fuertes",
    goal: "Vende Todo operativo de verdad: respuestas asistidas, scoring y render de vídeo automático.",
    scopeIn: [
      "Inbox conectado a WhatsApp Business API y email",
      "IA comercial: borradores de respuesta con revisión humana, scoring de leads",
      "Worker de render (ffmpeg) para MP4 reales del Studio",
      "Autopiloto: seguimientos e informes a propietario automáticos",
      "Analytics con agregados reales programados",
    ],
    scopeOut: ["Multi-tenant abierto", "Facturación"],
    dependencies: "V1 estable + acceso API WhatsApp + presupuesto IA",
    risk: "medio",
    impact: "Horas de trabajo repetitivo eliminadas; tiempo de respuesta imbatible en la plaza.",
  },
  {
    version: "V3",
    title: "Listo para otras agencias",
    goal: "Multi-tenant real con onboarding de agencia completo y branding propio.",
    scopeIn: [
      "Aislamiento por tenant en rules + custom claims",
      "Onboarding de agencia (branding, equipo, canales, plantillas)",
      "Subdominios por agencia",
      "Planes y límites aplicados en servidor",
      "Documentación y soporte interno",
    ],
    scopeOut: ["Self-service de pago", "Marketplace de plantillas"],
    dependencies: "V2 probada 3+ meses en Castresana",
    risk: "medio",
    impact: "El producto deja de ser interno: 2–3 agencias piloto validan el modelo.",
  },
  {
    version: "V4",
    title: "Producto estrella / SaaS",
    goal: "Castresana OS como SaaS: alta self-service, facturación y crecimiento.",
    scopeIn: [
      "Registro y pago self-service (Stripe)",
      "Dominios propios por agencia",
      "Marketplace de plantillas de contenido y automatizaciones",
      "Métricas de producto y salud de cuentas",
      "SLA, estado público del sistema y soporte escalado",
    ],
    scopeOut: [],
    dependencies: "V3 con pilotos de pago satisfechos",
    risk: "alto",
    impact: "Nueva línea de negocio: el software pasa de coste a activo que factura.",
  },
];
