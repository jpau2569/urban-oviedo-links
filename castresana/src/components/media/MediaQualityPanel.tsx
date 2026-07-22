import type { MediaCoverage } from "@/types/media";
import { REQUIRED_ROOMS, ROOM_ICON, ROOM_LABEL } from "@/lib/media/mediaTypes";

/**
 * Panel de calidad de cobertura: nota global, qué estancias están
 * cubiertas y cuáles faltan. La "salud visual" del inmueble en 5 segundos.
 */
export function MediaQualityPanel({ coverage }: { coverage: MediaCoverage }) {
  const rows = [
    { lbl: "Cobertura", val: coverage.score },
    { lbl: "Fotos", val: Math.min(100, coverage.photoCount * 10), display: String(coverage.photoCount) },
    { lbl: "Vídeos", val: coverage.videoCount > 0 ? 100 : 0, display: String(coverage.videoCount) },
  ];
  return (
    <div className="s-card s-card-pad">
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18 }}>
        <div className="ring" style={{ ["--p" as string]: coverage.score }}>
          <span>{coverage.score}</span>
        </div>
        <div>
          <p className="eyebrow">Salud visual del inmueble</p>
          <p className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
            {coverage.score >= 80
              ? "Material listo para campaña completa."
              : coverage.score >= 55
                ? "Buen material — hay huecos que cubrir."
                : "Material insuficiente: prioriza completar el reportaje."}
          </p>
        </div>
      </div>

      {rows.map((r) => (
        <div key={r.lbl} className="qual-row">
          <span className="lbl">{r.lbl}</span>
          <div className="track"><div className="fill" style={{ width: `${r.val}%` }} /></div>
          <span className="val">{r.display ?? r.val}</span>
        </div>
      ))}

      <hr className="s-hairline" />
      <p className="eyebrow" style={{ marginBottom: 10 }}>Estancias imprescindibles</p>
      <div className="room-dots">
        {REQUIRED_ROOMS.map((room) => {
          const on = coverage.covered.includes(room);
          return (
            <span key={room} className={`room-dot ${on ? "on" : "off"}`}>
              {ROOM_ICON[room]} {ROOM_LABEL[room]} {on ? "✓" : "· falta"}
            </span>
          );
        })}
      </div>
    </div>
  );
}
