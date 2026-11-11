import omaResearch from "@/data/dfw-oma-flight-research.json";

export type OmaPublicFlightOffer = (typeof omaResearch.offers)[number];

export function getOmaFlightResearchCatalog() {
  return {
    compiledAt: omaResearch.compiledAt,
    route: omaResearch.route,
    distanceMiles: omaResearch.distanceMiles,
    searchDates: omaResearch.searchDates,
    sources: omaResearch.sources,
    disclaimer: omaResearch.disclaimer,
  };
}

/** Internet-sourced DFW→OMA flight rows for 20–21 Nov 2026 (demo rebook home). */
export function getOmaPublicFlightOffers(): OmaPublicFlightOffer[] {
  return omaResearch.offers;
}
