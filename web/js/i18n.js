let dicts = { en: {}, th: {} };

export function setDicts(en, th) {
  dicts = { en, th };
}

export function t(lang, key) {
  return dicts[lang]?.[key] ?? dicts.en[key] ?? key;
}
