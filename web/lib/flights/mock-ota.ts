import mockData from "@/data/mock-ota-thanksgiving.json";
import { JENKINS_INCIDENT } from "@/lib/demo/jenkins-incident";
import { getOmaFlightResearchCatalog, getOmaPublicFlightOffers } from "@/lib/flights/oma-public";
import { getPublicGroundCatalog, getPublicGroundOffers } from "@/lib/ground/public-ground";
import { pickFareTracks, type FareTrack } from "@/lib/flights/fare-tracks";
import {
  filterOffersByMobilityModes,
  type MobilityMode,
} from "@/lib/flights/mobility-modes";
import type { FlightTimelineStep, Product } from "@/lib/types";

export type MockOtaOffer = (typeof mockData.offers)[number];

export type MockOtaSearchParams = {
  origin?: string;
  destination?: string;
  departureDate?: string;
  maxPriceUsd?: number;
  limit?: number;
  /** If set, only these modes appear in tracks / alsoConsider (DFW rebook). */
  modes?: MobilityMode[];
};

const CITY: Record<string, string> = {
  DFW: "Dallas/Fort Worth",
  MCI: "Kansas City",
  OMA: "Omaha",
  BOS: "Boston",
};

const AIRLINE: Record<string, string> = {
  AA: "American Airlines",
  F9: "Frontier Airlines",
  UA: "United Airlines",
};

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} minutes`;
  if (mins === 0) return hours === 1 ? "1 hour" : `${hours} hours`;
  return `${hours} hour${hours === 1 ? "" : "s"} ${mins} minutes`;
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${day} ${months[(month ?? 1) - 1]} ${year}`;
}

function parseMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function layoverMinutes(arrive: string, depart: string): number {
  let gap = parseMinutes(depart) - parseMinutes(arrive);
  if (gap < 0) gap += 24 * 60;
  return gap;
}

