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

1. `gh auth login` → `gh repo create shop-pal --public --source=. --remote=origin --push`
2. Upload `submission/video/shop-pal-demo.webm` to YouTube (`submission/video/YOUTUBE.md`)
3. Devpost form (`submission/devpost-copy.md`) + optional PayPal capture on prod demo
