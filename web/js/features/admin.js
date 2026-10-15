import { t } from "../i18n.js";
import { badge, el } from "../utils.js";
import { renderAdminChainPanel } from "./chains.js";
import { renderTravelLinkPanel } from "./travellink.js";

function kpiGrid(kpis, label, lang) {
  return el("section", { className: "kpi-grid" }, [
    el("div", { className: "row-between" }, [
      el("h2", { text: label }),
      badge(t(lang, "estimate"), "estimate"),
    ]),
    el("div", { className: "kpi-cards" }, [
      el("article", { className: "card kpi" }, [
        el("span", { text: "Listings" }),
        el("strong", { text: String(kpis.listings) }),
      ]),
      el("article", { className: "card kpi" }, [
        el("span", { text: "Bookings" }),
        el("strong", { text: String(kpis.bookings) }),
      ]),
      el("article", { className: "card kpi" }, [
        el("span", { text: "GMV (THB)" }),
        el("strong", { text: kpis.gmvThb.toLocaleString() }),
      ]),
      el("article", { className: "card kpi" }, [
        el("span", { text: "Open issues" }),
        el("strong", { text: String(kpis.openIssues) }),
      ]),
    ]),
    el("p", {
      className: "muted tiny",
      text: "Figures are Simulated / Estimate for investor demo — not measured traction.",
    }),
  ]);
}

