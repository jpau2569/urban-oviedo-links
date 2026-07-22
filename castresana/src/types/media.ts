/**
 * Castresana Media Studio — modelo de dominio.
 *
 * El Studio convierte el material bruto de un inmueble (fotos, clips, datos)
 * en piezas comerciales por canal. Tipos serializables 1:1 con las
 * colecciones Firestore previstas: mediaAssets, mediaProjects, exportJobs,
 * publishingRecords.
 */

/* ─────────────── Assets ─────────────── */

export type MediaKind = "photo" | "video" | "thumbnail";

/** Estancia / rol visual de un asset dentro del inmueble. */
export type RoomTag =
  | "exterior"
  | "portal"
  | "salon"
  | "cocina"
  | "dormitorio"
  | "bano"
  | "terraza"
  | "vistas"
  | "garaje"
  | "plano"
  | "detalle";

/** Subscores 0–100 con los que trabaja el recomendador. */
export interface MediaAssetQuality {
  light: number;
  sharpness: number;
  composition: number;
  /** Atractivo comercial percibido (mock; en producción, modelo de visión). */
  appeal: number;
}

/** Paleta del arte placeholder (sin fotos reales en mock). */
export type ArtPalette = "walnut" | "copper" | "olive" | "slate" | "sand" | "night";

export interface MediaAsset {
  id: string;
  propertyId: string;
  kind: MediaKind;
  title: string;
  room: RoomTag;
  tags: string[];
  isCover: boolean;
  /** Orden manual dentro de la biblioteca. */
  order: number;
  capturedAt: string;
  /** Solo vídeo. */
  durationSec?: number;
  quality: MediaAssetQuality;
  palette: ArtPalette;
  /** Derivados ya generados por canal. */
  variants: AssetVariant[];
  /** Storage path / URL firmada en producción. */
  url?: string;
}

export type AspectRatio = "9:16" | "16:9" | "1:1" | "4:5";

export type PublishingChannelId =
  | "whatsapp"
  | "reels"
  | "tiktok"
  | "shorts"
  | "youtube"
  | "web"
  | "client-portal"
  | "owner-portal"
  | "email";

export interface AssetVariant {
  id: string;
  channel: PublishingChannelId;
  ratio: AspectRatio;
  label: string;
  readyAt: string;
}

/* ─────────────── Presets y plantillas ─────────────── */

export type ScenePace = "calmado" | "dinamico" | "rapido";

export interface RenderPreset {
  id: string;
  name: string;
  channel: PublishingChannelId;
  ratio: AspectRatio;
  targetDurationSec: number;
  maxDurationSec: number;
  pace: ScenePace;
  /** Copy sugerido para acompañar la pieza en el canal. */
  suggestedCopy: string;
  cta: string;
  /** Estancias que este canal premia (ordenadas por prioridad). */
  visualPriorities: RoomTag[];
  /** Pista de música placeholder. */
  musicHint: string;
}

export type TemplateGoal =
  | "venta"
  | "alquiler"
  | "inversion"
  | "premium"
  | "captacion"
  | "propietario"
  | "resumen-marketing";

/** Papel de una escena dentro del guion. */
export type SceneRole = "gancho" | "espacio" | "detalle" | "datos" | "cta";

export interface SceneBlueprint {
  role: SceneRole;
  /** Estancias preferidas para cubrir este hueco, por orden. */
  roomHints: RoomTag[];
  /** Sugerencia de rótulo; {price}/{location}/{ref} se interpolan. */
  textHint?: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  goal: TemplateGoal;
  description: string;
  tone: string;
  sceneBlueprint: SceneBlueprint[];
  recommendedPresetIds: string[];
}

/* ─────────────── Storyboard / proyectos ─────────────── */

export interface StoryboardScene {
  id: string;
  order: number;
  role: SceneRole;
  /** null = hueco sin cubrir (el recomendador lo señala). */
  assetId: string | null;
  durationSec: number;
  text?: string;
  transition: "corte" | "fundido" | "barrido";
}

export type ProjectStatus = "borrador" | "listo" | "exportado";

export interface MediaProject {
  id: string;
  propertyId: string;
  name: string;
  templateId: string;
  presetId: string;
  scenes: StoryboardScene[];
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

/* ─────────────── Export ─────────────── */

export type ExportKind = "mp4" | "zip" | "pdf" | "pack-whatsapp" | "pack-social" | "enlace-privado";

export type ExportStatus = "en-cola" | "procesando" | "listo" | "error";

export interface ExportOutput {
  fileName: string;
  sizeLabel: string;
  note: string;
  /** Enlace privado (token de portal) cuando aplica. */
  shareUrl?: string;
}

export interface ExportJob {
  id: string;
  propertyId: string;
  projectId?: string;
  presetId?: string;
  kind: ExportKind;
  label: string;
  status: ExportStatus;
  /** 0–100. */
  progress: number;
  createdAt: string;
  output?: ExportOutput;
}

/* ─────────────── Publicación ─────────────── */

export type PublishingStatus = "borrador" | "lista" | "programada" | "publicada" | "enviada";

export interface PublishingRecord {
  id: string;
  propertyId: string;
  pieceLabel: string;
  channel: PublishingChannelId;
  status: PublishingStatus;
  /** Fecha de publicación/envío (o programada). */
  date?: string;
  /** Destinatario cuando es un envío directo (lead, propietario…). */
  sentTo?: string;
}

/* ─────────────── Recomendaciones ─────────────── */

export type RecommendationKind =
  | "portada"
  | "apertura"
  | "secuencia"
  | "falta-material"
  | "calidad"
  | "variante"
  | "pieza";

export type RecommendationSeverity = "info" | "sugerencia" | "importante";

export interface MediaRecommendation {
  id: string;
  propertyId: string;
  kind: RecommendationKind;
  severity: RecommendationSeverity;
  title: string;
  detail: string;
  assetIds?: string[];
}

/** Cobertura visual del inmueble: qué está fotografiado y qué falta. */
export interface MediaCoverage {
  propertyId: string;
  /** 0–100: completitud comercial del material. */
  score: number;
  covered: RoomTag[];
  missing: RoomTag[];
  photoCount: number;
  videoCount: number;
  hasCover: boolean;
}
