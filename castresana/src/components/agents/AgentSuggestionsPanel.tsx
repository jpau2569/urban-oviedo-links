"use client";

import { useState } from "react";
import Link from "next/link";
import type { AgentSuggestion } from "@/types/agents";
import { getAgent } from "@/lib/agents/agentRegistry";

const IMPACT_CHIP: Record<AgentSuggestion["impact"], string> = { alto: "warn", medio: "", bajo: "dim" };

/**
 * Bandeja de revisión humana: cada propuesta muestra su porqué y qué se
 * ejecutará al aprobar. Estado optimista; en producción la resolución va a
 * PATCH /api/agents/suggestions/{id} y dispara la ejecución auditada.
 */
export function AgentSuggestionsPanel({
  initial,
  showAgent = true,
  title = "Bandeja de revisión",
}: {
  initial: AgentSuggestion[];
  showAgent?: boolean;
  title?: string;
}) {
  const [items, setItems] = useState(initial);
  const resolve = (id: string, status: "aprobada" | "descartada") =>
    setItems((xs) => xs.map((s) => (s.id === id ? { ...s, status } : s)));

  const pending = items.filter((s) => s.status === "pendiente").length;

  return (
    <div className="s-card s-card-pad">
      <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap", marginBottom: 14 }}>
        <p className="eyebrow">{title}</p>
        {pending > 0
          ? <span className="s-chip warn">{pending} propuesta{pending > 1 ? "s" : ""} esperando tu ojo</span>
          : <span className="s-chip ok">Todo revisado ✓</span>}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {items.length === 0 && (
          <p className="muted" style={{ fontSize: 13 }}>Sin propuestas ahora mismo — el equipo sigue observando.</p>
        )}
        {items.map((s) => {
          const agent = getAgent(s.agentId);
          const resolved = s.status !== "pendiente";
          return (
            <div key={s.id} className="reco" style={{ opacity: resolved ? 0.55 : 1, alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  {showAgent && agent && (
                    <Link href={`/agents/${agent.id}`} className="s-chip dim" style={{ textDecoration: "none" }}>
                      {agent.icon} {agent.name}
                    </Link>
                  )}
                  <span className={`s-chip ${IMPACT_CHIP[s.impact]}`}>impacto {s.impact}</span>
                  {s.relatedRef && <span className="s-chip dim">{s.relatedRef}</span>}
                </div>
                <b style={{ display: "block", marginTop: 8, fontSize: 14, color: "var(--paper-ink)" }}>{s.title}</b>
                <small style={{ display: "block", marginTop: 4 }}>🧠 <em>Porqué:</em> {s.reasoning}</small>
                <small style={{ display: "block", marginTop: 3 }}>▶ <em>Si apruebas:</em> {s.actionOnApprove}</small>
                {resolved && (
                  <span className={`s-chip ${s.status === "aprobada" ? "ok" : "dim"}`} style={{ marginTop: 8 }}>
                    {s.status === "aprobada" ? "✓ Aprobada — en ejecución, quedará auditada" : "Descartada — el agente toma nota"}
                  </span>
                )}
              </div>
              {!resolved && (
                <div style={{ display: "flex", flexDirection: "column", gap: 7, flexShrink: 0 }}>
                  <button type="button" className="btn btn-sm btn-copper" onClick={() => resolve(s.id, "aprobada")}>
                    ✓ Aprobar
                  </button>
                  <button type="button" className="btn btn-sm btn-ghost" onClick={() => resolve(s.id, "descartada")}>
                    Descartar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
