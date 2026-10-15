# BAANYARD Investor Webapp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or subagent-driven-development) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single Vite+React+TS SPA in `App/` that presents an investor pitch then an interactive Guest/Host/Admin demo with Simulated mock data, bright light luxury theme (no gold, no black), and Thailand Country Admin as the default admin landing.

**Architecture:** Client-only SPA with `mode: 'pitch' | 'demo'`. Shared session state (language, lane, cart, authConfig overrides) in React context + localStorage. Pitch is horizontal snap slides; demo lanes are routed views with H/V scroll-snap and hidden scrollbars. All commercial metrics labeled Estimate or Simulated/Demo.

**Tech Stack:** Vite, React 18+, TypeScript, CSS variables (no UI kit required), Google Fonts (Fraunces + Source Sans 3).

## Global Constraints

- Deliverable = Option C: pitch first → Enter demo (spec §3).
- Scaffold only under `App/`; stack Vite + React + TypeScript.
- Hide scrollbars app-wide; support vertical + horizontal swipe/scroll.
- Mock data: `simulated: true` + UI badges Simulated/Demo; plan numbers = Estimate.
- Ask 1.5M THB = Estimate; never invent measured traction.
- Admin default landing = Country Admin Thailand; Branch ศรีสงคราม drill-down; Sync to HQ.
- Auth catalog config-driven (google/apple/whatsapp/alipay/line + enable/add); fake sessions only.
- Language chosen at registration; chat auto-translate = mock fixtures.
- Stripe + video = UI mocks only; no live keys / WebRTC.
- Compliance = roadmap not certified (PDPA, GDPR, ISO 27001, ISO 27701, SOC 2, PbD).
- Theme: bright, light, accessible, safe, soft luxury — **no gold, no black UI**; indigo/คราม + sage accents; charcoal text sparingly.
- Avoid purple AI gradients, cream+terracotta cliché, broadsheet layout.
- Do not git commit unless user asks.
- README in `App/` with `npm install && npm run dev`.

---

## File structure

```
App/
  package.json
  vite.config.ts
  tsconfig.json
  tsconfig.app.json
  tsconfig.node.json
  index.html
  README.md
  public/favicon.svg
  src/
    main.tsx
    App.tsx
    vite-env.d.ts
    styles/tokens.css
    styles/global.css
    i18n/th.ts
    i18n/en.ts
    i18n/index.ts
    data/types.ts
    data/communities.ts
    data/listings.ts
    data/authCatalog.ts
    data/admin.ts
    data/chat.ts
    state/AppState.tsx
    components/Badge.tsx
    components/DemoChrome.tsx
    components/HorizontalPager.tsx
    features/pitch/PitchDeck.tsx
    features/pitch/slides.tsx
    features/guest/GuestApp.tsx
    features/guest/Register.tsx
    features/guest/Explore.tsx
    features/guest/ListingDetail.tsx
    features/guest/Chat.tsx
    features/guest/VideoCall.tsx
    features/guest/Checkout.tsx
    features/host/HostApp.tsx
    features/admin/AdminApp.tsx
    features/privacy/PrivacyCenter.tsx
    utils/currency.ts
    utils/translate.ts
```

---

### Task 1: Scaffold Vite app + theme tokens + README

**Files:**
- Create: `App/package.json`, `App/vite.config.ts`, `App/tsconfig*.json`, `App/index.html`, `App/src/main.tsx`, `App/src/App.tsx`, `App/src/styles/tokens.css`, `App/src/styles/global.css`, `App/README.md`, `App/public/favicon.svg`

**Interfaces:**
- Produces: runnable `npm run dev` / `npm run build`; CSS vars `--by-bg`, `--by-surface`, `--by-ink`, `--by-indigo`, `--by-sage`, `--by-accent`, `--by-shadow`, fonts Fraunces + Source Sans 3

- [ ] **Step 1: Scaffold with Vite**

```bash
cd C:\Projects\BAANYARD
npm create vite@latest App -- --template react-ts
cd App && npm install
```

- [ ] **Step 2: Write theme tokens**

`tokens.css` must define light luxury palette with **no gold and no `#000` backgrounds**. Example:

