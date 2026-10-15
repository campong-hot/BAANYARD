import { useEffect, useState } from "react";
import { Badge } from "./Badge";
import { t } from "../i18n";
import { useAppState } from "../state/AppState";
import type { CurrencyCode, DemoLane } from "../data/types";
import "./DemoChrome.css";

const lanes: DemoLane[] = ["guest", "host", "admin"];
const currencies: CurrencyCode[] = ["THB", "USD", "EUR", "LAK", "VND"];

type Panel = "menu" | "settings" | null;

function uiCopy(lang: string, en: string, th: string) {
  return lang === "th" ? th : en;
}

export function DemoChrome() {
  const {
    uiLang,
    setMode,
    lane,
    setLane,
    currency,
    setCurrency,
    primaryLanguage,
    setPrimaryLanguage,
    privacyOpen,
    openPrivacy,
    closePrivacy,
    sessionUser,
    setGuestScreen,
  } = useAppState();

  const [panel, setPanel] = useState<Panel>(null);

  const roleHint = privacyOpen
    ? t(uiLang, "roleHintPrivacy")
    : lane === "guest"
      ? t(uiLang, "roleHintGuest")
      : lane === "host"
        ? t(uiLang, "roleHintHost")
        : t(uiLang, "roleHintAdmin");

  const roleLabel = privacyOpen
    ? t(uiLang, "lanePrivacy")
    : lane === "guest"
      ? t(uiLang, "laneGuest")
      : lane === "host"
        ? t(uiLang, "laneHost")
        : t(uiLang, "laneAdmin");

  const menuLabel = uiCopy(uiLang, "Menu", "เมนู");
  const closeLabel = uiCopy(uiLang, "Close", "ปิด");
  const open = panel !== null;

  useEffect(() => {
    document.body.classList.toggle("demo-chrome-lock", open);
    return () => document.body.classList.remove("demo-chrome-lock");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const closePanels = () => setPanel(null);

  const onPrivacyToggle = () => {
    closePanels();
    if (privacyOpen) {
      closePrivacy();
      setGuestScreen(sessionUser ? "explore" : "splash");
    } else {
      openPrivacy();
    }
  };

  return (
    <>
      <header className="demo-chrome">
        <strong className="demo-chrome__brand">
          <img
            className="brand-logo brand-logo--mark"
            src="/images/logo-campong-mark.png"
            alt="Campong Innovation"
            width={40}
            height={40}
          />
          <span className="demo-chrome__brand-text">
            <span className="demo-chrome__brand-name">{t(uiLang, "brand")}</span>
            <span className="demo-chrome__brand-th">{t(uiLang, "brandTh")}</span>
          </span>
        </strong>
        <div className="demo-chrome__actions">
          <button
            type="button"
            className="demo-chrome__icon-btn"
            aria-label={menuLabel}
            aria-expanded={panel === "menu"}
            aria-controls="demo-chrome-menu"
            onClick={() => setPanel((p) => (p === "menu" ? null : "menu"))}
          >
            <span aria-hidden="true">☰</span>
          </button>
          <button
            type="button"
            className="demo-chrome__icon-btn"
            aria-label={t(uiLang, "settings")}
            aria-expanded={panel === "settings"}
            aria-controls="demo-chrome-settings"
            onClick={() => setPanel((p) => (p === "settings" ? null : "settings"))}
          >
            <span aria-hidden="true">⚙</span>
          </button>
        </div>
      </header>

      <div
        className={`demo-chrome__backdrop${open ? " is-open" : ""}`}
        hidden={!open}
        aria-hidden={!open}
        onClick={closePanels}
      />

      <aside
        id="demo-chrome-menu"
        className={`demo-chrome__panel demo-chrome__panel--menu${panel === "menu" ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={menuLabel}
        aria-hidden={panel !== "menu"}
      >
        <div className="demo-chrome__panel-head">
          <div className="demo-chrome__panel-titles">
            <p className="demo-chrome__panel-kicker muted">{t(uiLang, "demoAs")}</p>
            <p className="demo-chrome__panel-title">{roleLabel}</p>
          </div>
          <button
            type="button"
            className="demo-chrome__icon-btn demo-chrome__icon-btn--close"
            aria-label={closeLabel}
            onClick={closePanels}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        <div className="demo-chrome__panel-body">
          <p className="role-hint muted">{roleHint}</p>
          <nav className="demo-chrome__lanes" aria-label={t(uiLang, "demoAs")}>
            {lanes.map((l) => (
              <button
                key={l}
                type="button"
                className={`demo-chrome__nav-btn ${!privacyOpen && lane === l ? "is-active" : ""}`}
                onClick={() => {
                  closePanels();
                  setLane(l);
                }}
              >
                {t(uiLang, l === "guest" ? "laneGuest" : l === "host" ? "laneHost" : "laneAdmin")}
              </button>
            ))}
            <button
              type="button"
              className={`demo-chrome__nav-btn ${privacyOpen ? "is-active" : ""}`}
              onClick={onPrivacyToggle}
            >
              {t(uiLang, "lanePrivacy")}
            </button>
          </nav>
          <button
            type="button"
            className="btn btn-ghost demo-chrome__back"
            onClick={() => {
              closePanels();
              setMode("pitch");
            }}
          >
            ← {t(uiLang, "backToPitch")}
          </button>
          <div className="demo-chrome__meta">
            <Badge label={t(uiLang, "simulated")} />
          </div>
        </div>
      </aside>

      <aside
        id="demo-chrome-settings"
        className={`demo-chrome__panel demo-chrome__panel--settings${panel === "settings" ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={t(uiLang, "settings")}
        aria-hidden={panel !== "settings"}
      >
        <div className="demo-chrome__panel-head">
          <div className="demo-chrome__panel-titles">
            <p className="demo-chrome__panel-kicker muted">{t(uiLang, "settings")}</p>
            <p className="demo-chrome__panel-title">⚙</p>
          </div>
          <button
            type="button"
            className="demo-chrome__icon-btn demo-chrome__icon-btn--close"
            aria-label={closeLabel}
            onClick={closePanels}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        <div className="demo-chrome__panel-body">
          <label className="chrome-field chrome-field--stack">
            <span>{t(uiLang, "language")}</span>
            <select
              aria-label={t(uiLang, "language")}
              value={primaryLanguage}
              onChange={(e) => setPrimaryLanguage(e.target.value as "th" | "en")}
            >
              <option value="en">EN</option>
              <option value="th">TH</option>
            </select>
          </label>
          <label className="chrome-field chrome-field--stack">
            <span>{t(uiLang, "currency")}</span>
            <select
              aria-label={t(uiLang, "currency")}
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={`demo-chrome__nav-btn ${privacyOpen ? "is-active" : ""}`}
            onClick={() => {
              closePanels();
              if (!privacyOpen) openPrivacy();
            }}
          >
            {t(uiLang, "privacy")}
          </button>
        </div>
      </aside>
    </>
  );
}
