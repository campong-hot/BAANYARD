import { en, type DictKey } from "./en";
import { th } from "./th";
import type { Lang } from "../data/types";

const dicts = { en, th } as const;

export function t(lang: Lang, key: DictKey): string {
  return dicts[lang][key] ?? en[key];
}

export type { DictKey };
