import type { RenderPreset } from "@/types/media";
import { CHANNEL_ICON, RATIO_LABEL, fmtDuration } from "@/lib/media/mediaTypes";

/** Selector de preset de render por canal (controlado por el StoryboardBuilder). */
export function RenderPresetPicker({
  presets,
  selectedId,
  recommendedIds,
  onSelect,
}: {
  presets: RenderPreset[];
  selectedId: string;
  recommendedIds: string[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="pick-grid">
      {presets.map((p) => (
        <button key={p.id} type="button" className={`pick ${p.id === selectedId ? "on" : ""}`} onClick={() => onSelect(p.id)}>
          <b>
            {CHANNEL_ICON[p.channel]} {p.name}
            {recommendedIds.includes(p.id) && (
              <span className="s-chip" style={{ marginLeft: 7, padding: "1px 8px", fontSize: 9 }}>ideal</span>
            )}
          </b>
          <small>
            {RATIO_LABEL[p.ratio]} · objetivo {fmtDuration(p.targetDurationSec)} · ritmo {p.pace}
          </small>
          <small style={{ marginTop: 4 }}>🎵 {p.musicHint}</small>
        </button>
      ))}
    </div>
  );
}
