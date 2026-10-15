import { t } from "../i18n.js";
import { enhanceHorizontalScroller } from "../hscroll.js";
import {
  callErrorMessage,
  clearCallError,
  getCallError,
  getCallStream,
  isCallBusy,
  isSecureContext,
  startCallMedia,
  stopCallMedia,
} from "../media-call.js";
import {
  badge,
  communityImage,
  demoMedia,
  demoTranslate,
  el,
  formatMoney,
  hostImage,
  listingImage,
} from "../utils.js";
import {
  effectiveStatus,
  mountChainScrollers,
  renderChainCard,
  renderChainConfirm,
  renderChainDetail,
  renderChainExplore,
  renderChainSuccess,
} from "./chains.js";

/** Stop camera tracks when leaving the video screen or guest lane. */
export function cleanupCallMedia() {
  stopCallMedia();
  clearCallError();
}

/** @type {Array<{ destroy: () => void }>} */
let exploreScrollCleanups = [];

export function cleanupExploreScrollers() {
  for (const c of exploreScrollCleanups) c.destroy();
  exploreScrollCleanups = [];
}

function mountExploreScroller(scroller, label) {
  exploreScrollCleanups.push(enhanceHorizontalScroller(scroller, { label }));
}

const EXPLORE_FILTERS = [
  { id: "all", key: "filterAll" },
  { id: "chain", key: "filterChain" },
  { id: "family", key: "filterFamily" },
  { id: "kids", key: "filterKids" },
  { id: "solo", key: "filterSolo" },
  { id: "wellness", key: "filterWellness" },
  { id: "food", key: "filterFood" },
  { id: "music", key: "filterMusic" },
];

function kindLabel(kind, lang) {
  if (kind === "stay") return t(lang, "kindStay");
  if (kind === "experience") return t(lang, "kindExperience");
  return t(lang, "kindProduct");
}

function listingMatchesFilter(listing, filter) {
  if (!filter || filter === "all") return true;
  const tags = Array.isArray(listing.tags) ? listing.tags : [];
  return tags.includes(filter);
}

function listingCard(l, lang, currency, rates, media, onOpen) {
  return el(
    "button",
    { type: "button", className: "listing-card", onClick: () => onOpen(l) },
    [
      demoMedia(listingImage(media, l.id), "listing-card__media", { "data-kind": l.kind }),
      el("div", { className: "listing-card__body" }, [
        el("span", { className: "chip", text: kindLabel(l.kind, lang) }),
        el("strong", { text: lang === "th" ? l.titleTh : l.title }),
        el("span", { className: "muted", text: formatMoney(l.priceThb, currency, lang, rates) }),
      ]),
    ],
  );
}

