import catalog from "@/data/catalog.json";
import type { Product } from "@/lib/types";

const products = catalog as Product[];

function scoreProduct(product: Product, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  if (product.title.toLowerCase().includes(q)) score += 3;
  if (product.category.toLowerCase().includes(q)) score += 2;
  for (const tag of product.tags) {
    if (q.includes(tag) || tag.includes(q)) score += 2;
  }
  const tokens = q.split(/\s+/).filter(Boolean);
  for (const t of tokens) {
    if (product.title.toLowerCase().includes(t)) score += 1;
    if (product.tags.some((tag) => tag.includes(t))) score += 1;
  }
  return score;
}

export function searchProducts(query: string, maxPriceUsd?: number): Product[] {
  const ranked = products
    .map((p) => ({ p, score: scoreProduct(p, query) }))
    .filter(({ p, score }) => {
      if (maxPriceUsd != null && p.priceUsd > maxPriceUsd) return false;
      return score > 0 || !query.trim();
    })
    .sort((a, b) => b.score - a.score || a.p.priceUsd - b.p.priceUsd);

  if (ranked.length === 0) {
    const fallback = products.filter(
      (p) => maxPriceUsd == null || p.priceUsd <= maxPriceUsd
    );
    return fallback.slice(0, 3);
  }
  return ranked.slice(0, 3).map(({ p }) => p);
}

export function getProductBySku(sku: string): Product | undefined {
  return products.find((p) => p.sku === sku);
}

export function allProducts(): Product[] {
  return products;
}
