import { notFound } from "next/navigation";
import { mockProperties } from "@/lib/portal/mockData";
import { assetsFor, exportJobsFor, publishingFor } from "@/lib/media/mockMedia";
import { MediaStudioShell } from "@/components/media/MediaStudioShell";
import { ExportQueuePanel } from "@/components/media/ExportQueuePanel";
import { PublishingCenter } from "@/components/media/PublishingCenter";

export const metadata = { title: "Exportar y publicar" };

/** Cola de exportación + centro de publicación del inmueble. */
export default async function ExportsPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = await params;
  const property = mockProperties[propertyId];
  if (!property) notFound();

  return (
    <MediaStudioShell property={property} active="exports">
      <p className="eyebrow">Salida y distribución</p>
      <h1 className="display" style={{ fontSize: "clamp(26px, 4vw, 38px)", color: "var(--paper-ink)", marginTop: 6 }}>
        Exportar y publicar {property.ref}
      </h1>
      <p className="muted" style={{ marginTop: 10, maxWidth: "64ch", lineHeight: 1.65, fontSize: 14 }}>
        Genera paquetes por canal, sigue la cola de render y controla qué pieza está publicada, programada o
        enviada — incluidos los envíos directos a leads y al portal del propietario.
      </p>

      <div style={{ display: "grid", gap: 22, marginTop: 28 }}>
        <ExportQueuePanel property={property} assets={assetsFor(propertyId)} initialJobs={exportJobsFor(propertyId)} />
        <PublishingCenter initialRecords={publishingFor(propertyId)} />

        <div className="s-card s-card-pad">
          <p className="eyebrow" style={{ marginBottom: 12 }}>Conectado con el ecosistema</p>
          <p className="muted" style={{ fontSize: 13, lineHeight: 1.7 }}>
            Las piezas listas pueden adjuntarse a una conversación del Inbox, enviarse por WhatsApp a un lead
            interesado, publicarse en el <b style={{ color: "var(--copper-soft)" }}>portal del cliente</b> como
            recomendación visual, o llegar al <b style={{ color: "var(--copper-soft)" }}>portal del propietario</b> como
            actualización de marketing — el estado queda registrado aquí y en el timeline comercial del inmueble.
          </p>
        </div>
      </div>
    </MediaStudioShell>
  );
}
