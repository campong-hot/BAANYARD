import type { Lang } from "../data/types";

/** Deterministic Demo translator — not a live MT API */
export function demoTranslate(text: string, from: Lang, to: Lang): string {
  if (from === to) return text;
  if (to === "th") return `[Demo translation TH] ${text}`;
  return `[Demo translation EN] ${text}`;
}
