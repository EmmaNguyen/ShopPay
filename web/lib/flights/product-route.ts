import type { Product } from "@/lib/types";

export function productDestinationCode(product: Product): string {
  if (product.flight) {
    const m = product.flight.toCity;
    if (m.includes("Omaha") || product.tags.includes("oma")) return "OMA";
    if (m.includes("Kansas") || product.tags.includes("kansas city")) return "MCI";
  }
  if (product.ground) {
    if (product.ground.toCity.includes("Omaha")) return "OMA";
    return "MCI";
  }
  const title = product.title.toUpperCase();
  if (title.includes("OMA") || title.includes("OMAHA")) return "OMA";
  return "MCI";
}

export function productOriginCode(product: Product): string {
  if (product.ground?.fromCity.includes("Dallas")) return "DFW";
  if (product.flight?.fromCity.includes("Dallas")) return "DFW";
  return "DFW";
}
