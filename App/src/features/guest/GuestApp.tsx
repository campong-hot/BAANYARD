import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Badge } from "../../components/Badge";
import { DemoMedia } from "../../components/DemoMedia";
import { HorizontalScroller } from "../../components/HorizontalScroller";
import { communities, hosts } from "../../data/communities";
import { listings } from "../../data/listings";
import { demoThread } from "../../data/chat";
import type { Lang, Listing, ListingKind, ListingTag } from "../../data/types";
import { t, type DictKey } from "../../i18n";
import { useAppState } from "../../state/AppState";
import { formatMoney } from "../../utils/currency";
import {
  communityImageSrc,
  heroSplashImage,
  hostImageSrc,
  listingImageSrc,
} from "../../utils/media";
import {
  callErrorMessage,
  isSecureContext,
  requestCallMedia,
  stopMediaStream,
  type CallMediaError,
} from "../../utils/secureMedia";
import { demoTranslate } from "../../utils/translate";
import {
  ChainConfirmScreen,
  ChainDetailScreen,
  ChainExploreSection,
  ChainSuccessScreen,
} from "../chains/ChainPanels";
import "./GuestApp.css";

const EXPLORE_FILTERS: { id: "all" | "chain" | ListingTag; key: DictKey }[] = [
  { id: "all", key: "filterAll" },
  { id: "chain", key: "filterChain" },
  { id: "family", key: "filterFamily" },
  { id: "kids", key: "filterKids" },
  { id: "solo", key: "filterSolo" },
  { id: "wellness", key: "filterWellness" },
  { id: "food", key: "filterFood" },
  { id: "music", key: "filterMusic" },
];

function kindLabel(kind: ListingKind, lang: Lang) {
  if (lang === "th") {
    return kind === "stay"
      ? t(lang, "kindStay")
      : kind === "experience"
        ? t(lang, "kindExperience")
        : t(lang, "kindProduct");
  }
  return t(lang, kind === "stay" ? "kindStay" : kind === "experience" ? "kindExperience" : "kindProduct");
}

function listingMatchesFilter(listing: Listing, filter: string) {
  if (!filter || filter === "all") return true;
  return Array.isArray(listing.tags) && listing.tags.includes(filter as ListingTag);
}