```css
:root {
  --by-bg: #F7FAFC;
  --by-bg-warm: #F5F7F4;
  --by-surface: #FFFFFF;
  --by-ink: #2A3340;
  --by-ink-muted: #5B6775;
  --by-indigo: #3D5A80;
  --by-indigo-soft: #E8EEF5;
  --by-sage: #7A9E7E;
  --by-sage-soft: #E8F0E9;
  --by-line: #D7E0E8;
  --by-danger: #C45C5C;
  --by-shadow: 0 12px 40px rgba(45, 74, 99, 0.08);
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Source Sans 3", system-ui, sans-serif;
}
```

- [ ] **Step 3: Global CSS — hide scrollbars, base layout**

```css
html, body, #root { height: 100%; }
* { scrollbar-width: none; }
*::-webkit-scrollbar { display: none; }
body {
  margin: 0;
  font-family: var(--font-body);
  color: var(--by-ink);
  background: var(--by-bg);
}
```

Load fonts in `index.html` via Google Fonts link for Fraunces + Source Sans 3.

- [ ] **Step 4: README**

Document: `cd App && npm install && npm run dev` and note Simulated/Demo data + no real OAuth/Stripe.

- [ ] **Step 5: Verify scaffold**

Run: `npm run build`  
Expected: success, no TS errors.

---

### Task 2: Types, mock data, i18n, AppState

**Files:**
- Create: `src/data/types.ts`, `communities.ts`, `listings.ts`, `authCatalog.ts`, `admin.ts`, `chat.ts`, `src/i18n/*`, `src/state/AppState.tsx`, `src/utils/currency.ts`, `src/utils/translate.ts`

**Interfaces:**
- Produces: `AppMode`, `DemoLane`, `AuthProviderConfig`, `Community`, `Listing`, `useAppState()` with `mode`, `setMode`, `lane`, `setLane`, `primaryLanguage`, `setPrimaryLanguage`, `sessionUser`, `signInDemo`, `authProviders`, `setProviderEnabled`, `addProvider`, `cart`, `adminSyncStatus`, `triggerSyncToHq`, `consentMarketing`, `dsrRequests`

- [ ] **Step 1: Define core types in `types.ts`**

Include `simulated: true` on fixture entity types; `AuthProviderConfig`; admin hierarchy ids `hq | country-th | branch-sri-songkhram`.

- [ ] **Step 2: Seed fixtures**

Communities: Sri Songkhram (TH) + ≥2 international (e.g. Luang Prabang LA, Sapa VN).  
Listings: stay / experience / product.  
Auth seed: five providers, all enabled by default.  
Admin KPIs for TH with Estimate/Demo labels in UI (not as real metrics).  
Chat thread with bilingual pairs.

- [ ] **Step 3: i18n dictionaries**

`t(lang, key)` for EN/TH covering nav, pitch CTA, register, admin, privacy, checkout.

- [ ] **Step 4: AppState provider**

Persist `authProviders`, `primaryLanguage`, `mode` optionally in `localStorage` keys prefixed `baanyard.`.  
`signInDemo(providerId)` creates fake session.  
`triggerSyncToHq()` cycles `idle → queued → synced` with short timeouts.

- [ ] **Step 5: Verify**

`npm run build` passes with providers wired in `main.tsx`.

---

### Task 3: Pitch deck (horizontal ~11 slides + Enter demo)

**Files:**
- Create: `src/features/pitch/PitchDeck.tsx`, `slides.tsx`, `src/components/HorizontalPager.tsx`, `Badge.tsx`

**Interfaces:**
- Consumes: `setMode('demo')`, `t`, theme tokens  
- Produces: keyboard/swipe horizontal slides; final CTA sets demo mode Guest

- [ ] **Step 1: HorizontalPager**

Scroll-snap-x container; children full viewport width/height; arrow keys change slide; touch swipe works via native overflow scroll.

- [ ] **Step 2: Slides content**

Slides: Title, Problem, Solution, Why now, Market, Product, Traction (Estimate), Business model, GTM, Competition, Team+Ask (1.5M Estimate), Trust & Compliance roadmap, CTA Enter demo.

Brand-first title: **BAANYARD บ้านญาติ** dominant.  
No certified badges — “Roadmap toward / Designed for”.

- [ ] **Step 3: Wire PitchDeck into App when `mode==='pitch'`**

