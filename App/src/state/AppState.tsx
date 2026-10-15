import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultAuthProviders } from "../data/authCatalog";
import type {
  AdminView,
  AppMode,
  AuthProviderConfig,
  CurrencyCode,
  DemoLane,
  DsrRequest,
  GuestScreen,
  HostScreen,
  Lang,
  Listing,
  OfferDraft,
  SyncStatus,
import type { ChainStatus } from "../data/supplyChains";
import { findChainRow, nextChainStatus } from "../data/supplyChains";

const LS_AUTH = "baanyard.authProviders";
const LS_LANG = "baanyard.primaryLanguage";
const LS_CURRENCY = "baanyard.currency";

type SessionUser = {
  id: string;
  displayName: string;
  providerId: string;
  primaryLanguage: Lang;
};

type AppStateValue = {
  mode: AppMode;
  setMode: (m: AppMode) => void;
  lane: DemoLane;
  setLane: (l: DemoLane) => void;
  privacyOpen: boolean;
  openPrivacy: () => void;
  closePrivacy: () => void;
  primaryLanguage: Lang;
  setPrimaryLanguage: (l: Lang) => void;
  uiLang: Lang;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  sessionUser: SessionUser | null;
  signInDemo: (providerId: string, language: Lang) => void;
  signOut: () => void;
  authProviders: AuthProviderConfig[];
  setProviderEnabled: (id: string, enabled: boolean) => void;
  addProvider: (label: string) => void;
  guestScreen: GuestScreen;
  setGuestScreen: (s: GuestScreen) => void;
  selectedListing: Listing | null;
  openListing: (listing: Listing) => void;
  selectedCommunityId: string | null;
  openCommunity: (id: string) => void;
  selectedHostId: string | null;
  openHost: (id: string) => void;
  exploreFilter: string;
  setExploreFilter: (f: string) => void;
  cartItem: Listing | null;
  setCartItem: (l: Listing | null) => void;
  offers: OfferDraft[];
  addOffer: (o: Omit<OfferDraft, "id">) => void;
  hostScreen: HostScreen;
  setHostScreen: (s: HostScreen) => void;
  adminView: AdminView;
  setAdminView: (v: AdminView) => void;
  adminTab: "dashboard" | "settings" | "reports";
  setAdminTab: (t: "dashboard" | "settings" | "reports") => void;
  adminSyncStatus: SyncStatus;
  triggerSyncToHq: () => void;
  hqReceiveNote: string;
  marketingConsent: boolean;
  setMarketingConsent: (v: boolean) => void;
  dsrRequests: DsrRequest[];
  addDsr: (type: "access" | "delete") => void;
  selectedChainId: string | null;
  openChain: (id: string) => void;
  chainStatus: Record<string, ChainStatus>;
  chainBookings: Record<string, boolean>;
  chainSettleNote: string;
  bookChain: (id: string) => void;
  advanceChain: (id: string, fallback: ChainStatus) => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

function loadProviders(): AuthProviderConfig[] {
  try {
    const raw = localStorage.getItem(LS_AUTH);
    if (raw) return JSON.parse(raw) as AuthProviderConfig[];
  } catch {
    /* ignore */
  }
  return defaultAuthProviders;
}

function loadCurrency(): CurrencyCode {
  const saved = localStorage.getItem(LS_CURRENCY);
  if (saved === "THB" || saved === "USD" || saved === "EUR" || saved === "LAK" || saved === "VND") {
    return saved;
  }
  return "THB";
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>("pitch");
  const [lane, setLaneState] = useState<DemoLane>("guest");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [primaryLanguage, setPrimaryLanguageState] = useState<Lang>(() => {
    const saved = localStorage.getItem(LS_LANG);
    return saved === "th" || saved === "en" ? saved : "en";
  });
  const [currency, setCurrencyState] = useState<CurrencyCode>(loadCurrency);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [authProviders, setAuthProviders] = useState<AuthProviderConfig[]>(loadProviders);
  const [guestScreen, setGuestScreen] = useState<GuestScreen>("splash");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
  const [exploreFilter, setExploreFilter] = useState("all");
  const [cartItem, setCartItem] = useState<Listing | null>(null);
  const [offers, setOffers] = useState<OfferDraft[]>([]);
  const [hostScreen, setHostScreen] = useState<HostScreen>("home");
  const [adminView, setAdminView] = useState<AdminView>("country-th");
  const [adminTab, setAdminTab] = useState<"dashboard" | "settings" | "reports">("dashboard");
  const [adminSyncStatus, setAdminSyncStatus] = useState<SyncStatus>("idle");
  const [hqReceiveNote, setHqReceiveNote] = useState("Waiting for country sync (Demo)");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [dsrRequests, setDsrRequests] = useState<DsrRequest[]>([]);
  const [selectedChainId, setSelectedChainId] = useState<string | null>(null);
  const [chainStatus, setChainStatus] = useState<Record<string, ChainStatus>>({});
  const [chainBookings, setChainBookings] = useState<Record<string, boolean>>({});
  const [chainSettleNote, setChainSettleNote] = useState("");

  useEffect(() => {
    localStorage.setItem(LS_AUTH, JSON.stringify(authProviders));
  }, [authProviders]);

  const setPrimaryLanguage = useCallback((l: Lang) => {
    setPrimaryLanguageState(l);
    localStorage.setItem(LS_LANG, l);
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem(LS_CURRENCY, c);
  }, []);

  const uiLang = sessionUser?.primaryLanguage ?? primaryLanguage;

  const closePrivacy = useCallback(() => setPrivacyOpen(false), []);
  const openPrivacy = useCallback(() => {
    setPrivacyOpen(true);
    setGuestScreen("privacy");
  }, []);

  const setLane = useCallback(
    (l: DemoLane) => {
      setLaneState(l);
      setPrivacyOpen(false);
      if (l === "admin") {
        setAdminView("country-th");
        setAdminTab("dashboard");
      }
      if (l === "host") {
        setHostScreen("home");
      }
      if (l === "guest") {
        setGuestScreen(sessionUser ? "explore" : "splash");
      }
    },
    [sessionUser],
  );

  const signInDemo = useCallback(
    (providerId: string, language: Lang) => {
      setPrimaryLanguage(language);
      setSessionUser({
        id: `user-${providerId}`,
        displayName: language === "th" ? "ผู้เยี่ยมเดโม" : "Demo Guest",
        providerId,
        primaryLanguage: language,
      });
      setGuestScreen("explore");
      setPrivacyOpen(false);
    },
    [setPrimaryLanguage],
  );

  const signOut = useCallback(() => {
    setSessionUser(null);
    setGuestScreen("splash");
  }, []);

  const setProviderEnabled = useCallback((id: string, enabled: boolean) => {
    setAuthProviders((prev) => prev.map((p) => (p.id === id ? { ...p, enabled } : p)));
  }, []);

  const addProvider = useCallback((label: string) => {
    const id = label.trim().toLowerCase().replace(/\s+/g, "-") || `provider-${Date.now()}`;
    setAuthProviders((prev) => {
      if (prev.some((p) => p.id === id)) return prev;
      return [...prev, { id, label: label.trim() || id, enabled: true, clientIdPlaceholder: `demo-${id}` }];
    });
  }, []);

  const openListing = useCallback((listing: Listing) => {
    setSelectedListing(listing);
    setSelectedHostId(listing.hostId);
    setGuestScreen("listing");
    setPrivacyOpen(false);
  }, []);

  const openCommunity = useCallback((id: string) => {
    setSelectedCommunityId(id);
    setGuestScreen("story");
    setPrivacyOpen(false);
  }, []);

  const openHost = useCallback((id: string) => {
    setSelectedHostId(id);
    setGuestScreen("host");
    setPrivacyOpen(false);
  }, []);

  const openChain = useCallback((id: string) => {
    setSelectedChainId(id);
    setGuestScreen("chain");
    setPrivacyOpen(false);
  }, []);

  const bookChain = useCallback((id: string) => {
    setChainBookings((prev) => ({ ...prev, [id]: true }));
    setChainStatus((prev) => {
      const current = prev[id] || findChainRow(id)?.product.status || "open";
      if (current === "open") return { ...prev, [id]: "funded" };
      return prev[id] ? prev : { ...prev, [id]: current };
    });
  }, []);

  const advanceChain = useCallback((id: string, fallback: ChainStatus) => {
    setChainStatus((prev) => {
      const from = prev[id] || fallback;
      const to = nextChainStatus(from);
      return { ...prev, [id]: to };
    });
    setChainSettleNote(`Synced ${id} (Demo)`);
  }, []);

  const addOffer = useCallback((o: Omit<OfferDraft, "id">) => {
    setOffers((prev) => [...prev, { ...o, id: `offer-${Date.now()}` }]);
  }, []);

  const triggerSyncToHq = useCallback(() => {
    setAdminSyncStatus("queued");
    setHqReceiveNote("Queued at Country · waiting HQ receive (Demo)");
    window.setTimeout(() => {
      setAdminSyncStatus("synced");
      setHqReceiveNote("Last sync received from Thailand Country · Simulated");
    }, 1200);
  }, []);

  const addDsr = useCallback((type: "access" | "delete") => {
    setDsrRequests((prev) => [
      {
        id: `dsr-${Date.now()}`,
        type,
        status: "queued",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      mode,
      setMode,
      lane,
      setLane,
      privacyOpen,
      openPrivacy,
      closePrivacy,
      primaryLanguage,
      setPrimaryLanguage,
      uiLang,
      currency,
      setCurrency,
      sessionUser,
      signInDemo,
      signOut,
      authProviders,
      setProviderEnabled,
      addProvider,
      guestScreen,
      setGuestScreen: (s) => {
        setGuestScreen(s);
        setPrivacyOpen(s === "privacy");
      },
      selectedListing,
      openListing,
      selectedCommunityId,
      openCommunity,
      selectedHostId,
      openHost,
      selectedChainId,
      openChain,
      chainStatus,
      chainBookings,
      chainSettleNote,
      bookChain,
      advanceChain,
      exploreFilter,
      setExploreFilter,
      cartItem,
      setCartItem,
      offers,
      addOffer,
      hostScreen,
      setHostScreen,
      adminView,
      setAdminView,
      adminTab,
      setAdminTab,
      adminSyncStatus,
      triggerSyncToHq,
      hqReceiveNote,
      marketingConsent,
      setMarketingConsent,
      dsrRequests,
      addDsr,
    }),
    [
      mode,
      lane,
      setLane,
      privacyOpen,
      openPrivacy,
      closePrivacy,
      primaryLanguage,
      setPrimaryLanguage,
      uiLang,
      currency,
      setCurrency,
      sessionUser,
      signInDemo,
      signOut,
      authProviders,
      setProviderEnabled,
      addProvider,
      guestScreen,
      selectedListing,
      openListing,
      selectedCommunityId,
      openCommunity,
      selectedHostId,
      openHost,
      selectedChainId,
      openChain,
      chainStatus,
      chainBookings,
      chainSettleNote,
      bookChain,
      advanceChain,
      exploreFilter,
      cartItem,
      offers,
      addOffer,
      hostScreen,
      adminView,
      adminTab,
      adminSyncStatus,
      triggerSyncToHq,
      hqReceiveNote,
      marketingConsent,
      dsrRequests,
      addDsr,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
