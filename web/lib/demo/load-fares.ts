import { resolveDemoMode } from "@/lib/demo-mode";
import { searchMockOtaWithTracks } from "@/lib/flights/mock-ota";
import type { FareTrack } from "@/lib/flights/fare-tracks";
import { getSession, updateSession } from "@/lib/session";
import type { Product } from "@/lib/types";
import { randomUUID } from "crypto";

export const DEMO_FARE_MAX_USD = 250;
export const DEMO_FARE_ORIGIN = "DFW";

export type LoadedFares = {
  sessionId: string;
  products: Product[];
  tracks: FareTrack[];
  headline: string;
  fareSource: "mock-ota";
  mockOtaSearchUrl: string;
  demoMode: boolean;
};

/** Load Jenkins demo fares via mock OTA dataset + checkout session. */
export function loadMockOtaDemoFares(): LoadedFares {
  const sessionId = randomUUID();
  getSession(sessionId);

  const search = searchMockOtaWithTracks({
    origin: DEMO_FARE_ORIGIN,
    maxPriceUsd: DEMO_FARE_MAX_USD,
  });

  updateSession(sessionId, {
    lastSearchResults: search.products,
    awaitingPayment: false,
  });

  const mockOtaSearchUrl = `/api/ota/v1/search?origin=${DEMO_FARE_ORIGIN}&maxPriceUsd=${DEMO_FARE_MAX_USD}&limit=3`;

  return {
    sessionId,
    products: search.products,
    tracks: search.tracks,
    headline: "Flights · bus · rental · 20–21 November 2026",
    fareSource: "mock-ota",
    mockOtaSearchUrl,
    demoMode: resolveDemoMode(),
  };
}
