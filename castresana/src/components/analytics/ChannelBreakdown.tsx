import type { ChannelPerformance } from "@/types/analytics";

/** Canales por rentabilidad: leads → visitas → cierres. */
export function ChannelBreakdown({ channels }: { channels: ChannelPerformance[] }) {
  const max = Math.max(1, ...channels.map((c) => c.leads));
  return (
    <div className="s-card s-card-pad">
      <p className="eyebrow" style={{ marginBottom: 16 }}>Canales más rentables</p>
      <div style={{ display: "grid", gap: 12 }}>
        {channels.map((c) => (
          <div key={c.channel} className="funnel-row" style={{ gridTemplateColumns: "110px 1fr 120px" }}>
            <span className="lbl" style={{ color: "var(--paper-soft)" }}>{c.label}</span>
            <div className="bar" style={{ background: "rgba(226,215,196,.1)" }}>
              <div className="fill" style={{ width: `${(c.leads / max) * 100}%` }} />
            </div>
            <span style={{ fontSize: 12, color: "var(--paper-soft)", textAlign: "right" }}>
              <b style={{ color: "var(--copper-soft)" }}>{c.leads}</b> leads · {c.visits} vis. · {c.closings} cierre{c.closings === 1 ? "" : "s"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
