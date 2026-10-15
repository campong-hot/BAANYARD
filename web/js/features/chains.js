import { t } from "../i18n.js";
import { enhanceHorizontalScroller } from "../hscroll.js";
import { badge, chainImage, chainVideo, demoMedia, el, formatMoney } from "../utils.js";

export const STATUS_FLOW = [
  "open",
  "funded",
  "growing",
  "processing",
  "packing",
  "retail",
  "settled",
];

const ROLE_KEYS = {
  grower: "chainRoleGrower",
  processor: "chainRoleProcessor",
  packager: "chainRolePackager",
  investor: "chainRoleInvestor",
  retail: "chainRoleRetail",
  guardian: "chainRoleGuardian",
};

export function flattenProducts(supply) {
  const rows = [];
  for (const province of supply.provinces || []) {
    for (const product of province.products || []) {
      rows.push({ province, product });
    }
  }
  return rows;
}

export function findChainRow(supply, productId) {
  return flattenProducts(supply).find((row) => row.product.id === productId) || null;
}

export function effectiveStatus(product, overrides) {
  return overrides?.[product.id] || product.status;
}

export function nextStatus(status) {
  const i = STATUS_FLOW.indexOf(status);
  if (i < 0 || i >= STATUS_FLOW.length - 1) return status;
  return STATUS_FLOW[i + 1];
}

export function statusLabel(status, lang) {
  const key = `chainStatus_${status}`;
  return t(lang, key);
}

function nodeName(node, lang) {
  return lang === "th" ? node.nameTh : node.name;
}

function productName(product, lang) {
  return lang === "th" ? product.nameTh : product.name;
}

function provinceTitle(province, lang) {
  const main = lang === "th" ? province.nameTh : province.name;
  const local = lang === "th" ? province.localNameTh : province.localName;
  return local ? `${main} · ${local}` : main;
}

export function chainDisclaimer(supply, lang) {
  return lang === "th" ? supply.disclaimerTh : supply.disclaimerEn;
}

export function renderChainCard(row, lang, currency, rates, status, onOpen, media) {
  const { province, product } = row;
  const src = product.image || chainImage(media, product.id);
  const crop = lang === "th" ? product.cropTh : product.crop;
  const mediaWrap = demoMedia(src, "chain-card__media listing-card__media", {
    alt: crop,
    video: chainVideo(media, product.id),
  });
  mediaWrap.append(el("span", { className: "chain-card__crop", text: crop }));
  return el(
    "button",
    { type: "button", className: "listing-card chain-card", onClick: () => onOpen(product.id) },
    [
      mediaWrap,
      el("div", { className: "listing-card__body" }, [
        el("span", { className: "chip chip-sage", text: statusLabel(status, lang) }),
        el("strong", { text: productName(product, lang) }),
        el("span", { className: "muted", text: provinceTitle(province, lang) }),
        el("span", { className: "muted", text: formatMoney(product.preOrderAmount, currency, lang, rates) }),
      ]),
    ],
  );
}

export function mountChainScrollers(root, lang) {
  const cleanups = [];
  root.querySelectorAll("[data-hscroll-chain]").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    cleanups.push(enhanceHorizontalScroller(node, { label: t(lang, "chainSection") }));
  });
  return cleanups;
}

