import Link from "next/link";
import { resolveClientPropertyDetail, fmtPrice } from "@/lib/portal/portalViewModels";
import { PortalShell } from "@/components/portal/PortalShell";
import { PropertyArt, StatusPill } from "@/components/portal/PropertyArt";
import { VisitPlanner } from "@/components/portal/VisitPlanner";
import { DocumentVault } from "@/components/portal/DocumentVault";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Detalle de propiedad" };

function videoEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

export default async function ClientPropertyDetail({
  params,
}: {
  params: Promise<{ token: string; id: string }>;
}) {
  const { token, id } = await params;
  const res = await resolveClientPropertyDetail(token, id);
  if (!res.ok) return <SecureAccessError reason={res.reason} />;
  const { session, property: p, selection, visitsForProperty, documents } = res.data;
  const base = `/client-portal/${token}`;
  const embed = p.videoUrl ? videoEmbedUrl(p.videoUrl) : null;

  return (
    <PortalShell role="client" token={token} active={base} bandText={`Espacio de ${session.clientName}`}>
      <p style={{ marginBottom: 16 }}>
        <Link href={base} style={{ fontSize: 13, fontWeight: 700, color: "var(--copper)", textDecoration: "none" }}>
          ← Volver a tu selección
        </Link>
      </p>

      <div className="detail-hero">
        <PropertyArt accent={p.accent} />
        <div className="pills">
          {selection?.status === "nueva" && <span className="pill pill-new">✦ Nueva para ti</span>}
          {selection?.favorite && <span className="pill pill-fav">♥ Favorita</span>}
          <StatusPill status={p.status} />
        </div>
        <span className="ref">{p.ref}</span>
      </div>

      <div className="detail-grid">
        <div>
          <p className="eyebrow">{p.type} · {p.operation === "venta" ? "Venta" : "Alquiler"}</p>
          <h1 className="display" style={{ fontSize: "clamp(26px, 4vw, 38px)", marginTop: 6 }}>
            {p.title}
          </h1>
          <p className="muted" style={{ marginTop: 8, fontSize: 14.5 }}>{p.location}</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: "var(--walnut-deep)", marginTop: 14 }}>
            {fmtPrice(p.price)}
            {p.operation === "alquiler" && <span style={{ fontSize: 17, color: "var(--ink-mut)" }}> /mes</span>}
          </p>

          <div className="spec-strip" style={{ marginTop: 22 }}>
            {p.bedrooms ? (
              <div className="spec-cell"><b>{p.bedrooms}</b><span>Dormitorios</span></div>
            ) : null}
            {p.bathrooms ? (
              <div className="spec-cell"><b>{p.bathrooms}</b><span>Baños</span></div>
            ) : null}
            {p.area ? (
              <div className="spec-cell"><b>{p.area} m²</b><span>Superficie</span></div>
            ) : null}
            {p.area ? (
              <div className="spec-cell"><b>{Math.round(p.price / p.area).toLocaleString("es-ES")} €</b><span>por m²</span></div>
            ) : null}
          </div>

          {selection?.agentNote && (
            <p className="agent-note" style={{ margin: "22px 0 0" }}>
              <b>{session.agent.name.split(" ")[0]}:</b> “{selection.agentNote}”
            </p>
          )}

          <hr className="hairline" />
          <div className="highlights">
            {p.highlights.map((h) => (
              <span key={h} className="hl">✓ {h}</span>
            ))}
          </div>
          <p className="prose" style={{ marginTop: 18 }}>{p.description}</p>

          {embed && (
            <div style={{ marginTop: 26, borderRadius: 16, overflow: "hidden", aspectRatio: "16/9", border: "1px solid var(--hairline-soft)" }}>
              <iframe
                src={embed}
                title={`Tour en vídeo de ${p.title}`}
                style={{ width: "100%", height: "100%", border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}

          {visitsForProperty.length > 0 && (
            <section className="section">
              <div className="section-head"><h2 className="display">Visitas a esta propiedad</h2></div>
              <VisitPlanner visits={visitsForProperty} propertyIndex={{ [p.id]: p }} />
            </section>
          )}

          {documents.length > 0 && (
            <section className="section">
              <div className="section-head"><h2 className="display">Documentación</h2></div>
              <DocumentVault documents={documents} />
            </section>
          )}
        </div>

        <aside className="side-sticky">
          <div className="card card-pad">
            <p className="eyebrow" style={{ marginBottom: 12 }}>¿Quieres verla?</p>
            <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.6 }}>
              Dime cuándo te viene bien y organizo la visita — normalmente en menos de 48&nbsp;h.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 16 }}>
              <a
                className="btn btn-copper"
                href={`https://wa.me/${session.agent.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${session.agent.name.split(" ")[0]}, me gustaría visitar ${p.title} (${p.ref}).`)}`}
              >
                💬 Pedir visita
              </a>
              <a className="btn btn-ghost" href={`tel:${session.agent.phone}`}>📞 Llamar a {session.agent.name.split(" ")[0]}</a>
            </div>
          </div>
          <div className="agent-card">
            <div className="agent-av">{session.agent.initials}</div>
            <div>
              <b>{session.agent.name}</b>
              <small>{session.agent.role}</small>
            </div>
          </div>
        </aside>
      </div>
    </PortalShell>
  );
}
