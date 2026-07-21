/**
 * Etiquetas, iconos y helpers de presentación del Media Studio.
 * Única fuente de verdad para nombres visibles de estancias, canales,
 * estados y formatos — los componentes nunca hardcodean estos literales.
 */

import type {
  AspectRatio,
  ExportKind,
  ExportStatus,
  MediaKind,
  ProjectStatus,
  PublishingChannelId,
  PublishingStatus,
  RoomTag,
  SceneRole,
} from "@/types/media";

export const ROOM_LABEL: Record<RoomTag, string> = {
  exterior: "Exterior",
  portal: "Portal",
  salon: "Salón",
  cocina: "Cocina",
  dormitorio: "Dormitorio",
  bano: "Baño",
  terraza: "Terraza",
  vistas: "Vistas",
  garaje: "Garaje",
  plano: "Plano",
  detalle: "Detalle",
};

export const ROOM_ICON: Record<RoomTag, string> = {
  exterior: "🏛️",
  portal: "🚪",
  salon: "🛋️",
  cocina: "🍳",
  dormitorio: "🛏️",
  bano: "🛁",
  terraza: "🌿",
  vistas: "🌄",
  garaje: "🚗",
  plano: "📐",
  detalle: "✨",
};

export const KIND_LABEL: Record<MediaKind, string> = {
  photo: "Foto",
  video: "Vídeo",
  thumbnail: "Miniatura",
};

export const CHANNEL_LABEL: Record<PublishingChannelId, string> = {
  whatsapp: "WhatsApp",
  reels: "Instagram Reels",
  tiktok: "TikTok",
  shorts: "YouTube Shorts",
  youtube: "YouTube",
  web: "Web / Portales",
  "client-portal": "Portal cliente",
  "owner-portal": "Portal propietario",
  email: "Email",
};

export const CHANNEL_ICON: Record<PublishingChannelId, string> = {
  whatsapp: "💬",
  reels: "📱",
  tiktok: "🎵",
  shorts: "▶️",
  youtube: "🎬",
  web: "🌐",
  "client-portal": "👤",
  "owner-portal": "🏠",
  email: "✉️",
};

export const RATIO_LABEL: Record<AspectRatio, string> = {
  "9:16": "Vertical 9:16",
  "16:9": "Horizontal 16:9",
  "1:1": "Cuadrado 1:1",
  "4:5": "Retrato 4:5",
};

export const SCENE_ROLE_LABEL: Record<SceneRole, string> = {
  gancho: "Gancho",
  espacio: "Espacio",
  detalle: "Detalle",
  datos: "Datos",
  cta: "Cierre / CTA",
};

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  borrador: "Borrador",
  listo: "Listo para exportar",
  exportado: "Exportado",
};

export const EXPORT_KIND_LABEL: Record<ExportKind, string> = {
  mp4: "Vídeo MP4",
  zip: "ZIP de assets",
  pdf: "Ficha visual PDF",
  "pack-whatsapp": "Paquete WhatsApp",
  "pack-social": "Paquete redes",
  "enlace-privado": "Enlace privado",
};

export const EXPORT_STATUS_LABEL: Record<ExportStatus, string> = {
  "en-cola": "En cola",
  procesando: "Procesando",
  listo: "Listo",
  error: "Error",
};

export const PUBLISHING_STATUS_LABEL: Record<PublishingStatus, string> = {
  borrador: "Borrador",
  lista: "Lista",
  programada: "Programada",
  publicada: "Publicada",
  enviada: "Enviada",
};

/** Orden natural de recorrido comercial de un inmueble. */
export const ROOM_SEQUENCE: RoomTag[] = [
  "exterior",
  "portal",
  "salon",
  "cocina",
  "dormitorio",
  "bano",
  "terraza",
  "vistas",
  "garaje",
  "plano",
  "detalle",
];

/** Estancias imprescindibles para considerar bien cubierto un inmueble. */
export const REQUIRED_ROOMS: RoomTag[] = ["exterior", "salon", "cocina", "dormitorio", "bano"];

export function fmtDuration(totalSec: number): string {
  const s = Math.round(totalSec);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")} min`;
}

export function fmtShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}
