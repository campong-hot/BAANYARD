# BAANYARD Investor Webapp — Design Spec

**Date:** 2026-08-07  
**Status:** Spec approved; theme locked (bright/light luxury, no gold/black); investor SPA implemented under `App/`  
**Product:** BAANYARD บ้านญาติ  
**Deliverable type:** Option **C** — Investor pitch deck + interactive product demo (single SPA)  
**Workspace:** `C:\Projects\BAANYARD` · App root: `App/`

---

## 1. One-liner & positioning

**EN:** Stay with rural hosts like visiting relatives — authentic stays, local goods, and stories from rural communities worldwide.  
**TH:** ไปเยี่ยมญาติชนบท — ที่พัก สินค้า และเรื่องราวจริงจากชุมชนทั่วโลก

**Audience for this build:** Investors (raise narrative) + demo users exploring Guest / Host / Admin flows.

**Investment ask (from business plan PDF):** **1,500,000 THB** — label as **Estimate** (plan figure, not measured traction).

**Do not invent traction.** Any users, GMV, revenue, or community counts shown in pitch or demo must be tagged **Estimate** (from plan) or **Simulated / Demo** (mock fixtures).

---

## 2. Goals & non-goals

### Goals (this investor webapp)

1. Present a coherent investor story (pitch slides) then hand off into a clickable product demo.
2. Demonstrate global rural tourism + community marketplace vision with mock data.
3. Show extreme ease of use (auto-first) for low-tech and high-tech users.
4. Show config-driven auth, language-at-registration, auto-translate chat (simulated).
5. Show Admin hierarchy with **Thailand Country Admin** as MVP default landing.
6. Show Privacy-by-Design UX and compliance *roadmap* (not certifications).
7. Mobile-friendly: vertical + horizontal swipe/scroll; scrollbars hidden app-wide.

### Non-goals (explicitly out of scope)

- Real OAuth / Apple / Google / WhatsApp / Alipay / Line production integrations
- Live Stripe payments or WebRTC video calls
- Production backend, real multi-tenant sync, or real ML translation APIs
- Flutter native app (PDF notes are historical only; this build is web)
- Claiming PDPA / GDPR / ISO / SOC 2 **certification** or audit pass
- Committing secrets or real API keys

---

## 3. Locked decisions

| Topic | Decision |
|-------|----------|
| Delivery shape | **C:** Pitch first → CTA enters interactive demo |
| Stack | **Vite + React + TypeScript** in `App/`; CSS variables + modules (or equivalent scoped CSS); no backend |
| Navigation | Horizontal = primary sections/slides; vertical = content within a section; both axes on mobile |
| Scrollbars | Hidden app-wide; scrolling still works (touch, wheel, keys) |
| Mock data | All fixtures `simulated: true`; UI badge **Simulated** or **Demo** |
| Vision | Global rural / community tourism + homemade products & services; city + foreign customers; rural providers worldwide |
| Admin MVP | **Country Admin · Thailand** is first Admin screen; Branch (e.g. ศรีสงคราม) drill-down; HQ parent + Sync destination |
| UX philosophy | Auto-first, minimal steps, clear defaults, progressive disclosure |
| Language | Primary language chosen at registration; not solely app-default |
| Chat | Auto-translation between guest and host (simulated) |
| Auth | Config-driven catalog; seed Google, Apple, WhatsApp, Alipay, Line; enable/disable/add via Admin config UI |
| Lanes | Guest · Host · Admin (demo role switcher) |
| Payments / AV | Stripe checkout UI mock; video call UI placeholder only |
| Compliance | PDPA, GDPR, ISO 27001, ISO 27701 (assumed intent of “ISO47000”), SOC 2, Privacy by Design & Default — **roadmap / designed-for**, not certified |
| Ask | 1.5M THB Estimate |

