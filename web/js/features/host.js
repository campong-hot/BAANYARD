import { t } from "../i18n.js";
import { badge, demoMedia, demoTranslate, el } from "../utils.js";
import { renderHostChainPanel } from "./chains.js";

const photoMoods = ["River morning", "Indigo vat", "Barn shelf", "Hill mist"];

export function renderHost(root, ctx) {
  const { data, api } = ctx;
  const s = api.get();
  const lang = api.uiLang();
  const draft = s.hostDraft;

  if (s.hostScreen === "inbox") {
    const input = el("input", {
      placeholder: lang === "th" ? "ตอบเป็นภาษาไทย…" : "Reply in host language…",
    });
    input.value = s.draftReply;
    input.addEventListener("input", (e) => api.patchSilent({ draftReply: e.target.value }));

    const bubbles = [
      ...data.chat.demoThread.map((m) =>
        el("div", { className: `bubble ${m.from === "host" ? "bubble--me" : ""}` }, [
          el("p", {
            text: s.showBilingualHost
              ? m.from === "host"
                ? m.sourceText
                : m.translatedText
              : m.from === "host"
                ? m.sourceText
                : m.translatedText,
          }),
          s.showBilingualHost
            ? el("p", { className: "bubble-original muted" }, [
                el("span", { className: "tiny", text: `${t(lang, "originalLabel")}: ` }),
                document.createTextNode(
                  m.from === "host" ? m.translatedText : m.sourceText,
                ),
              ])
            : null,
          el("span", { className: "muted tiny", text: `${m.sourceLang} → ${m.targetLang}` }),
        ]),
      ),
      ...s.hostExtraReplies.map((m) =>
        el("div", { className: "bubble bubble--me" }, [
          el("p", { text: m.text }),
          s.showBilingualHost
            ? el("p", { className: "bubble-original muted" }, [
                el("span", { className: "tiny", text: `${t(lang, "translatedLabel")}: ` }),
                document.createTextNode(m.translated),
              ])
            : null,
        ]),
      ),
    ];

    root.append(
      el("div", { className: "host-panel fade-in" }, [
        el("div", { className: "host-tabs" }, [
          el("button", {
            type: "button",
            className: "btn btn-ghost",
            text: t(lang, "hostHome"),
            onClick: () => api.setHostScreen("home"),
          }),
          el("button", {
            type: "button",
            className: "btn btn-secondary is-tab-active",
            text: t(lang, "hostInbox"),
          }),
        ]),
        el("div", { className: "row-between" }, [
          el("h1", { text: t(lang, "hostInbox") }),
          badge(t(lang, "autoTranslate")),
        ]),
        el("p", { className: "muted", text: t(lang, "hostInboxHint") }),
        el("div", { className: "chat-thread card host-inbox-thread" }, bubbles),
        el("button", {
          type: "button",
          className: "btn btn-ghost",
          text: s.showBilingualHost ? t(lang, "hideOriginal") : t(lang, "showOriginal"),
          onClick: () => api.patch({ showBilingualHost: !s.showBilingualHost }),
        }),
        el(
          "form",
          {
            className: "chat-compose",
            onSubmit: (e) => {
              e.preventDefault();
              const text = (api.get().draftReply || "").trim();
              if (!text) return;
              api.patch({
                hostExtraReplies: [
                  ...api.get().hostExtraReplies,
                  {
                    id: `hr-${Date.now()}`,
                    text,
                    translated: demoTranslate(text, "th", "en"),
                  },
                ],
                draftReply: "",
              });
            },
          },
          [
            input,
            el("button", { type: "submit", className: "btn", text: t(lang, "replyHost") }),
          ],
        ),
      ]),
    );
    return;
  }

  if (s.hostScreen === "wizard") {
    const step = s.hostWizardStep;
    const kids = [
      el("button", {
        type: "button",
        className: "btn btn-ghost",
        text: `← ${t(lang, "back")}`,
        onClick: () => api.setHostScreen("home"),
      }),
    ];

    if (step === 1) {
      kids.push(
        el("h1", { text: t(lang, "stepType") }),
        el(
          "div",
          { className: "kind-grid" },
          ["stay", "experience", "product"].map((k) =>
            el("button", {
              type: "button",
              className: `card kind-btn ${draft.kind === k ? "is-active" : ""}`,
              text: t(
                lang,
                k === "stay" ? "kindStay" : k === "experience" ? "kindExperience" : "kindProduct",
              ),
              onClick: () => api.patch({ hostDraft: { ...draft, kind: k } }),
            }),
          ),
        ),
        el("button", {
          type: "button",
          className: "btn",
          text: t(lang, "next"),
          onClick: () => api.patch({ hostWizardStep: 2 }),
        }),
      );
    }

    if (step === 2) {
      const titleIn = el("input");
      titleIn.value = draft.title;
      titleIn.addEventListener("input", (e) =>
        api.patchSilent({ hostDraft: { ...api.get().hostDraft, title: e.target.value } }),
      );
      const storyIn = el("textarea", { rows: "4" });
      storyIn.value = draft.story;
      storyIn.addEventListener("input", (e) =>
        api.patchSilent({ hostDraft: { ...api.get().hostDraft, story: e.target.value } }),
      );
      kids.push(
        el("h1", { text: t(lang, "stepStory") }),
        el("label", { className: "field" }, [
          el("span", { text: lang === "th" ? "ชื่อข้อเสนอ" : "Title" }),
          titleIn,
        ]),
        el("label", { className: "field" }, [
          el("span", { text: lang === "th" ? "เรื่องราว" : "Story" }),
          storyIn,
        ]),
        el("fieldset", { className: "photo-moods" }, [
          el("legend", { text: t(lang, "photoPick") }),
          el(
            "div",
            { className: "kind-grid" },
            photoMoods.map((mood) =>
              el("button", {
                type: "button",
                className: `card kind-btn ${draft.photoMood === mood ? "is-active" : ""}`,
                text: mood,
                onClick: () => api.patch({ hostDraft: { ...api.get().hostDraft, photoMood: mood } }),
              }),
            ),
          ),
        ]),
        el("div", { className: "cta-row" }, [
          el("button", {
            type: "button",
            className: "btn btn-secondary",
            text: t(lang, "back"),
            onClick: () => api.patch({ hostWizardStep: 1 }),
          }),
          el("button", {
            type: "button",
            className: "btn",
            text: t(lang, "next"),
            onClick: () => {
              if (!api.get().hostDraft.title.trim()) return;
              api.patch({ hostWizardStep: 3 });
            },
          }),
        ]),
      );
    }

    if (step === 3) {
      const priceIn = el("input", { inputmode: "decimal" });
      priceIn.value = draft.price;
      priceIn.addEventListener("input", (e) =>
        api.patchSilent({ hostDraft: { ...api.get().hostDraft, price: e.target.value } }),
      );
      kids.push(
        el("h1", { text: t(lang, "stepPrice") }),
        el("p", {
          className: "muted tiny",
          text: `${lang === "th" ? "ปก:" : "Cover:"} ${draft.photoMood}`,
        }),
        el("label", { className: "field" }, [el("span", { text: "THB" }), priceIn]),
        el("div", { className: "cta-row" }, [
          el("button", {
            type: "button",
            className: "btn btn-secondary",
            text: t(lang, "back"),
            onClick: () => api.patch({ hostWizardStep: 2 }),
          }),
          el("button", {
            type: "button",
            className: "btn btn-sage",
            text: t(lang, "saveOffer"),
            onClick: () => {
              const d = api.get().hostDraft;
              api.addOffer({
                kind: d.kind,
                title: `${d.title.trim()} · ${d.photoMood}`,
                story: d.story.trim(),
                priceThb: Number(d.price) || 0,
              });
              api.patch({
                hostScreen: "home",
                hostWizardStep: 1,
                hostDraft: {
                  kind: "experience",
                  title: "",
                  story: "",
                  price: "500",
                  photoMood: "River morning",
                },
              });
            },
          }),
        ]),
      );
    }

    root.append(el("div", { className: "host-panel fade-in" }, kids));
    return;
  }

  // home
  const homeKids = [
    el("div", { className: "host-tabs" }, [
      el("button", {
        type: "button",
        className: "btn btn-secondary is-tab-active",
        text: t(lang, "hostHome"),
      }),
      el("button", {
        type: "button",
        className: "btn btn-ghost",
        text: t(lang, "hostInbox"),
        onClick: () => api.setHostScreen("inbox"),
      }),
    ]),
    el("div", { className: "host-hero" }, [
      demoMedia(data.media.hostHero, "host-hero__media"),
      el("div", { className: "host-hero__copy" }, [
        el("h1", { text: t(lang, "hostTitle") }),
        el("p", { className: "muted", text: t(lang, "hostEmpty") }),
        el("button", {
          type: "button",
          className: "btn",
          text: t(lang, "startOffer"),
          onClick: () => api.patch({ hostWizardStep: 1, hostScreen: "wizard" }),
        }),
      ]),
    ]),
  ];

  if (s.offers.length) {
    homeKids.push(
      el("section", { className: "card host-list" }, [
        el("h2", { text: t(lang, "myOffers") }),
        el(
          "ul",
          {},
          s.offers.map((o) =>
            el("li", {}, [
              el("strong", { text: o.title }),
              el("span", { className: "muted", text: ` · ${o.kind} · ${o.priceThb} THB` }),
            ]),
          ),
        ),
        el("button", {
          type: "button",
          className: "btn btn-secondary",
          text: t(lang, "moreTools"),
          onClick: () => api.patch({ showAdvanced: !s.showAdvanced }),
        }),
        s.showAdvanced
          ? el("div", { className: "host-advanced" }, [
              el("article", { className: "card advanced-card" }, [
                el("h3", { text: t(lang, "calendarStub") }),
                el(
                  "div",
                  { className: "cal-grid", "aria-hidden": "true" },
                  Array.from({ length: 14 }, (_, i) =>
                    el("span", {
                      className: i % 3 === 0 ? "is-booked" : "",
                      text: String(i + 1),
                    }),
                  ),
                ),
              ]),
              el("article", { className: "card advanced-card" }, [
                el("h3", { text: t(lang, "seasonalStub") }),
                el("p", {
                  className: "muted",
                  text:
                    lang === "th"
                      ? "ฤดูท่องเที่ยว +15% · นอกฤดู −10% (จำลอง)"
                      : "Peak +15% · Off-peak −10% (Simulated)",
                }),
              ]),
              el("article", { className: "card advanced-card" }, [
                el("h3", { text: t(lang, "analyticsStub") }),
                el("p", {}, [
                  el("strong", { text: "12" }),
                  document.createTextNode(" "),
                  el("span", {
                    className: "muted",
                    text: lang === "th" ? "การดูข้อเสนอ" : "offer views",
                  }),
                ]),
              ]),
            ])
          : null,
      ]),
    );
  }

  homeKids.push(renderHostChainPanel(ctx));

  root.append(el("div", { className: "host-panel fade-in" }, homeKids));
}
