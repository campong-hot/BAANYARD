import { useState } from "react";
import { Badge } from "../../components/Badge";
import { auditRows, branchKpis, hqRollupKpis, thCountryKpis } from "../../data/admin";
import type { AdminKpis } from "../../data/types";
import { t } from "../../i18n";
import { useAppState } from "../../state/AppState";
import { AdminChainPanel } from "../chains/ChainPanels";
import "./AdminApp.css";

function KpiGrid({ kpis, label }: { kpis: AdminKpis; label: string }) {
  const { uiLang } = useAppState();
  return (
    <section className="kpi-grid">
      <div className="row-between">
        <h2>{label}</h2>
        <Badge kind="estimate" label={t(uiLang, "estimate")} />
      </div>
      <div className="kpi-cards">
        <article className="card kpi">
          <span>Listings</span>
          <strong>{kpis.listings}</strong>
        </article>
        <article className="card kpi">
          <span>Bookings</span>
          <strong>{kpis.bookings}</strong>
        </article>
        <article className="card kpi">
          <span>GMV (THB)</span>
          <strong>{kpis.gmvThb.toLocaleString()}</strong>
        </article>
        <article className="card kpi">
          <span>Open issues</span>
          <strong>{kpis.openIssues}</strong>
        </article>
      </div>
      <p className="muted tiny">
        Figures are Simulated / Estimate for investor demo — not measured traction.
      </p>
    </section>
  );
}

