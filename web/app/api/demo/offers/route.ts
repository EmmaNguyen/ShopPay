import { loadMockOtaDemoFares } from "@/lib/demo/load-fares";

/** Demo bootstrap — fares from mock OTA API (same data as /api/ota/v1/search). */
export async function GET() {
  const loaded = loadMockOtaDemoFares();
  return Response.json({
    ...loaded,
    ui: {
      step: "pick",
      label: `${loaded.products.length} fares · tap to select`,
    },
    otaApi: "/api/ota/v1/search",
    otaCatalogUrl: "/api/demo/ota-sources",
  });
}
