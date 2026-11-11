import groundResearch from "@/data/ground-public-research.json";
import type { FlightTimelineStep } from "@/lib/types";

export type PublicGroundOffer = (typeof groundResearch.offers)[number];

export function getPublicGroundCatalog() {
  return {
    compiledAt: groundResearch.compiledAt,
    route: groundResearch.route,
    distanceMiles: groundResearch.distanceMiles,
    sources: groundResearch.sources,
  };
}

/** Sourced coach / rental options for DFW → KC (same shape as mock OTA ground offers). */
export function getPublicGroundOffers(): PublicGroundOffer[] {
  return groundResearch.offers.map((o) => ({
    ...o,
    timelineStops: o.timelineStops.map((s) => ({
      time: s.time,
      place: s.place,
      detail: s.detail ?? "",
    })),
  })) as PublicGroundOffer[];
}
