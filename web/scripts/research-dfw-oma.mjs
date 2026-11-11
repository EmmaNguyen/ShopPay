#!/usr/bin/env node
/**
 * Spot-check public URLs cited in dfw-oma-flight-research.json.
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const dir = dirname(fileURLToPath(import.meta.url));
const dataPath = join(dir, "../data/dfw-oma-flight-research.json");
const data = JSON.parse(readFileSync(dataPath, "utf8"));

console.log("Checking DFW→OMA flight research sources...\n");

for (const src of data.sources) {
  try {
    const res = await fetch(src.url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "ShopPal-demo-research/1.0" },
    });
    const ok = res.ok ? "OK" : `HTTP ${res.status}`;
    const text = res.ok ? await res.text() : "";
    let hint = "";
    if (src.url.includes("exa.ai") && text.includes("2266")) hint = " · saw AA2266";
    if (src.url.includes("aa.com") && text.includes("563")) hint = " · saw $563 strip";
    console.log(`  ${ok}  ${src.label}${hint}`);
  } catch (e) {
    console.log(`  FAIL ${src.label} — ${e.message}`);
  }
}

data.checkedAt = new Date().toISOString();
writeFileSync(dataPath, JSON.stringify(data, null, 2) + "\n");
console.log(`\nUpdated checkedAt in ${dataPath}\n`);
