#!/usr/bin/env node
import { readFileSync } from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";

const KEYS = [
  "PAYPAL_CLIENT_ID",
  "PAYPAL_CLIENT_SECRET",
  "PAYPAL_MODE",
  "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
  "DEMO_MODE",
];

const envPath = resolve(process.cwd(), ".env.local");
const text = readFileSync(envPath, "utf8");
const env = {};
for (const line of text.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i === -1) continue;
  env[t.slice(0, i)] = t.slice(i + 1);
}

for (const key of KEYS) {
  const value = env[key];
  if (value == null || value === "") continue;
  for (const target of ["production", "preview"]) {
    const run = spawnSync(
      "vercel",
      ["env", "add", key, target, "--force"],
      { input: value, encoding: "utf8", cwd: process.cwd() }
    );
    if (run.status !== 0 && !String(run.stderr).includes("already exists")) {
      console.warn(`vercel env add ${key} ${target}:`, run.stderr || run.stdout);
    } else {
      console.log(`set ${key} (${target})`);
    }
  }
}
