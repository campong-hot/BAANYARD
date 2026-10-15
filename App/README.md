# BAANYARD บ้านญาติ — Investor webapp (Demo)

> **Static hosting (no build):** the plain HTML/CSS/JS/JSON version for ordinary web hosting lives in [`../web/`](../web/). Prefer `web/` for cPanel / Netlify / Apache. This `App/` folder is the Vite + React source.

Vite + React + TypeScript SPA: **investor pitch** first, then an interactive **Guest / Host / Admin / Privacy** product demo.

All marketplace metrics and sync/auth/payment flows are **Simulated / Demo**. Plan figures (e.g. 1.5M THB ask) are labeled **Estimate**. No real OAuth, Stripe charges, or WebRTC. No fake compliance certifications.

## Run

```bash
cd App
npm install
npm run dev
```

Vite listens on all interfaces (`host: true` → `0.0.0.0`). After starting, the terminal shows both:

- **Local:** `http://localhost:5173`
- **Network:** `http://192.168.x.x:5173` (your machine’s LAN IP)

### Open from phone / another PC

1. Stop any old `npm run dev` (Ctrl+C) and start again so the host setting takes effect.
2. On the other device (same Wi‑Fi/LAN), open the **Network** URL Vite printed.
3. If it does not load on Windows, allow **Node.js / Vite** through Windows Firewall for private networks on port **5173**.

## Build

```bash
npm run build
npm run preview
```

## Feature map (verify each lane)

| Lane | What to click |
|------|----------------|
| **Pitch** | Horizontal swipe/arrows through Product → Traction (Estimate) → Business model → GTM → Competition → Team+Ask 1.5M → Compliance roadmap → **Enter product demo** |
| **Guest** | Splash (language + currency) → Register (enabled auth only) → Explore communities/listings → Story → Listing (stay/experience/product) → Host profile + trust → Chat (original + translated) → Video UI → Cart → Stripe mock → Success. Currency chip uses Simulated FX |
| **Host** | My barn → 3-step offer wizard → My offers + More tools → **Inbox** with auto-translate reply |
| **Admin** | Lands on **Thailand Country** Dashboard / Settings / Reports + Sync to HQ (`idle→queued→synced`). Drill to Branch ศรีสงคราม (Dashboard/Settings/Reports). Drill up to **HQ** (rollup, receive sync, auth catalog enable/disable/add) |
| **Privacy** | Demo-as switcher → Consent + lawful basis notes → DSR access/delete stubs → Roadmap PDPA / GDPR / ISO 27001 / ISO 27701 / SOC 2 / PbD (**not certified**) |

Images: wired from `public/images/*.png` (community / listing / host / hero). Missing files fall back to CSS placeholders.

## Theme

Bright, light, accessible, soft luxury — indigo/คราม + sage accents. **No gold. No black UI theme.**
