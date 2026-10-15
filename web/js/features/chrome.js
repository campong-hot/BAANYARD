import { t } from "../i18n.js";
import { el } from "../utils.js";

function activeRoleLabel(lang, s) {
  if (s.privacyOpen) return t(lang, "lanePrivacy");
  if (s.lane === "guest") return t(lang, "laneGuest");
  if (s.lane === "host") return t(lang, "laneHost");
  return t(lang, "laneAdmin");
}

function uiCopy(lang, en, th) {
  return lang === "th" ? th : en;
}

let drawerCleanup = null;

function closePanels(root) {
  root.querySelectorAll(".demo-chrome__panel.is-open").forEach((panel) => {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  });
  root.querySelectorAll(".demo-chrome__icon-btn[aria-expanded='true']").forEach((btn) => {
    btn.setAttribute("aria-expanded", "false");
  });
  const backdrop = root.querySelector(".demo-chrome__backdrop");
  if (backdrop) {
    backdrop.hidden = true;
    backdrop.classList.remove("is-open");
  }
  document.body.classList.remove("demo-chrome-lock");
}

function openPanel(root, panelId, trigger) {
  const panel = root.querySelector(`#${panelId}`);
  const backdrop = root.querySelector(".demo-chrome__backdrop");
  if (!panel || !backdrop) return;

  closePanels(root);
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  trigger?.setAttribute("aria-expanded", "true");
  backdrop.hidden = false;
  backdrop.classList.add("is-open");
  document.body.classList.add("demo-chrome-lock");

  const focusable = panel.querySelector("button, select, [href], [tabindex]:not([tabindex='-1'])");
  focusable?.focus?.();
}

/** Escape / backdrop close for menu + settings panels. */
export function bindChromeAutoHide(root) {
  if (drawerCleanup) {
    drawerCleanup();
    drawerCleanup = null;
  }

  const onKey = (e) => {
    if (e.key === "Escape") closePanels(root);
  };
  document.addEventListener("keydown", onKey);

  drawerCleanup = () => {
    document.removeEventListener("keydown", onKey);
    document.body.classList.remove("demo-chrome-lock");
  };
}