**ISO note:** User wrote “ISO47000”. This spec treats that as likely meaning **ISO 27701** (privacy ISMS companion to ISO 27001), not ISO 42001 (AI) unless later corrected. Pitch and Compliance UI must use “ISO 27701 (privacy)” wording, never claim “ISO47000 certified”.

---

## 4. User lanes & primary journeys

Demo chrome includes a clear **“Demo as: Guest | Host | Admin”** switcher (always labeled Simulated).

### 4.1 Guest (city residents + foreigners)

1. Splash → Register / Sign-in  
2. Choose **primary language** + see only **enabled** auth providers from config  
3. Explore communities / experiences / products (currency shown with Demo FX)  
4. Open listing → trust signals + storytelling  
5. Chat with host (auto-translate UI)  
6. Optional video-call placeholder  
7. Cart → Stripe checkout mock → confirmation  

**Low-tech path:** Large CTAs, one primary action per screen, defaults for language/currency after registration, 1-tap book/buy where possible.  
**High-tech unlocks:** Advanced filters, multi-currency detail, compare, original-message toggle in chat.

### 4.2 Host / Provider (villagers, eco-communities, rural lifestyles)

1. Enter Host lane → 3-step onboarding (offer type → photos/story → price & availability stub)  
2. My offers list  
3. Inbox with auto-translate  
4. Progressive unlock: calendar, seasonal pricing, simple analytics (mock)

Low-tech must complete “list an offer” without advanced tools. High-tech tools appear after first offer is saved (or via explicit “More tools”).

### 4.3 Admin (MVP = Thailand Country)

**Default after “Demo as Admin”:** Thailand Country Admin home with three areas:

| Area | Purpose |
|------|---------|
| **Dashboard** | Simulated KPIs for Thailand (listings, bookings, GMV Estimate/Demo, open issues) |
| **Settings** | Country-level settings; link/note that **auth provider catalog** is HQ-owned (TH can view enabled set; HQ mock screen reachable via drill-up edits auth catalog) |
| **Reports** | Audit-friendly mock reports; export stub (CSV/JSON download of mock payload) |
| **Sync to HQ** | Button → status Simulated: `idle → queued → synced` |

**Hierarchy in IA:**

```
Central / HQ          ← drill-up; receives sync; owns auth catalog config
  └── Country (TH)    ← DEFAULT Admin landing (MVP)
        └── Branch (ศรีสงคราม, …)  ← drill-down
```

Other countries may appear in mock data for Guest explore, but Admin demo narrative centers on **TH Country**.

**Auth config ownership (explicit):**  
- **HQ Admin mock** can enable/disable providers and add a provider stub.  
- **TH Country** Settings shows which providers are currently enabled (read-mostly) and a link “Open HQ auth settings (Demo)”.  
This avoids contradicting “admin-configurable” with “TH is default landing”.

---

## 5. Investor pitch flow

Horizontal deck (~11 frames), 16:9 framing on desktop; swipe/arrow navigation.

| # | Slide | Content rules |
|---|-------|----------------|
| 1 | Title / one-liner | Brand-forward; BAANYARD บ้านญาติ |
| 2 | Problem | City emotional/food gap + rural hidden assets |
| 3 | Solution | Third place: stays + goods + stories + trust tools |
| 4 | Why now | Digital gap + wellness/travel demand (qualitative; no fake stats) |
| 5 | Market | Directional; label Estimate if using plan numbers |
| 6 | Product | Live UI preview or deep-link into demo |
| 7 | Traction | Plan figures only as **Estimate**; or omit numbers and show demo readiness |
| 8 | Business model | GP ~20% Estimate from plan; ads; managed services |
| 9 | Go-to-market | Community-first; Sri Songkhram as narrative seed |
| 10 | Competition | Generic OTAs/marketplaces — differentiation: relatives/countryside authenticity + low-tech inclusion |
| 11 | Team + Ask | **1.5M THB Estimate** use of funds (MVP / marketing / ops from plan) |
| — | Trust & Compliance | May be slide 10b or part of Product: roadmap PDPA/GDPR/ISO/SOC2 — **not certified** |
| CTA | Enter demo | Switches app mode from `pitch` → `demo` (Guest by default) |

