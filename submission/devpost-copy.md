# Devpost — project description (edit placeholders)

## Title

**ShopPal — Your AI shopping concierge that checks out with PayPal**

## Tagline

Delegate the search. Keep control of the payment.

## Description

ShopPal is a conversational agent for intentional purchases. Tell it what you need and your budget; it searches a curated catalog, explains tradeoffs in plain language, and waits for explicit approval before starting PayPal checkout.

Unlike recommendation bots that dump links, ShopPal uses **tool-backed actions**: product search, selection, and order creation through the **PayPal Orders API** in sandbox. Payment still happens in PayPal’s trusted UI—we never handle card data.

**Built for:** busy shoppers and anyone who wants fewer checkout steps without losing consent.

**PayPal:** Sandbox app, REST Orders v2, PayPal JavaScript Buttons (capture on approve).

**AI:** LLM tool calling for `search_products`, `select_product`, and gated `prepare_checkout` (only after the user says e.g. “yes, pay”).

## Demo URL

`https://YOUR-DEMO.onrender.com` (update before submit)

## Repository

`https://github.com/YOUR-USER/shop-pal` (update before submit)

## Video

`https://youtube.com/watch?v=YOUR_ID`

## How we used PayPal + AI

See `tools-used.md` in the repo `submission/` folder.
