import type { AdminKpis, AuditRow } from "./types";

export const thCountryKpis: AdminKpis = {
  listings: 68,
  bookings: 156,
  gmvThb: 980000,
  openIssues: 3,
};

export const branchKpis: AdminKpis = {
  listings: 24,
  bookings: 48,
  gmvThb: 265000,
  openIssues: 1,
};

export const hqRollupKpis: AdminKpis = {
  listings: 128,
  bookings: 360,
  gmvThb: 2450000,
  openIssues: 7,
};

export const auditRows: AuditRow[] = [
  { who: "admin.th@demo", when: "2026-08-06T10:12:00Z", action: "Viewed country report" },
  { who: "admin.branch.srs@demo", when: "2026-08-06T09:40:00Z", action: "Updated listing status" },
  { who: "hq.ops@demo", when: "2026-08-05T16:02:00Z", action: "Enabled auth provider: line" },
  { who: "admin.th@demo", when: "2026-08-05T11:20:00Z", action: "Queued sync to HQ" },
];
