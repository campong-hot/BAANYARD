# BAANYARD บ้านญาติ — Static investor demo

Plain **HTML5 + CSS + JavaScript + JSON**. No Node/Vite build required to run in production.

โฟลเดอร์นี้คือเวอร์ชันสำหรับ **web hosting ธรรมดา** (อัปโหลดทั้งโฟลเดอร์แล้วเปิดได้)

This folder is the **static hosting deliverable**. The React/Vite source remains in `../App/`.

## โครงสร้าง / Structure

```
web/
  index.html
  css/          tokens, global, feature styles
  js/           SPA (hash routes, state, Guest/Host/Admin/Privacy/Pitch)
  data/         *.json — communities, listings, auth, i18n, pitch, chat, FX, media
  images/       13 PNG demo photos
  favicon.svg
```

## สำคัญ: อย่าเปิดด้วย file://

เบราว์เซอร์บล็อก `fetch()` ของ JSON เมื่อเปิดไฟล์ตรงจากดิสก์  
Browsers block JSON `fetch` on `file://` — use a static server.

---

## วิธีรันบนเครื่อง (ท้องถิ่น)

### Option A — `npx serve` (แนะนำ)

```bash
cd C:\Projects\BAANYARD
npx --yes serve web -l 3000
```

เปิด `http://localhost:3000`  
LAN: `http://<IP-เครื่อง>:3000` (firewall อนุญาตพอร์ต 3000)

### Option B — VS Code / Cursor Live Server

คลิกขวา `web/index.html` → Open with Live Server

### Option C — Python

```bash
cd web
python -m http.server 8080
```

---

## อัปโหลดโฮสติ้งธรรมดา (production)

### cPanel / public_html (+ SSL สำหรับกล้อง)

1. Zip ทั้งโฟลเดอร์ `web/` หรืออัปโหลดเนื้อหาข้างใน (รวม `.htaccess`)
2. วางไฟล์ที่ **document root** (`public_html/` หรือ subdomain folder)
3. ให้ `index.html` อยู่ที่รากของไซต์ (หรือโฟลเดอร์ย่อย เช่น `public_html/baanyard/`)
4. เปิดโดเมน — ไม่ต้อง `npm install` / ไม่ต้อง build
5. **กล้องต้องใช้ HTTPS** — เปิด Let's Encrypt / AutoSSL ให้ `campong.co.th` แล้วทดสอบที่ `https://…`

รายละเอียดเต็ม: **[README-SSL.md](./README-SSL.md)**

### Netlify Drop / Cloudflare Pages / GitHub Pages

- ลากโฟลเดอร์ `web/` ไปที่ Netlify Drop หรือตั้ง publish directory = `web`
- ไม่มี build command

### Apache / Nginx

ชี้ `DocumentRoot` / `root` ไปที่โฟลเดอร์ `web`  
SPA ใช้ hash (`#/pitch`, `#/demo/guest`) — ไม่ต้อง rewrite พิเศษ

---

## Hash routes

| Hash | View |
|------|------|
| `#/pitch` | Investor pitch (swipe ← →) |
| `#/demo/guest` | Guest demo |
| `#/demo/host` | Host demo |
| `#/demo/admin` | Admin (TH Country default) |
| `#/demo/privacy` | Privacy center |

## Feature map

| Lane | Flow |
|------|------|
| **Pitch** | Horizontal slides → Enter product demo |
| **Guest** | Splash → Register → Explore → Story/Listing/Host → Chat translate → Video (getUserMedia preview on HTTPS) → Stripe mock → Success |
| **Host** | 3-step offer → My offers → Inbox translate |
| **Admin** | TH Country · Branch · HQ auth sync |
| **Privacy** | Consent · DSR stubs · compliance roadmap (not certified) |

Images: `images/*.png` wired via `data/media.json`.

Theme: light luxury (indigo + sage). No gold. No black UI theme. No Airbnb wording.

All payments, OAuth, sync, translation, and KPIs are **Simulated / Demo**.
