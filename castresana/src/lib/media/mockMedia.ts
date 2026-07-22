/**
 * Media mock del Studio, vinculada a las propiedades del ecosistema
 * (lib/portal/mockData). Tres niveles deliberados de cobertura para
 * ejercitar el recomendador:
 *  - p-001 (ático Uría): cobertura excelente, con vídeo y variantes.
 *  - p-012 (chalet Latores): buena pero sin cocina/baño → recomendaciones.
 *  - p-002 (piso Milán): mínima → alertas de material faltante.
 */

import type { ExportJob, MediaAsset, MediaProject, PublishingRecord } from "@/types/media";

const daysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

let seq = 0;
const q = (light: number, sharpness: number, composition: number, appeal: number) => ({
  light,
  sharpness,
  composition,
  appeal,
});

/* ── Assets ── */

export const mockAssets: MediaAsset[] = [
  /* p-001 — Ático Uría: material top */
  { id: "a-101", propertyId: "p-001", kind: "photo", title: "Terraza al atardecer", room: "terraza", tags: ["portada", "atardecer"], isCover: true, order: ++seq, capturedAt: daysAgo(18), quality: q(92, 88, 90, 96), palette: "copper", variants: [
    { id: "v-1", channel: "reels", ratio: "9:16", label: "Recorte vertical", readyAt: daysAgo(12) },
    { id: "v-2", channel: "web", ratio: "16:9", label: "Cabecera portal", readyAt: daysAgo(12) },
  ] },
  { id: "a-102", propertyId: "p-001", kind: "photo", title: "Vistas al Naranco", room: "vistas", tags: ["golden hour"], isCover: false, order: ++seq, capturedAt: daysAgo(18), quality: q(90, 85, 88, 93), palette: "sand", variants: [] },
  { id: "a-103", propertyId: "p-001", kind: "photo", title: "Salón principal", room: "salon", tags: ["amplio"], isCover: false, order: ++seq, capturedAt: daysAgo(18), quality: q(88, 90, 86, 84), palette: "walnut", variants: [
    { id: "v-3", channel: "whatsapp", ratio: "16:9", label: "Optimizada envío", readyAt: daysAgo(10) },
  ] },
  { id: "a-104", propertyId: "p-001", kind: "photo", title: "Salón hacia terraza", room: "salon", tags: [], isCover: false, order: ++seq, capturedAt: daysAgo(18), quality: q(85, 84, 82, 80), palette: "walnut", variants: [] },
  { id: "a-105", propertyId: "p-001", kind: "photo", title: "Cocina abierta", room: "cocina", tags: ["reformada"], isCover: false, order: ++seq, capturedAt: daysAgo(18), quality: q(86, 88, 85, 82), palette: "olive", variants: [] },
  { id: "a-106", propertyId: "p-001", kind: "photo", title: "Dormitorio principal", room: "dormitorio", tags: ["suite"], isCover: false, order: ++seq, capturedAt: daysAgo(18), quality: q(84, 86, 84, 78), palette: "slate", variants: [] },
  { id: "a-107", propertyId: "p-001", kind: "photo", title: "Dormitorio 2", room: "dormitorio", tags: [], isCover: false, order: ++seq, capturedAt: daysAgo(18), quality: q(78, 80, 74, 68), palette: "slate", variants: [] },
  { id: "a-108", propertyId: "p-001", kind: "photo", title: "Baño principal", room: "bano", tags: [], isCover: false, order: ++seq, capturedAt: daysAgo(18), quality: q(80, 84, 78, 72), palette: "night", variants: [] },
  { id: "a-109", propertyId: "p-001", kind: "photo", title: "Fachada Uría", room: "exterior", tags: [], isCover: false, order: ++seq, capturedAt: daysAgo(17), quality: q(82, 86, 84, 80), palette: "sand", variants: [] },
  { id: "a-110", propertyId: "p-001", kind: "photo", title: "Portal clásico", room: "portal", tags: [], isCover: false, order: ++seq, capturedAt: daysAgo(17), quality: q(74, 80, 76, 66), palette: "walnut", variants: [] },
  { id: "a-111", propertyId: "p-001", kind: "photo", title: "Plano acotado", room: "plano", tags: ["plano"], isCover: false, order: ++seq, capturedAt: daysAgo(16), quality: q(95, 96, 90, 55), palette: "night", variants: [] },
  { id: "a-112", propertyId: "p-001", kind: "video", title: "Clip terraza (dron)", room: "terraza", tags: ["dron"], isCover: false, order: ++seq, capturedAt: daysAgo(15), durationSec: 14, quality: q(90, 86, 92, 95), palette: "copper", variants: [] },
  { id: "a-113", propertyId: "p-001", kind: "thumbnail", title: "Miniatura YouTube", room: "detalle", tags: ["miniatura"], isCover: false, order: ++seq, capturedAt: daysAgo(12), quality: q(88, 90, 92, 88), palette: "copper", variants: [] },

  /* p-012 — Chalet Latores: faltan cocina y baño */
  { id: "a-201", propertyId: "p-012", kind: "photo", title: "Fachada de piedra", room: "exterior", tags: ["portada"], isCover: true, order: ++seq, capturedAt: daysAgo(33), quality: q(90, 88, 90, 92), palette: "walnut", variants: [
    { id: "v-4", channel: "web", ratio: "16:9", label: "Cabecera portal", readyAt: daysAgo(30) },
  ] },
  { id: "a-202", propertyId: "p-012", kind: "photo", title: "Finca y jardín", room: "exterior", tags: ["jardín"], isCover: false, order: ++seq, capturedAt: daysAgo(33), quality: q(88, 84, 86, 90), palette: "olive", variants: [] },
  { id: "a-203", propertyId: "p-012", kind: "photo", title: "Hórreo restaurado", room: "detalle", tags: ["hórreo"], isCover: false, order: ++seq, capturedAt: daysAgo(33), quality: q(86, 85, 88, 89), palette: "sand", variants: [] },
  { id: "a-204", propertyId: "p-012", kind: "photo", title: "Salón con chimenea", room: "salon", tags: [], isCover: false, order: ++seq, capturedAt: daysAgo(32), quality: q(78, 82, 80, 84), palette: "walnut", variants: [] },
  { id: "a-205", propertyId: "p-012", kind: "photo", title: "Dormitorio principal", room: "dormitorio", tags: [], isCover: false, order: ++seq, capturedAt: daysAgo(32), quality: q(75, 78, 74, 70), palette: "slate", variants: [] },
  { id: "a-206", propertyId: "p-012", kind: "photo", title: "Vistas del valle", room: "vistas", tags: [], isCover: false, order: ++seq, capturedAt: daysAgo(32), quality: q(84, 80, 85, 91), palette: "sand", variants: [] },
  { id: "a-207", propertyId: "p-012", kind: "photo", title: "Garaje doble", room: "garaje", tags: [], isCover: false, order: ++seq, capturedAt: daysAgo(31), quality: q(70, 76, 68, 58), palette: "night", variants: [] },
  { id: "a-208", propertyId: "p-012", kind: "photo", title: "Plano de parcela", room: "plano", tags: ["plano"], isCover: false, order: ++seq, capturedAt: daysAgo(30), quality: q(94, 95, 88, 52), palette: "night", variants: [] },
  { id: "a-209", propertyId: "p-012", kind: "video", title: "Vuelo de dron finca", room: "exterior", tags: ["dron"], isCover: false, order: ++seq, capturedAt: daysAgo(28), durationSec: 22, quality: q(92, 88, 94, 96), palette: "olive", variants: [] },

  /* p-002 — Piso Milán: cobertura mínima */
  { id: "a-301", propertyId: "p-002", kind: "photo", title: "Galería al parque", room: "salon", tags: ["galería"], isCover: false, order: ++seq, capturedAt: daysAgo(31), quality: q(80, 74, 78, 84), palette: "sand", variants: [] },
  { id: "a-302", propertyId: "p-002", kind: "photo", title: "Salón señorial", room: "salon", tags: [], isCover: false, order: ++seq, capturedAt: daysAgo(31), quality: q(72, 70, 74, 78), palette: "walnut", variants: [] },
  { id: "a-303", propertyId: "p-002", kind: "photo", title: "Fachada Milán", room: "exterior", tags: [], isCover: false, order: ++seq, capturedAt: daysAgo(31), quality: q(76, 78, 72, 74), palette: "slate", variants: [] },
  { id: "a-304", propertyId: "p-002", kind: "photo", title: "Dormitorio con balcón", room: "dormitorio", tags: [], isCover: false, order: ++seq, capturedAt: daysAgo(30), quality: q(68, 66, 70, 72), palette: "slate", variants: [] },
];

