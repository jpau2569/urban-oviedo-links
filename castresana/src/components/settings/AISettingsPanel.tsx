"use client";

import { useState } from "react";
import type { AISettings } from "@/types/settings";

/**
 * Preferencias de Inteligencia (Vende Todo). La revisión humana de
 * respuestas es un compromiso de producto: no se puede desactivar aquí.
 */
export function AISettingsPanel({ initial }: { initial: AISettings }) {
  const [s, setS] = useState(initial);
  const flip = (k: "autoDraftReplies" | "autoScoreLeads" | "mediaRecommendations") =>
    setS((prev) => ({ ...prev, [k]: !prev[k] }));

  return (
    <div style={{ display: "grid", gap: 22, maxWidth: 720 }}>
      <div className="s-card s-card-pad">
        <p className="eyebrow" style={{ marginBottom: 16 }}>Asistente comercial</p>
        <div className="os-row2">
          <div className="os-field"><label htmlFor="ai-name">Nombre del asistente</label><input id="ai-name" defaultValue={s.assistantName} /></div>
          <div className="os-field">
            <label htmlFor="ai-tone">Tono</label>
            <select id="ai-tone" defaultValue={s.tone}>
              <option value="cercano">Cercano</option>
              <option value="profesional">Profesional</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <div className="tgl">
            <span className="tx"><b>Borradores de respuesta</b><small>Redacta la primera respuesta a cada lead para que el agente la revise y envíe.</small></span>
            <button type="button" className={`tgl-pill ${s.autoDraftReplies ? "on" : ""}`} onClick={() => flip("autoDraftReplies")} aria-pressed={s.autoDraftReplies} aria-label="Borradores de respuesta" />
          </div>
          <div className="tgl">
            <span className="tx"><b>Scoring de leads</b><small>Prioriza oportunidades por probabilidad de visita y cierre.</small></span>
            <button type="button" className={`tgl-pill ${s.autoScoreLeads ? "on" : ""}`} onClick={() => flip("autoScoreLeads")} aria-pressed={s.autoScoreLeads} aria-label="Scoring de leads" />
          </div>
          <div className="tgl">
            <span className="tx"><b>Recomendaciones de media</b><small>Sugerencias de portada, secuencia y piezas en el Media Studio.</small></span>
            <button type="button" className={`tgl-pill ${s.mediaRecommendations ? "on" : ""}`} onClick={() => flip("mediaRecommendations")} aria-pressed={s.mediaRecommendations} aria-label="Recomendaciones de media" />
          </div>
          <div className="tgl" style={{ opacity: 0.75 }}>
            <span className="tx"><b>Revisión humana obligatoria</b><small>Ninguna respuesta IA sale sin aprobación de una persona. Fijo por diseño.</small></span>
            <span className="s-chip ok">Siempre</span>
          </div>
        </div>
      </div>
      <div className="s-card s-card-pad">
        <p className="eyebrow" style={{ marginBottom: 10 }}>Consumo</p>
        <div className="qual-row">
          <span className="lbl">Créditos/mes</span>
          <div className="track"><div className="fill" style={{ width: "38%" }} /></div>
          <span className="val">38%</span>
        </div>
        <p className="muted" style={{ fontSize: 12 }}>Presupuesto mensual: {s.monthlyCreditBudget.toLocaleString("es-ES")} créditos · el Autopiloto se pausa al 95% y avisa.</p>
      </div>
    </div>
  );
}
