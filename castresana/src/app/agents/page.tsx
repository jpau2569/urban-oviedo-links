import Link from "next/link";
import { guardPage } from "@/lib/auth/roleGuards";
import { AGENTS, AGENT_CONTRACT } from "@/lib/agents/agentRegistry";
import { AGENT_SUGGESTIONS, kpisFor, teamTotals } from "@/lib/agents/agentWork";
import { OsShell } from "@/components/os/OsShell";
import { AgentSuggestionsPanel } from "@/components/agents/AgentSuggestionsPanel";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Equipo de agentes" };

/** El equipo de agentes IA: quiénes son, cómo trabajan y qué proponen hoy. */
export default async function AgentsPage() {
  const guard = await guardPage("inteligencia:view");
  if (!guard.allowed) return <SecureAccessError reason="wrong_role" />;
  const totals = teamTotals();

  return (
    <OsShell active="os" user={guard.user}>
      <section className="welcome" style={{ background: "linear-gradient(150deg, #241e19, #3d2f24 70%, #5a4331)" }}>
        <p className="eyebrow">Inteligencia · Vende Todo y su equipo</p>
        <h1>El equipo que nunca duerme.</h1>
        <p className="lede">
          Seis agentes especializados observan tu negocio y proponen; las personas aprueban. Nada sale
          sin revisión humana, todo queda auditado y su nota es la tasa de aceptación de sus propuestas.
        </p>
        <div className="facts">
          <div className="fact"><b>{totals.pending}</b><span>Propuestas hoy</span></div>
          <div className="fact"><b>{totals.tasksMonth}</b><span>Trabajos este mes</span></div>
          <div className="fact"><b>{totals.acceptance}%</b><span>Aceptación media</span></div>
          <div className="fact"><b>{totals.hoursSaved} h</b><span>Ahorradas este mes</span></div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="display" style={{ color: "var(--paper-ink)" }}>El equipo</h2>
          <span className="count" style={{ color: "var(--paper-soft)" }}>cada agente, un módulo y unos límites</span>
        </div>
        <div className="os-modules">
          {AGENTS.map((a) => {
            const k = kpisFor(a.id);
            const pending = AGENT_SUGGESTIONS.filter((s) => s.agentId === a.id && s.status === "pendiente").length;
            return (
              <Link key={a.id} href={`/agents/${a.id}`} className="os-mod">
                {a.isLead && <span className="soon s-chip">Jefe de equipo</span>}
                <span className="ic" aria-hidden="true">{a.icon}</span>
                <b>{a.name}</b>
                <small style={{ color: "var(--copper-soft)", fontWeight: 700 }}>{a.role}</small>
                <small>{a.mission}</small>
                <small style={{ marginTop: 6 }}>
                  {k ? `${k.acceptanceRate}% aceptación · ${k.tasksMonth} trabajos/mes` : ""}
                  {pending > 0 ? ` · ${pending} propuesta${pending > 1 ? "s" : ""} hoy` : ""}
                </small>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section grid-2col">
        <AgentSuggestionsPanel initial={AGENT_SUGGESTIONS} title="Bandeja de revisión del equipo" />
        <div className="s-card s-card-pad">
          <p className="eyebrow" style={{ marginBottom: 14 }}>El contrato de los agentes</p>
          <div style={{ display: "grid", gap: 10 }}>
            {AGENT_CONTRACT.map((rule, i) => (
              <div key={rule} className="reco">
                <div>
                  <b>{i + 1}.</b>
                  <small style={{ marginTop: 2 }}>{rule}</small>
                </div>
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>
            Este contrato es innegociable y está codificado en los guardarraíles de cada agente. La
            preferencia «revisión humana obligatoria» de <Link href="/settings/ai" style={{ color: "var(--copper-soft)" }}>Ajustes → Inteligencia</Link> está
            fijada por diseño.
          </p>
        </div>
      </section>
    </OsShell>
  );
}
