"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Onboarding de agente en 5 pasos. Al terminar se guardaría en
 * users/{uid}.onboardedAt + settings personales. El onboarding de una
 * agencia nueva (tenant) vive en Ajustes → Agencia/Marca y se orquesta
 * en V3 con un asistente equivalente a este.
 */
const STEPS = ["Bienvenida", "Tu perfil", "Objetivos", "Canales", "Avisos"] as const;

export function OnboardingWizard({ userName }: { userName: string }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const last = step === STEPS.length - 1;

  if (done) {
    return (
      <div className="onb-card s-card s-card-pad" style={{ textAlign: "center", padding: "48px 36px" }}>
        <div style={{ fontSize: 46 }}>🥂</div>
        <h1 className="display" style={{ fontSize: 30, color: "var(--paper-ink)", marginTop: 14 }}>Listo, {userName}.</h1>
        <p className="muted" style={{ marginTop: 10, lineHeight: 1.65, fontSize: 14 }}>
          Tu espacio está configurado. Vende Todo ya está priorizando tus oportunidades y el Autopiloto
          vigila que ningún lead se enfríe.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22, flexWrap: "wrap" }}>
          <Link className="btn btn-copper" href="/">Entrar en Castresana OS</Link>
          <Link className="btn btn-ghost" style={{ color: "#c9976f", borderColor: "rgba(201,151,111,.35)" }} href="/analytics">Ver resultados</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="onb-card">
      <p className="eyebrow" style={{ textAlign: "center" }}>Paso {step + 1} de {STEPS.length} · {STEPS[step]}</p>
      <div className="onb-steps" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length}>
        {STEPS.map((s, i) => <span key={s} className={i <= step ? "done" : ""} />)}
      </div>

      <div className="s-card s-card-pad">
        {step === 0 && (
          <div style={{ textAlign: "center", padding: "18px 6px" }}>
            <div style={{ fontSize: 42 }}>🏛️</div>
            <h1 className="display" style={{ fontSize: 30, color: "var(--paper-ink)", marginTop: 12 }}>
              Bienvenido/a a Castresana OS, {userName}.
            </h1>
            <p className="muted" style={{ marginTop: 12, lineHeight: 1.7, fontSize: 14 }}>
              Tu sistema operativo inmobiliario: capta, responde, organiza, recomienda, automatiza y
              enseña resultados. Este tour dura menos de 3 minutos y deja tu espacio a punto.
            </p>
          </div>
        )}
        {step === 1 && (
          <>
            <p className="eyebrow" style={{ marginBottom: 16 }}>Cómo te presentamos</p>
            <div className="os-row2">
              <div className="os-field"><label htmlFor="ob-name">Nombre visible</label><input id="ob-name" defaultValue={userName} /></div>
              <div className="os-field"><label htmlFor="ob-phone">Móvil de trabajo</label><input id="ob-phone" placeholder="+34 …" /></div>
            </div>
            <div className="os-field"><label htmlFor="ob-zone">Zonas que trabajas</label><input id="ob-zone" placeholder="Centro, Naranco, La Ería…" /></div>
            <p className="muted" style={{ fontSize: 12 }}>Aparecerá en portales privados, fichas y firmas.</p>
          </>
        )}
        {step === 2 && (
          <>
            <p className="eyebrow" style={{ marginBottom: 16 }}>Tus objetivos comerciales</p>
            <div className="os-row2">
              <div className="os-field"><label htmlFor="ob-val">Valoraciones/mes</label><input id="ob-val" type="number" defaultValue={4} /></div>
              <div className="os-field"><label htmlFor="ob-vis">Visitas/mes</label><input id="ob-vis" type="number" defaultValue={12} /></div>
            </div>
            <div className="os-row2">
              <div className="os-field"><label htmlFor="ob-cierre">Cierres/trimestre</label><input id="ob-cierre" type="number" defaultValue={4} /></div>
              <div className="os-field"><label htmlFor="ob-resp">Responder en (min)</label><input id="ob-resp" type="number" defaultValue={15} /></div>
            </div>
            <p className="muted" style={{ fontSize: 12 }}>Resultados medirá tu avance contra estos objetivos — solo lo ves tú y dirección.</p>
          </>
        )}
        {step === 3 && (
          <>
            <p className="eyebrow" style={{ marginBottom: 16 }}>Canales con los que trabajas</p>
            <div style={{ display: "grid", gap: 9 }}>
              {["WhatsApp Business", "Email", "Instagram", "Teléfono", "TikTok"].map((c, i) => (
                <label key={c} className="tgl" style={{ cursor: "pointer" }}>
                  <span className="tx"><b>{c}</b></span>
                  <input type="checkbox" defaultChecked={i < 4} style={{ width: 18, height: 18, accentColor: "#b0764f" }} />
                </label>
              ))}
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <p className="eyebrow" style={{ marginBottom: 16 }}>Cuándo quieres que te avisemos</p>
            <div style={{ display: "grid", gap: 9 }}>
              {[
                ["Lead nuevo", "Al instante — la velocidad cierra visitas"],
                ["Lead caliente sin contacto 24 h", "Para rescatarlo a tiempo"],
                ["Recordatorio de visitas", "La tarde anterior y 1 h antes"],
                ["Resumen diario", "A las 8:00, todo tu día en un vistazo"],
              ].map(([t, d]) => (
                <label key={t} className="tgl" style={{ cursor: "pointer" }}>
                  <span className="tx"><b>{t}</b><small>{d}</small></span>
                  <input type="checkbox" defaultChecked style={{ width: 18, height: 18, accentColor: "#b0764f" }} />
                </label>
              ))}
            </div>
          </>
        )}

        <hr className="s-hairline" />
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
          <button type="button" className="btn btn-ghost btn-sm" style={{ visibility: step === 0 ? "hidden" : "visible" }} onClick={() => setStep((s) => Math.max(0, s - 1))}>
            ← Atrás
          </button>
          <button type="button" className="btn btn-copper btn-sm" onClick={() => (last ? setDone(true) : setStep((s) => s + 1))}>
            {last ? "Terminar ✓" : step === 0 ? "Empezar" : "Siguiente →"}
          </button>
        </div>
      </div>
    </div>
  );
}
