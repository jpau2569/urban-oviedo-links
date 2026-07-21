/**
 * Vende Todo — recomendador de media.
 *
 * Reglas deterministas sobre la biblioteca de un inmueble que producen
 * consejos accionables: portada, apertura, material faltante, calidad
 * baja, variantes de canal pendientes y piezas sugeridas.
 */

import type { MediaAsset, MediaRecommendation, PublishingRecord } from "@/types/media";
import { buildCoverage, commercialScore, pickCover, pickOpener, technicalScore } from "./mediaScoring";
import { CHANNEL_LABEL, ROOM_LABEL } from "./mediaTypes";

let n = 0;
const rec = (
  propertyId: string,
  kind: MediaRecommendation["kind"],
  severity: MediaRecommendation["severity"],
  title: string,
  detail: string,
  assetIds?: string[],
): MediaRecommendation => ({ id: `rec-${propertyId}-${++n}`, propertyId, kind, severity, title, detail, assetIds });

export function buildRecommendations(
  propertyId: string,
  assets: MediaAsset[],
  publishing: PublishingRecord[],
): MediaRecommendation[] {
  const out: MediaRecommendation[] = [];
  const coverage = buildCoverage(propertyId, assets);
  const photos = assets.filter((a) => a.kind === "photo");

  /* Portada */
  const bestCover = pickCover(assets);
  const currentCover = assets.find((a) => a.isCover);
  if (!currentCover && bestCover) {
    out.push(rec(propertyId, "portada", "importante", "Sin portada marcada",
      `Sugerencia: «${bestCover.title}» (score ${commercialScore(bestCover)}) es tu mejor carta de presentación.`,
      [bestCover.id]));
  } else if (currentCover && bestCover && bestCover.id !== currentCover.id &&
    commercialScore(bestCover) - commercialScore(currentCover) >= 8) {
    out.push(rec(propertyId, "portada", "sugerencia", "Hay una portada más comercial",
      `«${bestCover.title}» puntúa ${commercialScore(bestCover)} frente a ${commercialScore(currentCover)} de la actual.`,
      [bestCover.id]));
  }

  /* Apertura de vídeo */
  const opener = pickOpener(assets);
  if (opener) {
    out.push(rec(propertyId, "apertura", "info", "Apertura de vídeo recomendada",
      `Abre con «${opener.title}»: es el plano con más gancho para los 2 primeros segundos.`,
      [opener.id]));
  }

  /* Material faltante */
  if (coverage.missing.length > 0) {
    out.push(rec(propertyId, "falta-material", "importante", "Faltan estancias clave",
      `Sin fotos de: ${coverage.missing.map((r) => ROOM_LABEL[r]).join(", ")}. Completa el reportaje para no frenar leads.`));
  }
  if (coverage.videoCount === 0) {
    out.push(rec(propertyId, "falta-material", "sugerencia", "Sin vídeo bruto",
      "Un clip de 15–30s (aunque sea de móvil) permite generar reels y tour para portales."));
  }

  /* Calidad */
  const weak = photos.filter((a) => technicalScore(a) < 72);
  if (weak.length > 0) {
    out.push(rec(propertyId, "calidad", "sugerencia", `${weak.length} foto${weak.length > 1 ? "s" : ""} por debajo del listón`,
      `Repetir con mejor luz: ${weak.slice(0, 3).map((a) => `«${a.title}»`).join(", ")}${weak.length > 3 ? "…" : ""}.`,
      weak.map((a) => a.id)));
  }

  /* Variantes de canal pendientes */
  const withVerticals = assets.some((a) => a.variants.some((v) => v.ratio === "9:16"));
  if (photos.length >= 4 && !withVerticals) {
    out.push(rec(propertyId, "variante", "sugerencia", "Sin recortes verticales",
      "Genera variantes 9:16 de tus 4 mejores fotos para Reels/TikTok sin re-fotografiar."));
  }

  /* Piezas por canal aún no trabajadas */
  const usedChannels = new Set(publishing.map((p) => p.channel));
  if (!usedChannels.has("whatsapp") && photos.length >= 3) {
    out.push(rec(propertyId, "pieza", "info", "Prepara el paquete WhatsApp",
      `Aún no hay pieza de ${CHANNEL_LABEL.whatsapp}: es el canal que más visitas cierra.`));
  }
  if (!usedChannels.has("reels") && coverage.score >= 60) {
    out.push(rec(propertyId, "pieza", "info", "Este inmueble da para un reel",
      "Cobertura suficiente para un vertical de 20s con la plantilla «Captación rápida»."));
  }

  const severityRank = { importante: 0, sugerencia: 1, info: 2 } as const;
  return out.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
}
