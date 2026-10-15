const LS_AUTH = "baanyard.authProviders";
const LS_LANG = "baanyard.primaryLanguage";
const LS_CURRENCY = "baanyard.currency";

function loadProviders(defaults) {
  try {
    const raw = localStorage.getItem(LS_AUTH);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return defaults.map((p) => ({ ...p }));
}

function loadCurrency() {
  const saved = localStorage.getItem(LS_CURRENCY);
  if (["THB", "USD", "EUR", "LAK", "VND"].includes(saved)) return saved;
  return "THB";
}

function loadLang() {
  const saved = localStorage.getItem(LS_LANG);
  return saved === "th" || saved === "en" ? saved : "en";
}

export function createState(defaults, onChange) {
  const state = {
    mode: "demo",
    lane: "guest",
    privacyOpen: false,
    primaryLanguage: loadLang(),
    currency: loadCurrency(),
    sessionUser: null,
    authProviders: loadProviders(defaults.auth),
    guestScreen: "splash",
    selectedListingId: null,
    selectedCommunityId: null,
    selectedHostId: null,
    exploreFilter: "all",
    selectedChainId: null,
    chainStatus: {},
    chainBookings: {},
    chainSettleNote: "",
    cartItemId: null,
    offers: [],
    hostScreen: "home",
    hostWizardStep: 1,
    hostDraft: { kind: "experience", title: "", story: "", price: "500", photoMood: "River morning" },
    adminView: "country-th",
    adminTab: "dashboard",
    adminSyncStatus: "idle",
    hqReceiveNote: "Waiting for country sync",
    marketingConsent: false,
    dsrRequests: [],
    showBilingualGuest: true,
    showBilingualHost: true,
    guestExtraMsgs: [],
    hostExtraReplies: [],
    draftMsg: "",
    draftReply: "",
    card: "4242",
    showAdvanced: false,
    branchHours: "08:00–18:00",
    branchContact: "sri@baanyard.com",
    newProvider: "",
    travelLinkProvinceId: null,
  };

  function persistAuth() {
    localStorage.setItem(LS_AUTH, JSON.stringify(state.authProviders));
  }

  function emit() {
    syncHash();
    onChange();
  }

  function syncHash() {
    let hash = "#/pitch";
    if (state.mode === "demo") {
      if (state.privacyOpen) hash = "#/demo/privacy";
      else hash = `#/demo/${state.lane}`;
    }
    if (location.hash !== hash) history.replaceState(null, "", hash);
  }

  function applyHash() {
    const raw = location.hash || "";
    const h = raw.replace(/^#\/?/, "");
    if (h === "pitch") {
      state.mode = "pitch";
      return;
    }
    // Default landing is the live product (Guest), not the pitch deck.
    state.mode = "demo";
    if (h.startsWith("demo")) {
      const part = h.split("/")[1] || "guest";
      if (part === "privacy") {
        state.privacyOpen = true;
      } else if (["guest", "host", "admin"].includes(part)) {
        state.privacyOpen = false;
        state.lane = part;
      }
    }
  }

  const api = {
    get() {
      return state;
    },
    uiLang() {
      return state.sessionUser?.primaryLanguage ?? state.primaryLanguage;
    },
    setMode(m) {
      state.mode = m;
      emit();
    },
    setLane(l) {
      state.lane = l;
      state.privacyOpen = false;
      if (l === "admin") {
        state.adminView = "country-th";
        state.adminTab = "dashboard";
        state.travelLinkProvinceId = null;
      }
      if (l === "host") state.hostScreen = "home";
      if (l === "guest") state.guestScreen = state.sessionUser ? "explore" : "splash";
      emit();
    },
    openPrivacy() {
      state.privacyOpen = true;
      state.guestScreen = "privacy";
      emit();
    },
    closePrivacy() {
      state.privacyOpen = false;
      emit();
    },
    setPrimaryLanguage(l) {
      state.primaryLanguage = l;
      localStorage.setItem(LS_LANG, l);
      emit();
    },
    setCurrency(c) {
      state.currency = c;
      localStorage.setItem(LS_CURRENCY, c);
      emit();
    },
    signInDemo(providerId, language) {
      api.setPrimaryLanguage(language);
      state.sessionUser = {
        id: `user-${providerId}`,
        displayName: language === "th" ? "ผู้เยี่ยม" : "Guest",
        providerId,
        primaryLanguage: language,
      };
      state.guestScreen = "explore";
      state.privacyOpen = false;
      emit();
    },
    signOut() {
      state.sessionUser = null;
      state.guestScreen = "splash";
      emit();
    },
    setProviderEnabled(id, enabled) {
      state.authProviders = state.authProviders.map((p) => (p.id === id ? { ...p, enabled } : p));
      persistAuth();
      emit();
    },
    addProvider(label) {
      const id = label.trim().toLowerCase().replace(/\s+/g, "-") || `provider-${Date.now()}`;
      if (state.authProviders.some((p) => p.id === id)) return;
      state.authProviders = [
        ...state.authProviders,
        { id, label: label.trim() || id, enabled: true, clientIdPlaceholder: `demo-${id}` },
      ];
      persistAuth();
      emit();
    },
    setGuestScreen(s) {
      state.guestScreen = s;
      state.privacyOpen = s === "privacy";
      emit();
    },
    openListing(listing) {
      state.selectedListingId = listing.id;
      state.selectedHostId = listing.hostId;
      state.guestScreen = "listing";
      state.privacyOpen = false;
      emit();
    },
    openCommunity(id) {
      state.selectedCommunityId = id;
      state.guestScreen = "story";
      state.privacyOpen = false;
      emit();
    },
    openHost(id) {
      state.selectedHostId = id;
      state.guestScreen = "host";
      state.privacyOpen = false;
      emit();
    },
    openChain(id) {
      state.selectedChainId = id;
      state.guestScreen = "chain";
      state.privacyOpen = false;
      emit();
    },
    bookChain(id, fallbackStatus) {
      const current = state.chainStatus[id] || fallbackStatus || "open";
      const nextStatus = current === "open" ? "funded" : current;
      state.chainBookings = { ...state.chainBookings, [id]: true };
      state.chainStatus = { ...state.chainStatus, [id]: nextStatus };
      emit();
    },
    advanceChain(id, fallbackStatus) {
      const STATUS_FLOW = [
        "open",
        "funded",
        "growing",
        "processing",
        "packing",
        "retail",
        "settled",
      ];
      const from = state.chainStatus[id] || fallbackStatus || "open";
      const i = STATUS_FLOW.indexOf(from);
      const to = i >= 0 && i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : from;
      state.chainStatus = { ...state.chainStatus, [id]: to };
      state.chainSettleNote = `Synced ${id}: ${from} → ${to}`;
      emit();
    },
    setCartItem(listing) {
      state.cartItemId = listing ? listing.id : null;
      emit();
    },
    addOffer(o) {
      state.offers = [...state.offers, { ...o, id: `offer-${Date.now()}` }];
      emit();
    },
    setHostScreen(s) {
      state.hostScreen = s;
      emit();
    },
    patch(partial) {
      Object.assign(state, partial);
      emit();
    },
    patchSilent(partial) {
      Object.assign(state, partial);
    },
    setAdminView(v) {
      state.adminView = v;
      if (v !== "country-th" && state.adminTab === "travellink") state.adminTab = "dashboard";
      emit();
    },
    setAdminTab(t) {
      state.adminTab = t;
      emit();
    },
    setTravelLinkProvince(id) {
      state.travelLinkProvinceId = id;
      emit();
    },
    triggerSyncToHq() {
      state.adminSyncStatus = "queued";
      state.hqReceiveNote = "Queued at Country · waiting HQ receive";
      emit();
      window.setTimeout(() => {
        state.adminSyncStatus = "synced";
        state.hqReceiveNote = "Last sync received from Thailand Country";
        emit();
      }, 1200);
    },
    setMarketingConsent(v) {
      state.marketingConsent = v;
      emit();
    },
    addDsr(type) {
      state.dsrRequests = [
        {
          id: `dsr-${Date.now()}`,
          type,
          status: "queued",
          createdAt: new Date().toISOString(),
        },
        ...state.dsrRequests,
      ];
      emit();
    },
    enterDemo() {
      state.lane = "guest";
      state.guestScreen = "splash";
      state.privacyOpen = false;
      state.mode = "demo";
      emit();
    },
    applyHash,
    syncHash,
  };

  return api;
}