Pitch metrics from `_pdf_extract/0.md` (GMV, users, communities) are **Estimate** only when shown.

---

## 6. Information architecture (screens)

### Pitch mode
- Slide container with horizontal paging; optional vertical scroll inside a slide if content overflows (prefer no overflow).

### Demo mode — shared
- Top/demo bar: lane switcher, language chip, currency chip, “Simulated” badge, “Back to pitch”

### Guest screens
1. Splash  
2. Register / Sign-in (language + auth providers from config)  
3. Home Explore (communities, experiences, products)  
4. Community story  
5. Listing detail (stay | experience | product)  
6. Trust & host profile  
7. Chat (auto-translate)  
8. Video call placeholder  
9. Checkout (Stripe mock)  
10. Confirmation  
11. Privacy Center / Consent (reachable from profile or footer)

### Host screens
1. Host home / empty state CTA  
2. Offer wizard (3 steps)  
3. My offers  
4. Inbox (translate)  
5. Optional advanced panel (progressive)

### Admin screens
1. **TH Country Dashboard** (default)  
2. TH Country Settings  
3. TH Country Reports + export stub  
4. Sync-to-HQ status panel  
5. Branch detail (ศรีสงคราม)  
6. HQ overview (rollup + auth catalog config)

---

## 7. Navigation model (H + V)

| Mode | Horizontal | Vertical |
|------|------------|----------|
| Pitch | Next/prev slide | Rare; avoid dense slides |
| Demo | Primary sections within a lane (e.g. Explore ↔ Saved stub ↔ Inbox entry points as needed) | Lists, long story, report tables |
| Mobile | Swipe both axes | Same |
| Desktop | Arrow keys + click affordances | Wheel / trackpad |

**Implementation guidance (for later plan, not code now):**
- Prefer CSS `scroll-snap` and/or a small gesture layer.
- `scrollbar-width: none` / `::-webkit-scrollbar { display: none }` globally; keep `overflow` scrollable.
- Do not trap focus in a way that blocks keyboard access.

---

## 8. Mock data domains

All records include `simulated: true` (or equivalent) and surface a **Demo / Simulated** label in UI.

| Domain | Minimum content |
|--------|-----------------|
| Communities | Sri Songkhram (TH) + ≥2 international rural stubs (e.g. Laos, Vietnam or similar) |
| Listings | Homestay, indigo dye workshop, local cooking, nature walk |
| Products | Indigo textile, dried foods, handicrafts |
| Hosts | Profiles with trust signals: community voucher, verified stub, review snippets (Demo) |
| Users | Guest + Host personas with `primaryLanguage` |
| FX rates | THB base → USD, EUR, LAK, VND (Demo rates constant in fixture) |
| Chat threads | Parallel `sourceText` + `translatedText` + `sourceLang` / `targetLang` |
| Auth config | Catalog entries with `id`, `label`, `enabled`, optional stub credentials fields (never real secrets) |
| Admin metrics | TH country KPIs; branch subset; HQ rollup aggregates (Demo) |
| Sync jobs | Sample job objects with status timeline |
| Compliance | Consent records stub; DSR request stub (`access` / `delete` statuses) |

**Source materials (reference only):** `_pdf_extract/0.md` (business plan), `2.md` (Sri Songkhram research). Do not treat OCR noise in `1.md` as product requirements beyond historical Flutter screen names.

---

## 9. Auth (config-driven)

**Seed providers:** `google`, `apple`, `whatsapp`, `alipay`, `line`.

**Config shape (conceptual):**

```ts
type AuthProviderConfig = {
  id: string;
  label: string;
  enabled: boolean;
  // stub fields for future apps — not used for real OAuth in this build
  clientIdPlaceholder?: string;
};
```

