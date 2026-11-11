import { getMockOtaCatalog } from "@/lib/flights/mock-ota";

/** Mock OTA API discovery. */
export async function GET() {
  const catalog = getMockOtaCatalog();
  return Response.json({
    name: catalog.api,
    version: catalog.version,
    holiday: catalog.holiday,
    routes: catalog.routes,
    sources: catalog.sources,
    offerCount: catalog.offers.length,
    endpoints: {
      search:
        "/api/ota/v1/search?origin=DFW&maxPriceUsd=250&limit=3&createSession=true",
      demoBootstrap: "/api/demo/offers",
      rawData: "/data/mock-ota-thanksgiving.json",
    },
  });
}
