export const metadata = { title: "Sin conexión" };

/** Fallback offline del service worker: elegante incluso sin red. */
export default function OfflinePage() {
  return (
    <div className="access-error">
      <div className="box">
        <div className="glyph">📡</div>
        <h1>Sin conexión</h1>
        <p>
          Castresana OS no encuentra red ahora mismo. Lo último que visitaste sigue disponible desde
          el historial; en cuanto vuelva la conexión, todo se pondrá al día solo.
        </p>
        <p style={{ marginTop: 20, fontSize: 13 }}>
          <a href="/" style={{ color: "#c9976f", fontWeight: 700 }}>Reintentar</a>
        </p>
      </div>
    </div>
  );
}
