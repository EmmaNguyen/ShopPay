import { getProductBySku } from "@/lib/catalog";
import { getSession } from "@/lib/session";
import type { Product } from "@/lib/types";

/** Catalog JSON or live fares stored on the session from /api/demo/offers. */
export function resolveProduct(
  sessionId: string,
  sku: string
): Product | undefined {
  const session = getSession(sessionId);
  const live = session.lastSearchResults.find((p) => p.sku === sku);
  if (live) return live;
  return getProductBySku(sku);
}
