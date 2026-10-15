import { setDicts } from "./i18n.js";
import { createState } from "./state.js";
import { clear } from "./utils.js";
import { cleanupPitch, renderPitch } from "./features/pitch.js";
import { bindChromeAutoHide, renderChrome } from "./features/chrome.js";
import { cleanupCallMedia, cleanupExploreScrollers, renderGuest } from "./features/guest.js";
import { renderHost } from "./features/host.js";
import { renderAdmin } from "./features/admin.js";
import { renderPrivacy } from "./features/privacy.js";

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

async function boot() {
  const app = document.getElementById("app");
  const bootEl = document.getElementById("boot");

  try {
    const [
      communities,
      hosts,
      listings,
      chat,
      admin,
      auth,
      fx,
      media,
      pitch,
      supplyChains,
      travellink,
      en,
      th,
    ] = await Promise.all([
      loadJson("data/communities.json"),
      loadJson("data/hosts.json"),
      loadJson("data/listings.json"),
      loadJson("data/chat.json"),
      loadJson("data/admin.json"),
      loadJson("data/auth.json"),
      loadJson("data/fx.json"),
      loadJson("data/media.json"),
      loadJson("data/pitch.json"),
      loadJson("data/supply-chains.json"),
      loadJson("data/travellink-provinces.json"),
      loadJson("data/i18n-en.json"),
      loadJson("data/i18n-th.json"),
    ]);

    setDicts(en, th);
    const data = {
      communities,
      hosts,
      listings,
      chat,
      admin,
      auth,
      fx,
      media,
      pitch,
      supplyChains,
      travellink,
    };

    let api;
    const render = () => {
      cleanupPitch(app);
      cleanupExploreScrollers();
      const s = api.get();
      const onVideo =
        s.mode === "demo" && s.lane === "guest" && !s.privacyOpen && s.guestScreen === "video";
      if (!onVideo) cleanupCallMedia();
      clear(app);
      const ctx = { data, api };

      if (s.mode === "pitch") {
        app.className = "app-root";
        renderPitch(app, ctx);
        return;
      }

      app.className = "app-root demo-root";
      renderChrome(app, ctx);
      const main = document.createElement("main");
      main.className = "demo-main";
      app.append(main);

      if (s.privacyOpen) renderPrivacy(main, ctx);
      else if (s.lane === "guest") renderGuest(main, ctx);
      else if (s.lane === "host") renderHost(main, ctx);
      else if (s.lane === "admin") renderAdmin(main, ctx);

      bindChromeAutoHide(app);
    };

    api = createState({ auth }, render);
    api.applyHash();
    window.addEventListener("hashchange", () => {
      api.applyHash();
      render();
    });

    if (bootEl) bootEl.remove();
    render();
  } catch (err) {
    console.error(err);
    if (bootEl) {
      bootEl.innerHTML = `
        <img class="brand-logo" src="images/logo-campong.png?v=20260916a" alt="Campong Innovation" />
        <h1>BAANYARD บ้านญาติ</h1>
        <p>โหลดข้อมูลไม่สำเร็จ — ต้องเปิดผ่าน static server (ไม่ใช่ file://)</p>
        <p>Load failed — serve this folder with a static server (not file://).</p>
        <pre style="white-space:pre-wrap;font-size:0.85rem">${String(err.message || err)}</pre>
        <p><code>npx serve web</code> หรือ Live Server / cPanel public_html</p>
      `;
    }
  }
}

boot();
