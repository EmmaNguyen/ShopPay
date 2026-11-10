# ShopPal — Progress log

> Update this file as you complete `TASKS.md`. Newest entries at the top.

## 2026-11-10

### Done

- Created product docs: PRD, ARCHITECTURE, DESIGN, RULES, TASKS
- Scaffolded `web/` Next.js app (chat UI, catalog, agent API, PayPal routes)
- Added `submission/` pack for Devpost
- `npm run build` passes in `web/`
- Marketing landing at `/`, chat moved to `/chat`

### Broken / known gaps

- PayPal sandbox credentials not configured locally until you add `.env.local`
- OpenAI optional — fallback agent works without `OPENAI_API_KEY`
- Session store is in-memory (resets on server restart; fine for demo)

### Next

1. `cd web && cp ../submission/env.example .env.local` — fill PayPal sandbox values
2. Run `npm install && npm run dev` — complete T1.1 smoke test
3. Sandbox checkout test (T3.5)
4. Deploy + demo video (Phase 5)
