import { demoDepartureDate } from "@/lib/flights/demo-dates";
import type { Product } from "@/lib/types";

const TEST = "https://test.api.amadeus.com";
const PROD = "https://api.amadeus.com";

function baseUrl(): string {
  return process.env.AMADEUS_ENV === "production" ? PROD : TEST;
}

type TokenResponse = { access_token: string; expires_in: number };

let cachedToken: { token: string; until: number } | null = null;

async function getToken(): Promise<string | null> {
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  if (cachedToken && Date.now() < cachedToken.until - 30_000) {
    return cachedToken.token;
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(`${baseUrl()}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) return null;
  const data = (await res.json()) as TokenResponse;
  cachedToken = {
    token: data.access_token,
    until: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

type AmadeusOffer = {
  id: string;
  price: { total: string; currency: string };
  itineraries: Array<{
    duration?: string;
    segments: Array<{
      departure: { iataCode: string; at: string };
      arrival: { iataCode: string; at: string };
      carrierCode: string;
      number: string;
    }>;
  }>;
};

type OffersResponse = { data?: AmadeusOffer[] };

function formatDepartLocal(iso: string): string {
  try {
    const d = new Date(iso);
    const day = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const time = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${day} ${time}`;
  } catch {
    return iso;
  }
}

function mapOfferToProduct(offer: AmadeusOffer): Product | null {
  const seg = offer.itineraries[0]?.segments[0];
  if (!seg) return null;
  const from = seg.departure.iataCode;
  const to = seg.arrival.iataCode;
  const priceUsd = parseFloat(offer.price.total);
  if (!Number.isFinite(priceUsd) || offer.price.currency !== "USD") return null;

  const carrier = seg.carrierCode;
  const when = formatDepartLocal(seg.departure.at);
  const duration = offer.itineraries[0]?.duration?.replace("PT", "") ?? "";

  return {
    sku: `live-${offer.id}`,
    title: `${carrier} ${seg.number} — ${from} → ${to} (${when})`,
    category: "travel",
    priceUsd,
    tags: ["flight", "live", "amadeus", from.toLowerCase(), to.toLowerCase()],
    blurb: `Live quote via Amadeus · ${duration || "nonstop"}. Prices change; captured at search time.`,
  };
}

async function searchRoute(
  token: string,
  origin: string,
  destination: string,
  departureDate: string,
  maxOffers: number
): Promise<Product[]> {
  const params = new URLSearchParams({
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate,
    adults: "1",
    currencyCode: "USD",
    max: String(maxOffers),
    nonStop: "false",
  });

  const res = await fetch(
    `${baseUrl()}/v2/shopping/flight-offers?${params}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return [];
  const json = (await res.json()) as OffersResponse;
  const products: Product[] = [];
  for (const offer of json.data ?? []) {
    const p = mapOfferToProduct(offer);
    if (p) products.push(p);
  }
  return products;
}

export async function fetchAmadeusRebookFares(
  maxPriceUsd: number
): Promise<Product[] | null> {
  const token = await getToken();
  if (!token) return null;

  const date = demoDepartureDate();
  const routes: [string, string][] = [
    ["DFW", "MCI"],
    ["DFW", "OMA"],
  ];

  const seen = new Set<string>();
  const merged: Product[] = [];

  for (const [from, to] of routes) {
    const batch = await searchRoute(token, from, to, date, 5);
    for (const p of batch) {
      if (p.priceUsd > maxPriceUsd) continue;
      const key = `${p.title}-${p.priceUsd}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(p);
    }
  }

  merged.sort((a, b) => a.priceUsd - b.priceUsd);
  return merged.length > 0 ? merged.slice(0, 3) : null;
}

export function amadeusConfigured(): boolean {
  return Boolean(
    process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET
  );
}
