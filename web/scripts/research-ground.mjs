#!/usr/bin/env node
/**
 * Spot-check public URLs cited in ground-public-research.json (live HEAD/GET).
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const dir = dirname(fileURLToPath(import.meta.url));
const dataPath = join(dir, "../data/ground-public-research.json");
const data = JSON.parse(readFileSync(dataPath, "utf8"));

console.log("Checking ground research sources...\n");

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
    if (src.url.includes("greyhound") && text.includes("61.98")) hint = " · saw $61.98";
    if (src.url.includes("qeeq") && text.includes("157")) hint = " · saw ~$157";
    if (src.url.includes("wanderu") && text.includes("142")) hint = " · saw from $142";
    if (src.url.includes("ridewise") && text.includes("353")) hint = " · saw Dallas 300mi band";
    console.log(`  ${ok}  ${src.label}${hint}`);
  } catch (e) {
    console.log(`  FAIL ${src.label} — ${e.message}`);
  }
}

data.compiledAt = new Date().toISOString().slice(0, 10);
data.checkedAt = new Date().toISOString();
writeFileSync(dataPath, JSON.stringify(data, null, 2) + "\n");
console.log(`\nUpdated checkedAt in ${dataPath}\n`);