export function renderChainExplore(ctx) {
  const { data, api } = ctx;
  const s = api.get();
  const lang = api.uiLang();
  const rates = data.fx.rates;
  const supply = data.supplyChains;
  const rows = flattenProducts(supply);
  const filter = s.exploreFilter || "all";
  const showOnly = filter === "chain";

  const kids = [
    el("div", { className: "row-between chain-section-head" }, [
      el("h2", { text: t(lang, "chainSection") }),
    ]),
    el("p", { className: "muted", text: t(lang, "chainExploreSub") }),
    el("p", { className: "muted tiny", text: chainDisclaimer(supply, lang) }),
  ];

  if (showOnly) {
    kids.push(
      ...supply.provinces.map((province) =>
        el("div", { className: "chain-province" }, [
          el("h3", { text: provinceTitle(province, lang) }),
          el(
            "div",
            { className: "h-scroll h-scroll--listings", dataset: { hscrollChain: province.id } },
            province.products.map((product) =>
              renderChainCard(
                { province, product },
                lang,
                s.currency,
                rates,
                effectiveStatus(product, s.chainStatus),
                (id) => api.openChain(id),
                data.media,
              ),
            ),
          ),
        ]),
      ),
    );
  } else {
    kids.push(
      el(
        "div",
        { className: "h-scroll h-scroll--listings", dataset: { hscrollChain: "preview" } },
        rows.map((row) =>
          renderChainCard(
            row,
            lang,
            s.currency,
            rates,
            effectiveStatus(row.product, s.chainStatus),
            (id) => api.openChain(id),
            data.media,
          ),
        ),
      ),
    );
  }

  return el("section", { className: "guest-section chain-explore" }, kids);
}

function flowStepClass(role, status) {
  const map = {
    grower: ["open", "funded", "growing"],
    processor: ["processing"],
    packager: ["packing"],
    investor: ["open", "funded", "settled"],
    retail: ["retail", "settled"],
    guardian: STATUS_FLOW,
  };
  const active = map[role] || [];
  return active.includes(status) ? "is-current" : "";
}

