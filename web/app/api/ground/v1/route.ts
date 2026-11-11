import { getPublicGroundCatalog, getPublicGroundOffers } from "@/lib/ground/public-ground";

export async function GET() {
  const catalog = getPublicGroundCatalog();
  return Response.json({
    api: "shop-pal-ground-research",
    version: 1,
    ...catalog,
    endpoints: {
      search: "/api/ota/v1/search?origin=DFW&maxPriceUsd=250&createSession=true",
      dataFile: "/data/ground-public-research.json",
      refresh: "npm run research:ground",
    },
    offerCount: getPublicGroundOffers().length,
  });
}
