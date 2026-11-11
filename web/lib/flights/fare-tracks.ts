import type { Product } from "@/lib/types";

/** Minimal offer shape for ranking — kept local so the client bundle never imports mock OTA JSON. */
export type TrackableOffer = {
  offerId: string;
  destination: string;
  departureLocal: string;
  stops: number;
  durationMin: number;
  priceUsd: number;
  transportMode?: string;
  groundType?: string;
};

export type FareTrackId = "budget" | "fast" | "best";

export type FareTrack = {
  id: FareTrackId;
  label: string;
  tagline: string;
  product: Product;
};

const TRACK_ORDER: FareTrackId[] = ["budget", "fast", "best"];

function trackLabel(id: FareTrackId): string {
  if (id === "budget") return "Budget";
  if (id === "fast") return "Fast";
  return "Best";
}

function bestScore(offer: TrackableOffer): number {
  let score = 0;
  if (offer.transportMode === "ground") {
    if (offer.groundType === "rental") score += 45;
    if (offer.groundType === "shuttle") score += 25;
    if (offer.groundType === "train") score += 15;
    if (offer.stops === 0) score += 20;
  }
  if (offer.stops === 0) score += 50;
  score += Math.max(0, 500 - offer.priceUsd) * 0.06;
  score += Math.max(0, 220 - offer.durationMin) * 0.15;
  const hour = parseInt(offer.departureLocal.split(":")[0] ?? "12", 10);
  if (hour < 12) score += 18;
  if (offer.destination === "MCI") score += 12;
  return score;
}

function modeLabel(offer: TrackableOffer): string {
  if (offer.transportMode !== "ground") return "Flight";
  if (offer.groundType === "bus") return "Bus";
  if (offer.groundType === "shuttle") return "Coach / shuttle";
  if (offer.groundType === "rental") return "Rental car";
  if (offer.groundType === "train") return "Train";
  if (offer.groundType === "rideshare") return "Rideshare";
  return "Ground";
}

function taglineFor(id: FareTrackId, offer: TrackableOffer): string {
  const hrs = Math.round((offer.durationMin / 60) * 10) / 10;
  const mode = modeLabel(offer);
  if (id === "budget") return `${mode} · lowest · $${offer.priceUsd}`;
  if (id === "fast") {
    if (offer.transportMode === "ground") return `${mode} · about ${hrs} hours`;
    const stop = offer.stops === 0 ? "nonstop" : `${offer.stops} stop`;
    return `${mode} · ${offer.durationMin} min · ${stop}`;
  }
  if (offer.transportMode === "ground" && offer.groundType === "rental")
    return "Rental car · your own schedule";
  if (offer.stops === 0) return `${mode} · nonstop · recommended`;
  return `${mode} · best balance`;
}

/** One pick per track — budget / fast / best — from the same search pool. */
export function pickFareTracks<T extends TrackableOffer>(
  offers: T[],
  offerToProduct: (offer: T) => Product
): FareTrack[] {
  if (offers.length === 0) return [];

  const picks: Partial<Record<FareTrackId, T>> = {};
  const used = new Set<string>();

  const byPrice = [...offers].sort((a, b) => a.priceUsd - b.priceUsd);
  picks.budget = byPrice[0];
  used.add(picks.budget.offerId);

  const fastPool = offers.filter((o) => !used.has(o.offerId));
  const fastSorted = [...fastPool].sort(
    (a, b) => a.durationMin - b.durationMin || a.priceUsd - b.priceUsd
  );
  picks.fast = fastSorted[0] ?? picks.budget;
  used.add(picks.fast.offerId);

  const bestPool = offers.filter((o) => !used.has(o.offerId));
  const bestSorted = [...bestPool].sort((a, b) => bestScore(b) - bestScore(a));
  picks.best = bestSorted[0] ?? offers.find((o) => !used.has(o.offerId)) ?? picks.fast;

  return TRACK_ORDER.map((id) => {
    const offer = picks[id]!;
    return {
      id,
      label: trackLabel(id),
      tagline: taglineFor(id, offer),
      product: offerToProduct(offer),
    };
  });
}
