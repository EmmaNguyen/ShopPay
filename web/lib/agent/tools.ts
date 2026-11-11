import { getProductBySku, searchProducts } from "@/lib/catalog";
import { resolveProduct } from "@/lib/catalog-resolve";
import { userConfirmedPayment } from "@/lib/confirm";
import { getSession, updateSession } from "@/lib/session";
import type { AssistantUi, Product } from "@/lib/types";

export type ToolResult = {
  reply: string;
  products?: Product[];
  awaitingPayment?: boolean;
  selectedProduct?: Product;
  selectedSku?: string;
  ui?: AssistantUi;
};

export function toolSearchProducts(
  sessionId: string,
  query: string,
  maxPriceUsd?: number
): ToolResult {
  const results = searchProducts(query, maxPriceUsd);
  updateSession(sessionId, {
    lastSearchResults: results,
    awaitingPayment: false,
    preparedOrderSku: undefined,
  });
  return {
    reply: results.length > 0 ? "" : "No matches — try a higher budget.",
    products: results,
    ui: {
      step: "pick",
      label:
        results.length > 0
          ? `${results.length} fares · tap to select`
          : undefined,
    },
  };
}

export function toolSelectProduct(
  sessionId: string,
  skuOrIndex: string
): ToolResult {
  const session = getSession(sessionId);
  let sku = skuOrIndex;
  const indexMatch = skuOrIndex.match(/^(\d+)$/);
  if (indexMatch) {
    const idx = parseInt(indexMatch[1], 10) - 1;
    const pick = session.lastSearchResults[idx];
    if (!pick) {
      return { reply: "I don't see that option in the last search. Search again first?" };
    }
    sku = pick.sku;
  }
  let product = resolveProduct(sessionId, sku);
  if (!product) {
    const fromLast = session.lastSearchResults.find(
      (p) => p.sku === skuOrIndex || p.title.toLowerCase().includes(skuOrIndex.toLowerCase())
    );
    if (!fromLast) {
      return { reply: "That product isn't in the catalog. Pick from the list above." };
    }
    sku = fromLast.sku;
    product = fromLast;
  }
  const selected = product;
  updateSession(sessionId, { selectedSku: sku, awaitingPayment: false });
  return {
    reply: "",
    selectedProduct: selected,
    selectedSku: sku,
    products: [selected],
    ui: { step: "consent", label: "Consent before PayPal" },
  };
}

export function toolPrepareCheckout(
  sessionId: string,
  userMessage: string
): ToolResult {
  if (!userConfirmedPayment(userMessage)) {
    return {
      reply: "",
      ui: { step: "consent", label: "Say yes, pay first" },
    };
  }
  const session = getSession(sessionId);
  if (!session.selectedSku) {
    return {
      reply: "Which product should I buy? Pick one from the list first.",
    };
  }
  const product = resolveProduct(sessionId, session.selectedSku);
  if (!product) {
    return { reply: "Selected product is invalid. Please choose again." };
  }
  updateSession(sessionId, {
    awaitingPayment: true,
    preparedOrderSku: product.sku,
  });
  return {
    reply: "",
    awaitingPayment: true,
    selectedProduct: product,
    selectedSku: product.sku,
    ui: { step: "checkout", label: "PayPal checkout" },
  };
}
