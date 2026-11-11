# ShopPal

**PayPal AI Hackathon** — agentic rebooking after a weather cancel: compare real-world indicative fares, confirm intent, pay with PayPal.

## Demo story

**Sarah Jenkins** is connecting **Boston → Dallas (DFW)** when **AA 2184 DFW → Kansas City** is canceled (weather, Gate C19). She is **going home to Omaha** but **prefers to keep the Kansas City stop** when that leg is still bookable.

In **~60 seconds** a judge can run: **pick destination & mode → see Budget / Fast / Best → tap a fare → yes, pay → PayPal**.

| Beat | What happens |
|------|----------------|
| 1 | FIDS-style status bar + canceled boarding pass |
| 2 | Choose **MCI** (KC stop) or **OMA** (home), transport modes, **Show 3 picks** |
| 3 | Budget · Fast · Best from mock OTA + public research (bus, train, flights; OMA = sourced flights) |
| 4 | **yes, pay** → PayPal sandbox (or simulate in demo mode) |

Full narrative: [`submission/demo-thanksgiving-story.md`](submission/demo-thanksgiving-story.md)

## Quick start

```bash
cd web
cp ../submission/env.example .env.local
# Optional: PayPal sandbox client id/secret for live widget
npm install
npm run dev
```

Open **http://localhost:3000/chat** (landing: **/**).

If the app returns **500** or a blank page after big changes:

```bash
npm run dev:clean
```

### Headless demo (API)

With dev running:

```bash
npm run demo:mock-ota
```

### E2E clip (Playwright)

```bash
npm run dev   # separate terminal
npx playwright test e2e/chat-demo-clip.spec.ts
```

## Architecture (judge view)

- **Next.js 15** app under `web/`
- **Mock OTA search** merges Thanksgiving flight JSON, **DFW→KC ground research**, and **DFW→OMA flight research**
- **Session-backed select/confirm** mirrors agent tools without requiring free-form chat
- **PayPal Orders API** via `PayPalCheckout` (demo mode when credentials omitted)

Key routes:

| Route | Role |
|--------|------|
| `GET /api/ota/v1/search` | Search with tracks; `origin=DFW`, `destination=MCI\|OMA`, `modes=flight,bus,...` |
| `GET /api/ground/v1` | Ground research catalog |
| `GET /api/flights/v1/oma` | Omaha flight research catalog |
| `POST /api/demo/select` | Hold a fare SKU |
| `POST /api/demo/confirm` | User consent → checkout |

Data sources (indicative, linked in JSON): `web/data/mock-ota-thanksgiving.json`, `ground-public-research.json`, `dfw-oma-flight-research.json`.

Refresh checks: `npm run research:ground`, `npm run research:oma`.

## PayPal sandbox

Create an app at [developer.paypal.com](https://developer.paypal.com/dashboard/applications/sandbox) and set `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` in `web/.env.local`. Without keys, the UI uses **Simulate PayPal approval**.

## Optional live fares

Set `FARE_PROVIDERS=duffel,amadeus` and API keys in `.env.local` to override mock data (see `submission/env.example`). Default hackathon path is **mock OTA + public research**.

## Repo map

| Path | Purpose |
|------|---------|
| [`web/`](web/) | Runnable app |
| [`submission/`](submission/) | Devpost copy, env template, story |
| [`PRD.md`](PRD.md) · [`ARCHITECTURE.md`](ARCHITECTURE.md) | Product & system notes |

## License

MIT — see [`submission/LICENSE`](submission/LICENSE).
