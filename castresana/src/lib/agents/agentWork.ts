/**
 * Trabajo del equipo de agentes: propuestas pendientes, historial y KPIs.
 * Mock coherente con el ecosistema (inmuebles AC-*, Lucía, Javier…).
 * En producción: tenants/{id}/agentSuggestions y /agentWork, escritos por
 * los workers de cada agente y resueltos desde esta UI.
 */

import type { AgentKpis, AgentSuggestion, AgentWorkItem } from "@/types/agents";

const hoursAgo = (h: number): string => new Date(Date.now() - h * 3600_000).toISOString();

export const AGENT_SUGGESTIONS: AgentSuggestion[] = [
  {
    id: "sug-1",
    agentId: "vende-todo",
    createdAt: hoursAgo(1),
    title: "Plan del día: 3 acciones que mueven visitas",
    reasoning: "Hay 2 leads calientes sin visita agendada y una segunda visita clave esta semana en AC-0012.",
    actionOnApprove: "Crea las 3 tareas priorizadas en la agenda del equipo y asigna responsables.",
    impact: "alto",
    status: "pendiente",
  },
  {
    id: "sug-2",
    agentId: "primera-linea",
    createdAt: hoursAgo(0),
    title: "Borrador listo para el lead de Idealista (AC-0007)",
    reasoning: "Pregunta por gastos de comunidad y orientación; ambos datos están en la ficha.",
    actionOnApprove: "Deja el borrador en Conversaciones listo para revisar y enviar en un toque.",
    impact: "alto",
    status: "pendiente",
    relatedRef: "AC-0007",
  },
  {
    id: "sug-3",
    agentId: "el-vigia",
    createdAt: hoursAgo(3),
    title: "Rescate: lead de AC-0019 sin contacto desde hace 3 días",
    reasoning: "Mostró interés alto (pidió plano y precio) y se enfrió tras la primera respuesta.",
    actionOnApprove: "Propone mensaje de retorno mencionando la doble terraza que le interesó.",
    impact: "medio",
    status: "pendiente",
    relatedRef: "AC-0019",
  },
  {
    id: "sug-4",
    agentId: "el-guionista",
    createdAt: hoursAgo(5),
    title: "Reel de captación para AC-0001 con la terraza como gancho",
    reasoning: "Cobertura visual 95/100 y 2 leads llegaron por Instagram esta semana: hay tracción.",
    actionOnApprove: "Genera el storyboard «Captación rápida × Reels» en borrador en Media Studio.",
    impact: "medio",
    status: "pendiente",
    relatedRef: "AC-0001",
  },
  {
    id: "sug-5",
    agentId: "el-analista",
    createdAt: hoursAgo(8),
    title: "AC-0007: 31 días, 7 leads y solo 4 visitas — revisar precio",
    reasoning: "Interés alto pero conversión a visita baja; el €/m² está un 6% sobre la media de la zona.",
    actionOnApprove: "Prepara propuesta de ajuste (−2% a −4%) con argumentos para comentar con el propietario.",
    impact: "alto",
    status: "pendiente",
    relatedRef: "AC-0007",
  },
  {
    id: "sug-6",
    agentId: "el-notario",
    createdAt: hoursAgo(10),
    title: "AC-0019 sin certificado energético adjunto",
    reasoning: "La ficha está publicada y el certificado es obligatorio para el dossier y los portales.",
    actionOnApprove: "Crea la tarea documental y avisa al agente responsable del inmueble.",
    impact: "medio",
    status: "pendiente",
    relatedRef: "AC-0019",
  },
];

export const AGENT_WORK: AgentWorkItem[] = [
  { id: "w-1", agentId: "primera-linea", at: hoursAgo(2), summary: "Borrador aprobado y enviado a lead de AC-0001 (respuesta en 4 min)", outcome: "aprobado" },
  { id: "w-2", agentId: "el-vigia", at: hoursAgo(6), summary: "Rescate aprobado: lead frío de AC-0012 retomó y pidió segunda visita", outcome: "aprobado" },
  { id: "w-3", agentId: "el-guionista", at: hoursAgo(20), summary: "Portada de AC-0012 propuesta y confirmada por Marta", outcome: "aprobado" },
  { id: "w-4", agentId: "el-analista", at: hoursAgo(26), summary: "Informe quincenal de AC-0012 redactado, revisado y publicado en el portal del propietario", outcome: "aprobado" },
  { id: "w-5", agentId: "el-notario", at: hoursAgo(30), summary: "Detectadas 2 fichas con superficie sin rellenar — corregidas por Sara", outcome: "aprobado" },
  { id: "w-6", agentId: "vende-todo", at: hoursAgo(25), summary: "Plan del día de ayer: 3/3 acciones completadas por el equipo", outcome: "aprobado" },
  { id: "w-7", agentId: "primera-linea", at: hoursAgo(28), summary: "Acuse automático fuera de horario a 2 leads (regla pre-aprobada)", outcome: "automatico" },
];

export const AGENT_KPIS: AgentKpis[] = [
  { agentId: "vende-todo", tasksToday: 1, tasksMonth: 22, acceptanceRate: 91, hoursSavedMonth: 9 },
  { agentId: "primera-linea", tasksToday: 3, tasksMonth: 47, acceptanceRate: 88, hoursSavedMonth: 16 },
  { agentId: "el-vigia", tasksToday: 2, tasksMonth: 18, acceptanceRate: 83, hoursSavedMonth: 7 },
  { agentId: "el-guionista", tasksToday: 1, tasksMonth: 12, acceptanceRate: 92, hoursSavedMonth: 11 },
  { agentId: "el-analista", tasksToday: 1, tasksMonth: 8, acceptanceRate: 75, hoursSavedMonth: 6 },
  { agentId: "el-notario", tasksToday: 1, tasksMonth: 14, acceptanceRate: 95, hoursSavedMonth: 5 },
];

export function kpisFor(agentId: string): AgentKpis | null {
  return AGENT_KPIS.find((k) => k.agentId === agentId) ?? null;
}

export function suggestionsFor(agentId: string): AgentSuggestion[] {
  return AGENT_SUGGESTIONS.filter((s) => s.agentId === agentId);
}

export function workFor(agentId: string): AgentWorkItem[] {
  return AGENT_WORK.filter((w) => w.agentId === agentId).sort((a, b) => b.at.localeCompare(a.at));
}

/** Totales del equipo para la cabecera del módulo. */
export function teamTotals(): { pending: number; tasksMonth: number; hoursSaved: number; acceptance: number } {
  const pending = AGENT_SUGGESTIONS.filter((s) => s.status === "pendiente").length;
  const tasksMonth = AGENT_KPIS.reduce((s, k) => s + k.tasksMonth, 0);
  const hoursSaved = AGENT_KPIS.reduce((s, k) => s + k.hoursSavedMonth, 0);
  const acceptance = Math.round(AGENT_KPIS.reduce((s, k) => s + k.acceptanceRate, 0) / AGENT_KPIS.length);
  return { pending, tasksMonth, hoursSaved, acceptance };
}
