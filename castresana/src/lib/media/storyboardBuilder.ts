/**
 * Constructor de storyboards: plantilla × preset × assets → escenas.
 *
 * Reparte la duración objetivo del preset entre las escenas del guion
 * (gancho corto, espacios más largos, CTA fijo), asigna a cada escena el
 * mejor asset disponible según las estancias sugeridas y prepara los
 * rótulos interpolando datos del inmueble.
 */

import type { PortalProperty } from "@/types/portal";
import type {
  ContentTemplate,
  MediaAsset,
  RenderPreset,
  SceneRole,
  StoryboardScene,
} from "@/types/media";
import { bestForRooms } from "./mediaScoring";

/** Peso relativo de duración por rol de escena. */
const ROLE_WEIGHT: Record<SceneRole, number> = {
  gancho: 0.8,
  espacio: 1.2,
  detalle: 1,
  datos: 0.9,
  cta: 0.7,
};

const ROLE_TRANSITION: Record<SceneRole, StoryboardScene["transition"]> = {
  gancho: "corte",
  espacio: "fundido",
  detalle: "corte",
  datos: "barrido",
  cta: "fundido",
};

function interpolate(hint: string, property: PortalProperty): string {
  return hint
    .replaceAll("{price}", property.price.toLocaleString("es-ES") + " €")
    .replaceAll("{location}", property.location.split("·").pop()?.trim() ?? property.location)
    .replaceAll("{ref}", property.ref)
    .replaceAll("{title}", property.title);
}

/**
 * Genera las escenas de un storyboard nuevo. Determinista: sin azar, para
 * que el mismo material produzca siempre el mismo guion (cacheable).
 */
export function buildScenes(
  template: ContentTemplate,
  preset: RenderPreset,
  assets: MediaAsset[],
  property: PortalProperty,
): StoryboardScene[] {
  const blueprint = template.sceneBlueprint;
  const weightTotal = blueprint.reduce((s, b) => s + ROLE_WEIGHT[b.role], 0);
  const used = new Set<string>();

  return blueprint.map((bp, i) => {
    // El gancho respeta las prioridades visuales del canal.
    const rooms = bp.role === "gancho" ? [...preset.visualPriorities, ...bp.roomHints] : bp.roomHints;
    const asset = bestForRooms(assets, rooms, used);
    if (asset) used.add(asset.id);
    const duration = (ROLE_WEIGHT[bp.role] / weightTotal) * preset.targetDurationSec;
    return {
      id: `sc-${i + 1}`,
      order: i + 1,
      role: bp.role,
      assetId: asset?.id ?? null,
      durationSec: Math.max(1.5, Math.round(duration * 2) / 2),
      text: bp.textHint ? interpolate(bp.textHint, property) : undefined,
      transition: ROLE_TRANSITION[bp.role],
    };
  });
}

export function totalDuration(scenes: StoryboardScene[]): number {
  return scenes.reduce((s, sc) => s + sc.durationSec, 0);
}

/** Mueve una escena arriba/abajo devolviendo un array nuevo reordenado. */
export function moveScene(scenes: StoryboardScene[], sceneId: string, dir: -1 | 1): StoryboardScene[] {
  const idx = scenes.findIndex((s) => s.id === sceneId);
  const target = idx + dir;
  if (idx < 0 || target < 0 || target >= scenes.length) return scenes;
  const next = [...scenes];
  const a = next[idx];
  const b = next[target];
  if (!a || !b) return scenes;
  next[idx] = b;
  next[target] = a;
  return next.map((s, i) => ({ ...s, order: i + 1 }));
}

/** Ajusta la duración de una escena dentro de límites razonables. */
export function setSceneDuration(
  scenes: StoryboardScene[],
  sceneId: string,
  durationSec: number,
): StoryboardScene[] {
  const clamped = Math.min(12, Math.max(1.5, Math.round(durationSec * 2) / 2));
  return scenes.map((s) => (s.id === sceneId ? { ...s, durationSec: clamped } : s));
}

/** ¿El guion cabe en el canal? Devuelve desvío frente al objetivo. */
export function durationCheck(
  scenes: StoryboardScene[],
  preset: RenderPreset,
): { total: number; withinMax: boolean; deltaToTarget: number } {
  const total = totalDuration(scenes);
  return {
    total,
    withinMax: total <= preset.maxDurationSec,
    deltaToTarget: Math.round((total - preset.targetDurationSec) * 10) / 10,
  };
}
