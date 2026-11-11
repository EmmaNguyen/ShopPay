import { demoDepartureDate } from "@/lib/flights/demo-dates";
import type { Product } from "@/lib/types";

const API = "https://api.duffel.com";

type DuffelSegment = {
  departing_at: string;
  origin: { iata_code: string };
  destination: { iata_code: string };
  marketing_carrier: { iata_code: string };
  marketing_carrier_flight_number: string;
};

type DuffelOffer = {
  id: string;
  total_amount: string;
  total_currency: string;
  slices: Array<{ segments: DuffelSegment[] }>;
};

type OfferRequestResponse = {
  data?: { offers?: DuffelOffer[] };
};

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

function mapOffer(offer: DuffelOffer): Product | null {
  const seg = offer.slices[0]?.segments[0];
  if (!seg) return null;
  if (offer.total_currency !== "USD") return null;
  const priceUsd = parseFloat(offer.total_amount);
  if (!Number.isFinite(priceUsd)) return null;
  const from = seg.origin.iata_code;
  const to = seg.destination.iata_code;
  const when = formatDepartLocal(seg.departing_at);
  const carrier = seg.marketing_carrier.iata_code;
  const flt = seg.marketing_carrier_flight_number;
  return {
    sku: `live-duffel-${offer.id}`,
    title: `${carrier} ${flt} — ${from} → ${to} (${when})`,
    category: "travel",
    priceUsd,
    tags: ["flight", "live", "duffel", from.toLowerCase(), to.toLowerCase()],
    blurb: "Live quote via Duffel · bookable OTA API. Price at search time.",
  };
}

async function searchOneWay(
  token: string,
  origin: string,
  destination: string,
  departureDate: string
): Promise<Product[]> {
  const res = await fetch(
    `${API}/air/offer_requests?return_offers=true&supplier_timeout=15000`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Duffel-Version": "v2",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          slices: [{ origin, destination, departure_date: departureDate }],
          passengers: [{ type: "adult" }],
          cabin_class: "economy",
          max_connections: 1,
        },
      }),
    }
  );
  if (!res.ok) return [];
  const json = (await res.json()) as OfferRequestResponse;
  const offers = json.data?.offers ?? [];
  const products: Product[] = [];
  for (const o of offers) {
    const p = mapOffer(o);
    if (p) products.push(p);
  }
  return products;
}

export function duffelConfigured(): boolean {
  return Boolean(process.env.DUFFEL_ACCESS_TOKEN?.trim());
}

export async function fetchDuffelRebookFares(
  maxPriceUsd: number
): Promise<Product[] | null> {
  const token = process.env.DUFFEL_ACCESS_TOKEN?.trim();
  if (!token) return null;

  const date = demoDepartureDate();
  const routes: [string, string][] = [
    ["DFW", "MCI"],
    ["DFW", "OMA"],
  ];

  const seen = new Set<string>();
  const merged: Product[] = [];

  for (const [from, to] of routes) {
    const batch = await searchOneWay(token, from, to, date);
    for (const p of batch) {
      if (p.priceUsd > maxPriceUsd) continue;
      const key = p.sku;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(p);
    }
  }

  merged.sort((a, b) => a.priceUsd - b.priceUsd);
  return merged.length > 0 ? merged.slice(0, 3) : null;
}