function exportReport(scope, auditRows, sync) {
  const blob = new Blob(
    [JSON.stringify({ simulated: true, scope, rows: auditRows, sync }, null, 2)],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const a = el("a", { href: url, download: `baanyard-${scope}-audit-demo.json` });
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function renderAdmin(root, ctx) {
  const { data, api } = ctx;
  const s = api.get();
  const lang = api.uiLang();
  const { adminView, adminTab } = s;

  const tabList =
    adminView === "country-th"
      ? ["dashboard", "travellink", "settings", "reports"]
      : ["dashboard", "settings", "reports"];

  const tabs =
    adminView !== "hq"
      ? el(
          "div",
          { className: "admin-tabs" },
          tabList.map((tab) =>
            el("button", {
              type: "button",
              className: adminTab === tab ? "is-active" : "",
              text: tab === "travellink" ? t(lang, "travellinkTab") : t(lang, tab),
              onClick: () => api.setAdminTab(tab),
            }),
          ),
        )
      : null;

  const kids = [
    el("header", { className: "admin-header card" }, [
      el("div", {}, [
        el("h1", {
          text:
            adminView === "country-th"
              ? t(lang, "adminTh")
              : adminView === "branch-sri-songkhram"
                ? t(lang, "branch")
                : t(lang, "hq"),
        }),
        el("p", {
          className: "muted",
          text:
            lang === "th"
              ? "แอดมิน MVP = ประเทศไทย · เจาะสาขาหรือขึ้น HQ"
              : "MVP admin landing = Thailand Country · drill to Branch or HQ",
        }),
        el("p", {
          className: "role-chip",
          text:
            adminView === "hq"
              ? "Role: HQ Admin"
              : adminView === "branch-sri-songkhram"
                ? "Role: Branch Admin · ศรีสงคราม"
                : "Role: Country Admin · Thailand",
        }),
      ]),
      el("div", { className: "admin-nav-tree" }, [
        el("button", {
          type: "button",
          className: adminView === "hq" ? "is-active" : "",
          text: "HQ",
          onClick: () => api.setAdminView("hq"),
        }),
        el("span", { text: "›" }),
        el("button", {
          type: "button",
          className: adminView === "country-th" ? "is-active" : "",
          text: "TH Country",
          onClick: () => api.setAdminView("country-th"),
        }),
        el("span", { text: "›" }),
        el("button", {
          type: "button",
          className: adminView === "branch-sri-songkhram" ? "is-active" : "",
          text: "ศรีสงคราม",
          onClick: () => api.setAdminView("branch-sri-songkhram"),
        }),
      ]),
    ]),
    tabs,
  ];

  if (adminView === "country-th" && adminTab === "dashboard") {
    kids.push(
      kpiGrid(data.admin.thCountryKpis, "Thailand dashboard", lang),
      el("section", { className: "card sync-panel" }, [
        el("h3", { text: t(lang, "syncHq") }),
        el("p", {}, [
          document.createTextNode("Status: "),
          el("strong", { text: s.adminSyncStatus }),
        ]),
        el("p", { className: "muted tiny", text: "idle → queued → synced" }),
        el("button", {
          type: "button",
          className: "btn",
          text: t(lang, "syncHq"),
          onClick: () => api.triggerSyncToHq(),
        }),
      ]),
      renderAdminChainPanel(ctx),
    );
  }

  if (adminView === "country-th" && adminTab === "travellink") {
    kids.push(renderTravelLinkPanel(ctx));
  }

  if (adminView === "country-th" && adminTab === "settings") {
    kids.push(
      el("section", { className: "card admin-block" }, [
        el("h2", { text: t(lang, "settings") }),
        el("p", { text: t(lang, "enabledProviders") }),
        el(
          "ul",
          {},
          s.authProviders.filter((p) => p.enabled).map((p) => el("li", { text: p.label })),
        ),
        el("p", { className: "muted" }, [
          document.createTextNode("Auth catalog is edited at HQ. "),
          el("button", {
            type: "button",
            className: "linkish",
            text: "Open HQ auth settings",
            onClick: () => api.setAdminView("hq"),
          }),
        ]),
        el("p", {
          text:
            lang === "th"
              ? "นโยบายเก็บข้อมูล: 24 เดือนสำหรับบันทึกการจอง"
              : "Retention policy: 24 months booking records.",
        }),
      ]),
    );
  }

  if (adminView === "country-th" && adminTab === "reports") {
    kids.push(
      el("section", { className: "card admin-block" }, [
        el("h2", { text: t(lang, "reports") }),
        el("div", { className: "audit-table-wrap" }, [
          el("table", { className: "audit-table" }, [
            el("thead", {}, [
              el("tr", {}, [
                el("th", { text: "Who" }),
                el("th", { text: "When" }),
                el("th", { text: "Action" }),
              ]),
            ]),
            el(
              "tbody",
              {},
              data.admin.auditRows.map((r) =>
                el("tr", {}, [
                  el("td", { text: r.who }),
                  el("td", { text: r.when }),
                  el("td", { text: r.action }),
                ]),
              ),
            ),
          ]),
        ]),
        el("button", {
          type: "button",
          className: "btn btn-secondary",
          text: "Export JSON",
          onClick: () => exportReport("th-country", data.admin.auditRows, s.adminSyncStatus),
        }),
      ]),
    );
  }

  if (adminView === "branch-sri-songkhram" && adminTab === "dashboard") {
    kids.push(
      kpiGrid(data.admin.branchKpis, "Branch · Sri Songkhram", lang),
      el("p", {
        className: "muted",
        text:
          lang === "th"
            ? "มุมมองปฏิบัติการของสาขาชุมชน"
            : "Operational view for the community location.",
      }),
      el("button", {
        type: "button",
        className: "btn",
        text: `Sync upward (via Country → HQ) · ${s.adminSyncStatus}`,
        onClick: () => api.triggerSyncToHq(),
      }),
    );
  }

  if (adminView === "branch-sri-songkhram" && adminTab === "settings") {
    const hours = el("input");
    hours.value = s.branchHours;
    hours.addEventListener("input", (e) => api.patchSilent({ branchHours: e.target.value }));
    const contact = el("input");
    contact.value = s.branchContact;
    contact.addEventListener("input", (e) => api.patchSilent({ branchContact: e.target.value }));
    kids.push(
      el("section", { className: "card admin-block" }, [
        el("h2", { text: t(lang, "branchSettings") }),
        el("label", { className: "field" }, [
          el("span", { text: lang === "th" ? "เวลาเปิดทำการ" : "Open hours" }),
          hours,
        ]),
        el("label", { className: "field" }, [
          el("span", { text: lang === "th" ? "ผู้ติดต่อสาขา" : "Branch contact" }),
          contact,
        ]),
        el("p", {
          className: "muted tiny",
          text:
            lang === "th"
              ? "การตั้งค่าสาขาเป็น local — แคตตาล็อก auth อยู่ที่ HQ"
              : "Branch settings are local — auth catalog remains HQ-owned.",
        }),
      ]),
    );
  }

  if (adminView === "branch-sri-songkhram" && adminTab === "reports") {
    kids.push(
      el("section", { className: "card admin-block" }, [
        el("h2", { text: t(lang, "branchReports") }),
        el("ul", {}, [
          el("li", { text: "Listings reviewed this week: 4" }),
          el("li", { text: "Guest chats needing host reply: 2" }),
          el("li", { text: `Sync upward status: ${s.adminSyncStatus}` }),
        ]),
        el("div", { className: "audit-table-wrap" }, [
          el("table", { className: "audit-table" }, [
            el("thead", {}, [
              el("tr", {}, [
                el("th", { text: "Who" }),
                el("th", { text: "When" }),
                el("th", { text: "Action" }),
              ]),
            ]),
            el(
              "tbody",
              {},
              data.admin.auditRows.slice(0, 2).map((r) =>
                el("tr", {}, [
                  el("td", { text: r.who }),
                  el("td", { text: r.when }),
                  el("td", { text: r.action }),
                ]),
              ),
            ),
          ]),
        ]),
        el("button", {
          type: "button",
          className: "btn btn-secondary",
          text: "Export JSON",
          onClick: () => exportReport("branch-sri", data.admin.auditRows, s.adminSyncStatus),
        }),
      ]),
    );
  }

  if (adminView === "hq") {
    const newIn = el("input", {
      placeholder: lang === "th" ? "ชื่อช่องทางใหม่" : "New provider name",
    });
    newIn.value = s.newProvider;
    newIn.addEventListener("input", (e) => api.patchSilent({ newProvider: e.target.value }));
    kids.push(
      kpiGrid(data.admin.hqRollupKpis, "Central / HQ rollup", lang),
      el("section", { className: "card sync-panel" }, [
        el("h3", { text: t(lang, "receiveSync") }),
        el("p", {}, [document.createTextNode(s.hqReceiveNote)]),
        el("p", {
          className: "muted tiny",
          text: `Country sync status mirror: ${s.adminSyncStatus}`,
        }),
      ]),
      el("section", { className: "card admin-block" }, [
        el("h2", { text: t(lang, "authCatalog") }),
        el("p", {
          className: "muted",
          text:
            lang === "th"
              ? "เปิด/ปิดช่องทางที่แสดงบนหน้าสมัครผู้เยี่ยม"
              : "Enable / disable providers shown on Guest registration.",
        }),
        el(
          "ul",
          { className: "auth-admin-list" },
          s.authProviders.map((p) => {
            const cb = el("input", { type: "checkbox" });
            cb.checked = p.enabled;
            cb.addEventListener("change", (e) => api.setProviderEnabled(p.id, e.target.checked));
            return el("li", {}, [
              el("label", {}, [cb, document.createTextNode(p.label)]),
              el("span", { className: "muted tiny", text: p.clientIdPlaceholder }),
            ]);
          }),
        ),
        el(
          "form",
          {
            className: "add-provider",
            onSubmit: (e) => {
              e.preventDefault();
              const label = (api.get().newProvider || "").trim();
              if (!label) return;
              api.addProvider(label);
              api.patch({ newProvider: "" });
            },
          },
          [
            newIn,
            el("button", {
              type: "submit",
              className: "btn btn-secondary",
              text: t(lang, "addProvider"),
            }),
          ],
        ),
      ]),
    );
  }

  root.append(el("div", { className: "admin-shell fade-in" }, kids));
}
