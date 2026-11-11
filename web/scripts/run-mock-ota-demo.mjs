#!/usr/bin/env node
/**
 * End-to-end mock OTA demo: search → select → yes, pay → checkout ready.
 * Usage: node scripts/run-mock-ota-demo.mjs [baseUrl]
 */
async function resolveBase() {
  if (process.argv[2]) return process.argv[2];
  if (process.env.BASE_URL) return process.env.BASE_URL;
  for (const port of [3000, 3001]) {
    const url = `http://localhost:${port}/api/ota/v1`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
      if (res.ok) return `http://localhost:${port}`;
    } catch {
      /* try next */
    }
  }
  return "http://localhost:3000";
}

const base = await resolveBase();

async function j(url, init) {
  const res = await fetch(url, init);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${url} → ${res.status} ${JSON.stringify(body)}`);
  return body;
}

console.log("\n=== ShopPal mock OTA demo ===\n");

const search = await j(
  `${base}/api/ota/v1/search?origin=DFW&limit=3&createSession=true`
);
console.log("1. Mock OTA search:", search.headline);
console.log("   sessionId:", search.sessionId);
if (search.tracks?.length) {
  for (const t of search.tracks) {
    console.log(`   · ${t.label} (${t.tagline}) — ${t.product.title} — $${t.product.priceUsd}`);
  }
} else {
  for (const p of search.products) {
    console.log(`   · ${p.title} — $${p.priceUsd}`);
  }
}

const sku = search.products[0]?.sku;
if (!sku) throw new Error("No fares returned");

const sel = await j(`${base}/api/demo/select`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ sessionId: search.sessionId, sku }),
});
console.log("\n2. Select fare:", sel.selectedProduct?.title);

const pay = await j(`${base}/api/demo/confirm`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ sessionId: search.sessionId }),
});
console.log("3. yes, pay →", pay.ui?.label ?? "checkout");
console.log(
   "   demoMode:",
   pay.demoMode,
   pay.demoMode ? "(Simulate PayPal in UI)" : "(PayPal widget)"
);

console.log("\n✓ Demo complete — open", `${base}/chat`, "for UI\n");
