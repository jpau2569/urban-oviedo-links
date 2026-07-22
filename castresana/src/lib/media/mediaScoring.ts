/**
 * Selección inteligente de media: puntuación comercial, portada, apertura,
 * secuencia óptima y cobertura. Funciones puras — mismas entradas, mismas
 * salidas — para poder testearlas y moverlas a Cloud Functions sin cambios.
 */

import type { MediaAsset, MediaCoverage, RoomTag } from "@/types/media";
import { REQUIRED_ROOMS, ROOM_SEQUENCE } from "./mediaTypes";

/** Peso comercial de cada estancia (qué vende más en portada/apertura). */
const ROOM_WEIGHT: Record<RoomTag, number> = {
  vistas: 1.25,
  terraza: 1.2,
  exterior: 1.1,
  salon: 1.15,
  cocina: 1.05,
  dormitorio: 0.95,
  bano: 0.85,
  portal: 0.8,
  garaje: 0.7,
  plano: 0.6,
  detalle: 0.9,
};

/** Calidad técnica media 0–100. */
export function technicalScore(asset: MediaAsset): number {
  const q = asset.quality;
  return Math.round(q.light * 0.25 + q.sharpness * 0.25 + q.composition * 0.2 + q.appeal * 0.3);
}

/** Calidad técnica ponderada por atractivo comercial de la estancia. */
export function commercialScore(asset: MediaAsset): number {
  return Math.round(Math.min(100, technicalScore(asset) * (ROOM_WEIGHT[asset.room] ?? 1)));
}

const byCommercial = (a: MediaAsset, b: MediaAsset): number => commercialScore(b) - commercialScore(a);

/** Mejor candidata a portada: foto con mayor score comercial. */
export function pickCover(assets: MediaAsset[]): MediaAsset | null {
  return assets.filter((a) => a.kind === "photo").sort(byCommercial)[0] ?? null;
}

/** Mejor apertura de vídeo: prioriza el plano más aspiracional. */
export function pickOpener(assets: MediaAsset[]): MediaAsset | null {
  const photos = assets.filter((a) => a.kind === "photo");
  const wow = photos.filter((a) => ["vistas", "terraza", "salon"].includes(a.room));
  return (wow.length ? wow : photos).sort(byCommercial)[0] ?? null;
}

/**
 * Secuencia óptima de recorrido: agrupa por estancia siguiendo el orden
 * comercial natural y dentro de cada estancia ordena por score.
 */
export function optimalSequence(assets: MediaAsset[]): MediaAsset[] {
  const photos = assets.filter((a) => a.kind === "photo");
  const out: MediaAsset[] = [];
  for (const room of ROOM_SEQUENCE) {
    out.push(...photos.filter((a) => a.room === room).sort(byCommercial));
  }
  return out;
}

/** Mejor asset disponible para una lista de estancias preferidas. */
export function bestForRooms(assets: MediaAsset[], rooms: RoomTag[], exclude: Set<string>): MediaAsset | null {
  for (const room of rooms) {
    const hit = assets
      .filter((a) => a.kind === "photo" && a.room === room && !exclude.has(a.id))
      .sort(byCommercial)[0];
    if (hit) return hit;
  }
  // Último recurso: la mejor foto no usada de cualquier estancia.
  return assets.filter((a) => a.kind === "photo" && !exclude.has(a.id)).sort(byCommercial)[0] ?? null;
}

/** Cobertura visual del inmueble y nota global de material. */
export function buildCoverage(propertyId: string, assets: MediaAsset[]): MediaCoverage {
  const photos = assets.filter((a) => a.kind === "photo");
  const covered = [...new Set(photos.map((a) => a.room))];
  const missing = REQUIRED_ROOMS.filter((r) => !covered.includes(r));
  const videoCount = assets.filter((a) => a.kind === "video").length;
  const hasCover = assets.some((a) => a.isCover);

  const requiredCovered = (REQUIRED_ROOMS.length - missing.length) / REQUIRED_ROOMS.length;
  const avgQuality = photos.length
    ? photos.reduce((s, a) => s + technicalScore(a), 0) / photos.length / 100
    : 0;
  const volume = Math.min(1, photos.length / 10);
  const videoBonus = videoCount > 0 ? 1 : 0.85;

  const score = Math.round(100 * (requiredCovered * 0.45 + avgQuality * 0.3 + volume * 0.25) * videoBonus);

  return { propertyId, score, covered, missing, photoCount: photos.length, videoCount, hasCover };
}
