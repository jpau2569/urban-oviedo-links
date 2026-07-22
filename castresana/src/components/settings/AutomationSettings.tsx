"use client";

import { useState } from "react";
import type { AutomationRuleConfig } from "@/types/settings";

/**
 * Autopiloto: reglas de automatización con activación por interruptor.
 * Persistencia real: tenants/{id}/settings/automation.
 */
export function AutomationSettings({ initialRules }: { initialRules: AutomationRuleConfig[] }) {
  const [rules, setRules] = useState(initialRules);
  const toggle = (id: string) => setRules((rs) => rs.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  const active = rules.filter((r) => r.enabled).length;
  const runs = rules.reduce((s, r) => s + r.runsThisMonth, 0);

  return (
    <div className="s-card s-card-pad">
      <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap", marginBottom: 16 }}>
        <p className="eyebrow">Reglas del Autopiloto</p>
        <span className="s-chip ok">{active} activas</span>
        <span className="s-chip dim">{runs} ejecuciones este mes</span>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {rules.map((r) => (
          <div key={r.id} className="tgl">
            <span className="tx">
              <b>{r.name}</b>
              <small>Cuando: {r.trigger} → {r.action} · {r.runsThisMonth} ejecuciones</small>
            </span>
            <button
              type="button"
              className={`tgl-pill ${r.enabled ? "on" : ""}`}
              onClick={() => toggle(r.id)}
              aria-pressed={r.enabled}
              aria-label={`${r.enabled ? "Desactivar" : "Activar"} ${r.name}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
