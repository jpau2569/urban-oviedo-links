/**
 * Publishing center: estado de cada pieza por canal.
 * Máquina de estados simple y helpers de agregación para el panel.
 */

import type { PublishingChannelId, PublishingRecord, PublishingStatus } from "@/types/media";

const FLOW: PublishingStatus[] = ["borrador", "lista", "programada", "publicada"];

/** Siguiente estado natural de una pieza (envíos directos terminan en "enviada"). */
export function nextStatus(record: PublishingRecord): PublishingStatus {
  if (record.channel === "whatsapp" || record.channel === "email" || record.channel.endsWith("-portal")) {
    return record.status === "enviada" ? "enviada" : "enviada";
  }
  const idx = FLOW.indexOf(record.status);
  return FLOW[Math.min(idx + 1, FLOW.length - 1)] ?? record.status;
}

export function isDone(record: PublishingRecord): boolean {
  return record.status === "publicada" || record.status === "enviada";
}

export interface PublishingSummary {
  total: number;
  done: number;
  pending: number;
  byChannel: { channel: PublishingChannelId; count: number; done: number }[];
}

export function summarize(records: PublishingRecord[]): PublishingSummary {
  const channels = [...new Set(records.map((r) => r.channel))];
  return {
    total: records.length,
    done: records.filter(isDone).length,
    pending: records.filter((r) => !isDone(r)).length,
    byChannel: channels.map((channel) => ({
      channel,
      count: records.filter((r) => r.channel === channel).length,
      done: records.filter((r) => r.channel === channel && isDone(r)).length,
    })),
  };
}

/** Orden de trabajo: primero lo accionable (borrador/lista), luego programadas, luego hechas. */
export function workOrder(records: PublishingRecord[]): PublishingRecord[] {
  const rank: Record<PublishingStatus, number> = {
    lista: 0,
    borrador: 1,
    programada: 2,
    publicada: 3,
    enviada: 3,
  };
  return [...records].sort((a, b) => rank[a.status] - rank[b.status]);
}
