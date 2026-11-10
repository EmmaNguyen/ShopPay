# ShopPal — Engineering Rules

## Coding style

- **TypeScript strict** in `web/`; no `any` except wrapped third-party gaps with a comment
- **Named exports** for lib utilities; default export only for Next.js `page.tsx` / `layout.tsx`
- **Colocate** API logic in `app/api/*`; business logic in `lib/*`
- **Zod** (or manual guards) for API request bodies
- Prefer `async/await` over raw Promise chains
- Comments only for non-obvious business rules (confirmation gate, sandbox quirks)

## File & naming

- Components: `PascalCase.tsx`
- Lib modules: `kebab-case.ts` or single-word `catalog.ts`
- API routes: REST-ish verbs in folders (`create-order`, `capture-order`)

## Git & commits

- Commits only when the user asks
- No secrets in git; use `.env.local` and `submission/env.example`

## Testing & quality

- `npm run lint` and `npm run build` must pass before submission
- Manual sandbox payment test before recording demo video

---

## What the AI agent (ShopPal runtime) must NEVER do

These are product safety rules enforced in code and prompts:

1. **Never create or capture a PayPal order** without an explicit user confirmation in the **current turn or immediately prior user message** (phrases like `yes, pay`, `confirm purchase`, `go ahead and pay`).
2. **Never invent products, prices, or inventory** — only return SKUs from `catalog.json` via `search_products`.
3. **Never claim payment succeeded** unless the capture API returned `COMPLETED` (or demo mode flag with clear “simulated” label).
4. **Never store or ask for** card numbers, CVV, or bank passwords in chat.
5. **Never exceed** the user’s stated `maxPriceUsd` without calling out the exception and asking again.
6. **Never use live PayPal credentials** in hackathon repo, videos, or public deploys — **sandbox only**.
7. **Never auto-select** a product without user picking or naming it after options were shown.
8. **Never expose** `PAYPAL_CLIENT_SECRET` or `OPENAI_API_KEY` to the client bundle or chat logs.

## What human developers must never do

- Disable the confirmation gate “for demo speed” on the submission branch
- Log full PayPal auth responses containing secrets
- Commit `.env` files

## Prompt guardrails (`lib/agent/system-prompt.ts`)

- System prompt repeats rules 1–3 and 7 in short form
- Tool descriptions state prerequisites (e.g. `prepare_checkout` requires confirmation)

## Demo mode

If PayPal env vars are missing, `DEMO_MODE=true` may mock success **only** when UI shows “Simulated payment (demo mode)” — never silently fake a real PayPal flow.
