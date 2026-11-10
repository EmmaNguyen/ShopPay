# ShopPal — Tasks (one step at a time)

Work in order. Check off in `PROGRESS.md` when done.

## Phase 0 — Repo & docs

- [x] **T0.1** Confirm all root docs exist (PRD, ARCHITECTURE, DESIGN, RULES, TASKS, PROGRESS)
- [x] **T0.2** Fill `submission/` checklist and env template
- [ ] **T0.3** Initialize git when ready (user request only)

## Phase 1 — Shell

- [x] **T1.1** `cd web && npm install && npm run dev` — app loads at localhost
- [x] **T1.2** Apply DESIGN tokens in `globals.css` + header layout
- [x] **T1.3** `Chat` component: input, send, message list

## Phase 2 — Catalog & tools

- [x] **T2.1** Add `data/catalog.json` (≥8 products, multiple categories)
- [x] **T2.2** Implement `lib/catalog.ts` search (query + max price)
- [x] **T2.3** Implement agent tools in `lib/agent/tools.ts`
- [x] **T2.4** Wire `/api/chat` with tool loop + session store

## Phase 3 — PayPal sandbox

- [x] **T3.1** Create PayPal sandbox app; copy client id + secret to `.env.local`
- [x] **T3.2** Implement `lib/paypal.ts` (OAuth + create + capture)
- [x] **T3.3** `POST /api/checkout/create-order` from selected SKU
- [x] **T3.4** `PayPalCheckout` component + capture route
- [x] **T3.5** Receipt message in chat after capture

## Phase 4 — Agent polish

- [ ] **T4.1** Tune system prompt for compare-then-confirm flow
- [ ] **T4.2** `ProductCard` rendering when API returns `products[]`
- [ ] **T4.3** Confirmation phrase detection tests (manual script in PROGRESS)
- [ ] **T4.4** Optional: OpenAI key; verify fallback without key

## Phase 5 — Deploy & submit

- [x] **T5.1** Deploy to Render/Vercel; set env vars
- [x] **T5.2** Record <3 min YouTube demo (see `submission/video/shop-pal-demo.webm`; upload per YOUTUBE.md)
- [ ] **T5.3** Complete Devpost form using `submission/devpost-copy.md`
- [ ] **T5.4** Public GitHub repo + LICENSE

## Phase 6 — Stretch (optional)

- [ ] **T6.1** PayPal MCP server tool bridge
- [ ] **T6.2** AG Grid order history table
- [ ] **T6.3** Discord-worthy agent tool trace UI