/* ── Proyectos existentes ── */

export const mockProjects: MediaProject[] = [
  {
    id: "mp-1",
    propertyId: "p-001",
    name: "Reel lanzamiento Uría",
    templateId: "tp-venta",
    presetId: "pr-reels",
    scenes: [],
    status: "exportado",
    createdAt: daysAgo(12),
    updatedAt: daysAgo(11),
  },
  {
    id: "mp-2",
    propertyId: "p-012",
    name: "Actualización semanal propietario",
    templateId: "tp-propietario",
    presetId: "pr-propietario",
    scenes: [],
    status: "listo",
    createdAt: daysAgo(6),
    updatedAt: daysAgo(5),
  },
];

/* ── Cola de exportación ── */

export const mockExportJobs: ExportJob[] = [
  {
    id: "ex-1",
    propertyId: "p-001",
    projectId: "mp-1",
    presetId: "pr-reels",
    kind: "mp4",
    label: "Reel lanzamiento Uría · 9:16",
    status: "listo",
    progress: 100,
    createdAt: daysAgo(11),
    output: { fileName: "AC-0001_reel_9x16.mp4", sizeLabel: "24,8 MB", note: "22s · 1080×1920 · H.264" },
  },
  {
    id: "ex-2",
    propertyId: "p-001",
    kind: "pdf",
    label: "Ficha visual AC-0001",
    status: "listo",
    progress: 100,
    createdAt: daysAgo(10),
    output: { fileName: "AC-0001_ficha.pdf", sizeLabel: "3,1 MB", note: "6 páginas · fotos + plano + QR" },
  },
  {
    id: "ex-3",
    propertyId: "p-001",
    kind: "pack-whatsapp",
    label: "Paquete WhatsApp (vídeo + 5 fotos)",
    status: "procesando",
    progress: 62,
    createdAt: daysAgo(0),
  },
  {
    id: "ex-4",
    propertyId: "p-012",
    projectId: "mp-2",
    presetId: "pr-propietario",
    kind: "mp4",
    label: "Vídeo actualización propietario · 16:9",
    status: "en-cola",
    progress: 0,
    createdAt: daysAgo(0),
  },
];