export function renderChainDetail(root, ctx) {
  const { data, api } = ctx;
  const s = api.get();
  const lang = api.uiLang();
  const rates = data.fx.rates;
  const row = findChainRow(data.supplyChains, s.selectedChainId);
  if (!row) return;
  const { province, product } = row;
  const status = effectiveStatus(product, s.chainStatus);
  const booked = Boolean(s.chainBookings?.[product.id]);

  const flow = el(
    "ol",
    { className: "chain-flow h-scroll", dataset: { hscrollChain: "flow" } },
    product.nodes.map((node) =>
      el("li", { className: `chain-flow__step ${flowStepClass(node.role, status)}` }, [
        el("span", { className: "chain-flow__role", text: t(lang, ROLE_KEYS[node.role] || "chainRoleGrower") }),
        el("strong", { text: nodeName(node, lang) }),
      ]),
    ),
  );

  const split = el("div", { className: "chain-split" }, [
    el("h3", { text: t(lang, "chainProfitSplit") }),
    el("ul", { className: "chain-split__bars" }, [
      ["farmerShare", "chainRoleGrower"],
      ["processorShare", "chainRoleProcessor"],
      ["packagerShare", "chainRolePackager"],
      ["investorShare", "chainRoleInvestor"],
    ].map(([field, key]) =>
      el("li", {}, [
        el("span", { text: `${t(lang, key)} ${product[field]}%` }),
        el("span", {
          className: "chain-split__bar",
          style: { width: `${product[field]}%` },
          "aria-hidden": "true",
        }),
      ]),
    )),
    el("p", { className: "muted tiny", text: t(lang, "chainSplitNote") }),
  ]);

  root.append(
    el("div", { className: "guest-panel fade-in chain-detail" }, [
      el("button", {
        type: "button",
        className: "btn btn-ghost",
        text: `← ${t(lang, "back")}`,
        onClick: () => api.setGuestScreen("explore"),
      }),
      badge(t(lang, "simulated")),
      demoMedia(
        product.image || chainImage(data.media, product.id),
        "listing-hero-media chain-detail__hero",
        {
          alt: lang === "th" ? product.cropTh : product.crop,
          video: chainVideo(data.media, product.id),
          eager: true,
        },
      ),
      el("div", { className: "tag-row" }, [
        el("p", { className: "chip", text: provinceTitle(province, lang) }),
        product.kinshipCharter ? el("span", { className: "chip chip-sage", text: t(lang, "chainKinshipBadge") }) : null,
      ]),
      el("h1", { text: productName(product, lang) }),
      el("p", { className: "muted", text: lang === "th" ? product.cropTh : product.crop }),
      el("p", { className: "chip chip-sage", text: statusLabel(status, lang) }),
      el("p", { className: "listing-desc", text: lang === "th" ? product.storyTh : product.story }),
      el("p", {
        className: "price",
        text: formatMoney(product.preOrderAmount, s.currency, lang, rates),
      }),
      el("section", { className: "card chain-flow-card" }, [
        el("h2", { text: t(lang, "chainFlowTitle") }),
        flow,
      ]),
      el("section", { className: "card" }, [
        el("h2", { text: t(lang, "chainCalendar") }),
        el(
          "ol",
          { className: "chain-cal" },
          product.timeline.map((slot) =>
            el("li", {}, [
              el("strong", { text: lang === "th" ? slot.labelTh : slot.label }),
              el("span", { className: "muted", text: slot.date }),
            ]),
          ),
        ),
      ]),
      el("section", { className: "card" }, [split]),
      product.certifiedBy
        ? el("section", { className: "card chain-cert-card" }, [
            el("h3", { text: t(lang, "chainCertifiedTitle") }),
            el("p", { text: lang === "th" ? product.certifiedByTh || product.certifiedBy : product.certifiedBy }),
            el("p", { className: "muted tiny", text: t(lang, "chainCertifiedNote") }),
          ])
        : null,
      product.passportOrigin
        ? el("section", { className: "card chain-passport-card" }, [
            el("h3", { text: t(lang, "chainPassportTitle") }),
            el("dl", { className: "chain-passport__list" }, [
              el("dt", { text: t(lang, "chainPassportOrigin") }),
              el("dd", { text: lang === "th" ? product.passportOriginTh || product.passportOrigin : product.passportOrigin }),
              el("dt", { text: t(lang, "chainPassportProcess") }),
              el("dd", { text: lang === "th" ? product.passportProcessTh || product.passportProcess : product.passportProcess }),
              el("dt", { text: t(lang, "chainPassportImpact") }),
              el("dd", { text: lang === "th" ? product.passportImpactTh || product.passportImpact : product.passportImpact }),
            ]),
            el("p", { className: "muted tiny", text: t(lang, "chainPassportNote") }),
          ])
        : null,
      el("p", { className: "muted tiny", text: chainDisclaimer(data.supplyChains, lang) }),
      el("div", { className: "cta-row" }, [
        el("button", {
          type: "button",
          className: "btn",
          text: booked ? t(lang, "chainBooked") : t(lang, "chainCta"),
          disabled: booked || status === "settled" ? true : null,
          onClick: () => {
            if (booked || status === "settled") return;
            api.setGuestScreen("chainConfirm");
          },
        }),
      ]),
    ]),
  );
}

export function renderChainConfirm(root, ctx) {
  const { data, api } = ctx;
  const s = api.get();
  const lang = api.uiLang();
  const rates = data.fx.rates;
  const row = findChainRow(data.supplyChains, s.selectedChainId);
  if (!row) return;
  const { product } = row;

  root.append(
    el("div", { className: "guest-panel fade-in" }, [
      el("button", {
        type: "button",
        className: "btn btn-ghost",
        text: `← ${t(lang, "back")}`,
        onClick: () => api.setGuestScreen("chain"),
      }),
      badge(t(lang, "simulated")),
      el("h1", { text: t(lang, "chainConfirmTitle") }),
      el("p", { text: productName(product, lang) }),
      el("p", {
        className: "price",
        text: formatMoney(product.preOrderAmount, s.currency, lang, rates),
      }),
      el("p", { className: "muted", text: t(lang, "chainConfirmBody") }),
      el("p", { className: "muted tiny", text: chainDisclaimer(data.supplyChains, lang) }),
      el("button", {
        type: "button",
        className: "btn",
        text: t(lang, "chainConfirmCta"),
        onClick: () => {
          api.bookChain(product.id, product.status);
          api.setGuestScreen("chainSuccess");
        },
      }),
    ]),
  );
}

