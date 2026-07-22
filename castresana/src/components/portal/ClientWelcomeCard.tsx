import type { ClientPortalVM } from "@/lib/portal/portalViewModels";
import { fmtPrice } from "@/lib/portal/portalViewModels";

/**
 * Hero de bienvenida del cliente: saludo personal, resumen de su búsqueda
 * y cifras de su espacio. Tono concierge, no dashboard.
 */
export function ClientWelcomeCard({ vm }: { vm: ClientPortalVM }) {
  const { session, recommendations, freshCount, favoriteCount, upcomingVisits } = vm;
  const s = session.searchSummary;
  return (
    <section className="welcome">
      <p className="eyebrow">Tu espacio en Castresana</p>
      <h1>
        Hola, {session.firstName}. {freshCount > 0 ? "Tenemos novedades para ti." : "Todo al día."}
      </h1>
      <p className="lede">
        {freshCount > 0
          ? `He seleccionado personalmente ${freshCount === 1 ? "una propiedad nueva que encaja" : `${freshCount} propiedades nuevas que encajan`} con lo que buscas. Sin ruido: solo lo que de verdad merece tu tiempo.`
          : "Aquí tienes tu selección al completo, tus visitas y los siguientes pasos. En cuanto entre algo que encaje, lo verás aquí antes que en ningún portal."}
        {" — "}
        {session.agent.name.split(" ")[0]}
      </p>

      <div className="search-summary" aria-label="Resumen de tu búsqueda">
        <span className="tag">{s.operation === "compra" ? "Compra" : "Alquiler"}</span>
        <span className="tag">{s.propertyTypes.join(" · ")}</span>
        <span className="tag">{s.zones.join(", ")}</span>
        <span className="tag">hasta {fmtPrice(s.budgetMax)}</span>
        {s.bedroomsMin ? <span className="tag">{s.bedroomsMin}+ dormitorios</span> : null}
        {s.mustHaves.map((m) => (
          <span key={m} className="tag">
            {m}
          </span>
        ))}
      </div>

      <div className="facts">
        <div className="fact">
          <b>{recommendations.length}</b>
          <span>Seleccionadas</span>
        </div>
        <div className="fact">
          <b>{favoriteCount}</b>
          <span>Favoritas</span>
        </div>
        <div className="fact">
          <b>{upcomingVisits.length}</b>
          <span>Próximas visitas</span>
        </div>
      </div>
    </section>
  );
}
