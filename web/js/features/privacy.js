import { t } from "../i18n.js";
import { el } from "../utils.js";

export function renderPrivacy(root, ctx) {
  const { api } = ctx;
  const s = api.get();
  const lang = api.uiLang();

  const consentCb = el("input", { type: "checkbox" });
  consentCb.checked = s.marketingConsent;
  consentCb.addEventListener("change", (e) => api.setMarketingConsent(e.target.checked));

  root.append(
    el("div", { className: "privacy-panel fade-in" }, [
      el("button", {
        type: "button",
        className: "btn btn-ghost",
        text: `← ${t(lang, "back")}`,
        onClick: () => {
          api.closePrivacy();
          api.setGuestScreen(s.sessionUser ? "explore" : "splash");
        },
      }),
      el("h1", { text: t(lang, "privacy") }),
      el("p", {
        className: "muted",
        text:
          lang === "th"
            ? "Privacy by Design & Default · ความยินยอมการตลาดปิดเป็นค่าเริ่มต้น หน้าจอนี้เป็น UX คอมพลายแอนซ์จำลอง — ไม่ใช่ใบรับรองทางกฎหมาย"
            : "Privacy by Design & Default. Marketing consent defaults off. This screen is a Simulated compliance UX — not a legal certification.",
      }),
      el("section", { className: "card privacy-block" }, [
        el("h2", {
          text: lang === "th" ? "ความยินยอมและฐานทางกฎหมาย" : "Consent & lawful basis",
        }),
        el("p", {
          text:
            lang === "th"
              ? "เราประมวลผลข้อมูลการจองและข้อความเพื่อให้บริการได้ การตลาดทางเลือกต้องได้รับความยินยอม"
              : "We process booking and messaging data to provide the service. Optional marketing requires your opt-in.",
        }),
        el("ul", { className: "lawful-list" }, [
          el("li", {
            text:
              lang === "th"
                ? "สัญญา / การให้บริการ — การจอง แชท การชำระเงินจำลอง"
                : "Contract / service delivery — bookings, chat, mock payments",
          }),
          el("li", {
            text:
              lang === "th"
                ? "ความยินยอม — การตลาด (ค่าเริ่มต้นปิด)"
                : "Consent — marketing (default off)",
          }),
          el("li", {
            text:
              lang === "th"
                ? "ประโยชน์โดยชอบด้วยกฎหมาย — ความปลอดภัยและการป้องกันการฉ้อโกง"
                : "Legitimate interest — safety & fraud prevention",
          }),
        ]),
        el("label", { className: "check" }, [
          consentCb,
          document.createTextNode(t(lang, "marketingConsent")),
        ]),
      ]),
      el("section", { className: "card privacy-block" }, [
        el("h2", { text: t(lang, "roadmap") }),
        el("ul", {}, [
          el("li", { text: "PDPA (Thailand) — consent & data subject rights" }),
          el("li", { text: "GDPR (EU) — lawful basis & DSR flows" }),
          el("li", {
            text: "ISO 27001 — access, logging, encryption-in-transit (HTTPS assumption)",
          }),
          el("li", { text: "ISO 27701 — privacy ISMS companion" }),
          el("li", { text: "SOC 2 — trust principles checklist" }),
          el("li", {
            text: "Privacy by Design & Default (PbD) — defaults, minimization, progressive disclosure",
          }),
        ]),
        el("p", {
          className: "muted",
          text:
            lang === "th"
              ? "ออกแบบเพื่อ / แผนงานมุ่งสู่ — ยังไม่ผ่านรับรอง ไม่มีป้าย certified ปลอม"
              : "Designed for / Roadmap toward — not certified. No fake certified badges.",
        }),
      ]),
      el("section", { className: "card privacy-block kinship-charter" }, [
        el("h2", { text: t(lang, "kinshipCharterTitle") }),
        el("p", { text: t(lang, "kinshipCharterIntro") }),
        el("ul", {}, [
          el("li", { text: t(lang, "kinshipCharterFair") }),
          el("li", { text: t(lang, "kinshipCharterSafe") }),
          el("li", { text: t(lang, "kinshipCharterSustain") }),
        ]),
        el("h3", { text: t(lang, "kinshipGuardiansTitle") }),
        el("p", { className: "muted", text: t(lang, "kinshipGuardiansBody") }),
        el("h3", { text: t(lang, "kinshipPartnersTitle") }),
        el("p", { className: "muted", text: t(lang, "kinshipPartnersBody") }),
      ]),
      el("section", { className: "card privacy-block" }, [
        el("h2", {
          text: lang === "th" ? "ข้อมูลการท่องเที่ยวรายจังหวัด" : "Province tourism statistics",
        }),
        el("p", {
          text:
            lang === "th"
              ? "แดชบอร์ด Travel Link ในแอดมินใช้ข้อมูลสถิติรวมระดับจังหวัด (ผู้มาเยือน รายได้ อัตราเข้าพัก) จากชุดข้อมูลเปิดของ MOTS Travel Link (สาธารณะ) เท่านั้น — ไม่มีข้อมูลส่วนบุคคลของนักท่องเที่ยวรายคน"
              : "The admin's Travel Link dashboard uses only aggregate, province-level tourism statistics (arrivals, revenue, occupancy) from the public MOTS Travel Link open dataset — no individual traveler personal data is collected or shown.",
        }),
      ]),
      el("section", { className: "card privacy-block" }, [
        el("h2", {
          text: lang === "th" ? "คำขอของเจ้าของข้อมูล" : "Data subject requests",
        }),
        el("div", { className: "cta-row" }, [
          el("button", {
            type: "button",
            className: "btn btn-secondary",
            text: t(lang, "dsrAccess"),
            onClick: () => api.addDsr("access"),
          }),
          el("button", {
            type: "button",
            className: "btn btn-secondary",
            text: t(lang, "dsrDelete"),
            onClick: () => api.addDsr("delete"),
          }),
        ]),
        s.dsrRequests.length === 0
          ? el("p", {
              className: "muted",
              text: lang === "th" ? "ยังไม่มีคำขอ" : "No requests yet.",
            })
          : el(
              "ul",
              {},
              s.dsrRequests.map((r) =>
                el("li", { text: `${r.type} · ${r.status} · ${r.createdAt}` }),
              ),
            ),
      ]),
    ]),
  );
}
