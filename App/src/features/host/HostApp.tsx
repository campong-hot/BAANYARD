import { useState } from "react";
import { Badge } from "../../components/Badge";
import { DemoMedia } from "../../components/DemoMedia";
import { hostInboxThread } from "../../data/chat";
import type { Lang, ListingKind } from "../../data/types";
import { t } from "../../i18n";
import { useAppState } from "../../state/AppState";
import { hostHeroImage } from "../../utils/media";
import { demoTranslate } from "../../utils/translate";
import { HostChainPanel } from "../chains/ChainPanels";
import "./HostApp.css";

const photoMoods = ["River morning", "Indigo vat", "Barn shelf", "Hill mist"] as const;

export function HostApp() {
  const { uiLang, offers, addOffer, hostScreen, setHostScreen } = useAppState();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [kind, setKind] = useState<ListingKind>("experience");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [price, setPrice] = useState("500");
  const [photoMood, setPhotoMood] = useState<(typeof photoMoods)[number]>("River morning");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showBilingual, setShowBilingual] = useState(true);
  const [draftReply, setDraftReply] = useState("");
  const [extraReplies, setExtraReplies] = useState<
    { id: string; text: string; translated: string }[]
  >([]);

  if (hostScreen === "inbox") {
    return (
      <div className="host-panel fade-in">
        <div className="host-tabs">
          <button type="button" className="btn btn-ghost" onClick={() => setHostScreen("home")}>
            {t(uiLang, "hostHome")}
          </button>
          <button type="button" className="btn btn-secondary is-tab-active">
            {t(uiLang, "hostInbox")}
          </button>
        </div>
        <div className="row-between">
          <h1>{t(uiLang, "hostInbox")}</h1>
          <Badge label={t(uiLang, "autoTranslate")} />
        </div>
        <p className="muted">{t(uiLang, "hostInboxHint")}</p>
        <div className="chat-thread card host-inbox-thread">
          {hostInboxThread.map((m) => (
            <div key={m.id} className={`bubble ${m.from === "host" ? "bubble--me" : ""}`}>
              {showBilingual ? (
                <>
                  <p>{m.from === "host" ? m.sourceText : m.translatedText}</p>
                  <p className="bubble-original muted">
                    <span className="tiny">{t(uiLang, "originalLabel")}: </span>
                    {m.from === "host" ? m.translatedText : m.sourceText}
                  </p>
                  <span className="muted tiny">
                    {m.sourceLang} → {m.targetLang}
                  </span>
                </>
              ) : (
                <p>{m.from === "host" ? m.sourceText : m.translatedText}</p>
              )}
            </div>
          ))}
          {extraReplies.map((m) => (
            <div key={m.id} className="bubble bubble--me">
              {showBilingual ? (
                <>
                  <p>{m.text}</p>
                  <p className="bubble-original muted">
                    <span className="tiny">{t(uiLang, "translatedLabel")}: </span>
                    {m.translated}
                  </p>
                </>
              ) : (
                <p>{m.text}</p>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setShowBilingual((v) => !v)}
        >
          {showBilingual ? t(uiLang, "hideOriginal") : t(uiLang, "showOriginal")}
        </button>
        <form
          className="chat-compose"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draftReply.trim()) return;
            const from: Lang = "th";
            const to: Lang = "en";
            setExtraReplies((prev) => [
              ...prev,
              {
                id: `hr-${Date.now()}`,
                text: draftReply,
                translated: demoTranslate(draftReply, from, to),
              },
            ]);
            setDraftReply("");
          }}
        >
          <input
            value={draftReply}
            onChange={(e) => setDraftReply(e.target.value)}
            placeholder={uiLang === "th" ? "ตอบเป็นภาษาไทย…" : "Reply in host language…"}
          />
          <button type="submit" className="btn">
            {t(uiLang, "replyHost")}
          </button>
        </form>
      </div>
    );
  }

  if (hostScreen === "wizard") {
    return (
      <div className="host-panel fade-in">
        <Badge label={t(uiLang, "demo")} />
        <button type="button" className="btn btn-ghost" onClick={() => setHostScreen("home")}>
          ← {t(uiLang, "back")}
        </button>

        {step === 1 ? (
          <>
            <h1>{t(uiLang, "stepType")}</h1>
            <div className="kind-grid">
              {(["stay", "experience", "product"] as ListingKind[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`card kind-btn ${kind === k ? "is-active" : ""}`}
                  onClick={() => setKind(k)}
                >
                  {t(
                    uiLang,
                    k === "stay" ? "kindStay" : k === "experience" ? "kindExperience" : "kindProduct",
                  )}
                </button>
              ))}
            </div>
            <button type="button" className="btn" onClick={() => setStep(2)}>
              {t(uiLang, "next")}
            </button>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h1>{t(uiLang, "stepStory")}</h1>
            <label className="field">
              <span>{uiLang === "th" ? "ชื่อข้อเสนอ" : "Title"}</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className="field">
              <span>{uiLang === "th" ? "เรื่องราว" : "Story"}</span>
              <textarea rows={4} value={story} onChange={(e) => setStory(e.target.value)} />
            </label>
            <fieldset className="photo-moods">
              <legend>{t(uiLang, "photoPick")}</legend>
              <div className="kind-grid">
                {photoMoods.map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    className={`card kind-btn ${photoMood === mood ? "is-active" : ""}`}
                    onClick={() => setPhotoMood(mood)}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="cta-row">
              <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                {t(uiLang, "back")}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setStep(3)}
                disabled={!title.trim()}
              >
                {t(uiLang, "next")}
              </button>
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h1>{t(uiLang, "stepPrice")}</h1>
            <p className="muted tiny">
              {uiLang === "th" ? "ปก:" : "Cover:"} {photoMood}
            </p>
            <label className="field">
              <span>THB</span>
              <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" />
            </label>
            <div className="cta-row">
              <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
                {t(uiLang, "back")}
              </button>
              <button
                type="button"
                className="btn btn-sage"
                onClick={() => {
                  addOffer({
                    kind,
                    title: `${title.trim()} · ${photoMood}`,
                    story: story.trim(),
                    priceThb: Number(price) || 0,
                  });
                  setHostScreen("home");
                  setStep(1);
                  setTitle("");
                  setStory("");
                }}
              >
                {t(uiLang, "saveOffer")}
              </button>
            </div>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="host-panel fade-in">
      <div className="host-tabs">
        <button type="button" className="btn btn-secondary is-tab-active">
          {t(uiLang, "hostHome")}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setHostScreen("inbox")}>
          {t(uiLang, "hostInbox")}
        </button>
      </div>
      <div className="host-hero">
        <DemoMedia src={hostHeroImage} className="host-hero__media" alt="" />
        <div className="host-hero__copy">
          <Badge label={t(uiLang, "simulated")} />
          <h1>{t(uiLang, "hostTitle")}</h1>
          <p className="muted">{t(uiLang, "hostEmpty")}</p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setStep(1);
              setHostScreen("wizard");
            }}
          >
            {t(uiLang, "startOffer")}
          </button>
        </div>
      </div>
      {offers.length > 0 ? (
        <section className="card host-list">
          <h2>{t(uiLang, "myOffers")}</h2>
          <ul>
            {offers.map((o) => (
              <li key={o.id}>
                <strong>{o.title}</strong>
                <span className="muted">
                  {" "}
                  · {o.kind} · {o.priceThb} THB
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowAdvanced((v) => !v)}
          >
            {t(uiLang, "moreTools")}
          </button>
          {showAdvanced ? (
            <div className="host-advanced">
              <article className="card advanced-card">
                <h3>{t(uiLang, "calendarStub")}</h3>
                <div className="cal-grid" aria-hidden>
                  {Array.from({ length: 14 }, (_, i) => (
                    <span key={i} className={i % 3 === 0 ? "is-booked" : ""}>
                      {i + 1}
                    </span>
                  ))}
                </div>
              </article>
              <article className="card advanced-card">
                <h3>{t(uiLang, "seasonalStub")}</h3>
                <p className="muted">
                  {uiLang === "th"
                    ? "ฤดูท่องเที่ยว +15% · นอกฤดู −10% (จำลอง)"
                    : "Peak +15% · Off-peak −10% (Simulated)"}
                </p>
              </article>
              <article className="card advanced-card">
                <h3>{t(uiLang, "analyticsStub")}</h3>
                <p>
                  <strong>12</strong>{" "}
                  <span className="muted">
                    {uiLang === "th" ? "การดูข้อเสนอ (เดโม)" : "offer views (Demo)"}
                  </span>
                </p>
              </article>
            </div>
          ) : null}
        </section>
      ) : null}
      <HostChainPanel />
    </div>
  );
}
