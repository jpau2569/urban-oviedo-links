import type { AgentPerformance } from "@/types/analytics";

/** Actividad por agente: la conversación honesta del equipo. */
export function AgentPerformanceTable({ agents }: { agents: AgentPerformance[] }) {
  return (
    <div className="s-card s-card-pad">
      <p className="eyebrow" style={{ marginBottom: 14 }}>Actividad por agente</p>
      <div className="os-wrap-x">
        <table className="os-table">
          <thead>
            <tr><th>Agente</th><th>Leads</th><th>Respuesta</th><th>Visitas</th><th>Cierres</th><th>Seguimiento</th></tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.userId}>
                <td><span className="av-sm">{a.initials}</span><b>{a.name}</b></td>
                <td className="num">{a.leadsAttended}</td>
                <td className="num">{a.avgResponseMinutes} min</td>
                <td className="num">{a.visitsDone}</td>
                <td className="num">{a.closings}</td>
                <td>
                  <span className={`s-chip ${a.followUpRate >= 85 ? "ok" : a.followUpRate >= 75 ? "" : "warn"}`}>
                    {a.followUpRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
