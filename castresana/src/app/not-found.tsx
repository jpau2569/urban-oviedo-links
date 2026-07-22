import Link from "next/link";

/** 404 con la estética de la casa — nada de página blanca por defecto. */
export default function NotFound() {
  return (
    <div className="access-error">
      <div className="box">
        <div className="glyph">🧭</div>
        <h1>Esta página no existe</h1>
        <p>
          La dirección no corresponde a ninguna pantalla de Castresana OS. Puede que el enlace esté
          incompleto o que el recurso se haya movido.
        </p>
        <p style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
          <Link className="btn btn-copper" href="/">Ir al inicio</Link>
        </p>
      </div>
    </div>
  );
}