export function AdminApp() {
  const {
    uiLang,
    adminView,
    setAdminView,
    adminTab,
    setAdminTab,
    adminSyncStatus,
    triggerSyncToHq,
    hqReceiveNote,
    authProviders,
    setProviderEnabled,
    addProvider,
  } = useAppState();
  const [newProvider, setNewProvider] = useState("");
  const [branchHours, setBranchHours] = useState("08:00–18:00");
  const [branchContact, setBranchContact] = useState("sri@baanyard.demo");

  const exportReport = (scope: string) => {
    const blob = new Blob(
      [JSON.stringify({ simulated: true, scope, rows: auditRows, sync: adminSyncStatus }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `baanyard-${scope}-audit-demo.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = (
    <div className="admin-tabs">
      {(["dashboard", "settings", "reports"] as const).map((tab) => (
        <button
          key={tab}
          type="button"
          className={adminTab === tab ? "is-active" : ""}
          onClick={() => setAdminTab(tab)}
        >
          {t(uiLang, tab)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="admin-shell fade-in">
      <header className="admin-header card">
        <div>
          <Badge label={t(uiLang, "simulated")} />
          <h1>
            {adminView === "country-th"
              ? t(uiLang, "adminTh")
              : adminView === "branch-sri-songkhram"
                ? t(uiLang, "branch")
                : t(uiLang, "hq")}
          </h1>
          <p className="muted">
            {uiLang === "th"
              ? "แอดมิน MVP = ประเทศไทย · เจาะสาขาหรือขึ้น HQ"
              : "MVP admin landing = Thailand Country · drill to Branch or HQ"}
          </p>
          <p className="role-chip">
            {adminView === "hq"
              ? "Role: HQ Admin (Demo)"
              : adminView === "branch-sri-songkhram"
                ? "Role: Branch Admin · ศรีสงคราม (Demo)"
                : "Role: Country Admin · Thailand (Demo)"}
          </p>
        </div>
        <div className="admin-nav-tree">
          <button
            type="button"
            className={adminView === "hq" ? "is-active" : ""}
            onClick={() => setAdminView("hq")}
          >
            HQ
          </button>
          <span>›</span>
          <button
            type="button"
            className={adminView === "country-th" ? "is-active" : ""}
            onClick={() => setAdminView("country-th")}
          >
            TH Country
          </button>
          <span>›</span>
          <button
            type="button"
            className={adminView === "branch-sri-songkhram" ? "is-active" : ""}
            onClick={() => setAdminView("branch-sri-songkhram")}
          >
            ศรีสงคราม
          </button>
        </div>
      </header>

      {adminView !== "hq" ? tabs : null}

      {adminView === "country-th" && adminTab === "dashboard" ? (
        <>
          <KpiGrid kpis={thCountryKpis} label="Thailand dashboard" />
          <section className="card sync-panel">
            <h3>{t(uiLang, "syncHq")}</h3>
            <p>
              Status: <strong>{adminSyncStatus}</strong> <Badge label={t(uiLang, "simulated")} />
            </p>
            <p className="muted tiny">idle → queued → synced</p>
            <button type="button" className="btn" onClick={triggerSyncToHq}>
              {t(uiLang, "syncHq")}
            </button>
          </section>
          <AdminChainPanel />
        </>
      ) : null}

      {adminView === "country-th" && adminTab === "settings" ? (
        <section className="card admin-block">
          <h2>{t(uiLang, "settings")}</h2>
          <p>{t(uiLang, "enabledProviders")}</p>
          <ul>
            {authProviders
              .filter((p) => p.enabled)
              .map((p) => (
                <li key={p.id}>{p.label}</li>
              ))}
          </ul>
          <p className="muted">
            Auth catalog is edited at HQ (Demo).{" "}
            <button type="button" className="linkish" onClick={() => setAdminView("hq")}>
              Open HQ auth settings
            </button>
          </p>
          <p>
            {uiLang === "th"
              ? "นโยบายเก็บข้อมูล: 24 เดือนสำหรับบันทึกการจอง (สำเนานโยบายเดโม)"
              : "Retention policy: 24 months booking records (Demo policy copy)."}
          </p>
        </section>
      ) : null}

      {adminView === "country-th" && adminTab === "reports" ? (
        <section className="card admin-block">
          <h2>{t(uiLang, "reports")}</h2>
          <div className="audit-table-wrap">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Who</th>
                  <th>When</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {auditRows.map((r) => (
                  <tr key={`${r.who}-${r.when}`}>
                    <td>{r.who}</td>
                    <td>{r.when}</td>
                    <td>{r.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => exportReport("th-country")}
          >
            Export JSON (Demo)
          </button>
        </section>
      ) : null}

      {adminView === "branch-sri-songkhram" && adminTab === "dashboard" ? (
        <>
          <KpiGrid kpis={branchKpis} label="Branch · Sri Songkhram" />
          <p className="muted">
            {uiLang === "th"
              ? "มุมมองปฏิบัติการของสาขาชุมชน (เดโม)"
              : "Operational view for the community location (Demo)."}
          </p>
          <button type="button" className="btn" onClick={triggerSyncToHq}>
            Sync upward (via Country → HQ) · {adminSyncStatus}
          </button>
        </>
      ) : null}

      {adminView === "branch-sri-songkhram" && adminTab === "settings" ? (
        <section className="card admin-block">
          <h2>{t(uiLang, "branchSettings")}</h2>
          <label className="field">
            <span>{uiLang === "th" ? "เวลาเปิดทำการ (เดโม)" : "Open hours (Demo)"}</span>
            <input value={branchHours} onChange={(e) => setBranchHours(e.target.value)} />
          </label>
          <label className="field">
            <span>{uiLang === "th" ? "ผู้ติดต่อสาขา" : "Branch contact"}</span>
            <input value={branchContact} onChange={(e) => setBranchContact(e.target.value)} />
          </label>
          <p className="muted tiny">
            {uiLang === "th"
              ? "การตั้งค่าสาขาเป็น local — แคตตาล็อก auth อยู่ที่ HQ"
              : "Branch settings are local — auth catalog remains HQ-owned."}
          </p>
          <Badge label={t(uiLang, "simulated")} />
        </section>
      ) : null}

      {adminView === "branch-sri-songkhram" && adminTab === "reports" ? (
        <section className="card admin-block">
          <h2>{t(uiLang, "branchReports")}</h2>
          <ul>
            <li>Listings reviewed this week: 4 (Demo)</li>
            <li>Guest chats needing host reply: 2 (Demo)</li>
            <li>Sync upward status: {adminSyncStatus}</li>
          </ul>
          <div className="audit-table-wrap">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Who</th>
                  <th>When</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {auditRows.slice(0, 2).map((r) => (
                  <tr key={`b-${r.who}-${r.when}`}>
                    <td>{r.who}</td>
                    <td>{r.when}</td>
                    <td>{r.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => exportReport("branch-sri")}
          >
            Export JSON (Demo)
          </button>
        </section>
      ) : null}

      {adminView === "hq" ? (
        <>
          <KpiGrid kpis={hqRollupKpis} label="Central / HQ rollup" />
          <section className="card sync-panel">
            <h3>{t(uiLang, "receiveSync")}</h3>
            <p>
              {hqReceiveNote} <Badge label={t(uiLang, "simulated")} />
            </p>
            <p className="muted tiny">Country sync status mirror: {adminSyncStatus}</p>
          </section>
          <section className="card admin-block">
            <h2>{t(uiLang, "authCatalog")}</h2>
            <p className="muted">
              {uiLang === "th"
                ? "เปิด/ปิดช่องทางที่แสดงบนหน้าสมัครผู้เยี่ยม"
                : "Enable / disable providers shown on Guest registration."}
            </p>
            <ul className="auth-admin-list">
              {authProviders.map((p) => (
                <li key={p.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={p.enabled}
                      onChange={(e) => setProviderEnabled(p.id, e.target.checked)}
                    />
                    {p.label}
                  </label>
                  <span className="muted tiny">{p.clientIdPlaceholder}</span>
                </li>
              ))}
            </ul>
            <form
              className="add-provider"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newProvider.trim()) return;
                addProvider(newProvider);
                setNewProvider("");
              }}
            >
              <input
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
                placeholder={uiLang === "th" ? "ชื่อช่องทางใหม่" : "New provider name"}
              />
              <button type="submit" className="btn btn-secondary">
                {t(uiLang, "addProvider")}
              </button>
            </form>
          </section>
        </>
      ) : null}
    </div>
  );
}
