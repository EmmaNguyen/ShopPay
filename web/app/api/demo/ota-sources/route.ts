import otaSources from "@/data/ota-public-apis.json";
import { amadeusConfigured } from "@/lib/flights/amadeus";
import { duffelConfigured } from "@/lib/flights/duffel";

/** Public OTA / flight API catalog + which keys are set locally. */
export async function GET() {
  const configured = {
    duffel: duffelConfigured(),
    amadeus: amadeusConfigured(),
  };
  return Response.json({
    sources: otaSources,
    configured,
    fareProviders: process.env.FARE_PROVIDERS ?? "duffel,amadeus",
    docs: "https://github.com — see README Live flight fares",
  });
}
