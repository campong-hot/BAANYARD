// One-off build script: aggregates MOTS/CKAN open data (Travel Link's source dataset)
// into web/data/travellink-provinces.json. Not shipped to production runtime.
//
// travellink.go.th itself blocks direct scraping (GDCC WAF). Its dashboard is built
// on the Ministry of Tourism and Sports (MOTS) open dataset published on CKAN MOTS,
// so this script reads that same open dataset directly.
//
// To refresh the raw snapshot before re-running this script:
//   curl -s "https://ckan.mots.go.th/api/3/action/package_show?id=trend_domestic_tourists" -o pkg.json
//   (read the JSON resource "url" field from pkg.json, then:)
//   curl -s "<that JSON resource url>" -o trend_domestic.json
//   node scripts/build-travellink.js
const fs = require("fs");
const path = require("path");

const RAW_PATH = path.join(__dirname, "..", "trend_domestic.json");
const OUT_PATH = path.join(__dirname, "..", "web", "data", "travellink-provinces.json");

// Thai -> English name + region, per MOTS/TAT provincial groupings.
const PROVINCE_META = {
  "กระบี่": ["Krabi", "South"],
  "กรุงเทพมหานคร": ["Bangkok", "Central"],
  "กาญจนบุรี": ["Kanchanaburi", "West"],
  "กาฬสินธุ์": ["Kalasin", "Northeast"],
  "กำแพงเพชร": ["Kamphaeng Phet", "North"],
  "ขอนแก่น": ["Khon Kaen", "Northeast"],
  "จันทบุรี": ["Chanthaburi", "East"],
  "ฉะเชิงเทรา": ["Chachoengsao", "East"],
  "ชลบุรี": ["Chonburi", "East"],
  "ชัยนาท": ["Chai Nat", "Central"],
  "ชัยภูมิ": ["Chaiyaphum", "Northeast"],
  "ชุมพร": ["Chumphon", "South"],
  "เชียงราย": ["Chiang Rai", "North"],
  "เชียงใหม่": ["Chiang Mai", "North"],
  "ตรัง": ["Trang", "South"],
  "ตราด": ["Trat", "East"],
  "ตาก": ["Tak", "North"],
  "นครนายก": ["Nakhon Nayok", "Central"],
  "นครปฐม": ["Nakhon Pathom", "Central"],
  "นครพนม": ["Nakhon Phanom", "Northeast"],
  "นครราชสีมา": ["Nakhon Ratchasima", "Northeast"],
  "นครศรีธรรมราช": ["Nakhon Si Thammarat", "South"],
  "นครสวรรค์": ["Nakhon Sawan", "North"],
  "นนทบุรี": ["Nonthaburi", "Central"],
  "นราธิวาส": ["Narathiwat", "South"],
  "น่าน": ["Nan", "North"],
  "บึงกาฬ": ["Bueng Kan", "Northeast"],
  "บุรีรัมย์": ["Buriram", "Northeast"],
  "ปทุมธานี": ["Pathum Thani", "Central"],
  "ประจวบคีรีขันธ์": ["Prachuap Khiri Khan", "West"],
  "ปราจีนบุรี": ["Prachinburi", "East"],
  "ปัตตานี": ["Pattani", "South"],
  "พระนครศรีอยุธยา": ["Phra Nakhon Si Ayutthaya", "Central"],
  "พะเยา": ["Phayao", "North"],
  "พังงา": ["Phang Nga", "South"],
  "พัทลุง": ["Phatthalung", "South"],
  "พิจิตร": ["Phichit", "North"],
  "พิษณุโลก": ["Phitsanulok", "North"],
  "เพชรบุรี": ["Phetchaburi", "West"],
  "เพชรบูรณ์": ["Phetchabun", "North"],
  "แพร่": ["Phrae", "North"],
  "ภูเก็ต": ["Phuket", "South"],
  "มหาสารคาม": ["Maha Sarakham", "Northeast"],
  "มุกดาหาร": ["Mukdahan", "Northeast"],
  "แม่ฮ่องสอน": ["Mae Hong Son", "North"],
  "ยโสธร": ["Yasothon", "Northeast"],
  "ยะลา": ["Yala", "South"],
  "ร้อยเอ็ด": ["Roi Et", "Northeast"],
  "ระนอง": ["Ranong", "South"],
  "ระยอง": ["Rayong", "East"],
  "ราชบุรี": ["Ratchaburi", "West"],
  "ลพบุรี": ["Lopburi", "Central"],
  "ลำปาง": ["Lampang", "North"],
  "ลำพูน": ["Lamphun", "North"],
  "เลย": ["Loei", "Northeast"],
  "ศรีสะเกษ": ["Si Sa Ket", "Northeast"],
  "สกลนคร": ["Sakon Nakhon", "Northeast"],
  "สงขลา": ["Songkhla", "South"],
  "สตูล": ["Satun", "South"],
  "สมุทรปราการ": ["Samut Prakan", "Central"],
  "สมุทรสงคราม": ["Samut Songkhram", "Central"],
  "สมุทรสาคร": ["Samut Sakhon", "Central"],
  "สระแก้ว": ["Sa Kaeo", "East"],
  "สระบุรี": ["Saraburi", "Central"],
  "สิงห์บุรี": ["Sing Buri", "Central"],
  "สุโขทัย": ["Sukhothai", "North"],
  "สุพรรณบุรี": ["Suphan Buri", "Central"],
  "สุราษฎร์ธานี": ["Surat Thani", "South"],
  "สุรินทร์": ["Surin", "Northeast"],
  "หนองคาย": ["Nong Khai", "Northeast"],
  "หนองบัวลำภู": ["Nong Bua Lamphu", "Northeast"],
  "อ่างทอง": ["Ang Thong", "Central"],
  "อำนาจเจริญ": ["Amnat Charoen", "Northeast"],
  "อุดรธานี": ["Udon Thani", "Northeast"],
  "อุตรดิตถ์": ["Uttaradit", "North"],
  "อุทัยธานี": ["Uthai Thani", "North"],
  "อุบลราชธานี": ["Ubon Ratchathani", "Northeast"],
};

