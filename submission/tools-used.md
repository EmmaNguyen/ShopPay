# Tools used — PayPal AI Hackathon

## PayPal

| Capability | How ShopPal uses it |
|------------|---------------------|
| Developer Dashboard | Sandbox app credentials |
| Orders API v2 | Create order from selected catalog SKU |
| Capture on approve | Complete payment after user approves in PayPal Buttons |
| JavaScript SDK (`@paypal/react-paypal-js`) | Client-side approval UI |
| (Stretch) PayPal MCP server | Documented in ARCHITECTURE.md for agent tool bridge |

## AI

| Tool | How ShopPal uses it |
|------|---------------------|
| OpenAI API (optional) | Chat completions with function tools for catalog search & checkout prep |
| Deterministic fallback | Keyword + catalog search when no API key — still demonstrates flow |

## Sponsor / infra (optional)

| Tool | Use |
|------|-----|
| Render | Host Next.js demo (`$PORT`) |
| Vercel | Alternative deploy |

## Not used in MVP

AG Grid, APIMatic, Zapier — listed as future enhancements in TASKS Phase 6.
