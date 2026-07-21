import type { MediaAsset } from "@/types/media";
import { MediaAssetCard } from "./MediaAssetCard";

/** Rejilla simple de assets (solo lectura). */
export function MediaAssetGrid({ assets }: { assets: MediaAsset[] }) {
  if (assets.length === 0) {
    return <p className="muted" style={{ fontSize: 13.5, padding: "16px 0" }}>Sin material todavía.</p>;
  }
  return (
    <div className="asset-grid">
      {assets.map((a) => (
        <MediaAssetCard key={a.id} asset={a} />
      ))}
    </div>
  );
}
