import { getProductBySku, searchProducts } from "@/lib/catalog";
import { userConfirmedPayment } from "@/lib/confirm";
import { getSession, updateSession } from "@/lib/session";
import type { Product } from "@/lib/types";

export type ToolResult = {
  reply: string;
  products?: Product[];
  awaitingPayment?: boolean;
  selectedProduct?: Product;
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
  const lines = results.map(
    (p, i) =>
      `${i + 1}. **${p.title}** — $${p.priceUsd.toFixed(2)} (${p.blurb})`
  );
  return {
    reply:
      results.length > 0
        ? `Here are ${results.length} options:\n\n${lines.join("\n")}\n\nTell me which one you want (e.g. "buy the second one"). I'll ask you to reply **yes, pay** before PayPal checkout.`
        : "I couldn't find matches. Try different keywords or a higher budget.",
    products: results,
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
  const product = getProductBySku(sku);
  if (!product) {
    const fromLast = session.lastSearchResults.find(
      (p) => p.sku === skuOrIndex || p.title.toLowerCase().includes(skuOrIndex.toLowerCase())
    );
    if (!fromLast) {
      return { reply: "That product isn't in the catalog. Pick from the list above." };
    }
    sku = fromLast.sku;
  }
  const selected = getProductBySku(sku)!;
  updateSession(sessionId, { selectedSku: sku, awaitingPayment: false });
  return {
    reply: `Great — **${selected.title}** at **$${selected.priceUsd.toFixed(2)}**. When you're ready, reply **yes, pay** and I'll open PayPal checkout.`,
    selectedProduct: selected,
  };
}

export function toolPrepareCheckout(
  sessionId: string,
  userMessage: string
): ToolResult {
  if (!userConfirmedPayment(userMessage)) {
    return {
      reply:
        'I need explicit consent first. Reply **yes, pay** to start PayPal checkout.',
    };
  }
  const session = getSession(sessionId);
  if (!session.selectedSku) {
    return {
      reply: "Which product should I buy? Pick one from the list first.",
    };
  }
  const product = getProductBySku(session.selectedSku);
  if (!product) {
    return { reply: "Selected product is invalid. Please choose again." };
  }
  updateSession(sessionId, {
    awaitingPayment: true,
    preparedOrderSku: product.sku,
  });
  return {
    reply: `Starting PayPal checkout for **${product.title}** ($${product.priceUsd.toFixed(2)}). Use the PayPal button below.`,
    awaitingPayment: true,
    selectedProduct: product,
  };
}
