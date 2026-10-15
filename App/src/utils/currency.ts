import type { CurrencyCode } from "../data/types";

/** Demo FX rates from THB — Simulated only */
const rates: Record<CurrencyCode, number> = {
  THB: 1,
  USD: 0.029,
  EUR: 0.027,
  LAK: 630,
  VND: 730,
};

export function convertFromThb(amountThb: number, currency: CurrencyCode): number {
  return amountThb * rates[currency];
}

export function formatMoney(amountThb: number, currency: CurrencyCode, lang: "th" | "en"): string {
  const value = convertFromThb(amountThb, currency);
  const locale = lang === "th" ? "th-TH" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "THB" || currency === "LAK" || currency === "VND" ? 0 : 2,
  }).format(value);
}
