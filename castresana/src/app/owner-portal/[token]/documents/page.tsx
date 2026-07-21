import { resolveOwnerPortal } from "@/lib/portal/portalViewModels";
import { PortalShell } from "@/components/portal/PortalShell";
import { DocumentVault } from "@/components/portal/DocumentVault";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Documentos del inmueble" };

export default async function OwnerDocumentsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const res = await resolveOwnerPortal(token);
  if (!res.ok) return <SecureAccessError reason={res.reason} />;
  const vm = res.data;

  return (
    <PortalShell
      role="owner"
      token={token}
      active={`/owner-portal/${token}/documents`}
      bandText={`Propietario: ${vm.session.ownerName}`}
    >
      <p className="eyebrow">Archivo del inmueble</p>
      <h1 className="display" style={{ fontSize: "clamp(28px, 4vw, 40px)", marginTop: 6 }}>Documentos</h1>
      <p className="muted" style={{ marginTop: 10, maxWidth: "60ch", lineHeight: 1.65 }}>
        Contratos, certificados, el dossier comercial y los informes periódicos de {vm.property.title.toLowerCase()}.
      </p>
      <section className="section">
        <DocumentVault documents={vm.documents} />
      </section>
    </PortalShell>
  );
}
