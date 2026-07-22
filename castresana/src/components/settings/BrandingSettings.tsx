import type { Tenant } from "@/types/tenant";

/**
 * Marca de la agencia: identidad que heredan portales, dosieres y piezas
 * del Studio. En multi-tenant, cada agencia pinta aquí su propia cara.
 */
export function BrandingSettings({ tenant }: { tenant: Tenant }) {
  const b = tenant.branding;
  return (
    <div style={{ display: "grid", gap: 22, maxWidth: 720 }}>
      <div className="s-card s-card-pad">
        <p className="eyebrow" style={{ marginBottom: 16 }}>Identidad</p>
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 18 }}>
          <span
            className="st-badge"
            style={{ width: 64, height: 64, fontSize: 30, fontFamily: "var(--font-display)", fontWeight: 700, background: `linear-gradient(140deg, ${b.colorAccent}, ${b.colorPrimary})` }}
            aria-hidden="true"
          >
            {b.monogram}
          </span>
          <div>
            <b style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--paper-ink)" }}>{b.displayName}</b>
            <p className="muted" style={{ fontSize: 12.5 }}>
              {tenant.city} · plan {tenant.planId} · {tenant.operations.join(" y ")}
            </p>
          </div>
        </div>
        <div className="os-row2">
          <div className="os-field"><label htmlFor="br-name">Nombre visible</label><input id="br-name" defaultValue={b.displayName} /></div>
          <div className="os-field"><label htmlFor="br-mono">Monograma</label><input id="br-mono" defaultValue={b.monogram} maxLength={2} /></div>
        </div>
        <div className="os-row2">
          <div className="os-field"><label htmlFor="br-c1">Color principal</label><input id="br-c1" type="color" defaultValue={b.colorPrimary} style={{ height: 44, padding: 4 }} /></div>
          <div className="os-field"><label htmlFor="br-c2">Color acento</label><input id="br-c2" type="color" defaultValue={b.colorAccent} style={{ height: 44, padding: 4 }} /></div>
        </div>
        <div className="os-field"><label htmlFor="br-logo">Logo (SVG/PNG)</label><input id="br-logo" type="file" accept="image/*" /></div>
        <button type="button" className="btn btn-copper btn-sm">Aplicar marca</button>
      </div>
      <div className="s-card s-card-pad">
        <p className="eyebrow" style={{ marginBottom: 10 }}>Dónde se aplica</p>
        <p className="muted" style={{ fontSize: 13, lineHeight: 1.7 }}>
          Portal del cliente y del propietario, fichas PDF y dosieres, plantillas del Media Studio, firmas de
          email e informes. Un cambio aquí actualiza toda la experiencia externa de la agencia.
        </p>
      </div>
    </div>
  );
}
