export type AppMode = "pitch" | "demo";
export type DemoLane = "guest" | "host" | "admin";
export type Lang = "th" | "en";
export type CurrencyCode = "THB" | "USD" | "EUR" | "LAK" | "VND";
export type ListingKind = "stay" | "experience" | "product";
export type AdminView = "country-th" | "branch-sri-songkhram" | "hq";
export type SyncStatus = "idle" | "queued" | "synced";
export type GuestScreen =
  | "splash"
  | "register"
  | "explore"
  | "story"
  | "host"
  | "listing"
  | "chat"
  | "video"
  | "checkout"
  | "success"
  | "privacy"
  | "chain"
  | "chainConfirm"
  | "chainSuccess";

export type HostScreen = "home" | "wizard" | "inbox";

export type AuthProviderConfig = {
  id: string;
  label: string;
  enabled: boolean;
  clientIdPlaceholder?: string;
};

export type Community = {
  id: string;
  name: string;
  nameTh: string;
  country: string;
  countryCode: string;
  blurb: string;
  blurbTh: string;
  story: string;
  storyTh: string;
  accent: string;
  simulated: true;
};

export type ListingTag =
  | "kids"
  | "family"
  | "solo"
  | "wellness"
  | "food"
  | "music";

export type Listing = {
  id: string;
  communityId: string;
  kind: ListingKind;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  priceThb: number;
  hostId: string;
  tags?: ListingTag[];
  trust: string[];
  simulated: true;
};

export type Host = {
  id: string;
  name: string;
  nameTh: string;
  communityId: string;
  primaryLanguage: Lang;
  bio: string;
  bioTh: string;
  simulated: true;
};

export type ChatMessage = {
  id: string;
  from: "guest" | "host";
  sourceLang: Lang;
  targetLang: Lang;
  sourceText: string;
  translatedText: string;
};

export type OfferDraft = {
  id: string;
  kind: ListingKind;
  title: string;
  story: string;
  priceThb: number;
};

export type DsrRequest = {
  id: string;
  type: "access" | "delete";
  status: "queued" | "processing" | "done";
  createdAt: string;
};

export type AuditRow = {
  who: string;
  when: string;
  action: string;
};

export type AdminKpis = {
  listings: number;
  bookings: number;
  gmvThb: number;
  openIssues: number;
};
