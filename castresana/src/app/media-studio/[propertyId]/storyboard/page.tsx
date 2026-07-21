import { notFound } from "next/navigation";
import { mockProperties } from "@/lib/portal/mockData";
import { assetsFor } from "@/lib/media/mockMedia";
import { MediaStudioShell } from "@/components/media/MediaStudioShell";
import { StoryboardBuilder } from "@/components/media/StoryboardBuilder";

export const metadata = { title: "Storyboard" };

/** Constructor de storyboard del inmueble. */
export default async function StoryboardPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = await params;
  const property = mockProperties[propertyId];
  if (!property) notFound();

  return (
    <MediaStudioShell property={property} active="storyboard">
      <p className="eyebrow">Storyboard builder</p>
      <h1 className="display" style={{ fontSize: "clamp(26px, 4vw, 38px)", color: "var(--paper-ink)", marginTop: 6 }}>
        Monta el vídeo de {property.ref}
      </h1>
      <p className="muted" style={{ marginTop: 10, maxWidth: "64ch", lineHeight: 1.65, fontSize: 14 }}>
        Elige qué contar y dónde publicarlo: Vende Todo propone el guion con tus mejores planos y tú lo
        afinas — orden, ritmo y rótulos.
      </p>
      <div style={{ marginTop: 28 }}>
        <StoryboardBuilder property={property} assets={assetsFor(propertyId)} />
      </div>
    </MediaStudioShell>
  );
}
