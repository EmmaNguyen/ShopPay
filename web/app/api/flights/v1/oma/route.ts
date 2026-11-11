import {
  getOmaFlightResearchCatalog,
  getOmaPublicFlightOffers,
} from "@/lib/flights/oma-public";

export async function GET() {
  const catalog = getOmaFlightResearchCatalog();
  return Response.json({
    api: "shop-pal-dfw-oma-research",
    version: 1,
    ...catalog,
    offers: getOmaPublicFlightOffers(),
    refresh: "npm run research:oma",
  });
}
