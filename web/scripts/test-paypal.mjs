import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i);
    const val = t.slice(i + 1);
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const base =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const clientId = process.env.PAYPAL_CLIENT_ID;
const secret = process.env.PAYPAL_CLIENT_SECRET;

if (!clientId || !secret) {
  console.error("FAIL: missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET");
  process.exit(1);
}

const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
});
if (!tokenRes.ok) {
  console.error("FAIL: oauth", await tokenRes.text());
  process.exit(1);
}
const { access_token } = await tokenRes.json();

const orderRes = await fetch(`${base}/v2/checkout/orders`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: "earbuds-soundwave-lite",
        description: "ShopPal sandbox test",
        amount: { currency_code: "USD", value: "59.99" },
      },
    ],
  }),
});

if (!orderRes.ok) {
  console.error("FAIL: create order", await orderRes.text());
  process.exit(1);
}

const order = await orderRes.json();
console.log("OK: PayPal sandbox order created", order.id);
