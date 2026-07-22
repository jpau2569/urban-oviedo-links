import { guardPage } from "@/lib/auth/roleGuards";
import {
  AGENT_PERFORMANCE,
  CHANNEL_PERFORMANCE,
  KPIS,
  LEADS_WEEKLY,
  MEDIA_USAGE,
  PROPERTY_INTEREST,
  RESPONSE_WEEKLY,
} from "@/lib/analytics/analyticsData";
import { OsShell } from "@/components/os/OsShell";
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { LeadPerformanceChart } from "@/components/analytics/LeadPerformanceChart";
import { AgentPerformanceTable } from "@/components/analytics/AgentPerformanceTable";
import { ChannelBreakdown } from "@/components/analytics/ChannelBreakdown";
import { SecureAccessError } from "@/components/portal/SecureAccessNotice";

export const metadata = { title: "Resultados" };

export default async function AnalyticsPage() {
  const guard = await guardPage("resultados:view");
  if (!guard.allowed) return <SecureAccessError reason="wrong_role" />;

  return (
    <OsShell active="analytics" user={guard.user}>
      <p className="eyebrow">Resultados · {KPIS.periodLabel}</p>
      <h1 className="display" style={{ fontSize: "clamp(26px, 4vw, 38px)", color: "var(--paper-ink)", marginTop: 6 }}>
        Decisiones con números, no sensaciones
      </h1>
      <p className="muted" style={{ marginTop: 8, maxWidth: "64ch", lineHeight: 1.6, fontSize: 13.5 }}>
        El pulso comercial de la agencia: captación, velocidad, visitas y cierres — por canal, por agente y por inmueble.
      </p>

      <div style={{ display: "grid", gap: 22, marginTop: 28 }}>
        <AnalyticsOverview kpis={KPIS} properties={PROPERTY_INTEREST} mediaUsage={MEDIA_USAGE} />
        <LeadPerformanceChart leads={LEADS_WEEKLY} response={RESPONSE_WEEKLY} />
        <div className="grid-2col">
          <AgentPerformanceTable agents={AGENT_PERFORMANCE} />
          <ChannelBreakdown channels={CHANNEL_PERFORMANCE} />
        </div>
      </div>
    </OsShell>
  );
}
