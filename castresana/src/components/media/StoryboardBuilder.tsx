"use client";

import { useMemo, useState } from "react";
import type { MediaAsset } from "@/types/media";
import type { PortalProperty } from "@/types/portal";
import { CONTENT_TEMPLATES, RENDER_PRESETS, getPreset, getTemplate } from "@/lib/media/mediaPresets";
import { ROOM_ICON, SCENE_ROLE_LABEL, fmtDuration } from "@/lib/media/mediaTypes";
import {
  buildScenes,
  durationCheck,
  moveScene,
  setSceneDuration,
} from "@/lib/media/storyboardBuilder";
import { ContentTemplatePicker } from "./ContentTemplatePicker";
import { RenderPresetPicker } from "./RenderPresetPicker";
import { StoryboardTimeline } from "./StoryboardTimeline";

/**
 * Constructor de storyboard: plantilla → preset → guion editable.
 * El guion se regenera al cambiar plantilla/preset y luego se puede
 * reordenar y ajustar escena a escena. Guardado real: POST /api/media/projects.
 */
export function StoryboardBuilder({
  property,
  assets,
}: {
  property: PortalProperty;
  assets: MediaAsset[];
}) {
  const [templateId, setTemplateId] = useState<string>(CONTENT_TEMPLATES[0]?.id ?? "tp-venta");
  const [presetId, setPresetId] = useState<string>(RENDER_PRESETS[1]?.id ?? "pr-reels");

  const template = getTemplate(templateId) ?? CONTENT_TEMPLATES[0]!;
  const preset = getPreset(presetId) ?? RENDER_PRESETS[0]!;

  const [scenes, setScenes] = useState(() => buildScenes(template, preset, assets, property));

  const assetIndex = useMemo(() => {
    const idx: Record<string, MediaAsset> = {};
    for (const a of assets) idx[a.id] = a;
    return idx;
  }, [assets]);

  const regenerate = (nextTemplateId: string, nextPresetId: string) => {
    const t = getTemplate(nextTemplateId);
    const p = getPreset(nextPresetId);
    if (t && p) setScenes(buildScenes(t, p, assets, property));
  };

  const check = durationCheck(scenes, preset);

  return (
    <div style={{ display: "grid", gap: 26 }}>
      <div className="s-card s-card-pad">
        <p className="eyebrow" style={{ marginBottom: 14 }}>1 · Qué contamos — plantilla</p>
        <ContentTemplatePicker
          templates={CONTENT_TEMPLATES}
          selectedId={templateId}
          onSelect={(id) => { setTemplateId(id); regenerate(id, presetId); }}
        />
      </div>

      <div className="s-card s-card-pad">
        <p className="eyebrow" style={{ marginBottom: 14 }}>2 · Dónde se publica — preset de canal</p>
        <RenderPresetPicker
          presets={RENDER_PRESETS}
          selectedId={presetId}
          recommendedIds={template.recommendedPresetIds}
          onSelect={(id) => { setPresetId(id); regenerate(templateId, id); }}
        />
      </div>

      <div className="s-card s-card-pad">
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
          <p className="eyebrow">3 · Guion — {scenes.length} escenas</p>
          <span className={`s-chip ${check.withinMax ? "ok" : "warn"}`}>
            {fmtDuration(check.total)} / objetivo {fmtDuration(preset.targetDurationSec)}
            {check.withinMax ? "" : ` · supera el máximo de ${fmtDuration(preset.maxDurationSec)}`}
          </span>
        </div>

        <StoryboardTimeline scenes={scenes} assetIndex={assetIndex} />

        <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
          {scenes.map((s, i) => {
            const asset = s.assetId ? assetIndex[s.assetId] : undefined;
            return (
              <div key={s.id} className={`sb-scene ${asset ? "" : "empty-slot"}`}>
                <div className={`sb-thumb ${asset ? `m-${asset.palette}` : ""}`} aria-hidden="true">
                  {asset ? ROOM_ICON[asset.room] : "＋"}
                </div>
                <div className="sb-info">
                  <b>
                    {i + 1}. {SCENE_ROLE_LABEL[s.role]} — {asset ? asset.title : "hueco sin cubrir"}
                  </b>
                  <small>Transición: {s.transition}</small>
                  {s.text && <span className="sb-text">“{s.text}”</span>}
                </div>
                <div className="sb-acts">
                  <button type="button" aria-label="Menos duración" onClick={() => setScenes(setSceneDuration(scenes, s.id, s.durationSec - 0.5))}>−</button>
                  <span className="sb-dur">{s.durationSec}s</span>
                  <button type="button" aria-label="Más duración" onClick={() => setScenes(setSceneDuration(scenes, s.id, s.durationSec + 0.5))}>＋</button>
                  <button type="button" aria-label="Subir escena" disabled={i === 0} onClick={() => setScenes(moveScene(scenes, s.id, -1))}>↑</button>
                  <button type="button" aria-label="Bajar escena" disabled={i === scenes.length - 1} onClick={() => setScenes(moveScene(scenes, s.id, 1))}>↓</button>
                </div>
              </div>
            );
          })}
        </div>

        <hr className="s-hairline" />
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <p className="eyebrow" style={{ marginBottom: 6 }}>Copy sugerido para el canal</p>
            <p className="muted" style={{ fontSize: 13, lineHeight: 1.55 }}>{preset.suggestedCopy}</p>
            <p style={{ fontSize: 12.5, color: "var(--copper-soft)", fontWeight: 700, marginTop: 6 }}>CTA final: {preset.cta}</p>
          </div>
          <a className="btn btn-copper" href={`/media-studio/${property.id}/exports`}>
            Continuar a exportación →
          </a>
        </div>
      </div>
    </div>
  );
}
