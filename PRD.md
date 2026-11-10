# ShopPal — Product Requirements Document

## One-liner

**ShopPal** is a chat-first shopping agent that finds products within budget, explains tradeoffs, asks for explicit approval, then completes **PayPal checkout** in sandbox—without the user hunting through product pages.

## Problem

Online shopping still means tab chaos: search, compare, fill addresses, pick payment, confirm. For constrained purchases (“headphones under $80, ship to me”), people want **delegation with guardrails**, not another marketplace.

## Target users

| Persona | Need | Why ShopPal |
|---------|------|-------------|
| **Busy professional (primary)** | Buy routine items quickly with a spending cap | Natural language + one confirmation step |
| **Accessibility-focused shopper** | Fewer UI steps, clear spoken-style summaries | Single conversational surface |
| **Hackathon judge / demo viewer** | See **agentic commerce** (act, not advise) | Live sandbox payment after agent tool chain |

## Goals (hackathon MVP)

1. User describes intent in chat; agent returns **2–3 catalog options** with prices and rationale.
2. User picks one (or refines); agent shows **order summary** (item, subtotal, shipping placeholder).
3. User must explicitly confirm (“yes, pay”); agent creates **PayPal order** and surfaces **PayPal Buttons** or approve link.
4. Payment completes in **PayPal sandbox**; chat shows **receipt** (order ID, status).
5. Repo is **runnable locally** and **deployable** (Render/Vercel) with env-based config.

## Non-goals (MVP)

- Real merchant catalog, inventory, or global shipping quotes
- Multi-item carts, subscriptions, or Pay Later
- Production PayPal live payments
- Autonomous spending without confirmation
- Mobile native apps

## User stories

1. **As a shopper**, I say what I want and a max price so the agent only suggests in-budget items.
2. **As a shopper**, I see a plain-language comparison before anything is charged.
3. **As a shopper**, I must confirm before the agent creates a PayPal order.
4. **As a judge**, I can run the demo from a README or open a hosted URL and complete a sandbox payment in under 3 minutes.

## Functional requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Chat UI with message history and loading states | P0 |
| FR-2 | Catalog search tool (static JSON catalog, filter by query + max price) | P0 |
| FR-3 | Agent orchestration with tool calling (LLM) or deterministic fallback | P0 |
| FR-4 | PayPal sandbox: create order, client approve/capture, show result in chat | P0 |
| FR-5 | Session-scoped cart / selected SKU before checkout | P0 |
| FR-6 | Environment config for PayPal + optional OpenAI | P0 |
| FR-7 | PayPal MCP integration path (documented; optional wire-up in v1.1) | P1 |
| FR-8 | Demo mode without API keys (mock payment success) | P1 |

## Success metrics (demo)

- End-to-end demo in **< 90 seconds** from first message to sandbox receipt
- **Zero** charges without an explicit user confirmation message
- Judges can clone, `npm install`, set `.env`, and run per README

## Compliance & trust

- Sandbox only for submissions
- No storage of real card data; PayPal handles payment UI
- Log PayPal order IDs only; no PII in repo or videos beyond test accounts

## Devpost alignment

- **PayPal:** Orders / Checkout (JavaScript SDK v6), sandbox dashboard
- **AI:** LLM tool use for search, summarize, confirm gate
- **Category:** Agentic commerce — agent **transacts** after user approval
