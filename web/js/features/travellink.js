import { t } from "../i18n.js";
import { badge, el } from "../utils.js";
import { flattenProducts } from "./chains.js";

const MONTH_LABELS = {
  en: ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  th: [
    "",
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ],
};

const REGION_LABELS = {
  North: "ภาคเหนือ",
  Northeast: "ภาคอีสาน",
  Central: "ภาคกลาง",
  East: "ภาคตะวันออก",
  West: "ภาคตะวันตก",
  South: "ภาคใต้",
};

function monthName(m, lang) {
  return MONTH_LABELS[lang === "th" ? "th" : "en"][m] || String(m);
}

function regionLabel(region, lang) {
  return lang === "th" ? REGION_LABELS[region] || region : region;
}

function fmtInt(n, lang) {
  return new Intl.NumberFormat(lang === "th" ? "th-TH" : "en-US").format(Math.round(n));
}

function fmtPct(n, lang) {
  if (n === null || n === undefined) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat(lang === "th" ? "th-TH" : "en-US", {
    maximumFractionDigits: 1,
  }).format(n)}%`;
}

function confidenceLabel(lang, key) {
  const map = {
    measured: { en: "Measured", th: "วัดจริง" },
    estimate: { en: "Estimate", th: "ประมาณการ" },
    simulated: { en: "Simulated", th: "จำลอง" },
    demo: { en: "Demo", th: "เดโม" },
  };
  return map[key]?.[lang === "th" ? "th" : "en"] || key;
}

function confidenceChip(lang, key) {
  const kind = key === "measured" || key === "estimate" ? "estimate" : "simulated";
  return badge(confidenceLabel(lang, key), kind);
}

export function findProvince(travellink, id) {
  return (travellink.provinces || []).find((p) => p.id === id) || null;
}

export function countrySummary(travellink) {
  const provinces = travellink.provinces || [];
  const arrivals = provinces.reduce((sum, p) => sum + p.stats.arrivals, 0);
  const revenue = provinces.reduce((sum, p) => sum + p.stats.revenueMillionThb, 0);
  const withYoy = provinces.filter((p) => p.stats.yoyArrivalsPct !== null);
  const avgYoy = withYoy.length
    ? withYoy.reduce((sum, p) => sum + p.stats.yoyArrivalsPct, 0) / withYoy.length
    : null;
  const withOcc = provinces.filter((p) => p.stats.occupancyPct !== null);
  const avgOcc = withOcc.length
    ? withOcc.reduce((sum, p) => sum + p.stats.occupancyPct, 0) / withOcc.length
    : null;
  return { arrivals, revenue, avgYoy, avgOcc, provinceCount: provinces.length };
}

/**
 * Pure heuristic recommendation engine — no external/paid API.
 * Reads Measured Travel Link stats + BAANYARD's own supply-chain catalog and
 * returns ranked BAANYARD product/service recommendations per province.
 */
export function predictProducts(province, supplyChains) {
  const { stats, region, supplyChainId } = province;
  const recs = [];
  const chainRow = supplyChainId
    ? flattenProducts(supplyChains).filter((r) => r.province.id === supplyChainId)
    : [];

  if (stats.intlSharePct >= 35) {
    recs.push({
      id: "intl-tools",
      category: "tools",
      titleEn: "Push translation, video-call & multi-currency tools",
      titleTh: "ดันฟีเจอร์แปลภาษา วิดีโอคอล และหลายสกุลเงิน",
      reasonEn: `International visitors are ${stats.intlSharePct}% of arrivals — high language/payment friction to remove.`,
      reasonTh: `นักท่องเที่ยวต่างชาติคิดเป็น ${stats.intlSharePct}% ของผู้มาเยือน — ควรลดอุปสรรคภาษา/การชำระเงิน`,
      confidence: "estimate",
    });
    if (chainRow.length) {
      recs.push({
        id: "intl-export-chain",
        category: "premiumChains",
        titleEn: "Feature premium export-grade supply chains to visiting buyers",
        titleTh: "ชูสินค้าโซ่อุปทานพรีเมียมสำหรับผู้ซื้อต่างชาติ",
        reasonEn:
          "High international share + an active BAANYARD supply chain here — good fit for forward-purchase / export-style pre-orders.",
        reasonTh: "สัดส่วนต่างชาติสูง และมีโซ่อุปทานของ BAANYARD ในจังหวัดนี้ — เหมาะกับพรีออเดอร์ส่งออก",
        confidence: "simulated",
        chainProductIds: chainRow.map((r) => r.product.id),
      });
    }
  }

  if (stats.domesticSharePct >= 65) {
    recs.push({
      id: "domestic-family",
      category: "experiences",
      titleEn: "Promote family & kids wellness experiences",
      titleTh: "ดันแพ็กเกจครอบครัวและกิจกรรมสุขภาพใจสำหรับเด็ก",
      reasonEn: `Domestic travelers are ${stats.domesticSharePct}% of arrivals — long-weekend family trips are the core segment.`,
      reasonTh: `นักท่องเที่ยวไทยคิดเป็น ${stats.domesticSharePct}% — กลุ่มหลักคือทริปครอบครัวช่วงวันหยุดยาว`,
      confidence: "estimate",
    });
  }

  if (chainRow.length) {
    for (const row of chainRow) {
      const crop = (row.product.crop || "").toLowerCase();
      const isFood = /sato|rice|fish|honey|tea|indigo|cocoa|coffee|silk|herb/i.test(crop);
      if (isFood) {
        recs.push({
          id: `chain-${row.product.id}`,
          category: "premiumChains",
          titleEn: `Highlight "${row.product.name}" pre-order lot`,
          titleTh: `ชูล็อตพรีออเดอร์ "${row.product.nameTh}"`,
          reasonEn:
            "Existing community supply chain here matches food/craft tourism demand signals.",
          reasonTh: "มีโซ่อุปทานชุมชนอยู่แล้ว ตรงกับสัญญาณดีมานด์ท่องเที่ยวเชิงอาหาร/หัตถกรรม",
          confidence: "simulated",
          chainProductIds: [row.product.id],
        });
      }
    }
  }

  if (stats.occupancyPct !== null && stats.occupancyPct >= 75) {
    recs.push({
      id: "stays-capacity",
      category: "stays",
      titleEn: "Recruit more host homestays (supply-constrained)",
      titleTh: "ชวนโฮสต์ที่พักเพิ่ม (อุปทานตึงตัว)",
      reasonEn: `Average occupancy ${stats.occupancyPct}% suggests rooms are tight in peak months.`,
      reasonTh: `อัตราเข้าพักเฉลี่ย ${stats.occupancyPct}% แสดงว่าห้องพักตึงตัวช่วงพีค`,
      confidence: "estimate",
    });
  }

  if (stats.yoyArrivalsPct !== null && stats.yoyArrivalsPct >= 40) {
    recs.push({
      id: "momentum-goods",
      category: "goods",
      titleEn: "Scale up pre-order goods production ahead of demand",
      titleTh: "เร่งกำลังผลิตสินค้าพรีออเดอร์รับดีมานด์ที่กำลังมา",
      reasonEn: `Arrivals grew ${fmtPct(stats.yoyArrivalsPct, "en")} YoY — momentum play for goods & premium chains.`,
      reasonTh: `จำนวนผู้มาเยือนโต ${fmtPct(stats.yoyArrivalsPct, "th")} เทียบปีก่อน — จังหวะเร่งสินค้าและโซ่อุปทาน`,
      confidence: "estimate",
    });
  } else if (stats.yoyArrivalsPct !== null && stats.yoyArrivalsPct < 0) {
    recs.push({
      id: "recovery-bundle",
      category: "experiences",
      titleEn: "Run a recovery story bundle (stay + experience discount)",
      titleTh: "ทำแพ็กเกจฟื้นฟู (ที่พัก + ประสบการณ์ ลดราคา)",
      reasonEn: `Arrivals fell ${fmtPct(stats.yoyArrivalsPct, "en")} YoY — bundle stories & discounts to rebuild draw.`,
      reasonTh: `จำนวนผู้มาเยือนลดลง ${fmtPct(stats.yoyArrivalsPct, "th")} — ควรทำแพ็กเกจเล่าเรื่องพร้อมส่วนลด`,
      confidence: "estimate",
    });
  }

  if (!chainRow.length) {
    const regionRules = {
      North: {
        en: "Coffee, tea & textile micro-lot experiences fit this region's crops.",
        th: "กาแฟ ชา และผ้าทอ เข้ากับพืชเศรษฐกิจภาคเหนือ",
      },
      Northeast: {
        en: "Sticky rice, fermented foods & silk weaving fit Isan's craft strengths.",
        th: "ข้าวเหนียว อาหารหมัก และผ้าไหม เข้ากับจุดแข็งงานฝีมืออีสาน",
      },
      South: {
        en: "Seafood trails & wellness/spa stays fit coastal demand.",
        th: "ทริปอาหารทะเลและที่พักเชิงสุขภาพ/สปา เข้ากับดีมานด์ชายฝั่ง",
      },
      Central: {
        en: "Day-trip market goods & river-town stays fit central-plain access.",
        th: "สินค้าตลาดทริปวันเดียวและที่พักริมน้ำ เข้ากับทำเลภาคกลาง",
      },
      East: {
        en: "Beach + family short-break bundles fit eastern-seaboard access.",
        th: "แพ็กเกจชายหาดสำหรับครอบครัวระยะสั้น เข้ากับพื้นที่ชายฝั่งตะวันออก",
      },
      West: {
        en: "River & nature retreat stays fit western forest-edge geography.",
        th: "ที่พักริมน้ำและธรรมชาติ เข้ากับภูมิประเทศชายป่าภาคตะวันตก",
      },
    };
    const rule = regionRules[region];
    if (rule) {
      recs.push({
        id: "region-fallback",
        category: "goods",
        titleEn: "Seed a starter goods/experience listing for this province",
        titleTh: "เริ่มลงสินค้า/ประสบการณ์นำร่องสำหรับจังหวัดนี้",
        reasonEn: `No BAANYARD supply chain here yet. ${rule.en}`,
        reasonTh: `ยังไม่มีโซ่อุปทาน BAANYARD ในจังหวัดนี้ ${rule.th}`,
        confidence: "demo",
      });
    }
  }

  return recs;
}

function statCard(labelEn, labelTh, value, lang) {
  return el("article", { className: "card kpi" }, [
    el("span", { text: lang === "th" ? labelTh : labelEn }),
    el("strong", { text: value }),
  ]);
}

function provinceRow(province, lang, onSelect) {
  const s = province.stats;
  return el(
    "button",
    { type: "button", className: "tl-province-row", onClick: () => onSelect(province.id) },
    [
      el("span", { className: "tl-province-row__name" }, [
        el("strong", { text: lang === "th" ? province.nameTh : province.name }),
        el("span", { className: "muted tiny", text: regionLabel(province.region, lang) }),
      ]),
      el("span", { className: "tl-province-row__stat", text: fmtInt(s.arrivals, lang) }),
      el("span", {
        className: `tl-province-row__stat ${s.yoyArrivalsPct >= 0 ? "is-up" : "is-down"}`,
        text: fmtPct(s.yoyArrivalsPct, lang),
      }),
      province.supplyChainId ? badge(t(lang, "simulated")) : null,
    ],
  );
}

function predictionCard(rec, lang) {
  return el("li", { className: "tl-prediction-card" }, [
    el("div", { className: "row-between" }, [
      el("strong", { text: lang === "th" ? rec.titleTh : rec.titleEn }),
      confidenceChip(lang, rec.confidence),
    ]),
    el("p", { className: "muted", text: lang === "th" ? rec.reasonTh : rec.reasonEn }),
  ]);
}

function provinceDetail(province, lang, ctx, onBack) {
  const { data } = ctx;
  const s = province.stats;
  const recs = predictProducts(province, data.supplyChains);

  return el("section", { className: "card admin-block tl-detail" }, [
    el("button", {
      type: "button",
      className: "btn btn-ghost",
      text: `← ${t(lang, "travellinkAllProvinces")}`,
      onClick: onBack,
    }),
    el("div", { className: "row-between" }, [
      el("h2", { text: lang === "th" ? province.nameTh : province.name }),
      el("span", { className: "muted tiny", text: regionLabel(province.region, lang) }),
    ]),
    el("div", { className: "kpi-cards" }, [
      statCard("Arrivals (12mo)", "ผู้มาเยือน (12 เดือน)", fmtInt(s.arrivals, lang), lang),
      statCard(
        "Revenue (M THB)",
        "รายได้ (ล้านบาท)",
        new Intl.NumberFormat(lang === "th" ? "th-TH" : "en-US").format(s.revenueMillionThb),
        lang,
      ),
      statCard("YoY arrivals", "โตเทียบปีก่อน", fmtPct(s.yoyArrivalsPct, lang), lang),
      statCard(
        "Occupancy",
        "อัตราเข้าพัก",
        s.occupancyPct === null ? "—" : `${s.occupancyPct}%`,
        lang,
      ),
    ]),
    el("div", { className: "tl-segment" }, [
      el("span", { className: "tl-segment__bar" }, [
        el("span", {
          className: "tl-segment__fill tl-segment__fill--domestic",
          style: { width: `${s.domesticSharePct}%` },
        }),
      ]),
      el("span", {
        className: "muted tiny",
        text:
          lang === "th"
            ? `ไทย ${s.domesticSharePct}% · ต่างชาติ ${s.intlSharePct}%`
            : `Domestic ${s.domesticSharePct}% · International ${s.intlSharePct}%`,
      }),
    ]),
    el("p", { className: "muted tiny" }, [
      document.createTextNode(
        lang === "th"
          ? `ฤดูกาลพีค (เฉลี่ยย้อนหลัง): ${s.topSeasonMonths.map((m) => monthName(m, lang)).join(", ")}`
          : `Peak season (historical avg): ${s.topSeasonMonths.map((m) => monthName(m, lang)).join(", ")}`,
      ),
      document.createTextNode(" "),
      confidenceChip(lang, "measured"),
    ]),
    el("h3", { text: t(lang, "travellinkPredictionsTitle") }),
    recs.length
      ? el("ul", { className: "tl-prediction-list" }, recs.map((r) => predictionCard(r, lang)))
      : el("p", { className: "muted", text: t(lang, "travellinkNoPredictions") }),
  ]);
}

export function renderTravelLinkPanel(ctx) {
  const { data, api } = ctx;
  const s = api.get();
  const lang = api.uiLang();
  const travellink = data.travellink;
  if (!travellink) return null;

  const selectedId = s.travelLinkProvinceId;
  const selected = selectedId ? findProvince(travellink, selectedId) : null;

  if (selected) {
    return el("div", { className: "tl-wrap" }, [
      provinceDetail(selected, lang, ctx, () => api.setTravelLinkProvince(null)),
    ]);
  }

  const summary = countrySummary(travellink);

  return el("section", { className: "card admin-block tl-panel" }, [
    el("div", { className: "row-between" }, [
      el("h2", { text: t(lang, "travellinkTitle") }),
      confidenceChip(lang, "measured"),
    ]),
    el("p", { className: "muted", text: t(lang, "travellinkSourceNote") }),
    el("p", { className: "muted tiny" }, [
      document.createTextNode(
        lang === "th"
          ? `แหล่งข้อมูล: Travel Link (MOTS/BDI) · ช่วงข้อมูลล่าสุด ${travellink.provinces[0]?.period.currentFrom}–${travellink.provinces[0]?.period.currentTo}`
          : `Source: Travel Link (MOTS/BDI) · latest window ${travellink.provinces[0]?.period.currentFrom}–${travellink.provinces[0]?.period.currentTo}`,
      ),
      document.createTextNode(" "),
      el("a", {
        href: travellink.source,
        target: "_blank",
        rel: "noopener noreferrer",
        text: "travellink.go.th",
      }),
    ]),
    el("div", { className: "kpi-cards" }, [
      statCard(
        "Total arrivals (12mo)",
        "ผู้มาเยือนรวม (12 เดือน)",
        fmtInt(summary.arrivals, lang),
        lang,
      ),
      statCard("Total revenue (M THB)", "รายได้รวม (ล้านบาท)", fmtInt(summary.revenue, lang), lang),
      statCard("Avg YoY arrivals", "โตเฉลี่ยเทียบปีก่อน", fmtPct(summary.avgYoy, lang), lang),
      statCard(
        "Avg occupancy",
        "อัตราเข้าพักเฉลี่ย",
        summary.avgOcc === null ? "—" : `${summary.avgOcc.toFixed(1)}%`,
        lang,
      ),
    ]),
    el("h3", { text: t(lang, "travellinkTopProvinces") }),
    el(
      "div",
      { className: "tl-province-list" },
      travellink.provinces.map((p) => provinceRow(p, lang, (id) => api.setTravelLinkProvince(id))),
    ),
  ]);
}
