import type { MediaAsset, StoryboardScene } from "@/types/media";
import { ROOM_ICON } from "@/lib/media/mediaTypes";
import { totalDuration } from "@/lib/media/storyboardBuilder";

const PALETTE_BG: Record<string, string> = {
  walnut: "#6e5440",
  copper: "#a86f47",
  olive: "#6b6b4e",
  slate: "#5c5952",
  sand: "#a98a66",
  night: "#3a342d",
};

/** Barra proporcional del guion: cada bloque = escena, ancho = duración. */
export function StoryboardTimeline({
  scenes,
  assetIndex,
}: {
  scenes: StoryboardScene[];
  assetIndex: Record<string, MediaAsset>;
}) {
  const total = totalDuration(scenes) || 1;
  return (
    <div className="sb-timeline" role="img" aria-label="Línea de tiempo del vídeo">
      {scenes.map((s) => {
        const asset = s.assetId ? assetIndex[s.assetId] : undefined;
        return (
          <div
            key={s.id}
            style={{ flexGrow: s.durationSec / total, flexBasis: 0, background: asset ? PALETTE_BG[asset.palette] ?? "#444" : "rgba(226,215,196,.12)" }}
            title={`${s.role} · ${s.durationSec}s`}
          >
            {asset ? ROOM_ICON[asset.room] : "∅"}
          </div>
        );
      })}
    </div>
  );
}
