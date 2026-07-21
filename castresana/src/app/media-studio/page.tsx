import Link from "next/link";
import { mockProperties } from "@/lib/portal/mockData";
import { assetsFor, propertyIdsWithMedia, publishingFor } from "@/lib/media/mockMedia";
import { buildCoverage } from "@/lib/media/mediaScoring";
import { buildRecommendations } from "@/lib/media/mediaRecommendations";
import { summarize } from "@/lib/media/publishingManager";
import { ROOM_ICON } from "@/lib/media/mediaTypes";
import { MediaStudioShell } from "@/components/media/MediaStudioShell";

export const metadata = { title: "Media Studio" };

/**
 * Home del Studio: parque de inmuebles con su salud visual, piezas y
 * pendientes. "Vende Todo" saluda con lo más urgente del día.
 */
export default function MediaStudioHome() {
  const rows = propertyIdsWithMedia()
    .map((id) => {
      const property = mockProperties[id];
      if (!property) return null;
      const assets = assetsFor(id);
      const publishing = publishingFor(id);
      return {
        property,
        assets,
        coverage: buildCoverage(id, assets),
        recommendations: buildRecommendations(id, assets, publishing),
        pub: summarize(publishing),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)
    .sort((a, b) => a.coverage.score - b.coverage.score); // lo más flojo, arriba: ahí hay trabajo

  const urgent = rows.flatMap((r) =>
    r.recommendations.filter((x) => x.severity === "importante").map((x) => ({ ...x, ref: r.property.ref })),
  );

  return (
    <MediaStudioShell property={null} active="home">
      <section className="welcome" style={{ background: "linear-gradient(150deg, #241e19, #3d2f24 70%, #5a4331)" }}>
        <p className="eyebrow">Vende Todo · tu estudio creativo</p>
        <h1>Cada inmueble, presentado para vender.</h1>
        <p className="lede">
          {urgent.length > 0
            ? `Hoy hay ${urgent.length} ${urgent.length === 1 ? "asunto importante" : "asuntos importantes"}: ${urgent
                .slice(0, 2)
                .map((u) => `${u.ref} — ${u.title.toLowerCase()}`)
                .join("; ")}${urgent.length > 2 ? "…" : "."}`
            : "Material al día. Buen momento para generar piezas nuevas de captación."}
        </p>
        <div className="facts">
          <div className="fact"><b>{rows.length}</b><span>Inmuebles con media</span></div>
          <div className="fact"><b>{rows.reduce((s, r) => s + r.assets.length, 0)}</b><span>Assets</span></div>
          <div className="fact"><b>{rows.reduce((s, r) => s + r.pub.done, 0)}</b><span>Piezas publicadas</span></div>
          <div className="fact"><b>{rows.reduce((s, r) => s + r.pub.pending, 0)}</b><span>Pendientes</span></div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="display" style={{ color: "var(--paper-ink)" }}>Inmuebles en el estudio</h2>
          <span className="count" style={{ color: "var(--paper-soft)" }}>ordenados por dónde hace más falta trabajo</span>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {rows.map(({ property, assets, coverage, recommendations, pub }) => {
            const cover = assets.find((a) => a.isCover) ?? assets[0];
            const topReco = recommendations[0];
            return (
              <div key={property.id} className="s-card studio-prop">
                <div className={`art-mini m-${cover?.palette ?? "night"}`} aria-hidden="true">
                  {cover ? ROOM_ICON[cover.room] : "🏠"}
                </div>
                <div className="info">
                  <b>{property.title}</b>
                  <small>{property.ref} · {property.location} · {property.price.toLocaleString("es-ES")} €</small>
                  {topReco && (
                    <small style={{ display: "block", marginTop: 5, color: topReco.severity === "importante" ? "#d99a86" : "var(--copper-soft)" }}>
                      {topReco.severity === "importante" ? "⚠︎" : "✦"} {topReco.title}
                    </small>
                  )}
                </div>
                <div className="stats">
                  <div><b>{coverage.photoCount}</b><span>Fotos</span></div>
                  <div><b>{coverage.videoCount}</b><span>Vídeos</span></div>
                  <div><b>{pub.done}</b><span>Publicadas</span></div>
                </div>
                <div className="ring" style={{ ["--p" as string]: coverage.score }}><span>{coverage.score}</span></div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Link className="btn btn-sm btn-copper" href={`/media-studio/${property.id}`}>Abrir estudio</Link>
                  <Link className="btn btn-sm btn-ghost" href={`/media-studio/${property.id}/storyboard`}>🎬 Storyboard</Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </MediaStudioShell>
  );
}