export function renderChrome(root, ctx) {
  const { api } = ctx;
  const s = api.get();
  const lang = api.uiLang();
  const roleLabel = activeRoleLabel(lang, s);

  const roleHint = s.privacyOpen
    ? t(lang, "roleHintPrivacy")
    : s.lane === "guest"
      ? t(lang, "roleHintGuest")
      : s.lane === "host"
        ? t(lang, "roleHintHost")
        : t(lang, "roleHintAdmin");

  const menuLabel = uiCopy(lang, "Menu", "เมนู");
  const closeLabel = uiCopy(lang, "Close", "ปิด");

  const langSelect = el(
    "select",
    {
      "aria-label": t(lang, "language"),
      onChange: (e) => api.setPrimaryLanguage(e.target.value),
    },
    [
      el("option", { value: "en", text: "EN" }),
      el("option", { value: "th", text: "TH" }),
    ],
  );
  langSelect.value = s.primaryLanguage;

  const curSelect = el(
    "select",
    {
      "aria-label": t(lang, "currency"),
      onChange: (e) => api.setCurrency(e.target.value),
    },
    ["THB", "USD", "EUR", "LAK", "VND"].map((c) => el("option", { value: c, text: c })),
  );
  curSelect.value = s.currency;

  const menuBtn = el(
    "button",
    {
      type: "button",
      className: "demo-chrome__icon-btn",
      "aria-label": menuLabel,
      "aria-expanded": "false",
      "aria-controls": "demo-chrome-menu",
      onClick: (e) => {
        const open = e.currentTarget.getAttribute("aria-expanded") === "true";
        if (open) closePanels(root);
        else openPanel(root, "demo-chrome-menu", e.currentTarget);
      },
    },
    [el("span", { "aria-hidden": "true", text: "☰" })],
  );

  const gearBtn = el(
    "button",
    {
      type: "button",
      className: "demo-chrome__icon-btn",
      "aria-label": t(lang, "settings"),
      "aria-expanded": "false",
      "aria-controls": "demo-chrome-settings",
      onClick: (e) => {
        const open = e.currentTarget.getAttribute("aria-expanded") === "true";
        if (open) closePanels(root);
        else openPanel(root, "demo-chrome-settings", e.currentTarget);
      },
    },
    [el("span", { "aria-hidden": "true", text: "⚙" })],
  );

  const laneButtons = ["guest", "host", "admin"].map((l) =>
    el("button", {
      type: "button",
      className: `demo-chrome__nav-btn ${!s.privacyOpen && s.lane === l ? "is-active" : ""}`,
      text: t(lang, l === "guest" ? "laneGuest" : l === "host" ? "laneHost" : "laneAdmin"),
      onClick: () => {
        closePanels(root);
        api.setLane(l);
      },
    }),
  );

  const privacyBtn = el("button", {
    type: "button",
    className: `demo-chrome__nav-btn ${s.privacyOpen ? "is-active" : ""}`,
    text: t(lang, "lanePrivacy"),
    onClick: () => {
      closePanels(root);
      if (s.privacyOpen) {
        api.closePrivacy();
        api.setGuestScreen(s.sessionUser ? "explore" : "splash");
      } else {
        api.openPrivacy();
      }
    },
  });

  const backdrop = el("div", {
    className: "demo-chrome__backdrop",
    hidden: true,
    "aria-hidden": "true",
    onClick: () => closePanels(root),
  });

  const menuPanel = el(
    "aside",
    {
      id: "demo-chrome-menu",
      className: "demo-chrome__panel demo-chrome__panel--menu",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": menuLabel,
      "aria-hidden": "true",
    },
    [
      el("div", { className: "demo-chrome__panel-head" }, [
        el("div", { className: "demo-chrome__panel-titles" }, [
          el("p", { className: "demo-chrome__panel-kicker muted", text: t(lang, "demoAs") }),
          el("p", { className: "demo-chrome__panel-title", text: roleLabel }),
        ]),
        el(
          "button",
          {
            type: "button",
            className: "demo-chrome__icon-btn demo-chrome__icon-btn--close",
            "aria-label": closeLabel,
            onClick: () => closePanels(root),
          },
          [el("span", { "aria-hidden": "true", text: "✕" })],
        ),
      ]),
      el("div", { className: "demo-chrome__panel-body" }, [
        el("p", { className: "role-hint muted", text: roleHint }),
        el(
          "nav",
          { className: "demo-chrome__lanes", "aria-label": t(lang, "demoAs") },
          [...laneButtons, privacyBtn],
        ),
        el("button", {
          type: "button",
          className: "btn btn-ghost demo-chrome__back",
          text: t(lang, "backToPitch"),
          onClick: () => {
            closePanels(root);
            api.setMode("pitch");
          },
        }),
      ]),
    ],
  );

  const settingsPanel = el(
    "aside",
    {
      id: "demo-chrome-settings",
      className: "demo-chrome__panel demo-chrome__panel--settings",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": t(lang, "settings"),
      "aria-hidden": "true",
    },
    [
      el("div", { className: "demo-chrome__panel-head" }, [
        el("div", { className: "demo-chrome__panel-titles" }, [
          el("p", { className: "demo-chrome__panel-kicker muted", text: t(lang, "settings") }),
          el("p", { className: "demo-chrome__panel-title", text: "⚙" }),
        ]),
        el(
          "button",
          {
            type: "button",
            className: "demo-chrome__icon-btn demo-chrome__icon-btn--close",
            "aria-label": closeLabel,
            onClick: () => closePanels(root),
          },
          [el("span", { "aria-hidden": "true", text: "✕" })],
        ),
      ]),
      el("div", { className: "demo-chrome__panel-body" }, [
        el("label", { className: "chrome-field chrome-field--stack" }, [
          el("span", { text: t(lang, "language") }),
          langSelect,
        ]),
        el("label", { className: "chrome-field chrome-field--stack" }, [
          el("span", { text: t(lang, "currency") }),
          curSelect,
        ]),
        el("button", {
          type: "button",
          className: `demo-chrome__nav-btn ${s.privacyOpen ? "is-active" : ""}`,
          text: t(lang, "privacy"),
          onClick: () => {
            closePanels(root);
            if (!s.privacyOpen) api.openPrivacy();
          },
        }),
      ]),
    ],
  );

  root.append(
    el("header", { className: "demo-chrome" }, [
      el("strong", { className: "demo-chrome__brand" }, [
        el("img", {
          className: "brand-logo brand-logo--mark",
          src: "images/logo-campong-mark.png?v=20260916a",
          alt: "Campong Innovation",
          width: "40",
          height: "40",
        }),
        el("span", { className: "demo-chrome__brand-text" }, [
          el("span", { className: "demo-chrome__brand-name", text: t(lang, "brand") }),
          el("span", { className: "demo-chrome__brand-th", text: t(lang, "brandTh") }),
        ]),
      ]),
      el("div", { className: "demo-chrome__actions" }, [menuBtn, gearBtn]),
    ]),
    backdrop,
    menuPanel,
    settingsPanel,
  );
}
