/**
 * Export manager: convierte proyectos y bibliotecas en trabajos de salida.
 *
 * En esta fase el render es mock (metadata realista, sin ffmpeg): la
 * estructura del job ya es la definitiva, de modo que el worker real
 * (Cloud Function + ffmpeg / servicio de render) solo tendrá que consumir
 * `ExportJob` y rellenar `output`.
 */

import type { ExportJob, ExportKind, MediaAsset, RenderPreset, StoryboardScene } from "@/types/media";
import type { PortalProperty } from "@/types/portal";
import { totalDuration } from "./storyboardBuilder";

/** Bitrate aproximado por segundo para estimar tamaño de MP4 (mock). */
const MB_PER_SEC = 1.15;

function fileSafe(ref: string): string {
  return ref.replace(/[^\w-]/g, "");
}

export function estimateVideoSize(scenes: StoryboardScene[]): string {
  const mb = Math.max(4, totalDuration(scenes) * MB_PER_SEC);
  return mb.toFixed(1).replace(".", ",") + " MB";
}

/** Crea un job de exportación de vídeo desde un storyboard. */
export function createVideoExport(
  property: PortalProperty,
  preset: RenderPreset,
  scenes: StoryboardScene[],
  projectId?: string,
): ExportJob {
  const dims = preset.ratio === "9:16" ? "1080×1920" : preset.ratio === "16:9" ? "1920×1080" : preset.ratio === "4:5" ? "1080×1350" : "1080×1080";
  return {
    id: `ex-${Date.now()}`,
    propertyId: property.id,
    projectId,
    presetId: preset.id,
    kind: "mp4",
    label: `${preset.name} · ${preset.ratio}`,
    status: "en-cola",
    progress: 0,
    createdAt: new Date().toISOString(),
    output: {
      fileName: `${fileSafe(property.ref)}_${preset.channel}_${preset.ratio.replace(":", "x")}.mp4`,
      sizeLabel: estimateVideoSize(scenes),
      note: `${Math.round(totalDuration(scenes))}s · ${dims} · H.264 · ${scenes.length} escenas`,
    },
  };
}

/** Job de paquete de assets (ZIP, WhatsApp, redes) o ficha PDF. */
export function createPackExport(
  property: PortalProperty,
  kind: Exclude<ExportKind, "mp4" | "enlace-privado">,
  assets: MediaAsset[],
): ExportJob {
  const photos = assets.filter((a) => a.kind === "photo").length;
  const meta: Record<typeof kind, { label: string; fileName: string; note: string; sizeLabel: string }> = {
    zip: {
      label: "ZIP con todos los assets",
      fileName: `${fileSafe(property.ref)}_assets.zip`,
      note: `${assets.length} archivos originales`,
      sizeLabel: `${Math.max(20, assets.length * 6)} MB`,
    },
    pdf: {
      label: "Ficha visual PDF",
      fileName: `${fileSafe(property.ref)}_ficha.pdf`,
      note: `${Math.min(8, Math.ceil(photos / 2) + 2)} páginas · fotos + datos + QR`,
      sizeLabel: "3,4 MB",
    },
    "pack-whatsapp": {
      label: "Paquete WhatsApp",
      fileName: `${fileSafe(property.ref)}_whatsapp.zip`,
      note: "Vídeo comprimido + 5 mejores fotos + copy listo",
      sizeLabel: "18 MB",
    },
    "pack-social": {
      label: "Paquete redes",
      fileName: `${fileSafe(property.ref)}_social.zip`,
      note: "Reel + carrusel 1:1 + story + miniatura + copys",
      sizeLabel: "42 MB",
    },
  };
  const m = meta[kind];
  return {
    id: `ex-${Date.now()}`,
    propertyId: property.id,
    kind,
    label: m.label,
    status: "en-cola",
    progress: 0,
    createdAt: new Date().toISOString(),
    output: { fileName: m.fileName, sizeLabel: m.sizeLabel, note: m.note },
  };
}

/**
 * Enlace privado compartible: reutiliza el modelo de tokens del portal
 * (expiración + revocación). El visor de pieza será una ruta pública
 * token-gated como los portales.
 */
export function createShareLink(property: PortalProperty, pieceLabel: string): ExportJob {
  const token = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
  return {
    id: `ex-${Date.now()}`,
    propertyId: property.id,
    kind: "enlace-privado",
    label: `Enlace privado — ${pieceLabel}`,
    status: "listo",
    progress: 100,
    createdAt: new Date().toISOString(),
    output: {
      fileName: "Enlace con caducidad de 30 días",
      sizeLabel: "—",
      note: "Solo lectura · revocable desde el Studio",
      shareUrl: `/media/${token}`,
    },
  };
}

/** Simula el avance de un job (para la demo del panel de cola). */
export function advanceJob(job: ExportJob): ExportJob {
  if (job.status === "en-cola") return { ...job, status: "procesando", progress: 18 };
  if (job.status === "procesando") {
    const next = Math.min(100, job.progress + 28);
    return next >= 100 ? { ...job, status: "listo", progress: 100 } : { ...job, progress: next };
  }
  return job;
}
