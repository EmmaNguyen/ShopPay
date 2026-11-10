# ShopPal — Design System

## Vibe

**Trustworthy concierge** — calm fintech (PayPal-adjacent blues) plus warm accents so it feels helpful, not corporate-empty. Chat is the hero; payment is a deliberate “moment” with extra spacing and confirmation copy.

**Keywords:** clear, patient, precise, never pushy.

## Color palette

| Token | Hex | Usage |
|-------|-----|--------|
| `paypal-navy` | `#003087` | Headers, primary buttons, links |
| `paypal-blue` | `#0070E0` | Focus rings, active states |
| `paypal-light` | `#009CDE` | Gradients, badges |
| `ink` | `#001435` | Body text on light |
| `mist` | `#F5F7FA` | Page background |
| `surface` | `#FFFFFF` | Cards, chat panel |
| `success` | `#198754` | Payment complete |
| `warning` | `#F5A623` | “Confirm before pay” banners |
| `error` | `#D20000` | Failures |

**Gradient (marketing strip):** `linear-gradient(135deg, #003087 0%, #0070E0 50%, #009CDE 100%)`

## Typography

| Role | Font | Fallback |
|------|------|----------|
| UI / body | **Inter** | system-ui, sans-serif |
| Display (logo wordmark) | **Inter** weight 700 | — |
| Mono (order IDs) | **JetBrains Mono** | ui-monospace |

- Base size: `16px`; chat messages `15–16px`, line-height `1.5`
- Headings: `text-2xl` / `text-lg` only; avoid deep heading hierarchy in chat app

## Layout

- **Desktop:** max-width `720px` centered chat column; sticky header with ShopPal mark
- **Mobile:** full-width; input pinned to bottom safe area
- Spacing scale: Tailwind `4, 6, 8, 12` (16/24/32/48px)

## Components

| Component | Behavior |
|-----------|----------|
| `Chat` | Scrollable thread, auto-scroll on new assistant message |
| `MessageBubble` | User: right, navy fill, white text. Assistant: left, white card, subtle border |
| `ProductCard` | Image placeholder, title, price, one-line “why this fits”; tap to select |
| `ConfirmBar` | Yellow-tint strip: “Say **yes, pay** to continue” |
| `PayPalCheckout` | Isolated card with PayPal Buttons only after confirm |
| `Receipt` | Green top border, mono order ID, link to sandbox transaction (optional) |

## Motion

- Message enter: `opacity 0→1`, `translateY 4px`, 200ms ease-out
- PayPal block: fade-in 300ms after confirm (signals seriousness)
- No gratuitous animation on errors

## Accessibility

- Focus visible on input and product cards (`ring-paypal-blue`)
- Confirm actions require keyboard-submit on chat input
- Color contrast ≥ 4.5:1 on body text
- PayPal widget remains primary accessible payment surface

## Voice & microcopy

- Assistant: “Here are three options under your budget.” not “I found amazing deals!!!”
- Before pay: “I’ll start PayPal checkout for **{product}** at **${price}**. Reply **yes, pay** to continue.”
- After pay: “Payment completed in sandbox. Order ID: …”

## Devpost / demo video framing

- Open on mist background + one user message already visible (optional seed)
- Show product cards → confirm phrase → PayPal overlay → receipt
- End card: ShopPal logo on navy gradient, tagline “Delegate the cart. Keep the control.”