export function renderChainSuccess(root, ctx) {
  const { data, api } = ctx;
  const s = api.get();
  const lang = api.uiLang();
  const row = findChainRow(data.supplyChains, s.selectedChainId);
  const timeline = row?.product.timeline || [];

  root.append(
    el("div", { className: "guest-panel success-pop" }, [
      badge(t(lang, "simulated")),
      el("h1", { text: t(lang, "chainSuccessTitle") }),
      el("p", { text: t(lang, "chainSuccessBody") }),
      timeline.length
        ? el(
            "ol",
            { className: "chain-cal" },
            timeline.map((slot) =>
              el("li", {}, [
                el("strong", { text: lang === "th" ? slot.labelTh : slot.label }),
                el("span", { className: "muted", text: slot.date }),
              ]),
            ),
          )
        : null,
      el("p", { className: "muted tiny", text: chainDisclaimer(data.supplyChains, lang) }),
      el("button", {
        type: "button",
        className: "btn",
        text: t(lang, "continueExplore"),
        onClick: () => api.setGuestScreen("explore"),
      }),
    ]),
  );
}

export function renderHostChainPanel(ctx) {
  const { data, api } = ctx;
  const s = api.get();
  const lang = api.uiLang();
  const rows = flattenProducts(data.supplyChains);

  return el("section", { className: "card host-list chain-host" }, [
    el("div", { className: "row-between" }, [
      el("h2", { text: t(lang, "chainHostTitle") }),
    ]),
    el("p", { className: "muted", text: t(lang, "chainHostHint") }),
    el(
      "ul",
      { className: "chain-admin-list" },
      rows.map(({ province, product }) =>
        el("li", {}, [
          el("strong", { text: productName(product, lang) }),
          el("span", {
            className: "muted",
            text: ` · ${provinceTitle(province, lang)} · ${statusLabel(effectiveStatus(product, s.chainStatus), lang)}`,
          }),
        ]),
      ),
    ),
    el("p", { className: "muted tiny", text: chainDisclaimer(data.supplyChains, lang) }),
  ]);
}

export function renderAdminChainPanel(ctx) {
  const { data, api } = ctx;
  const s = api.get();
  const lang = api.uiLang();
  const rows = flattenProducts(data.supplyChains);

  return el("section", { className: "card admin-block chain-admin" }, [
    el("div", { className: "row-between" }, [
      el("h2", { text: t(lang, "chainAdminTitle") }),
    ]),
    el("p", { className: "muted", text: t(lang, "chainAdminHint") }),
    el(
      "div",
      { className: "audit-table-wrap" },
      el("table", { className: "audit-table" }, [
        el("thead", {}, [
          el("tr", {}, [
            el("th", { text: t(lang, "chainColProduct") }),
            el("th", { text: t(lang, "chainColProvince") }),
            el("th", { text: t(lang, "chainColStatus") }),
            el("th", { text: t(lang, "chainColAction") }),
          ]),
        ]),
        el(
          "tbody",
          {},
          rows.map(({ province, product }) => {
            const status = effectiveStatus(product, s.chainStatus);
            return el("tr", {}, [
              el("td", { text: productName(product, lang) }),
              el("td", { text: lang === "th" ? province.nameTh : province.name }),
              el("td", { text: statusLabel(status, lang) }),
              el("td", {}, [
                el("button", {
                  type: "button",
                  className: "btn btn-secondary chain-sync-btn",
                  text: t(lang, "chainSettleSync"),
                  disabled: status === "settled" ? true : null,
                  onClick: () => api.advanceChain(product.id, product.status),
                }),
              ]),
            ]);
          }),
        ),
      ]),
    ),
    el("p", {
      className: "muted tiny",
      text: `${t(lang, "chainSettleNote")} · ${s.chainSettleNote || t(lang, "chainSettleIdle")}`,
    }),
    el("p", { className: "muted tiny", text: chainDisclaimer(data.supplyChains, lang) }),
  ]);
}
