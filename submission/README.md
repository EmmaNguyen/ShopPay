# Hackathon submission pack — ShopPal

Use this folder when filling [PayPal AI Hackathon on Devpost](https://paypalaihackathon.devpost.com/).

## Checklist

- [ ] Public repo URL (GitHub)
- [ ] Hosted demo URL (Render/Vercel)
- [ ] YouTube demo video (< 3 min, public)
- [ ] Text description → `devpost-copy.md`
- [ ] Tools list → `tools-used.md`
- [ ] PayPal sandbox (not live) in video and deploy
- [ ] LICENSE visible on repo

## Files here

| File | Use |
|------|-----|
| `devpost-copy.md` | Paste into Devpost description |
| `tools-used.md` | AI + PayPal tools section |
| `demo-script.md` | Record video from this script |
| `env.example` | Copy to `web/.env.local` |
| `LICENSE` | MIT for repo root |

## Judges — run locally

```bash
git clone <your-repo>
cd Paypal_hackathon/web
cp ../submission/env.example .env.local
# Add PAYPAL_* from your sandbox OR set DEMO_MODE=true for UI-only sim
npm install
npm run build && npm run start
```
