import type { MediaAsset } from "@/types/media";
import { commercialScore } from "@/lib/media/mediaScoring";
import { KIND_LABEL, ROOM_ICON, ROOM_LABEL, fmtDuration } from "@/lib/media/mediaTypes";

/**
 * Tarjeta de asset: arte placeholder de paleta cálida + icono de estancia
 * (en producción, la imagen real de Storage), score comercial y metadatos.
 * Presentacional pura: el click lo gestiona quien la monta.
 */
export function MediaAssetCard({
  asset,
  onClick,
  selected,
}: {
  asset: MediaAsset;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <div
      className={`asset ${asset.isCover || selected ? "is-cover" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
    >
      <div className={`asset-art m-${asset.palette}`} aria-hidden="true">
        {ROOM_ICON[asset.room]}
        {(asset.isCover || selected) && <span className="cover-tag">Portada</span>}
        <span className="score">{commercialScore(asset)}</span>
        {asset.kind === "video" && asset.durationSec && <span className="dur">▶ {fmtDuration(asset.durationSec)}</span>}
        {asset.kind === "thumbnail" && <span className="dur">Miniatura</span>}
      </div>
      <div className="asset-meta">
        <b>{asset.title}</b>
        <small>
          {ROOM_LABEL[asset.room]} · {KIND_LABEL[asset.kind]}
          {asset.variants.length > 0 && <span className="s-chip dim" style={{ padding: "1px 8px", fontSize: 9.5 }}>{asset.variants.length} var.</span>}
        </small>
      </div>
    </div>
  );
}
