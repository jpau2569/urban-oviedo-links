import { guardPage } from "@/lib/auth/roleGuards";
import { AGENCY_PROFILE, CHANNELS, NOTIFICATION_PREFS } from "@/lib/os/mockOs";
import { CHANNEL_ICON, CHANNEL_LABEL } from "@/lib/media/mediaTypes";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { AgencyProfileForm } from "@/components/settings/AgencyProfileForm";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Agencia" };

export default async function AgencySettingsPage() {
  const guard = await guardPage("ajustes:edit");
  if (!guard.allowed) return <SecureAccessError reason="wrong_role" />;

  return (
    <SettingsShell
      active="/settings/agency"
      user={guard.user}
      title="Agencia"
      intro="Datos fiscales y comerciales, canales activos y avisos. Lo que firma cada documento y cada portal."
    >
      <div className="grid-2col">
        <AgencyProfileForm profile={AGENCY_PROFILE} />
        <div style={{ display: "grid", gap: 22 }}>
          <div className="s-card s-card-pad">
            <p className="eyebrow" style={{ marginBottom: 14 }}>Canales activos</p>
            <div style={{ display: "grid", gap: 9 }}>
              {CHANNELS.map((c) => (
                <div key={c.id} className="pub-row">
                  <span className="ch" aria-hidden="true">{CHANNEL_ICON[c.id]}</span>
                  <span className="who"><b>{CHANNEL_LABEL[c.id]}</b><small>{c.handle ?? c.note ?? ""}</small></span>
                  {c.enabled ? <span className="s-chip ok">Activo</span> : <span className="s-chip dim">Apagado</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="s-card s-card-pad">
            <p className="eyebrow" style={{ marginBottom: 14 }}>Notificaciones del equipo</p>
            <div style={{ display: "grid", gap: 8, fontSize: 13, color: "var(--paper-soft)" }}>
              <span>✓ Lead nuevo: {NOTIFICATION_PREFS.newLead ? "al instante" : "silenciado"}</span>
              <span>✓ Lead caliente sin actividad: {NOTIFICATION_PREFS.hotLeadInactivity ? "activo" : "apagado"}</span>
              <span>✓ Recordatorios de visita: {NOTIFICATION_PREFS.visitReminders ? "activo" : "apagado"}</span>
              <span>✓ Informe semanal a propietarios: {NOTIFICATION_PREFS.ownerWeeklyReport ? "activo" : "apagado"}</span>
              <span>✓ Resumen diario a las {NOTIFICATION_PREFS.dailyDigestHour}:00 · por {NOTIFICATION_PREFS.channels.join(" y ")}</span>
            </div>
          </div>
        </div>
      </div>
    </SettingsShell>
  );
}
