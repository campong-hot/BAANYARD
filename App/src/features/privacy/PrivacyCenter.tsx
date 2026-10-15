import { Badge } from "../../components/Badge";
import { t } from "../../i18n";
import { useAppState } from "../../state/AppState";
import "./PrivacyCenter.css";

type Props = { onBack: () => void };

export function PrivacyCenter({ onBack }: Props) {
  const { uiLang, dsrRequests, addDsr, marketingConsent, setMarketingConsent } = useAppState();

  return (
    <div className="privacy-panel fade-in">
      <button type="button" className="btn btn-ghost" onClick={onBack}>
        ← {t(uiLang, "back")}
      </button>
      <Badge label={t(uiLang, "demo")} />
      <h1>{t(uiLang, "privacy")}</h1>
      <p className="muted">
        {uiLang === "th"
          ? "Privacy by Design & Default (เดโม) ความยินยอมการตลาดปิดเป็นค่าเริ่มต้น หน้าจอนี้เป็น UX คอมไพล์라이언ซ์จำลอง — ไม่ใช่ใบรับรองทางกฎหมาย"
          : "Privacy by Design & Default (Demo). Marketing consent defaults off. This screen is a Simulated compliance UX — not a legal certification."}
      </p>

      <section className="card privacy-block">
        <h2>
          {uiLang === "th" ? "ความยินยอมและฐานทางกฎหมาย" : "Consent & lawful basis"}
        </h2>
        <p>
          {uiLang === "th"
            ? "เราประมวลผลข้อมูลการจองและข้อความเพื่อให้บริการได้ การตลาดทางเลือกต้องได้รับความยินยอม"
            : "We process booking and messaging data to provide the service. Optional marketing requires your opt-in."}
        </p>
        <ul className="lawful-list">
          <li>
            {uiLang === "th"
              ? "สัญญา / การให้บริการ — การจอง แชท การชำระเงินจำลอง"
              : "Contract / service delivery — bookings, chat, mock payments"}
          </li>
          <li>
            {uiLang === "th"
              ? "ความยินยอม — การตลาด (ค่าเริ่มต้นปิด)"
              : "Consent — marketing (default off)"}
          </li>
          <li>
            {uiLang === "th"
              ? "ประโยชน์โดยชอบด้วยกฎหมาย — ความปลอดภัยและการป้องกันการฉ้อโกง (เดโม)"
              : "Legitimate interest — safety & fraud prevention (Demo notes)"}
          </li>
        </ul>
        <label className="check">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
          />
          {t(uiLang, "marketingConsent")}
        </label>
      </section>

      <section className="card privacy-block">
        <h2>{t(uiLang, "roadmap")}</h2>
        <ul>
          <li>PDPA (Thailand) — consent & data subject rights</li>
          <li>GDPR (EU) — lawful basis & DSR flows</li>
          <li>ISO 27001 — access, logging, encryption-in-transit (HTTPS assumption)</li>
          <li>ISO 27701 — privacy ISMS companion</li>
          <li>SOC 2 — trust principles checklist</li>
          <li>Privacy by Design & Default (PbD) — defaults, minimization, progressive disclosure</li>
        </ul>
        <p className="muted">
          {uiLang === "th"
            ? "ออกแบบเพื่อ / แผนงานมุ่งสู่ — ยังไม่ผ่านรับรอง ไม่มีป้าย certified ปลอม"
            : "Designed for / Roadmap toward — not certified. No fake certified badges."}
        </p>
      </section>

      <section className="card privacy-block">
        <h2>
          {uiLang === "th" ? "คำขอของเจ้าของข้อมูล (เดโม)" : "Data subject requests (Demo)"}
        </h2>
        <div className="cta-row">
          <button type="button" className="btn btn-secondary" onClick={() => addDsr("access")}>
            {t(uiLang, "dsrAccess")}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => addDsr("delete")}>
            {t(uiLang, "dsrDelete")}
          </button>
        </div>
        {dsrRequests.length === 0 ? (
          <p className="muted">
            {uiLang === "th" ? "ยังไม่มีคำขอ" : "No requests yet."}
          </p>
        ) : (
          <ul>
            {dsrRequests.map((r) => (
              <li key={r.id}>
                {r.type} · {r.status} · {r.createdAt}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