**Rules:**
- Register/Sign-in renders only `enabled: true` providers.  
- HQ Auth Settings: toggle enable; “Add provider” adds a stub row to the in-memory/local fixture store.  
- Persistence for demo: `localStorage` (or equivalent client store) so toggles survive refresh within a browser; reset control allowed in HQ settings.  
- Clicking a provider completes a **fake session** (sets demo user + language) — no network OAuth.

---

## 10. i18n & auto-translate chat

- UI strings: at least **Thai** and **English** dictionaries; active UI language follows user’s `primaryLanguage` after registration (pre-auth splash may offer a temporary chooser that does not override the registration choice once set).  
- Chat: when guest language ≠ host language, show translated bubble as primary and “Show original” secondary.  
- Translation engine in this build: deterministic mock map / passthrough with `[Demo translation]` prefix or bilingual fixture pairs — **not** a live MT API.

---

## 11. Payments & video (mocks)

**Stripe:** Checkout sheet collects mock card last-4 / test brand display; Confirm → success screen. No Stripe.js live keys; no charges.

**Video call:** Full-screen placeholder (“Connecting to host… Demo”) with End button. No WebRTC, no camera requirement.

---

## 12. Privacy & compliance architecture (stubs)

### Principles to demonstrate

- Privacy by Design and Default: minimal required fields at registration; marketing consent off by default.  
- Lawful basis / purpose notice on consent screen (Demo copy).  
- Data minimization: listing forms ask only what is needed for Demo flows.  
- Role-based access: Guest / Host / Country / Branch / HQ see different nav.  
- Encryption in transit: stated as deployment assumption (HTTPS) in Compliance copy — not a fake certificate badge.  
- Retention: Settings copy + mock retention period field.  
- DSR: Privacy Center → Request access / Request delete → queued status (Simulated).  
- Audit-friendly reports: Admin Reports export includes who/when/action mock rows.

### Standards framing (investor-safe)

| Framework | How we show it |
|-----------|----------------|
| PDPA (Thailand) | Consent + TH-oriented rights copy |
| GDPR (EU) | Lawful basis + DSR placeholders |
| ISO 27001 | Control roadmap checklist (access, logging, encryption-in-transit) |
| ISO 27701 | Privacy ISMS companion checklist (assumed for former “ISO47000” mention) |
| SOC 2 | Trust-principles roadmap checklist |
| PbD / Default | Defaults + minimization in UI |

**Forbidden:** “Certified”, “Compliant audited”, or official ISO/SOC logos implying completed certification.  
**Allowed:** “Designed for”, “Roadmap toward”, “Privacy by Design (Demo)”.

---

## 13. Visual direction & theme (locked)

**Theme keywords (TH):** สดใส · เข้าถึงง่าย · ดูปลอดภัย · สว่าง · มีความ luxury  

**Mandatory constraints:**
- **ห้ามสีทอง (no gold)** — no metallic gold accents, gold gradients, or “premium gold” CTAs.  
- **ห้ามสีดำ (no black)** — no black UI chrome, no dark-mode / black panels as the product look. Pure `#000` is forbidden for backgrounds and chrome.  
- Body text may use **deep charcoal sparingly** (e.g. `#2A3340`) only for readability on light surfaces — not as a dark theme.  
- Luxury via **space, typography, soft materials** (soft shadows, refined type, calm light surfaces) — not gold/black contrast.

**Palette direction (CSS tokens in implementation):**
- Soft whites / cool off-whites (avoid warm cream `#F4F1EA` + terracotta AI cliché).  
- **Indigo / คราม** as primary accent (product story).  
- Soft **sage / leaf** as secondary nature accent.  
- Avoid deep navy that reads as near-black chrome; keep UI light and airy.  
- Avoid purple-on-white AI gradients; broadsheet dense newspaper look; glow pills; emoji decoration.

**Typography:** Expressive pair (display + UI) — not Inter / Roboto / Arial defaults.  

**Pitch:** Brand-forward title slide; one idea per slide; photography/place as visual anchor where used.  

