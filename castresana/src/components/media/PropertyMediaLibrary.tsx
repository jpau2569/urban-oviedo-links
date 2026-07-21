import type { MediaAsset } from "@/types/media";
import { CHANNEL_ICON, CHANNEL_LABEL, RATIO_LABEL, fmtShortDate } from "@/lib/media/mediaTypes";
import { CoverSelector } from "./CoverSelector";

/**
 * Biblioteca del inmueble: selector de portada sobre todo el material y
 * grupo de variantes ya derivadas por canal.
 */
export function PropertyMediaLibrary({ assets }: { assets: MediaAsset[] }) {
  const variants = assets.flatMap((a) => a.variants.map((v) => ({ asset: a, variant: v })));
  return (
    <div style={{ display: "grid", gap: 26 }}>
      <div className="s-card s-card-pad">
        <p className="eyebrow" style={{ marginBottom: 14 }}>Material del inmueble · {assets.length} assets</p>
        <CoverSelector assets={assets} />
      </div>

      <div className="s-card s-card-pad">
        <p className="eyebrow" style={{ marginBottom: 14 }}>Versiones por canal · {variants.length}</p>
        {variants.length === 0 ? (
          <p className="muted" style={{ fontSize: 13 }}>
            Aún no hay variantes derivadas. Genera recortes por canal desde «Exportar y publicar».
          </p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {variants.map(({ asset, variant }) => (
              <div key={variant.id} className="pub-row">
                <span className="ch" aria-hidden="true">{CHANNEL_ICON[variant.channel]}</span>
                <span className="who">
                  <b>{asset.title} — {variant.label}</b>
                  <small>{CHANNEL_LABEL[variant.channel]} · {RATIO_LABEL[variant.ratio]} · lista desde {fmtShortDate(variant.readyAt)}</small>
                </span>
                <span className="pub-st publicada">Lista</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
