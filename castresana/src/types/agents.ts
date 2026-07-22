/**
 * Castresana OS — equipo de agentes IA.
 *
 * Filosofía "santo grial": un agente perfecto no es el que actúa solo,
 * sino el que propone con criterio, trabaja dentro de guardarraíles,
 * deja auditoría de todo y mejora con cada revisión humana.
 *
 * Flujo canónico: el agente OBSERVA → PROPONE (AgentSuggestion) →
 * una persona APRUEBA/DESCARTA → el sistema EJECUTA → queda AUDITADO →
 * la tasa de aceptación alimenta la mejora del agente.
 */

import type { PermissionArea } from "./roles";

export type AgentId =
  | "vende-todo"
  | "primera-linea"
  | "el-vigia"
  | "el-guionista"
  | "el-analista"
  | "el-notario";

export interface AgentSkill {
  name: string;
  detail: string;
}

export interface AgentDefinition {
  id: AgentId;
  /** Nombre de agente (naming premium de la casa). */
  name: string;
  /** Cargo dentro del equipo. */
  role: string;
  icon: string;
  /** Misión en una frase — el listón contra el que se mide. */
  mission: string;
  /** Módulo del OS donde opera (hereda sus permisos, nunca más). */
  module: PermissionArea;
  skills: AgentSkill[];
  /** Límites duros e innegociables del agente. */
  guardrails: string[];
  /** El jefe de equipo orquesta al resto. */
  isLead?: boolean;
}

export type SuggestionImpact = "alto" | "medio" | "bajo";
export type SuggestionStatus = "pendiente" | "aprobada" | "descartada";

/** Propuesta de un agente esperando revisión humana. */
export interface AgentSuggestion {
  id: string;
  agentId: AgentId;
  createdAt: string;
  title: string;
  /** Por qué el agente lo propone (siempre explicable). */
  reasoning: string;
  /** Qué ejecutará el sistema si se aprueba. */
  actionOnApprove: string;
  impact: SuggestionImpact;
  status: SuggestionStatus;
  /** Referencia del ecosistema (inmueble, lead…). */
  relatedRef?: string;
}

/** Trabajo ya realizado por un agente (siempre auditado). */
export interface AgentWorkItem {
  id: string;
  agentId: AgentId;
  at: string;
  summary: string;
  /** aprobado = pasó revisión humana; automatico = regla pre-aprobada del Autopiloto. */
  outcome: "aprobado" | "automatico";
}

/** Métricas de calidad del trabajo del agente. */
export interface AgentKpis {
  agentId: AgentId;
  tasksToday: number;
  tasksMonth: number;
  /** % de propuestas aprobadas por humanos — la nota real del agente. */
  acceptanceRate: number;
  /** Horas de trabajo humano ahorradas este mes (estimación). */
  hoursSavedMonth: number;
}
