/**
 * Dos variantes:
 *  - "inline": nota discreta al pie de página sobre la naturaleza del enlace.
 *  - "error": pantalla completa cuando el token no es válido.
 */

const REASON_COPY: Record<string, { glyph: string; title: string; body: string }> = {
  expired: {
    glyph: "⏳",
    title: "Este enlace ha caducado",
    body: "Por seguridad, los accesos privados de Castresana tienen una vigencia limitada. Pide a tu asesor un enlace nuevo y volverás a entrar en segundos.",
  },
  revoked: {
    glyph: "🔒",
    title: "Acceso desactivado",
    body: "Este enlace ha sido desactivado. Si crees que es un error, contacta con tu asesor de Castresana.",
  },
  not_found: {
    glyph: "🔍",
    title: "Enlace no reconocido",
    body: "No encontramos ningún espacio asociado a este enlace. Revisa que la dirección esté completa o solicita uno nuevo a tu asesor.",
  },
  wrong_role: {
    glyph: "🚪",
    title: "Este no es tu portal",
    body: "El enlace es válido pero pertenece a otro tipo de acceso. Usa el enlace que te envió tu asesor para este espacio.",
  },
};

export function SecureAccessError({ reason }: { reason: string }) {
  const copy = REASON_COPY[reason] ?? REASON_COPY.not_found!;
  return (
    <div className="access-error">
      <div className="box">
        <div className="glyph">{copy.glyph}</div>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <p style={{ marginTop: 20, fontSize: 13 }}>
          <a href="tel:+34984000000" style={{ color: "#c9976f", fontWeight: 700 }}>
            📞 +34 984 000 000
          </a>
        </p>
      </div>
    </div>
  );
}

export function SecureAccessNotice({ expiresInDays }: { expiresInDays: number }) {
  return (
    <div className="secure-note">
      <span className="lock" aria-hidden="true">
        🔐
      </span>
      <span>
        Este es un espacio privado creado para ti por Castresana. El enlace es personal, no requiere
        contraseña y caducará automáticamente en {expiresInDays} día{expiresInDays === 1 ? "" : "s"}.
        Si lo necesitas más tiempo, tu asesor puede renovarlo al instante.
      </span>
    </div>
  );
}