/* ── Centro de publicación ── */

export const mockPublishing: PublishingRecord[] = [
  { id: "pub-1", propertyId: "p-001", pieceLabel: "Reel lanzamiento", channel: "reels", status: "publicada", date: daysAgo(10) },
  { id: "pub-2", propertyId: "p-001", pieceLabel: "Reel lanzamiento", channel: "tiktok", status: "publicada", date: daysAgo(10) },
  { id: "pub-3", propertyId: "p-001", pieceLabel: "Vídeo ficha 16:9", channel: "web", status: "publicada", date: daysAgo(9) },
  { id: "pub-4", propertyId: "p-001", pieceLabel: "Paquete WhatsApp", channel: "whatsapp", status: "enviada", date: daysAgo(1), sentTo: "Lucía Álvarez (lead caliente)" },
  { id: "pub-5", propertyId: "p-001", pieceLabel: "Ficha visual PDF", channel: "client-portal", status: "enviada", date: daysAgo(4), sentTo: "Portal de Lucía Álvarez" },
  { id: "pub-6", propertyId: "p-012", pieceLabel: "Vídeo actualización", channel: "owner-portal", status: "programada", date: daysAgo(-2) },
  { id: "pub-7", propertyId: "p-012", pieceLabel: "Teaser dron", channel: "shorts", status: "lista" },
  { id: "pub-8", propertyId: "p-002", pieceLabel: "Carrusel señorial", channel: "reels", status: "borrador" },
];

/* ── Consultas ── */

export function assetsFor(propertyId: string): MediaAsset[] {
  return mockAssets.filter((a) => a.propertyId === propertyId).sort((a, b) => a.order - b.order);
}

export function projectsFor(propertyId: string): MediaProject[] {
  return mockProjects.filter((p) => p.propertyId === propertyId);
}

export function exportJobsFor(propertyId: string): ExportJob[] {
  return mockExportJobs.filter((j) => j.propertyId === propertyId);
}

export function publishingFor(propertyId: string): PublishingRecord[] {
  return mockPublishing.filter((p) => p.propertyId === propertyId);
}

/** Propiedades con media en el Studio (para la home). */
export function propertyIdsWithMedia(): string[] {
  return [...new Set(mockAssets.map((a) => a.propertyId))];
}
