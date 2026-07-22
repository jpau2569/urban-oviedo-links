import Link from "next/link";
import { notFound } from "next/navigation";
import { guardPage } from "@/lib/auth/roleGuards";
import { getAgent } from "@/lib/agents/agentRegistry";
import { getModule } from "@/lib/os/modules";
import { kpisFor, suggestionsFor, workFor } from "@/lib/agents/agentWork";
import { OsShell } from "@/components/os/OsShell";
import { AgentSuggestionsPanel } from "@/components/agents/AgentSuggestionsPanel";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Agente" };

function timeAgo(iso: string): string {
  const h = Math.round((Date.now() - new Date(iso).getTime()) / 3600_000);
  if (h < 1) return "hace minutos";
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.round(h / 24)} d`;
}

/** Ficha de un agente: misión, habilidades, guardarraíles, KPIs y trabajo. */
export default async function AgentDetailPage({ params }: { params: Promise<{ agentId: string }> }) {
  const guard = await guardPage("inteligencia:view");
  if (!guard.allowed) return <SecureAccessError reason="wrong_role" />;
  const { agentId } = await params;
  const agent = getAgent(agentId);
  if (!agent) notFound();

  const k = kpisFor(agent.id);
  const mod = getModule(agent.module);
  const work = workFor(agent.id);

  return (
    <OsShell active="os" user={guard.user}>
      <p style={{ marginBottom: 16 }}>
        <Link href="/agents" style={{ fontSize: 13, fontWeight: 700, color: "var(--copper-soft)", textDecoration: "none" }}>
          ← Volver al equipo
        </Link>
      </p>

      <section className="welcome" style={{ background: "linear-gradient(150deg, #241e19, #3d2f24 70%, #5a4331)" }}>
        <p className="eyebrow">{agent.role}</p>
        <h1>{agent.icon} {agent.name}</h1>
        <p className="lede">
          <em>«{agent.mission}»</em>
          {mod && (
            <>
              <br />Opera en <strong style={{ color: "var(--copper-soft)" }}>{mod.icon} {mod.name}</strong> con los permisos de ese módulo — ni uno más.
            </>
          )}
        </p>
        {k && (
          <div className="facts">
            <div className="fact"><b>{k.tasksToday}</b><span>Hoy</span></div>
            <div className="fact"><b>{k.tasksMonth}</b><span>Este mes</span></div>
            <div className="fact"><b>{k.acceptanceRate}%</b><span>Aceptación</span></div>
            <div className="fact"><b>{k.hoursSavedMonth} h</b><span>Ahorradas/mes</span></div>
          </div>
        )}
      </section>

      <section className="section grid-2col">
        <div style={{ display: "grid", gap: 22 }}>
          <AgentSuggestionsPanel initial={suggestionsFor(agent.id)} showAgent={false} title="Propuestas pendientes" />

          <div className="s-card s-card-pad">
            <p className="eyebrow" style={{ marginBottom: 14 }}>Trabajo reciente · siempre auditado</p>
            <div style={{ display: "grid", gap: 9 }}>
              {work.length === 0 && <p className="muted" style={{ fontSize: 13 }}>Aún sin historial.</p>}
              {work.map((w) => (
                <div key={w.id} className="pub-row">
                  <span className="ch" aria-hidden="true">{w.outcome === "aprobado" ? "✅" : "⚙️"}</span>
                  <span className="who">
                    <b>{w.summary}</b>
                    <small>{timeAgo(w.at)} · {w.outcome === "aprobado" ? "aprobado por una persona" : "regla pre-aprobada del Autopiloto"}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 22 }}>
          <div className="s-card s-card-pad">
            <p className="eyebrow" style={{ marginBottom: 14 }}>Habilidades</p>
            <div style={{ display: "grid", gap: 10 }}>
              {agent.skills.map((s) => (
                <div key={s.name} className="tgl">
                  <span className="tx"><b>{s.name}</b><small>{s.detail}</small></span>
                </div>
              ))}
            </div>
          </div>

          <div className="s-card s-card-pad">
            <p className="eyebrow" style={{ marginBottom: 14 }}>Guardarraíles propios</p>
            <div style={{ display: "grid", gap: 10 }}>
              {agent.guardrails.map((g) => (
                <div key={g} className="reco importante">
                  <div><small>{g}</small></div>
                </div>
              ))}
            </div>
            <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>
              Además del <Link href="/agents" style={{ color: "var(--copper-soft)" }}>contrato común del equipo</Link>, que aplica siempre.
            </p>
          </div>
        </div>
      </section>
    </OsShell>
  );
}
