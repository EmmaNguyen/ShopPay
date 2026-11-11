import { resolveDemoMode } from "@/lib/demo-mode";
import {
  formatMobilityModesList,
  parseMobilityModesParam,
} from "@/lib/flights/mobility-modes";
import { searchMockOta, searchMockOtaWithTracks } from "@/lib/flights/mock-ota";
import {
  parseRebookDestination,
  rebookDestinationMeta,
} from "@/lib/flights/rebook-destination";
import { getSession, updateSession } from "@/lib/session";
import { randomUUID } from "crypto";
import { z } from "zod";

const QuerySchema = z.object({
  origin: z.string().length(3).optional(),
  destination: z.string().length(3).optional(),
  departureDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  maxPriceUsd: z.coerce.number().positive().optional(),
  limit: z.coerce.number().int().min(1).max(12).optional(),
});

/**
 * Mock OTA search API — Thanksgiving indicative fares (public research).
 * Example: /api/ota/v1/search?origin=DFW&destination=MCI&maxPriceUsd=250
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = QuerySchema.safeParse({
    origin: url.searchParams.get("origin") ?? undefined,
    destination: url.searchParams.get("destination") ?? undefined,
    departureDate: url.searchParams.get("departureDate") ?? undefined,
    maxPriceUsd: url.searchParams.get("maxPriceUsd") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid query", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const useTracks = url.searchParams.get("tracks") !== "false";
  const modes = parseMobilityModesParam(url.searchParams.get("modes"));
  const rebookDest = parseRebookDestination(
    parsed.data.destination ?? url.searchParams.get("destination")
  );
  const destMeta = rebookDestinationMeta(rebookDest);
  const searchParams = {
    origin: parsed.data.origin,
    destination: parsed.data.destination ?? rebookDest,
    departureDate: parsed.data.departureDate,
    maxPriceUsd: parsed.data.maxPriceUsd,
    limit: parsed.data.limit,
    modes,
  };
  const result = useTracks
    ? searchMockOtaWithTracks(searchParams)
    : searchMockOta(searchParams);
  const tracks = "tracks" in result ? result.tracks : undefined;

  const createSession = url.searchParams.get("createSession") === "true";
  const existingSessionId = url.searchParams.get("sessionId") ?? undefined;
  let sessionId: string | undefined;

  const alsoConsider =
    "alsoConsider" in result && Array.isArray(result.alsoConsider)
      ? result.alsoConsider
      : [];
  const sessionProducts = [...result.products, ...alsoConsider];

  if (result.offers.length > 0) {
    sessionId = existingSessionId ?? (createSession ? randomUUID() : undefined) ?? randomUUID();
    getSession(sessionId);
    updateSession(sessionId, {
      lastSearchResults: sessionProducts,
      awaitingPayment: false,
    });
  }

  const modeLine = modes?.length
    ? formatMobilityModesList(modes)
    : "Flight · Bus & rental · Train · Uber · Lyft";
  const headline = useTracks
    ? `${modeLine} · DFW → ${destMeta.code} · 20–21 Nov`
    : parsed.data.maxPriceUsd != null
      ? `Thanksgiving fares (mock OTA) · up to $${parsed.data.maxPriceUsd}`
      : "Thanksgiving fares (mock OTA)";

  return Response.json({
    ...result.meta,
    query: { ...parsed.data, modes: modes ?? null },
    modes: modes ?? null,
    count: result.offers.length,
    offers: result.offers,
    products: result.products,
    tracks,
    alsoConsider,
    fullPoolCount: "fullPoolCount" in result ? result.fullPoolCount : undefined,
    fareSource: (() => {
      const hasFlight = result.products.some((p) => p.flight);
      const hasGround = result.products.some((p) => p.ground);
      if (rebookDest === "OMA" && hasFlight) return "oma-research";
      if (hasFlight && hasGround) return "mixed-rebook";
      if (hasGround) return "ground-research";
      return "mock-ota";
    })(),
    sessionId,
    demoMode: createSession ? resolveDemoMode() : undefined,
    ui: {
      step: "pick",
      label: useTracks
        ? "Budget · Fast · Best tags"
        : `${result.products.length} fares · tap to select`,
    },
    headline,
    disclaimer:
      "Indicative Thanksgiving-week fares from public market snapshots — not a live bookable feed.",
  });
}
