import {
  amadeusConfigured,
  fetchAmadeusRebookFares,
} from "@/lib/flights/amadeus";
import {
  duffelConfigured,
  fetchDuffelRebookFares,
} from "@/lib/flights/duffel";
import { mockOtaJenkinsFares } from "@/lib/flights/mock-ota";
import type { Product } from "@/lib/types";

export type LiveFareProvider = "mock-ota" | "duffel" | "amadeus";

export type LiveFareResult = {
  products: Product[];
  provider: LiveFareProvider;
};

function useMockOta(): boolean {
  return process.env.USE_MOCK_OTA !== "false";
}

/** Providers in order — default mock → duffel → amadeus. */
export async function fetchLiveRebookFares(
  maxPriceUsd: number
): Promise<LiveFareResult | null> {
  const order = (
    process.env.FARE_PROVIDERS ?? "mock,duffel,amadeus"
  )
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  for (const id of order) {
    if (id === "mock" || id === "mock-ota") {
      if (!useMockOta()) continue;
      const products = mockOtaJenkinsFares(maxPriceUsd);
      if (products.length) return { products, provider: "mock-ota" };
    }
    if (id === "duffel" && duffelConfigured()) {
      const products = await fetchDuffelRebookFares(maxPriceUsd);
      if (products?.length) return { products, provider: "duffel" };
    }
    if (id === "amadeus" && amadeusConfigured()) {
      const products = await fetchAmadeusRebookFares(maxPriceUsd);
      if (products?.length) return { products, provider: "amadeus" };
    }
  }
  return null;
}

export function anyOtaConfigured(): boolean {
  return useMockOta() || duffelConfigured() || amadeusConfigured();
}
