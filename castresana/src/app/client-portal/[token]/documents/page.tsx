import { resolveClientPortal } from "@/lib/portal/portalViewModels";
import { PortalShell } from "@/components/portal/PortalShell";
import { DocumentVault } from "@/components/portal/DocumentVault";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Documentos" };

export default async function ClientDocumentsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const res = await resolveClientPortal(token);
  if (!res.ok) return <SecureAccessError reason={res.reason} />;
  const vm = res.data;

  return (
    <PortalShell
      role="client"
      token={token}
      active={`/client-portal/${token}/documents`}
      bandText={`Espacio de ${vm.session.clientName}`}
    >
      <p className="eyebrow">Biblioteca</p>
      <h1 className="display" style={{ fontSize: "clamp(28px, 4vw, 40px)", marginTop: 6 }}>Tus documentos</h1>
      <p className="muted" style={{ marginTop: 10, maxWidth: "60ch", lineHeight: 1.65 }}>
        Dosieres de las propiedades seleccionadas, tu simulación financiera y las guías de Castresana.
      </p>
      <section className="section">
        <DocumentVault documents={vm.documents} />
      </section>
    </PortalShell>
  );
}
