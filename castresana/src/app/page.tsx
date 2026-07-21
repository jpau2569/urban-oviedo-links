import Link from "next/link";

/**
 * Índice interno de desarrollo. En producción esta ruta redirige a la web
 * pública o al login del equipo; los portales solo se alcanzan por enlace
 * privado con token.
 */
export default function Home() {
  return (
    <div className="access-error">
      <div className="box">
        <div className="glyph">🏛️</div>
        <h1 className="display">Castresana</h1>
        <p>
          Plataforma de portales privados. Accesos de demostración:
        </p>
        <p style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 18 }}>
          <Link className="btn btn-copper" href="/client-portal/demo-cliente">
            Portal cliente
          </Link>
          <Link className="btn btn-ghost" style={{ color: "#c9976f", borderColor: "#4a3b30" }} href="/owner-portal/demo-propietario">
            Portal propietario
          </Link>
        </p>
      </div>
    </div>
  );
}