export function GuestApp() {
  const {
    uiLang,
    currency,
    setCurrency,
    guestScreen,
    setGuestScreen,
    authProviders,
    signInDemo,
    primaryLanguage,
    setPrimaryLanguage,
    marketingConsent,
    setMarketingConsent,
    selectedListing,
    openListing,
    selectedCommunityId,
    openCommunity,
    selectedHostId,
    openHost,
    exploreFilter,
    setExploreFilter,
    cartItem,
    setCartItem,
    sessionUser,
  } = useAppState();

  const [showBilingual, setShowBilingual] = useState(true);
  const [card, setCard] = useState("4242");
  const [draftMsg, setDraftMsg] = useState("");
  const [extraMsgs, setExtraMsgs] = useState<
    { id: string; text: string; translated: string; sourceLang: Lang; targetLang: Lang }[]
  >([]);
  const [callStream, setCallStream] = useState<MediaStream | null>(null);
  const [callError, setCallError] = useState<CallMediaError | null>(null);
  const [cameraStarting, setCameraStarting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (el && callStream) {
      el.srcObject = callStream;
    }
  }, [callStream]);

  useEffect(() => {
    if (guestScreen !== "video") {
      setCallStream((prev) => {
        stopMediaStream(prev);
        return null;
      });
      setCallError(null);
      setCameraStarting(false);
    }
  }, [guestScreen]);

  useEffect(() => {
    return () => {
      stopMediaStream(callStream);
    };
  }, [callStream]);

  if (guestScreen === "splash" || (!sessionUser && guestScreen !== "register" && guestScreen !== "privacy")) {
    return (
      <div className="guest-panel guest-splash fade-in">
        <DemoMedia src={heroSplashImage} className="listing-hero-media splash-hero" alt="" />
        <img
          className="brand-logo brand-logo--splash"
          src="/images/logo-campong.png"
          alt="Campong Innovation"
        />
        <Badge label={t(uiLang, "demo")} />
        <h1>{t(uiLang, "splashTitle")}</h1>
        <p className="muted">{t(uiLang, "splashSub")}</p>
        <label className="field">
          <span>{t(uiLang, "language")}</span>
          <select
            value={primaryLanguage}
            onChange={(e) => setPrimaryLanguage(e.target.value as Lang)}
          >
            <option value="en">English</option>
            <option value="th">ไทย</option>
          </select>
        </label>
        <label className="field">
          <span>{t(uiLang, "currency")}</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as typeof currency)}
          >
            {(["THB", "USD", "EUR", "LAK", "VND"] as const).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <p className="muted tiny">{t(uiLang, "fxNote")}</p>
        <button type="button" className="btn" onClick={() => setGuestScreen("register")}>
          {t(uiLang, "splashContinue")}
        </button>
      </div>
    );
  }

  if (guestScreen === "register" || !sessionUser) {
    const enabled = authProviders.filter((p) => p.enabled);
    return (
      <div className="guest-panel guest-register fade-in">
        <button type="button" className="btn btn-ghost" onClick={() => setGuestScreen("splash")}>
          ← {t(uiLang, "back")}
        </button>
        <Badge label={t(uiLang, "simulated")} />
        <h1>{t(uiLang, "registerTitle")}</h1>
        <p className="muted">{t(uiLang, "registerHint")}</p>
        <label className="field">
          <span>{t(uiLang, "primaryLanguage")}</span>
          <select
            value={primaryLanguage}
            onChange={(e) => setPrimaryLanguage(e.target.value as Lang)}
          >
            <option value="en">English</option>
            <option value="th">ไทย</option>
          </select>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
          />
          {t(uiLang, "marketingConsent")}
        </label>
        <div className="auth-grid">
          {enabled.map((p) => (
            <button
              key={p.id}
              type="button"
              className="btn btn-secondary"
              onClick={() => signInDemo(p.id, primaryLanguage)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {enabled.length === 0 ? (
          <p className="muted">
            {uiLang === "th"
              ? "ไม่มีช่องทางเข้าสู่ระบบที่เปิดใช้ — เปิดที่ Admin → HQ (เดโม)"
              : "No auth providers enabled — open Admin → HQ to enable (Demo)."}
          </p>
        ) : null}
      </div>
    );
  }

  if (guestScreen === "chain") return <ChainDetailScreen />;
  if (guestScreen === "chainConfirm") return <ChainConfirmScreen />;
  if (guestScreen === "chainSuccess") return <ChainSuccessScreen />;

  if (guestScreen === "explore") {
    return (
      <div className="guest-shell fade-in">
        <section className="guest-hero card">
          <DemoMedia src={heroSplashImage} className="guest-hero__media" alt="" />
          <div className="guest-hero__copy">
            <Badge label={t(uiLang, "demo")} />
            <h1>{t(uiLang, "exploreTitle")}</h1>
            <p className="muted">{t(uiLang, "exploreSub")}</p>
            <p className="muted tiny">
              {t(uiLang, "fxNote")} · {formatMoney(1000, currency, uiLang)} = 1,000 THB base (Demo)
            </p>
          </div>
        </section>

        <section className="guest-section">
          <h2>{t(uiLang, "communities")}</h2>
          <HorizontalScroller label={t(uiLang, "communities")}>
            {communities.map((c) => (
              <button
                key={c.id}
                type="button"
                className="card community-card"
                style={
                  {
                    "--card-accent": c.accent,
                    "--media-a": `${c.accent}22`,
                    "--media-b": "var(--by-sage-soft)",
                  } as CSSProperties
                }
                onClick={() => openCommunity(c.id)}
              >
                <DemoMedia
                  src={communityImageSrc(c.id)}
                  className="community-card__media"
                  alt=""
                />
                <div className="community-card__body">
                  <Badge label={t(uiLang, "simulated")} />
                  <h3>{uiLang === "th" ? c.nameTh : c.name}</h3>
                  <p className="muted">
                    {c.country} · {c.countryCode}
                  </p>
                  <p>{uiLang === "th" ? c.blurbTh : c.blurb}</p>
                  <span className="linkish-inline">{t(uiLang, "openStory")} →</span>
                </div>
              </button>
            ))}
          </HorizontalScroller>
        </section>

        <section className="guest-section">
          <h2>{t(uiLang, "listingsTitle")}</h2>
          <div className="filter-chips" role="toolbar" aria-label={t(uiLang, "listingsTitle")}>
            {EXPLORE_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`chip filter-chip${exploreFilter === f.id ? " is-active" : ""}`}
                onClick={() => setExploreFilter(f.id)}
              >
                {t(uiLang, f.key)}
              </button>
            ))}
          </div>
          {exploreFilter === "chain" ? (
            <p className="muted">{t(uiLang, "chainFilterHint")}</p>
          ) : listings.filter((l) => listingMatchesFilter(l, exploreFilter)).length > 0 ? (
            <HorizontalScroller
              label={t(uiLang, "listingsTitle")}
              className="h-scroll--listings"
            >
              {listings
                .filter((l) => listingMatchesFilter(l, exploreFilter))
                .map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className="listing-card"
                    onClick={() => openListing(l)}
                  >
                    <DemoMedia
                      src={listingImageSrc(l.id)}
                      className="listing-card__media"
                      data-kind={l.kind}
                      alt=""
                    />
                    <div className="listing-card__body">
                      <span className="chip">{kindLabel(l.kind, uiLang)}</span>
                      <strong>{uiLang === "th" ? l.titleTh : l.title}</strong>
                      <span className="muted">{formatMoney(l.priceThb, currency, uiLang)}</span>
                    </div>
                  </button>
                ))}
            </HorizontalScroller>
          ) : (
            <p className="muted">{t(uiLang, "filterEmpty")}</p>
          )}
        </section>
        <ChainExploreSection />
      </div>
    );
  }

  if (guestScreen === "story" && selectedCommunityId) {
    const community = communities.find((c) => c.id === selectedCommunityId);
    if (!community) return null;
    const communityListings = listings.filter((l) => l.communityId === community.id);
    return (
      <div className="guest-panel fade-in">
        <button type="button" className="btn btn-ghost" onClick={() => setGuestScreen("explore")}>
          ← {t(uiLang, "back")}
        </button>
        <DemoMedia
          src={communityImageSrc(community.id)}
          className="listing-hero-media"
          style={{ "--card-accent": community.accent } as CSSProperties}
          alt=""
        />
        <Badge label={t(uiLang, "simulated")} />
        <p className="chip">{t(uiLang, "storyTitle")}</p>
        <h1>{uiLang === "th" ? community.nameTh : community.name}</h1>
        <p className="muted">
          {community.country} · {community.countryCode}
        </p>
        <p className="story-body">{uiLang === "th" ? community.storyTh : community.story}</p>
        {communityListings.length > 0 ? (
          <section>
            <h2>{t(uiLang, "listingsTitle")}</h2>
            <div className="listing-grid">
              {communityListings.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className="listing-card"
                  onClick={() => openListing(l)}
                >
                  <DemoMedia
                    src={listingImageSrc(l.id)}
                    className="listing-card__media"
                    data-kind={l.kind}
                    alt=""
                  />
                  <div className="listing-card__body">
                    <span className="chip">{kindLabel(l.kind, uiLang)}</span>
                    <strong>{uiLang === "th" ? l.titleTh : l.title}</strong>
                    <span className="muted">{formatMoney(l.priceThb, currency, uiLang)}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <p className="muted">
            {uiLang === "th"
              ? "ยังไม่มีรายการในชุมชนนี้ (เดโม) — สำรวจชุมชนอื่นได้"
              : "No listings in this community yet (Demo) — explore others."}
          </p>
        )}
      </div>
    );
  }

  if (guestScreen === "host" && selectedHostId) {
    const host = hosts.find((h) => h.id === selectedHostId);
    if (!host) return null;
    const community = communities.find((c) => c.id === host.communityId);
    const hostListings = listings.filter((l) => l.hostId === host.id);
    return (
      <div className="guest-panel fade-in">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setGuestScreen(selectedListing ? "listing" : "explore")}
        >
          ← {t(uiLang, "back")}
        </button>
        <DemoMedia src={hostImageSrc(host.id)} className="listing-hero-media" alt="" />
        <Badge label={t(uiLang, "simulated")} />
        <p className="chip">{t(uiLang, "hostProfile")}</p>
        <h1>{uiLang === "th" ? host.nameTh : host.name}</h1>
        <p className="muted">
          {community ? (uiLang === "th" ? community.nameTh : community.name) : ""} ·{" "}
          {host.primaryLanguage.toUpperCase()}
        </p>
        <p>{uiLang === "th" ? host.bioTh : host.bio}</p>
        <div className="trust-block card">
          <h3>{t(uiLang, "trust")}</h3>
          <ul>
            <li>{uiLang === "th" ? "ยืนยันโฮสต์ชุมชน (เดโม)" : "Community-verified host (Demo)"}</li>
            <li>{uiLang === "th" ? "ตอบแชทพร้อมแปลอัตโนมัติ" : "Chat with auto-translate"}</li>
            <li>
              {uiLang === "th"
                ? "วิดีโอคอล — พรีวิวกล้องเมื่อเปิดผ่าน HTTPS"
                : "Video call — live camera preview on HTTPS"}
            </li>
          </ul>
        </div>
        <div className="cta-row">
          <button type="button" className="btn btn-secondary" onClick={() => setGuestScreen("chat")}>
            {t(uiLang, "chat")}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setGuestScreen("video")}>
            {t(uiLang, "call")}
          </button>
        </div>
        {hostListings.length > 0 ? (
          <section>
            <h2>{t(uiLang, "listingsTitle")}</h2>
            <div className="listing-grid">
              {hostListings.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className="listing-card"
                  onClick={() => openListing(l)}
                >
                  <DemoMedia
                    src={listingImageSrc(l.id)}
                    className="listing-card__media"
                    data-kind={l.kind}
                    alt=""
                  />
                  <div className="listing-card__body">
                    <span className="chip">{kindLabel(l.kind, uiLang)}</span>
                    <strong>{uiLang === "th" ? l.titleTh : l.title}</strong>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    );
  }

  if (guestScreen === "listing" && selectedListing) {
    const host = hosts.find((h) => h.id === selectedListing.hostId);
    const community = communities.find((c) => c.id === selectedListing.communityId);
    return (
      <div className="guest-panel fade-in">
        <button type="button" className="btn btn-ghost" onClick={() => setGuestScreen("explore")}>
          ← {t(uiLang, "back")}
        </button>
        <DemoMedia
          src={listingImageSrc(selectedListing.id)}
          className="listing-hero-media"
          data-kind={selectedListing.kind}
          alt=""
        />
        <Badge label={t(uiLang, "simulated")} />
        <div className="tag-row">
          <span className="chip">{kindLabel(selectedListing.kind, uiLang)}</span>
          {(selectedListing.tags ?? []).map((tag) => {
            const key = EXPLORE_FILTERS.find((f) => f.id === tag)?.key;
            return (
              <span key={tag} className="chip chip-sage">
                {key ? t(uiLang, key) : tag}
              </span>
            );
          })}
        </div>
        <h1>{uiLang === "th" ? selectedListing.titleTh : selectedListing.title}</h1>
        <p className="muted">
          {community ? (
            <button type="button" className="linkish-inline" onClick={() => openCommunity(community.id)}>
              {uiLang === "th" ? community.nameTh : community.name}
            </button>
          ) : null}
          {" · "}
          {host ? (
            <button type="button" className="linkish-inline" onClick={() => openHost(host.id)}>
              {uiLang === "th" ? host.nameTh : host.name} · {t(uiLang, "viewHost")}
            </button>
          ) : null}
        </p>
        <p className="listing-desc">
          {uiLang === "th" ? selectedListing.descriptionTh : selectedListing.description}
        </p>
        <p className="price">{formatMoney(selectedListing.priceThb, currency, uiLang)}</p>
        <div className="trust-block card">
          <h3>{t(uiLang, "trust")}</h3>
          <ul>
            {selectedListing.trust.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="cta-row">
          <button type="button" className="btn btn-secondary" onClick={() => setGuestScreen("chat")}>
            {t(uiLang, "chat")}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setGuestScreen("video")}>
            {t(uiLang, "call")}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setCartItem(selectedListing);
              setGuestScreen("checkout");
            }}
          >
            {t(uiLang, "bookBuy")}
          </button>
        </div>
      </div>
    );
  }

  if (guestScreen === "chat") {
    return (
      <div className="guest-panel fade-in">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setGuestScreen(selectedListing ? "listing" : "host")}
        >
          ← {t(uiLang, "back")}
        </button>
        <div className="row-between">
          <h1>{t(uiLang, "chat")}</h1>
          <Badge label={t(uiLang, "autoTranslate")} />
        </div>
        <div className="chat-thread card">
          {demoThread.map((m) => (
            <div key={m.id} className={`bubble ${m.from === "guest" ? "bubble--me" : ""}`}>
              {showBilingual ? (
                <>
                  <p className="bubble-primary">{m.translatedText}</p>
                  <p className="bubble-original muted">
                    <span className="tiny">{t(uiLang, "originalLabel")}: </span>
                    {m.sourceText}
                  </p>
                  <span className="muted tiny">
                    {m.sourceLang} → {m.targetLang}
                  </span>
                </>
              ) : (
                <>
                  <p>{m.translatedText}</p>
                  <span className="muted tiny">
                    {m.sourceLang} → {m.targetLang}
                  </span>
                </>
              )}
            </div>
          ))}
          {extraMsgs.map((m) => (
            <div key={m.id} className="bubble bubble--me">
              {showBilingual ? (
                <>
                  <p className="bubble-primary">{m.translated}</p>
                  <p className="bubble-original muted">
                    <span className="tiny">{t(uiLang, "originalLabel")}: </span>
                    {m.text}
                  </p>
                </>
              ) : (
                <p>{m.translated}</p>
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
            if (!draftMsg.trim()) return;
            const from = uiLang;
            const to: Lang = from === "th" ? "en" : "th";
            setExtraMsgs((prev) => [
              ...prev,
              {
                id: `x-${Date.now()}`,
                text: draftMsg,
                translated: demoTranslate(draftMsg, from, to),
                sourceLang: from,
                targetLang: to,
              },
            ]);
            setDraftMsg("");
          }}
        >
          <input
            value={draftMsg}
            onChange={(e) => setDraftMsg(e.target.value)}
            placeholder={uiLang === "th" ? "พิมพ์ข้อความ…" : "Type a message…"}
          />
          <button type="submit" className="btn">
            {t(uiLang, "send")}
          </button>
        </form>
      </div>
    );
  }

  if (guestScreen === "video") {
    const secure = isSecureContext();
    let statusText: string;
    if (!secure) statusText = callErrorMessage(uiLang, "insecure");
    else if (callError) statusText = callErrorMessage(uiLang, callError);
    else if (callStream) statusText = t(uiLang, "cameraLive");
    else statusText = t(uiLang, "cameraHint");

    const leave = () => {
      stopMediaStream(callStream);
      setCallStream(null);
      setCallError(null);
      setGuestScreen(selectedListing ? "listing" : "host");
    };

    const startCamera = async () => {
      setCameraStarting(true);
      setCallError(null);
      const { stream, error } = await requestCallMedia();
      setCameraStarting(false);
      if (stream) {
        stopMediaStream(callStream);
        setCallStream(stream);
      } else {
        setCallError(error);
      }
    };

    return (
      <div className="video-overlay fade-in">
        <div className="video-card card">
          <Badge label={t(uiLang, "demo")} />
          <h1>{callStream ? t(uiLang, "cameraLiveTitle") : t(uiLang, "connecting")}</h1>
          {callStream ? (
            <video
              ref={videoRef}
              className="video-preview"
              autoPlay
              muted
              playsInline
              aria-label={uiLang === "th" ? "พรีวิวกล้อง" : "Camera preview"}
            />
          ) : (
            <div className="video-fake" aria-hidden />
          )}
          <p className={`muted tiny video-status${!secure || callError ? " video-status--warn" : ""}`}>
            {statusText}
          </p>
          {!callStream ? (
            <button
              type="button"
              className="btn btn-secondary"
              disabled={cameraStarting || !secure}
              onClick={() => void startCamera()}
            >
              {cameraStarting ? t(uiLang, "cameraStarting") : t(uiLang, "startCamera")}
            </button>
          ) : null}
          <button type="button" className="btn" onClick={leave}>
            {t(uiLang, "endCall")}
          </button>
        </div>
      </div>
    );
  }

  if (guestScreen === "checkout" && cartItem) {
    return (
      <div className="guest-panel fade-in">
        <button type="button" className="btn btn-ghost" onClick={() => setGuestScreen("listing")}>
          ← {t(uiLang, "back")}
        </button>
        <h1>{t(uiLang, "checkout")}</h1>
        <Badge label={t(uiLang, "payWithStripe")} />
        <div className="card checkout-box">
          <p>
            <strong>{uiLang === "th" ? cartItem.titleTh : cartItem.title}</strong>
          </p>
          <p>{formatMoney(cartItem.priceThb, currency, uiLang)}</p>
          <p className="muted tiny">{t(uiLang, "fxNote")}</p>
          <label className="field">
            <span>{t(uiLang, "cardLabel")}</span>
            <input value={card} onChange={(e) => setCard(e.target.value)} inputMode="numeric" />
          </label>
          <p className="muted tiny">Stripe UI mock — no real charge · Simulated</p>
          <button type="button" className="btn" onClick={() => setGuestScreen("success")}>
            {t(uiLang, "confirmPay")}
          </button>
        </div>
      </div>
    );
  }

  if (guestScreen === "success") {
    return (
      <div className="guest-panel success-pop">
        <Badge label={t(uiLang, "simulated")} />
        <h1>{t(uiLang, "successTitle")}</h1>
        <p>{t(uiLang, "successBody")}</p>
        <button type="button" className="btn" onClick={() => setGuestScreen("explore")}>
          {t(uiLang, "continueExplore")}
        </button>
      </div>
    );
  }

  return null;
}
