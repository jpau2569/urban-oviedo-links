import Link from "next/link";
import { notFound } from "next/navigation";
import { mockProperties } from "@/lib/portal/mockData";
import { assetsFor, projectsFor, publishingFor } from "@/lib/media/mockMedia";
import { buildCoverage } from "@/lib/media/mediaScoring";
import { buildRecommendations } from "@/lib/media/mediaRecommendations";
import { PROJECT_STATUS_LABEL, fmtShortDate } from "@/lib/media/mediaTypes";
import { getPreset, getTemplate } from "@/lib/media/mediaPresets";
import { MediaStudioShell } from "@/components/media/MediaStudioShell";
import { PropertyMediaLibrary } from "@/components/media/PropertyMediaLibrary";
import { MediaQualityPanel } from "@/components/media/MediaQualityPanel";

export const metadata = { title: "Biblioteca de media" };

/** Biblioteca del inmueble: material, salud visual, consejos y proyectos. */
export default async function PropertyStudioPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = await params;
  const property = mockProperties[propertyId];
  if (!property) notFound();

  const assets = assetsFor(propertyId);
  const coverage = buildCoverage(propertyId, assets);
  const recommendations = buildRecommendations(propertyId, assets, publishingFor(propertyId));
  const projects = projectsFor(propertyId);

  return (
    <MediaStudioShell property={property} active="library">
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
        <h1 className="display" style={{ fontSize: "clamp(26px, 4vw, 38px)", color: "var(--paper-ink)" }}>
          {property.title}
        </h1>
        <span className="s-chip dim">{property.ref} · {property.price.toLocaleString("es-ES")} €</span>
      </div>

      <div className="grid-2col" style={{ marginTop: 26 }}>
        <PropertyMediaLibrary assets={assets} />

        <div style={{ display: "grid", gap: 22 }}>
          <MediaQualityPanel coverage={coverage} />

          <div className="s-card s-card-pad">
            <p className="eyebrow" style={{ marginBottom: 14 }}>Vende Todo recomienda</p>
            <div style={{ display: "grid", gap: 10 }}>
              {recommendations.length === 0 && (
                <p className="muted" style={{ fontSize: 13 }}>Todo en orden: material completo y piezas al día. 👏</p>
              )}
              {recommendations.map((r) => (
                <div key={r.id} className={`reco ${r.severity}`}>
                  <div>
                    <b>{r.title}</b>
                    <small>{r.detail}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="s-card s-card-pad">
            <p className="eyebrow" style={{ marginBottom: 14 }}>Proyectos de vídeo</p>
            <div style={{ display: "grid", gap: 10 }}>
              {projects.length === 0 && (
                <p className="muted" style={{ fontSize: 13 }}>Sin proyectos aún — crea el primero en el storyboard.</p>
              )}
              {projects.map((p) => (
                <div key={p.id} className="pub-row">
                  <span className="ch">🎬</span>
                  <span className="who">
                    <b>{p.name}</b>
                    <small>
                      {getTemplate(p.templateId)?.name} · {getPreset(p.presetId)?.name} · {fmtShortDate(p.updatedAt)}
                    </small>
                  </span>
                  <span className={`pub-st ${p.status === "exportado" ? "publicada" : p.status === "listo" ? "lista" : "borrador"}`}>
                    {PROJECT_STATUS_LABEL[p.status]}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <Link className="btn btn-sm btn-copper" href={`/media-studio/${property.id}/storyboard`}>
                🎬 Nuevo storyboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MediaStudioShell>
  );
}
