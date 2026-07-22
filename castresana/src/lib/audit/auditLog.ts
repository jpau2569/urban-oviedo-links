/**
 * Auditoría y salud del sistema (Torre de control).
 * Producción: tenants/{id}/audit (TTL 12 meses) escrito por un helper
 * `audit(kind, summary)` desde cada handler de escritura.
 */

import type { AuditEvent, QueueJobSummary, SystemService } from "@/types/analytics";

const hoursAgo = (h: number): string => new Date(Date.now() - h * 3600_000).toISOString();

export const AUDIT_EVENTS: AuditEvent[] = [
  { id: "ev-1", at: hoursAgo(1), kind: "portal", actor: "Sistema", summary: "Portal de propietario visitado (Javier Solís) — 4 páginas", severity: "info" },
  { id: "ev-2", at: hoursAgo(2), kind: "export", actor: "Marta C.", summary: "Exportado paquete WhatsApp de AC-0001 y enviado a lead", severity: "info" },
  { id: "ev-3", at: hoursAgo(5), kind: "lead", actor: "Autopiloto", summary: "Lead sin respuesta 24 h → recordatorio asignado a Diego F.", severity: "aviso" },
  { id: "ev-4", at: hoursAgo(8), kind: "propiedad", actor: "Sara L.", summary: "AC-0019 actualizada: nuevas fotos de terraza (4)", severity: "info" },
  { id: "ev-5", at: hoursAgo(11), kind: "ajustes", actor: "Marta C.", summary: "Plantilla de informe quincenal a propietarios modificada", severity: "info" },
  { id: "ev-6", at: hoursAgo(16), kind: "auth", actor: "Sistema", summary: "3 intentos de acceso fallidos a un enlace de portal caducado", severity: "aviso" },
  { id: "ev-7", at: hoursAgo(22), kind: "automatizacion", actor: "Autopiloto", summary: "Informe semanal enviado a 2 propietarios", severity: "info" },
  { id: "ev-8", at: hoursAgo(30), kind: "error", actor: "Sistema", summary: "Render de vídeo reintentado con éxito tras timeout (job ex-4)", severity: "critico" },
];

export const SYSTEM_SERVICES: SystemService[] = [
  { id: "svc-app", name: "Aplicación (hosting)", status: "operativo", latencyMs: 84 },
  { id: "svc-db", name: "Base de datos (Firestore)", status: "operativo", latencyMs: 46 },
  { id: "svc-storage", name: "Storage de media", status: "operativo", latencyMs: 112 },
  { id: "svc-render", name: "Cola de render", status: "degradado", latencyMs: 2400, note: "1 job reintentado esta noche" },
  { id: "svc-msg", name: "Mensajería (WhatsApp API)", status: "operativo", latencyMs: 310 },
];

export const QUEUE_JOBS: QueueJobSummary[] = [
  { id: "qj-1", queue: "render", label: "MP4 actualización propietario AC-0012", status: "procesando", at: hoursAgo(0) },
  { id: "qj-2", queue: "notificaciones", label: "Recordatorio visita jueves (Lucía Á.)", status: "en-cola", at: hoursAgo(0) },
  { id: "qj-3", queue: "informes", label: "Informe quincenal AC-0012", status: "completado", at: hoursAgo(6) },
  { id: "qj-4", queue: "sincronizacion", label: "Sincronización con portales externos", status: "completado", at: hoursAgo(7) },
  { id: "qj-5", queue: "render", label: "Reel AC-0019 (borrador)", status: "fallido", at: hoursAgo(26) },
];
