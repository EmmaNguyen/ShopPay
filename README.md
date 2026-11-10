# ShopPal — PayPal AI Hackathon

Agentic shopping: describe what you want, compare options, confirm, then pay with **PayPal sandbox**.

## Docs

| File | Purpose |
|------|---------|
| [PRD.md](./PRD.md) | What & for whom |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Stack & data flow |
| [DESIGN.md](./DESIGN.md) | UI system |
| [RULES.md](./RULES.md) | Code + agent safety rules |
| [TASKS.md](./TASKS.md) | Step-by-step build |
| [PROGRESS.md](./PROGRESS.md) | Status log |
| [submission/](./submission/) | Devpost & demo pack |

## Quick start

```bash
cd web
cp ../submission/env.example .env.local
# Edit .env.local with PayPal sandbox credentials
npm install
npm run dev
```

If you see **500** or a blank page after pulling changes, stop the dev server and run:

```bash
npm run dev:clean
```

Open [http://localhost:3000](http://localhost:3000) — landing at `/`, chat at `/chat`.

### Example conversation

1. “Wireless earbuds under $80”
2. Pick a product or say “buy the second one”
3. Reply **yes, pay** when prompted
4. Complete PayPal sandbox checkout in the widget

## PayPal

Create a sandbox app at [developer.paypal.com](https://developer.paypal.com/dashboard/applications/sandbox).

## License

MIT — see `submission/LICENSE`.