**Motion:** 2–3 intentional transitions (slide change, lane enter, checkout success) — not noise.

---

## 14. Technical architecture

```
App/                          # Vite + React + TS
  src/
    main.tsx
    App.tsx                   # mode: pitch | demo
    styles/                   # global hide-scrollbars, tokens
    data/                     # mock fixtures (communities, authConfig, …)
    i18n/                     # th.json, en.json
    state/                    # session, language, cart, authConfig overrides
    components/
    features/
      pitch/
      guest/
      host/
      admin/
      privacy/
      checkout/
```

- **No backend.** All data client-side.  
- Optional later static deploy (e.g. any static host) — not required for spec approval.  
- Evidence labels: component or data helper that renders **Simulated / Demo / Estimate** consistently.

---

## 15. Scope split: investor mock vs future production

| In this build | Future production |
|---------------|-------------------|
| Pitch + 3 demo lanes | Native apps, real APIs |
| Config UI for auth providers | Real OAuth per provider |
| Simulated translation | Production MT + human review |
| Admin TH/Branch/HQ mock rollup | Real multi-tenant sync & RBAC server |
| Consent, Privacy Center, DSR stubs | Legal-reviewed policies, real DSR ops |
| Stripe / video UI mocks | Stripe Live, WebRTC or vendor A/V |
| localStorage demo persistence | Secure server sessions |
| Compliance roadmap screens | Actual ISO/SOC audit programs |

---

## 16. Error handling & empty states (demo)

- Disabled auth provider: not shown (not an error).  
- Sync failure: one Simulated failure path toggle optional in Admin for storytelling; default path succeeds.  
- Empty Host offers: single clear CTA to 3-step wizard.  
- Missing translation fixture: show source text + note “Translation unavailable (Demo)”.

---

## 17. Testing expectations (for implementation plan later)

- Smoke: pitch navigates; Enter demo works; lane switch works.  
- Guest happy path to checkout success.  
- Host 3-step create offer.  
- Admin lands on TH Country; sync to HQ updates status; drill to Branch and HQ.  
- Auth toggle at HQ changes Register buttons.  
- No scrollbar visible on primary surfaces (manual/visual check).  
- Labels Simulated/Demo present on mock metrics.

---

## 18. Open assumptions (resolved for implementers)

| Item | Resolution |
|------|------------|
| UI language default before registration | Splash temporary EN/TH chooser; registration sets `primaryLanguage` as source of truth |
| Auth config edit location | HQ screen; TH sees enabled list |
| ISO47000 | Treated as ISO 27701 unless user corrects later |
| Flutter PDF | Ignored as implementation stack; web only |
| Commit of this file | Only when user asks; writing the file does not imply git commit |

---

## 19. Success criteria

1. Investor can walk pitch → demo in one sitting on phone and desktop.  
2. Guest books/buys with few taps; Host lists an offer in 3 steps; Admin starts on TH Country and syncs to HQ.  
3. No screen claims completed PDPA/GDPR/ISO/SOC certification.  
4. All mock commercial metrics are Estimate or Simulated.  
5. Scrollbars hidden; H+V navigation usable on mobile.

---

## 20. Spec self-review (2026-08-07)

| Check | Result |
|-------|--------|
| Placeholders / TBD | None left material; ISO47000 ambiguity resolved by explicit assumption (ISO 27701) |
| Contradictions | Auth “admin-configurable” vs “TH default Admin” resolved: HQ edits catalog; TH is default landing |
| Scope | Single SPA investor mock; production items listed as non-goals |
| Ambiguity | Admin default, ask amount labeling, mock vs real integrations made explicit |

---

## 21. Next step after user approves this file

1. User reviews this spec and confirms (or requests edits).  
2. Only then: invoke **writing-plans** to produce an implementation plan.  
3. Only after plan approval: scaffold `App/` and implement.  

**Do not implement code from this document until the implementation plan is written and agreed.**