function formatLayover(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} minute layover`;
  if (m === 0) return `${h} hour layover`;
  return `${h} hour ${m} minute layover`;
}

function arrivalDetail(offer: MockOtaOffer): string {
  return "arrivalDate" in offer &&
    offer.arrivalDate &&
    offer.arrivalDate !== offer.departureDate
    ? `Arrive · ${formatDate(offer.arrivalDate as string)}`
    : "Arrive";
}

function buildTimeline(offer: MockOtaOffer): FlightTimelineStep[] {
  const fromCity = CITY[offer.origin] ?? offer.origin;
  const toCity = CITY[offer.destination] ?? offer.destination;
  const layover = "layover" in offer && offer.layover
    ? (offer.layover as { city: string; arrive: string; depart: string })
    : undefined;

  if (offer.stops === 0 || !layover) {
    const air =
      offer.durationMin >= 60
        ? `${Math.floor(offer.durationMin / 60)} hr ${offer.durationMin % 60} min in the air · Nonstop`
        : `${offer.durationMin} min in the air · Nonstop`;
    return [
      { time: offer.departureLocal, place: fromCity, detail: "Depart" },
      { time: "", place: "", detail: air },
      { time: offer.arrivalLocal, place: toCity, detail: arrivalDetail(offer) },
    ];
  }

  const layMin = layoverMinutes(layover.arrive, layover.depart);
  const firstLeg = parseMinutes(layover.arrive) - parseMinutes(offer.departureLocal);
  const secondLeg = parseMinutes(offer.arrivalLocal) - parseMinutes(layover.depart);

  return [
    { time: offer.departureLocal, place: fromCity, detail: "Depart" },
    {
      time: "",
      place: "",
      detail: `${Math.max(firstLeg, 0)} min to connection`,
    },
    {
      time: layover.arrive,
      place: layover.city,
      detail: "Land · connection",
    },
    {
      time: layover.depart,
      place: layover.city,
      detail: formatLayover(layMin),
    },
    {
      time: "",
      place: "",
      detail: `${Math.max(secondLeg, 0)} min to destination`,
    },
    { time: offer.arrivalLocal, place: toCity, detail: arrivalDetail(offer) },
  ];
}

function isGroundOffer(
  offer: MockOtaOffer
): offer is MockOtaOffer & {
  transportMode: "ground";
  vendor: string;
  serviceName: string;
  vehicle: string;
  distanceMiles: number;
  timelineStops: FlightTimelineStep[];
} {
  return "transportMode" in offer && offer.transportMode === "ground";
}

function groundOfferToProduct(
  offer: MockOtaOffer & {
    groundType?: string;
    vendor: string;
    serviceName: string;
    vehicle: string;
    distanceMiles: number;
    timelineStops: FlightTimelineStep[];
    sourceUrl?: string;
    sourceLabel?: string;
    compareOnly?: boolean;
    blurb: string;
  }
): Product {
  const fromCity = CITY[offer.origin] ?? offer.origin;
  const toCity = CITY[offer.destination] ?? "Kansas City";
  const arrives =
    "arrivalDate" in offer &&
    offer.arrivalDate &&
    offer.arrivalDate !== offer.departureDate
      ? `${offer.arrivalLocal} on ${formatDate(offer.arrivalDate as string)}`
      : offer.arrivalLocal;

  const compareOnly =
    "compareOnly" in offer && offer.compareOnly === true;

  return {
    sku: `mock-ota-${offer.offerId}`,
    title: `${offer.vendor} — ${offer.serviceName}`,
    category: "ground",
    priceUsd: offer.priceUsd,
    tags: [
      "ground",
      offer.groundType ?? "shuttle",
      "mock-ota",
      "dfw",
      "kansas city",
      "rebook",
      ...(compareOnly ? ["compare-only"] : []),
    ],
    blurb: offer.blurb,
    ground: {
      vendor: offer.vendor,
      service: offer.serviceName,
      vehicle: offer.vehicle,
      fromCity,
      toCity,
      date: formatDate(offer.departureDate),
      departs: offer.departureLocal,
      arrives,
      duration: formatDuration(offer.durationMin),
      distanceMiles: offer.distanceMiles,
      timeline: offer.timelineStops,
      sourceLabel: offer.sourceLabel,
      sourceUrl: offer.sourceUrl,
    },
  };
}

function offerToProduct(offer: MockOtaOffer): Product {
  if (isGroundOffer(offer)) return groundOfferToProduct(offer);

  const stop =
    offer.stops === 0 ? "nonstop" : `${offer.stops} stop`;
  const airline = AIRLINE[offer.carrier] ?? offer.carrier;
  const fromCity = CITY[offer.origin] ?? offer.origin;
  const toCity = CITY[offer.destination] ?? offer.destination;
  const src =
    "sourceUrl" in offer && typeof offer.sourceUrl === "string"
      ? {
          sourceUrl: offer.sourceUrl as string,
          sourceLabel:
            "sourceLabel" in offer && typeof offer.sourceLabel === "string"
              ? (offer.sourceLabel as string)
              : "Source",
        }
      : {};
  return {
    sku: `mock-ota-${offer.offerId}`,
    title: `${airline} ${offer.flightNumber} — ${fromCity} to ${toCity}`,
    category: "travel",
    priceUsd: offer.priceUsd,
    tags: [
      "flight",
      "mock-ota",
      "thanksgiving",
      offer.origin.toLowerCase(),
      offer.destination.toLowerCase(),
      stop,
    ],
    blurb: offer.blurb,
    flight: {
      airline,
      flight: `${airline} ${offer.flightNumber}`,
      fromCity,
      toCity,
      date: formatDate(offer.departureDate),
      departs: offer.departureLocal,
      arrives:
        "arrivalDate" in offer &&
        offer.arrivalDate &&
        offer.arrivalDate !== offer.departureDate
          ? `${offer.arrivalLocal} on ${formatDate(offer.arrivalDate as string)}`
          : offer.arrivalLocal,
      duration: formatDuration(offer.durationMin),
      stops: offer.stops === 0 ? "Nonstop" : offer.stops === 1 ? "1 stop" : `${offer.stops} stops`,
      cabin: offer.fareFamily,
      timeline: buildTimeline(offer),
      ...src,
    },
  };
}

function getDfwRebookPool(
  modes?: MobilityMode[],
  destination: string = JENKINS_INCIDENT.canceledConnection.to
): MockOtaOffer[] {
  const win = new Set<string>(JENKINS_INCIDENT.rebookDates);
  const dest = destination.toUpperCase();
  const flights =
    dest === "OMA"
      ? (getOmaPublicFlightOffers().filter((o) =>
          win.has(o.departureDate)
        ) as unknown as MockOtaOffer[])
      : mockData.offers.filter(
          (o) =>
            o.origin === "DFW" &&
            o.destination === dest &&
            win.has(o.departureDate) &&
            !("transportMode" in o && o.transportMode === "ground")
        );
  const mobility =
    dest === "MCI"
      ? getPublicGroundOffers().filter(
          (o) => o.destination === dest && win.has(o.departureDate)
        )
      : [];
  const pool = [...flights, ...mobility] as unknown as MockOtaOffer[];
  return filterOffersByMobilityModes(pool, modes);
}

export function searchMockOta(params: MockOtaSearchParams = {}): {
  offers: MockOtaOffer[];
  products: Product[];
  meta: {
    api: string;
    version: number;
    holiday: typeof mockData.holiday;
    sources: typeof mockData.sources;
    groundResearch?: ReturnType<typeof getPublicGroundCatalog>;
    omaResearch?: ReturnType<typeof getOmaFlightResearchCatalog>;
    searchedAt: string;
  };
} {
  const origin = params.origin?.toUpperCase();
  const destination = params.destination?.toUpperCase();
  const max = params.maxPriceUsd;
  const limit = params.limit ?? 6;
  const date = params.departureDate;

  let offers = mockData.offers.filter((o) => max == null || o.priceUsd <= max);

  if (origin) offers = offers.filter((o) => o.origin === origin);
  if (destination) offers = offers.filter((o) => o.destination === destination);
  if (date) offers = offers.filter((o) => o.departureDate === date);
  else if (origin === "DFW") {
    const dest = params.destination?.toUpperCase() ?? JENKINS_INCIDENT.canceledConnection.to;
    offers = getDfwRebookPool(params.modes, dest).filter(
      (o) => max == null || o.priceUsd <= max
    );
  }

  offers.sort((a, b) => a.priceUsd - b.priceUsd);
  offers = offers.slice(0, limit);

  const hasGround = offers.some((o) => "transportMode" in o && o.transportMode === "ground");
  const groundResearch = origin === "DFW" && hasGround ? getPublicGroundCatalog() : undefined;
  const destUpper = params.destination?.toUpperCase() ?? (origin === "DFW" ? JENKINS_INCIDENT.canceledConnection.to : undefined);
  const omaResearch =
    origin === "DFW" && destUpper === "OMA" ? getOmaFlightResearchCatalog() : undefined;

  return {
    offers,
    products: offers.map(offerToProduct),
    meta: {
      api: mockData.api,
      version: mockData.version,
      holiday: mockData.holiday,
      sources: [
        ...mockData.sources,
        ...(groundResearch?.sources ?? []),
        ...(omaResearch?.sources ?? []),
      ],
      groundResearch,
      omaResearch,
      searchedAt: new Date().toISOString(),
    },
  };
}

/** Search + Budget / Fast / Best track picks (uses full route pool, not price-sorted slice). */
export function searchMockOtaWithTracks(
  params: MockOtaSearchParams = {}
): ReturnType<typeof searchMockOta> & {
  tracks: FareTrack[];
  alsoConsider: Product[];
  fullPoolCount: number;
} {
  const max = params.maxPriceUsd;
  const dfwDest =
    params.destination?.toUpperCase() ?? JENKINS_INCIDENT.canceledConnection.to;
  const fullPool =
    params.origin?.toUpperCase() === "DFW"
      ? getDfwRebookPool(params.modes, dfwDest)
      : searchMockOta({ ...params, limit: 24 }).offers;
  const affordable =
    max != null ? fullPool.filter((o) => o.priceUsd <= max) : fullPool;
  const trackSource = affordable.length >= 3 ? affordable : fullPool;
  const tracks = pickFareTracks(trackSource, offerToProduct);
  const used = new Set(tracks.map((t) => t.product.sku));
  const alsoConsider = fullPool
    .map(offerToProduct)
    .filter((p) => !used.has(p.sku))
    .sort((a, b) => a.priceUsd - b.priceUsd);

  const base = searchMockOta({ ...params, limit: 24 });
  return {
    ...base,
    offers: fullPool,
    tracks,
    products: tracks.map((t) => t.product),
    alsoConsider,
    fullPoolCount: fullPool.length,
  };
}

/** Demo rebook: DFW exits toward KC metro for Thanksgiving week. */
export function mockOtaJenkinsFares(maxPriceUsd?: number): Product[] {
  return searchMockOtaWithTracks({
    origin: "DFW",
    maxPriceUsd,
  }).products;
}

export function getMockOtaCatalog() {
  return mockData;
}