export function renderGuest(root, ctx) {
  const { data, api } = ctx;
  const s = api.get();
  const lang = api.uiLang();
  const { currency } = s;
  const rates = data.fx.rates;
  const media = data.media;

  const screen =
    s.guestScreen === "splash" ||
    (!s.sessionUser && s.guestScreen !== "register" && s.guestScreen !== "privacy")
      ? "splash"
      : !s.sessionUser || s.guestScreen === "register"
        ? "register"
        : s.guestScreen;

  if (screen === "splash") {
    root.append(
      el("div", { className: "guest-panel guest-splash fade-in" }, [
        demoMedia(media.heroSplash, "listing-hero-media splash-hero"),
        el("img", {
          className: "brand-logo brand-logo--splash",
          src: "images/logo-campong.png?v=20260916a",
          alt: "Campong Innovation",
        }),
        el("h1", { text: t(lang, "splashTitle") }),
        el("p", { className: "muted brand-tagline", text: t(lang, "brandTagline") }),
        el("p", { className: "muted", text: t(lang, "splashSub") }),
        el("label", { className: "field" }, [
          el("span", { text: t(lang, "language") }),
          el(
            "select",
            {
              onChange: (e) => api.setPrimaryLanguage(e.target.value),
            },
            [
              el("option", { value: "en", text: "English", selected: s.primaryLanguage === "en" || null }),
              el("option", { value: "th", text: "ไทย", selected: s.primaryLanguage === "th" || null }),
            ],
          ),
        ]),
        el("label", { className: "field" }, [
          el("span", { text: t(lang, "currency") }),
          el(
            "select",
            { onChange: (e) => api.setCurrency(e.target.value) },
            ["THB", "USD", "EUR", "LAK", "VND"].map((c) =>
              el("option", { value: c, text: c, selected: currency === c || null }),
            ),
          ),
        ]),
        el("p", { className: "muted tiny", text: t(lang, "fxNote") }),
        el("button", {
          type: "button",
          className: "btn",
          text: t(lang, "splashContinue"),
          onClick: () => api.setGuestScreen("register"),
        }),
      ]),
    );
    return;
  }

  if (screen === "register") {
    const enabled = s.authProviders.filter((p) => p.enabled);
    root.append(
      el("div", { className: "guest-panel guest-register fade-in" }, [
        el("button", {
          type: "button",
          className: "btn btn-ghost",
          text: `← ${t(lang, "back")}`,
          onClick: () => api.setGuestScreen("splash"),
        }),
        el("h1", { text: t(lang, "registerTitle") }),
        el("p", { className: "muted", text: t(lang, "registerHint") }),
        el("label", { className: "field" }, [
          el("span", { text: t(lang, "primaryLanguage") }),
          el(
            "select",
            { onChange: (e) => api.setPrimaryLanguage(e.target.value) },
            [
              el("option", { value: "en", text: "English", selected: s.primaryLanguage === "en" || null }),
              el("option", { value: "th", text: "ไทย", selected: s.primaryLanguage === "th" || null }),
            ],
          ),
        ]),
        el("label", { className: "check" }, [
          el("input", {
            type: "checkbox",
            checked: s.marketingConsent || null,
            onChange: (e) => api.setMarketingConsent(e.target.checked),
          }),
          document.createTextNode(t(lang, "marketingConsent")),
        ]),
        el(
          "div",
          { className: "auth-grid" },
          enabled.map((p) =>
            el("button", {
              type: "button",
              className: "btn btn-secondary",
              text: p.label,
              onClick: () => api.signInDemo(p.id, s.primaryLanguage),
            }),
          ),
        ),
        enabled.length === 0
          ? el("p", {
              className: "muted",
              text:
                lang === "th"
                  ? "ไม่มีช่องทางเข้าสู่ระบบที่เปิดใช้ — เปิดที่ Admin → HQ"
                  : "No auth providers enabled — open Admin → HQ to enable.",
            })
          : null,
      ]),
    );
    return;
  }

  if (screen === "explore") {
    root.append(
      el("div", { className: "guest-shell fade-in" }, [
        el("section", { className: "guest-hero card" }, [
          demoMedia(media.heroSplash, "guest-hero__media"),
          el("div", { className: "guest-hero__copy" }, [
            el("h1", { text: t(lang, "exploreTitle") }),
            el("p", { className: "muted", text: t(lang, "exploreSub") }),
            el("p", {
              className: "muted tiny",
              text: `${t(lang, "fxNote")} · ${formatMoney(1000, currency, lang, rates)} = 1,000 THB base`,
            }),
          ]),
        ]),
        el("section", { className: "guest-section" }, [
          el("h2", { text: t(lang, "communities") }),
          el(
            "div",
            { className: "h-scroll", dataset: { hscroll: "communities" } },
            data.communities.map((c) =>
              el(
                "button",
                {
                  type: "button",
                  className: "card community-card",
                  style: {
                    "--card-accent": c.accent,
                    "--media-a": `${c.accent}22`,
                    "--media-b": "var(--by-sage-soft)",
                  },
                  onClick: () => api.openCommunity(c.id),
                },
                [
                  demoMedia(communityImage(media, c.id), "community-card__media"),
                  el("div", { className: "community-card__body" }, [
                    el("h3", { text: lang === "th" ? c.nameTh : c.name }),
                    el("p", { className: "muted", text: `${c.country} · ${c.countryCode}` }),
                    el("p", { text: lang === "th" ? c.blurbTh : c.blurb }),
                    el("span", { className: "linkish-inline", text: `${t(lang, "openStory")} →` }),
                  ]),
                ],
              ),
            ),
          ),
        ]),
        (() => {
          const filter = s.exploreFilter || "all";
          const chainOnly = filter === "chain";
          const filtered = chainOnly
            ? []
            : data.listings.filter((l) => listingMatchesFilter(l, filter));
          return el("section", { className: "guest-section" }, [
            el("h2", { text: t(lang, "listingsTitle") }),
            el(
              "div",
              { className: "filter-chips", role: "toolbar", "aria-label": t(lang, "listingsTitle") },
              EXPLORE_FILTERS.map((f) =>
                el("button", {
                  type: "button",
                  className: `chip filter-chip${filter === f.id ? " is-active" : ""}`,
                  text: t(lang, f.key),
                  onClick: () => api.patch({ exploreFilter: f.id }),
                }),
              ),
            ),
            chainOnly
              ? el("p", { className: "muted", text: t(lang, "chainFilterHint") })
              : filtered.length
                ? el(
                    "div",
                    { className: "h-scroll h-scroll--listings", dataset: { hscroll: "listings" } },
                    filtered.map((l) =>
                      listingCard(l, lang, currency, rates, media, (x) => api.openListing(x)),
                    ),
                  )
                : el("p", { className: "muted", text: t(lang, "filterEmpty") }),
          ]);
        })(),
        renderChainExplore(ctx),
      ]),
    );

    root.querySelectorAll("[data-hscroll]").forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      const key = node.dataset.hscroll;
      const label =
        key === "listings" ? t(lang, "listingsTitle") : t(lang, "communities");
      mountExploreScroller(node, label);
    });
    for (const c of mountChainScrollers(root, lang)) exploreScrollCleanups.push(c);
    return;
  }

  if (screen === "chain" && s.selectedChainId) {
    renderChainDetail(root, ctx);
    for (const c of mountChainScrollers(root, lang)) exploreScrollCleanups.push(c);
    return;
  }

  if (screen === "chainConfirm" && s.selectedChainId) {
    renderChainConfirm(root, ctx);
    return;
  }

  if (screen === "chainSuccess") {
    renderChainSuccess(root, ctx);
    return;
  }

  if (screen === "story" && s.selectedCommunityId) {
    const community = data.communities.find((c) => c.id === s.selectedCommunityId);
    if (!community) return;
    const communityListings = data.listings.filter((l) => l.communityId === community.id);
    const communityChains = (data.supplyChains.provinces || [])
      .filter((p) => p.communityId === community.id)
      .flatMap((province) => province.products.map((product) => ({ province, product })));
    root.append(
      el("div", { className: "guest-panel fade-in" }, [
        el("button", {
          type: "button",
          className: "btn btn-ghost",
          text: `← ${t(lang, "back")}`,
          onClick: () => api.setGuestScreen("explore"),
        }),
        demoMedia(communityImage(media, community.id), "listing-hero-media", {
          style: { "--card-accent": community.accent },
        }),
        el("p", { className: "chip", text: t(lang, "storyTitle") }),
        el("h1", { text: lang === "th" ? community.nameTh : community.name }),
        el("p", { className: "muted", text: `${community.country} · ${community.countryCode}` }),
        el("p", { className: "story-body", text: lang === "th" ? community.storyTh : community.story }),
        communityChains.length
          ? el("section", {}, [
              el("h2", { text: t(lang, "chainSection") }),
              el(
                "div",
                { className: "listing-grid" },
                communityChains.map((row) =>
                  renderChainCard(
                    row,
                    lang,
                    currency,
                    rates,
                    effectiveStatus(row.product, s.chainStatus),
                    (id) => api.openChain(id),
                  ),
                ),
              ),
            ])
          : null,
        communityListings.length
          ? el("section", {}, [
              el("h2", { text: t(lang, "listingsTitle") }),
              el(
                "div",
                { className: "listing-grid" },
                communityListings.map((l) =>
                  listingCard(l, lang, currency, rates, media, (x) => api.openListing(x)),
                ),
              ),
            ])
          : el("p", {
              className: "muted",
              text:
                lang === "th"
                  ? "ยังไม่มีรายการในชุมชนนี้ — สำรวจชุมชนอื่นได้"
                  : "No listings in this community yet — explore others.",
            }),
      ]),
    );
    return;
  }

  if (screen === "host" && s.selectedHostId) {
    const host = data.hosts.find((h) => h.id === s.selectedHostId);
    if (!host) return;
    const community = data.communities.find((c) => c.id === host.communityId);
    const hostListings = data.listings.filter((l) => l.hostId === host.id);
    root.append(
      el("div", { className: "guest-panel fade-in" }, [
        el("button", {
          type: "button",
          className: "btn btn-ghost",
          text: `← ${t(lang, "back")}`,
          onClick: () => api.setGuestScreen(s.selectedListingId ? "listing" : "explore"),
        }),
        demoMedia(hostImage(media, host.id), "listing-hero-media"),
        el("p", { className: "chip", text: t(lang, "hostProfile") }),
        el("h1", { text: lang === "th" ? host.nameTh : host.name }),
        el("p", {
          className: "muted",
          text: `${community ? (lang === "th" ? community.nameTh : community.name) : ""} · ${host.primaryLanguage.toUpperCase()}`,
        }),
        el("p", { text: lang === "th" ? host.bioTh : host.bio }),
        el("div", { className: "trust-block card" }, [
          el("h3", { text: t(lang, "trust") }),
          el("ul", {}, [
            el("li", {
              text: lang === "th" ? "ยืนยันโฮสต์ชุมชน" : "Community-verified host",
            }),
            el("li", {
              text: lang === "th" ? "ตอบแชทพร้อมแปลอัตโนมัติ" : "Chat with auto-translate",
            }),
            el("li", {
              text:
                lang === "th"
                  ? "วิดีโอคอล — พรีวิวกล้องเมื่อเปิดผ่าน HTTPS"
                  : "Video call — live camera preview on HTTPS",
            }),
          ]),
        ]),
        el("div", { className: "cta-row" }, [
          el("button", {
            type: "button",
            className: "btn btn-secondary",
            text: t(lang, "chat"),
            onClick: () => api.setGuestScreen("chat"),
          }),
          el("button", {
            type: "button",
            className: "btn btn-secondary",
            text: t(lang, "call"),
            onClick: () => api.setGuestScreen("video"),
          }),
        ]),
        hostListings.length
          ? el("section", {}, [
              el("h2", { text: t(lang, "listingsTitle") }),
              el(
                "div",
                { className: "listing-grid" },
                hostListings.map((l) =>
                  el(
                    "button",
                    { type: "button", className: "listing-card", onClick: () => api.openListing(l) },
                    [
                      demoMedia(listingImage(media, l.id), "listing-card__media", {
                        "data-kind": l.kind,
                      }),
                      el("div", { className: "listing-card__body" }, [
                        el("span", { className: "chip", text: kindLabel(l.kind, lang) }),
                        el("strong", { text: lang === "th" ? l.titleTh : l.title }),
                      ]),
                    ],
                  ),
                ),
              ),
            ])
          : null,
      ]),
    );
    return;
  }

  if (screen === "listing" && s.selectedListingId) {
    const listing = data.listings.find((l) => l.id === s.selectedListingId);
    if (!listing) return;
    const host = data.hosts.find((h) => h.id === listing.hostId);
    const community = data.communities.find((c) => c.id === listing.communityId);
    root.append(
      el("div", { className: "guest-panel fade-in" }, [
        el("button", {
          type: "button",
          className: "btn btn-ghost",
          text: `← ${t(lang, "back")}`,
          onClick: () => api.setGuestScreen("explore"),
        }),
        demoMedia(listingImage(media, listing.id), "listing-hero-media", {
          "data-kind": listing.kind,
        }),
        el("div", { className: "tag-row" }, [
          el("span", { className: "chip", text: kindLabel(listing.kind, lang) }),
          ...(Array.isArray(listing.tags)
            ? listing.tags.map((tag) => {
                const key = EXPLORE_FILTERS.find((f) => f.id === tag)?.key;
                return el("span", {
                  className: "chip chip-sage",
                  text: key ? t(lang, key) : tag,
                });
              })
            : []),
        ]),
        el("h1", { text: lang === "th" ? listing.titleTh : listing.title }),
        el("p", { className: "muted" }, [
          community
            ? el("button", {
                type: "button",
                className: "linkish-inline",
                text: lang === "th" ? community.nameTh : community.name,
                onClick: () => api.openCommunity(community.id),
              })
            : null,
          document.createTextNode(" · "),
          host
            ? el("button", {
                type: "button",
                className: "linkish-inline",
                text: `${lang === "th" ? host.nameTh : host.name} · ${t(lang, "viewHost")}`,
                onClick: () => api.openHost(host.id),
              })
            : null,
        ]),
        el("p", {
          className: "listing-desc",
          text: lang === "th" ? listing.descriptionTh : listing.description,
        }),
        el("p", {
          className: "price",
          text: formatMoney(listing.priceThb, currency, lang, rates),
        }),
        el("div", { className: "trust-block card" }, [
          el("h3", { text: t(lang, "trust") }),
          el(
            "ul",
            {},
            listing.trust.map((x) => el("li", { text: x })),
          ),
        ]),
        el("div", { className: "cta-row" }, [
          el("button", {
            type: "button",
            className: "btn btn-secondary",
            text: t(lang, "chat"),
            onClick: () => api.setGuestScreen("chat"),
          }),
          el("button", {
            type: "button",
            className: "btn btn-secondary",
            text: t(lang, "call"),
            onClick: () => api.setGuestScreen("video"),
          }),
          el("button", {
            type: "button",
            className: "btn",
            text: t(lang, "bookBuy"),
            onClick: () => {
              api.setCartItem(listing);
              api.setGuestScreen("checkout");
            },
          }),
        ]),
      ]),
    );
    return;
  }

  if (screen === "chat") {
    const thread = data.chat.demoThread;
    const bubbles = [
      ...thread.map((m) =>
        el("div", { className: `bubble ${m.from === "guest" ? "bubble--me" : ""}` }, [
          s.showBilingualGuest
            ? el("p", { className: "bubble-primary", text: m.translatedText })
            : el("p", { text: m.translatedText }),
          s.showBilingualGuest
            ? el("p", { className: "bubble-original muted" }, [
                el("span", { className: "tiny", text: `${t(lang, "originalLabel")}: ` }),
                document.createTextNode(m.sourceText),
              ])
            : null,
          el("span", { className: "muted tiny", text: `${m.sourceLang} → ${m.targetLang}` }),
        ]),
      ),
      ...s.guestExtraMsgs.map((m) =>
        el("div", { className: "bubble bubble--me" }, [
          s.showBilingualGuest
            ? el("p", { className: "bubble-primary", text: m.translated })
            : el("p", { text: m.translated }),
          s.showBilingualGuest
            ? el("p", { className: "bubble-original muted" }, [
                el("span", { className: "tiny", text: `${t(lang, "originalLabel")}: ` }),
                document.createTextNode(m.text),
              ])
            : null,
        ]),
      ),
    ];

    const input = el("input", {
      value: s.draftMsg,
      placeholder: lang === "th" ? "พิมพ์ข้อความ…" : "Type a message…",
    });
    input.value = s.draftMsg;
    input.addEventListener("input", (e) => api.patchSilent({ draftMsg: e.target.value }));

    root.append(
      el("div", { className: "guest-panel fade-in" }, [
        el("button", {
          type: "button",
          className: "btn btn-ghost",
          text: `← ${t(lang, "back")}`,
          onClick: () => api.setGuestScreen(s.selectedListingId ? "listing" : "host"),
        }),
        el("div", { className: "row-between" }, [
          el("h1", { text: t(lang, "chat") }),
          badge(t(lang, "autoTranslate")),
        ]),
        el("div", { className: "chat-thread card" }, bubbles),
        el("button", {
          type: "button",
          className: "btn btn-ghost",
          text: s.showBilingualGuest ? t(lang, "hideOriginal") : t(lang, "showOriginal"),
          onClick: () => api.patch({ showBilingualGuest: !s.showBilingualGuest }),
        }),
        el(
          "form",
          {
            className: "chat-compose",
            onSubmit: (e) => {
              e.preventDefault();
              const text = (api.get().draftMsg || "").trim();
              if (!text) return;
              const from = lang;
              const to = from === "th" ? "en" : "th";
              api.patch({
                guestExtraMsgs: [
                  ...api.get().guestExtraMsgs,
                  {
                    id: `x-${Date.now()}`,
                    text,
                    translated: demoTranslate(text, from, to),
                    sourceLang: from,
                    targetLang: to,
                  },
                ],
                draftMsg: "",
              });
            },
          },
          [
            input,
            el("button", { type: "submit", className: "btn", text: t(lang, "send") }),
          ],
        ),
      ]),
    );
    return;
  }

  if (screen === "video") {
    const stream = getCallStream();
    const errCode = getCallError();
    const secure = isSecureContext();
    const leaveTarget = s.selectedListingId ? "listing" : "host";

    const videoEl = el("video", {
      className: "video-preview",
      autoplay: true,
      muted: true,
      playsinline: true,
      "aria-label": lang === "th" ? "พรีวิวกล้อง" : "Camera preview",
    });
    videoEl.playsInline = true;
    videoEl.muted = true;
    videoEl.autoplay = true;
    if (stream) videoEl.srcObject = stream;

    let statusText;
    if (!secure) {
      statusText = callErrorMessage(lang, "insecure");
    } else if (errCode) {
      statusText = callErrorMessage(lang, errCode);
    } else if (stream) {
      statusText = t(lang, "cameraLive");
    } else {
      statusText = t(lang, "cameraHint");
    }

    const startBtn = el("button", {
      type: "button",
      className: "btn btn-secondary",
      text: isCallBusy() ? t(lang, "cameraStarting") : t(lang, "startCamera"),
      disabled: isCallBusy() || !secure || null,
      onClick: async () => {
        startBtn.disabled = true;
        startBtn.textContent = t(lang, "cameraStarting");
        await startCallMedia();
        api.patch({});
      },
    });

    root.append(
      el("div", { className: "video-overlay fade-in" }, [
        el("div", { className: "video-card card" }, [
          el("h1", { text: stream ? t(lang, "cameraLiveTitle") : t(lang, "connecting") }),
          stream
            ? videoEl
            : el("div", { className: "video-fake", "aria-hidden": "true" }),
          el("p", {
            className: errCode || !secure ? "muted tiny video-status video-status--warn" : "muted tiny video-status",
            text: statusText,
          }),
          !stream ? startBtn : null,
          el("button", {
            type: "button",
            className: "btn",
            text: t(lang, "endCall"),
            onClick: () => {
              cleanupCallMedia();
              api.setGuestScreen(leaveTarget);
            },
          }),
        ]),
      ]),
    );
    return;
  }

  if (screen === "checkout" && s.cartItemId) {
    const cartItem = data.listings.find((l) => l.id === s.cartItemId);
    if (!cartItem) return;
    const cardInput = el("input", { inputmode: "numeric" });
    cardInput.value = s.card;
    cardInput.addEventListener("input", (e) => api.patchSilent({ card: e.target.value }));
    root.append(
      el("div", { className: "guest-panel fade-in" }, [
        el("button", {
          type: "button",
          className: "btn btn-ghost",
          text: `← ${t(lang, "back")}`,
          onClick: () => api.setGuestScreen("listing"),
        }),
        el("h1", { text: t(lang, "checkout") }),
        el("div", { className: "card checkout-box" }, [
          el("p", {}, [el("strong", { text: lang === "th" ? cartItem.titleTh : cartItem.title })]),
          el("p", { text: formatMoney(cartItem.priceThb, currency, lang, rates) }),
          el("p", { className: "muted tiny", text: t(lang, "fxNote") }),
          el("label", { className: "field" }, [
            el("span", { text: t(lang, "cardLabel") }),
            cardInput,
          ]),
          el("p", {
            className: "muted tiny",
            text: "Stripe UI mock — no real charge · Simulated",
          }),
          el("button", {
            type: "button",
            className: "btn",
            text: t(lang, "confirmPay"),
            onClick: () => api.setGuestScreen("success"),
          }),
        ]),
      ]),
    );
    return;
  }

  if (screen === "success") {
    root.append(
      el("div", { className: "guest-panel success-pop" }, [
        el("h1", { text: t(lang, "successTitle") }),
        el("p", { text: t(lang, "successBody") }),
        el("button", {
          type: "button",
          className: "btn",
          text: t(lang, "continueExplore"),
          onClick: () => api.setGuestScreen("explore"),
        }),
      ]),
    );
  }
}