- [ ] **Step 4: Verify** build + manual: arrows change slides; CTA enters demo.

---

### Task 4: Demo chrome + Guest lane (register → explore → listing → chat → video → checkout)

**Files:**
- Create: `DemoChrome.tsx`, `features/guest/*`, privacy entry from chrome/footer

**Interfaces:**
- Consumes: AppState lane/user/cart/authProviders  
- Produces: full Guest happy path ending in checkout success

- [ ] **Step 1: DemoChrome**

Lane switcher Guest|Host|Admin; Back to pitch; language/currency chips; Simulated badge.

- [ ] **Step 2: Register**

Language select (primaryLanguage); buttons for enabled auth providers only; marketing consent default **off**; on success go Explore.

- [ ] **Step 3: Explore + ListingDetail**

Show communities worldwide; TH narrative visible; badges Simulated; trust block; CTAs Chat / Call / Buy-Book.

- [ ] **Step 4: Chat mock translate + Video placeholder + Stripe mock**

Chat shows translated primary + Show original.  
Video: overlay “Connecting… Demo” + End.  
Checkout: mock card fields → success.

- [ ] **Step 5: Verify** build + path Guest register → checkout.

---

### Task 5: Host lane (3-step offer wizard)

**Files:**
- Create: `features/host/HostApp.tsx`

**Interfaces:**
- Produces: offers saved in AppState; inbox stub with translate

- [ ] **Step 1: Empty state CTA → 3 steps** (type → story/photos stub → price)  
- [ ] **Step 2: My offers list + progressive “More tools” panel**  
- [ ] **Step 3: Verify** build

---

### Task 6: Admin lane (TH Country default + Branch + HQ sync + auth catalog)

**Files:**
- Create: `features/admin/AdminApp.tsx`

**Interfaces:**
- Default view: `country-th` Dashboard | Settings | Reports | Sync to HQ  
- Drill-down: `branch-sri-songkhram`  
- Drill-up: `hq` with auth catalog toggles + add provider

- [ ] **Step 1: TH Country dashboard as initial admin screen**  
- [ ] **Step 2: Reports export stub** (download JSON of mock audit rows)  
- [ ] **Step 3: Sync to HQ status UI**  
- [ ] **Step 4: HQ auth enable/disable/add** affects Guest Register  
- [ ] **Step 5: Verify** Admin lands on TH; sync works; Register buttons update

---

### Task 7: Privacy Center + compliance copy

**Files:**
- Create: `features/privacy/PrivacyCenter.tsx`

- [ ] **Step 1: Consent summary, DSR access/delete request stubs, roadmap checklist** (PDPA, GDPR, ISO 27001, ISO 27701, SOC 2, PbD) with explicit not-certified language  
- [ ] **Step 2: Link from DemoChrome**  
- [ ] **Step 3: Verify** build

---

### Task 8: Polish motion, mobile H+V, final verification

**Files:**
- Modify: `global.css`, pitch/demo layouts as needed

- [ ] **Step 1: Add 2–3 transitions** (slide fade/snap feel, lane enter, checkout success)  
- [ ] **Step 2: Ensure explore lists scroll vertically inside horizontal sections**  
- [ ] **Step 3: Run `npm install && npm run build`** — fix all errors  
- [ ] **Step 4: Brief `npm run dev` smoke** — pitch → demo → three lanes load  
- [ ] **Step 5: Do not commit** unless user asks

---

## Spec coverage checklist

| Spec area | Task |
|-----------|------|
| C pitch→demo | 3 |
| Theme no gold/black, light luxury | 1, 8 |
| H+V + hide scrollbars | 1, 3, 8 |
| Mock Simulated/Estimate | 2, 3, 4, 6 |
| Guest/Host/Admin | 4, 5, 6 |
| TH Country admin first | 6 |
| Auth config | 2, 6 |
| i18n + translate chat | 2, 4 |
| Stripe/video mocks | 4 |
| Privacy roadmap | 7 |
| README run instructions | 1 |

## Plan self-review

- No TBD placeholders in tasks.  
- Auth edit at HQ vs TH landing made explicit in Task 6.  
- Commits listed as optional / skip per user rule.  
- Single SPA scope retained (YAGNI).