// Links existing web/data/supply-chains.json province ids to Thai province names.
const SUPPLY_CHAIN_LINK = {
  "สกลนคร": "sakon-nakhon",
  "เลย": "loei",
  "น่าน": "nan",
  "พะเยา": "phayao",
  "เชียงใหม่": "chiang-mai",
  "สุราษฎร์ธานี": "surat-thani",
  "อุบลราชธานี": "ubon",
};

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function periodKey(y, m) {
  return y * 100 + m;
}

function monthsBack(y, m, n) {
  // returns array of [year, month] going back n months, ending at (y, m) inclusive
  const out = [];
  let yy = y;
  let mm = m;
  for (let i = 0; i < n; i++) {
    out.push([yy, mm]);
    mm -= 1;
    if (mm === 0) {
      mm = 12;
      yy -= 1;
    }
  }
  return out.reverse();
}

function main() {
  const rows = JSON.parse(fs.readFileSync(RAW_PATH, "utf8"));

  // Determine the latest fully-available (year, month).
  let latestY = 0;
  let latestM = 0;
  for (const r of rows) {
    const k = periodKey(r.YearInfo, r.MonthInfo);
    if (k > periodKey(latestY, latestM)) {
      latestY = r.YearInfo;
      latestM = r.MonthInfo;
    }
  }

  const currentWindow = monthsBack(latestY, latestM, 12);
  const priorWindow = monthsBack(currentWindow[0][0], currentWindow[0][1] - 1 <= 0 ? 12 : currentWindow[0][1] - 1, 12);
  // Simpler: prior window = 12 months ending exactly 12 months before latest.
  let py = latestY - 1;
  let pm = latestM;
  const priorWindow2 = monthsBack(py, pm, 12);

  const currentSet = new Set(currentWindow.map(([y, m]) => periodKey(y, m)));
  const priorSet = new Set(priorWindow2.map(([y, m]) => periodKey(y, m)));

  // Group rows by province.
  const byProvince = new Map();
  for (const r of rows) {
    if (!byProvince.has(r.Province)) byProvince.set(r.Province, []);
    byProvince.get(r.Province).push(r);
  }

  const provinces = [];

  for (const [thaiName, meta] of Object.entries(PROVINCE_META)) {
    const [enName, region] = meta;
    const provRows = byProvince.get(thaiName) || [];
    if (provRows.length === 0) continue;

    const sum = (set) => {
      let domestic = 0;
      let intl = 0;
      let domesticIncome = 0;
      let intlIncome = 0;
      let orSum = 0;
      let orCount = 0;
      for (const r of provRows) {
        if (!set.has(periodKey(r.YearInfo, r.MonthInfo))) continue;
        domestic += r.InternalAmount || 0;
        intl += r.ForeignerInternalAmount || 0;
        domesticIncome += r.InternalIncome || 0;
        intlIncome += r.ForeignersinternalIncome || 0;
        if (typeof r.OR === "number") {
          orSum += r.OR;
          orCount += 1;
        }
      }
      return {
        domestic,
        intl,
        domesticIncome,
        intlIncome,
        occupancy: orCount ? orSum / orCount : null,
      };
    };

    const cur = sum(currentSet);
    const prior = sum(priorSet);

    const curArrivals = cur.domestic + cur.intl;
    const priorArrivals = prior.domestic + prior.intl;
    const yoyArrivalsPct =
      priorArrivals > 0 ? ((curArrivals - priorArrivals) / priorArrivals) * 100 : null;

    const curRevenue = cur.domesticIncome + cur.intlIncome; // million THB
    const priorRevenue = prior.domesticIncome + prior.intlIncome;
    const yoyRevenuePct =
      priorRevenue > 0 ? ((curRevenue - priorRevenue) / priorRevenue) * 100 : null;

    const intlSharePct = curArrivals > 0 ? (cur.intl / curArrivals) * 100 : 0;
    const domesticSharePct = 100 - intlSharePct;

    // Seasonality: average arrivals per calendar month across all available years
    // (whole-history average smooths one-off shocks like 2020-2021).
    const monthTotals = new Array(13).fill(0);
    const monthCounts = new Array(13).fill(0);
    for (const r of provRows) {
      const total = (r.InternalAmount || 0) + (r.ForeignerInternalAmount || 0);
      monthTotals[r.MonthInfo] += total;
      monthCounts[r.MonthInfo] += 1;
    }
    const monthAvg = [];
    for (let m = 1; m <= 12; m++) {
      monthAvg.push({ month: m, avg: monthCounts[m] ? monthTotals[m] / monthCounts[m] : 0 });
    }
    const topMonths = [...monthAvg].sort((a, b) => b.avg - a.avg).slice(0, 3).map((x) => x.month);

    const id = slugify(enName);
    provinces.push({
      id,
      name: enName,
      nameTh: thaiName,
      region,
      supplyChainId: SUPPLY_CHAIN_LINK[thaiName] || null,
      period: {
        currentFrom: `${currentWindow[0][0]}-${String(currentWindow[0][1]).padStart(2, "0")}`,
        currentTo: `${currentWindow[11][0]}-${String(currentWindow[11][1]).padStart(2, "0")}`,
        priorFrom: `${priorWindow2[0][0]}-${String(priorWindow2[0][1]).padStart(2, "0")}`,
        priorTo: `${priorWindow2[11][0]}-${String(priorWindow2[11][1]).padStart(2, "0")}`,
      },
      stats: {
        arrivals: Math.round(curArrivals),
        domesticArrivals: Math.round(cur.domestic),
        intlArrivals: Math.round(cur.intl),
        revenueMillionThb: Math.round(curRevenue * 10) / 10,
        yoyArrivalsPct: yoyArrivalsPct === null ? null : Math.round(yoyArrivalsPct * 10) / 10,
        yoyRevenuePct: yoyRevenuePct === null ? null : Math.round(yoyRevenuePct * 10) / 10,
        intlSharePct: Math.round(intlSharePct * 10) / 10,
        domesticSharePct: Math.round(domesticSharePct * 10) / 10,
        occupancyPct: cur.occupancy === null ? null : Math.round(cur.occupancy * 10) / 10,
        topSeasonMonths: topMonths,
      },
      confidence: "measured",
    });
  }

  provinces.sort((a, b) => b.stats.arrivals - a.stats.arrivals);

  const out = {
    source: "https://www.travellink.go.th/dashboard/",
    sourceDataset: "https://ckan.mots.go.th/en/dataset/trend_domestic_tourists",
    sourceOwner: "MOTS (Ministry of Tourism and Sports) via Big Data Institute (BDI) Travel Link, open data on CKAN MOTS",
    fetchedAt: new Date().toISOString(),
    simulated: false,
    confidenceNote:
      "Measured = real MOTS/CKAN open-data figures (last available monthly window). travellink.go.th itself blocks direct scraping (GDCC WAF); this connector reads the same open dataset the dashboard is built on.",
    unit: {
      revenue: "million THB (MOTS estimate)",
      arrivals: "visits (domestic + international), 12-month rolling window",
    },
    provinceCount: provinces.length,
    provinces,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  console.log("Wrote", OUT_PATH, "with", provinces.length, "provinces");
  console.log("Window:", out.provinces[0].period);
}

main();
