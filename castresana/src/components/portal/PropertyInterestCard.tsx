"use client";

import Link from "next/link";
import { useState } from "react";
import type { SelectionStatus } from "@/types/portal";
import type { RecommendationVM } from "@/lib/portal/portalViewModels";
import { PropertyArt, StatusPill } from "./PropertyArt";

/**
 * Tarjeta de propiedad recomendada con acciones del cliente:
 * favorito y "me interesa". Estado optimista en local; la persistencia
 * real irá contra un Route Handler que revalida el token
 * (POST /api/portal/selection { token, selectionId, action }).
 */
export function PropertyInterestCard({ rec, token }: { rec: RecommendationVM; token: string }) {
  const { property: p, selection } = rec;
  const [favorite, setFavorite] = useState<boolean>(selection.favorite);
  const [status, setStatus] = useState<SelectionStatus>(selection.status);

  const detailHref = `/client-portal/${token}/properties/${p.id}`;
  const agentFirst = "Marta";

  return (
    <article className="prop-card">
      <div className="prop-art">
        <PropertyArt accent={p.accent} />
        <div className="pills">
          {status === "nueva" && <span className="pill pill-new">✦ Nueva para ti</span>}
          {favorite && <span className="pill pill-fav">♥ Favorita</span>}
          <StatusPill status={p.status} />
        </div>
        <span className="ref">{p.ref}</span>
        <Link href={detailHref} aria-label={`Ver ${p.title}`} />
      </div>

      <div className="prop-info">
        <div className="prop-price">
          {p.price.toLocaleString("es-ES")} €{p.operation === "alquiler" && <small> /mes</small>}
        </div>
        <h3 className="prop-name">
          <Link href={detailHref}>{p.title}</Link>
        </h3>
        <p className="prop-where">{p.location}</p>
        <div className="prop-specs">
          {p.bedrooms ? <span>{p.bedrooms} dorm.</span> : null}
          {p.bathrooms ? <span>{p.bathrooms} baños</span> : null}
          {p.area ? <span>{p.area} m²</span> : null}
        </div>
      </div>

      {selection.agentNote && (
        <p className="agent-note">
          <b>{agentFirst}:</b> “{selection.agentNote}”
        </p>
      )}

      <div className="prop-cta">
        <button
          type="button"
          className={favorite ? "btn btn-sm btn-carbon" : "btn btn-sm btn-ghost"}
          onClick={() => setFavorite((f) => !f)}
          aria-pressed={favorite}
        >
          {favorite ? "♥ Guardada" : "♡ Guardar"}
        </button>
        <button
          type="button"
          className={status === "interesa" ? "btn btn-sm btn-copper" : "btn btn-sm btn-ghost"}
          onClick={() => setStatus((s) => (s === "interesa" ? "vista" : "interesa"))}
          aria-pressed={status === "interesa"}
        >
          {status === "interesa" ? "✓ Me interesa" : "Me interesa"}
        </button>
      </div>
    </article>
  );
}
