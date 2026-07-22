import type { AgencyProfile } from "@/types/settings";

/**
 * Perfil de agencia (datos fiscales y comerciales). Solo lectura + edición
 * visual en mock; el guardado real irá a tenants/{id}/settings/agency.
 */
export function AgencyProfileForm({ profile }: { profile: AgencyProfile }) {
  return (
    <form className="s-card s-card-pad" style={{ maxWidth: 720 }}>
      <p className="eyebrow" style={{ marginBottom: 16 }}>Perfil de la agencia</p>
      <div className="os-row2">
        <div className="os-field"><label htmlFor="ag-display">Nombre comercial</label><input id="ag-display" defaultValue={profile.displayName} /></div>
        <div className="os-field"><label htmlFor="ag-legal">Razón social</label><input id="ag-legal" defaultValue={profile.legalName} /></div>
      </div>
      <div className="os-row2">
        <div className="os-field"><label htmlFor="ag-tax">CIF/NIF</label><input id="ag-tax" defaultValue={profile.taxId} /></div>
        <div className="os-field"><label htmlFor="ag-phone">Teléfono</label><input id="ag-phone" defaultValue={profile.phone} /></div>
      </div>
      <div className="os-field"><label htmlFor="ag-addr">Dirección</label><input id="ag-addr" defaultValue={`${profile.address}, ${profile.postalCode} ${profile.city}`} /></div>
      <div className="os-row2">
        <div className="os-field"><label htmlFor="ag-mail">Email</label><input id="ag-mail" type="email" defaultValue={profile.email} /></div>
        <div className="os-field"><label htmlFor="ag-web">Web</label><input id="ag-web" defaultValue={profile.website} /></div>
      </div>
      <div className="os-field"><label htmlFor="ag-hours">Horario de oficina</label><input id="ag-hours" defaultValue={profile.officeHours} /></div>
      <button type="button" className="btn btn-copper btn-sm">Guardar cambios</button>
    </form>
  );
}
