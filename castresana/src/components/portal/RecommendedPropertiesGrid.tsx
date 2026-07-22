import type { RecommendationVM } from "@/lib/portal/portalViewModels";
import { PropertyInterestCard } from "./PropertyInterestCard";

/**
 * Escaparate curado del cliente. Orden editorial: nuevas primero,
 * después interesadas/favoritas, después el resto; descartadas al final.
 */
export function RecommendedPropertiesGrid({
  recommendations,
  token,
}: {
  recommendations: RecommendationVM[];
  token: string;
}) {
  const weight = (r: RecommendationVM): number => {
    if (r.selection.status === "nueva") return 0;
    if (r.selection.status === "interesa") return 1;
    if (r.selection.status === "vista") return 2;
    return 3;
  };
  const ordered = [...recommendations].sort((a, b) => weight(a) - weight(b));

  if (ordered.length === 0) {
    return (
      <div className="card card-pad" style={{ textAlign: "center" }}>
        <p className="muted">
          Estamos preparando tu primera selección. En cuanto haya propiedades que encajen, aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="props-grid">
      {ordered.map((rec) => (
        <PropertyInterestCard key={rec.selection.id} rec={rec} token={token} />
      ))}
    </div>
  );
}
