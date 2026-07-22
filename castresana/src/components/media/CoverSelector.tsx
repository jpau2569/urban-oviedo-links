"use client";

import { useState } from "react";
import type { MediaAsset } from "@/types/media";
import { MediaAssetCard } from "./MediaAssetCard";

/**
 * Biblioteca interactiva: clic en una foto para marcarla como portada.
 * Estado optimista local; la persistencia real irá a
 * PATCH /api/media/assets/{id} { isCover: true }.
 */
export function CoverSelector({ assets }: { assets: MediaAsset[] }) {
  const initialCover = assets.find((a) => a.isCover)?.id ?? null;
  const [coverId, setCoverId] = useState<string | null>(initialCover);

  return (
    <>
      <p className="muted" style={{ fontSize: 12.5, marginBottom: 14 }}>
        Clic en una foto para marcarla como <b style={{ color: "var(--copper-soft)" }}>portada</b> — se usará en
        portales, dosieres y como apertura por defecto.
      </p>
      <div className="asset-grid">
        {assets.map((a) => (
          <MediaAssetCard
            key={a.id}
            asset={{ ...a, isCover: false }}
            selected={coverId === a.id}
            onClick={a.kind === "photo" ? () => setCoverId(a.id) : undefined}
          />
        ))}
      </div>
    </>
  );
}
