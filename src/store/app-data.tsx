import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { telLink, whatsappLink, type SocialKey } from "@/config/site";
import { defaultServices, type Service } from "@/data/services";
import { defaultPortfolio, type PortfolioItem } from "@/data/portfolio";
import { defaultBlogPosts, type BlogPost } from "@/data/blog";
import { defaultStaff, type StaffMember } from "@/data/staff";
import { type ContactMessage, type QuoteRequest } from "@/data/demo";
import {
  defaultCompany,
  defaultWebsite,
  type CompanySettings,
  type WebsiteSettings,
} from "@/data/site-settings";
import { getDb, initAnalytics } from "@/lib/firebase";
import {
  addMessageDoc,
  addQuoteDoc,
  loadSiteBundle,
  saveCompany,
  saveMessages,
  savePortfolio,
  savePosts,
  saveQuotes,
  saveServices,
  saveStaff,
  saveWebsite,
  seedFirestoreDefaults,
  subscribeMessages,
  subscribeQuotes,
} from "@/lib/firestore-data";

export type { CompanySettings, WebsiteSettings };
export { defaultCompany, defaultWebsite };

/* ------------------------------------------------------------ context */

interface AppDataValue {
  hydrated: boolean;
  firebaseReady: boolean;
  firebaseError: string | null;
  services: Service[];
  setServices: Dispatch<SetStateAction<Service[]>>;
  portfolio: PortfolioItem[];
  setPortfolio: Dispatch<SetStateAction<PortfolioItem[]>>;
  quotes: QuoteRequest[];
  setQuotes: Dispatch<SetStateAction<QuoteRequest[]>>;
  messages: ContactMessage[];
  setMessages: Dispatch<SetStateAction<ContactMessage[]>>;
  company: CompanySettings;
  setCompany: Dispatch<SetStateAction<CompanySettings>>;
  website: WebsiteSettings;
  setWebsite: Dispatch<SetStateAction<WebsiteSettings>>;
  posts: BlogPost[];
  setPosts: Dispatch<SetStateAction<BlogPost[]>>;
  staff: StaffMember[];
  setStaff: Dispatch<SetStateAction<StaffMember[]>>;
  addQuote: (q: Omit<QuoteRequest, "id" | "createdAt" | "status" | "source">) => void;
  addMessage: (m: Omit<ContactMessage, "id" | "createdAt" | "read" | "source">) => void;
  seedCloud: () => Promise<void>;
  resetAll: () => void;
}

const AppDataContext = createContext<AppDataValue | null>(null);

const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function mergeCompany(s: CompanySettings): CompanySettings {
  const oldMaps = "https://maps.app.goo.gl/WgdvH4Dhr8mavVgbA";
  const savedMaps = s.mapsUrl?.trim() ?? "";
  return {
    ...defaultCompany,
    ...s,
    mapsUrl:
      !savedMaps || savedMaps === oldMaps || savedMaps.startsWith(oldMaps)
        ? defaultCompany.mapsUrl
        : savedMaps,
    socials: Object.fromEntries(
      (Object.keys(defaultCompany.socials) as SocialKey[]).map((key) => [
        key,
        s.socials?.[key]?.trim() || defaultCompany.socials[key],
      ]),
    ) as Record<SocialKey, string>,
  };
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [services, setServicesState] = useState<Service[]>(defaultServices);
  const [portfolio, setPortfolioState] = useState<PortfolioItem[]>(defaultPortfolio);
  const [quotes, setQuotesState] = useState<QuoteRequest[]>([]);
  const [messages, setMessagesState] = useState<ContactMessage[]>([]);
  const [company, setCompanyState] = useState<CompanySettings>(defaultCompany);
  const [website, setWebsiteState] = useState<WebsiteSettings>(defaultWebsite);
  const [posts, setPostsState] = useState<BlogPost[]>(defaultBlogPosts);
  const [staff, setStaffState] = useState<StaffMember[]>(defaultStaff);
  const [hydrated, setHydrated] = useState(false);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const skipCloud = useRef(true);
  const syncingRemote = useRef(false);

  useEffect(() => {
    let unsubQuotes: (() => void) | undefined;
    let unsubMessages: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const db = getDb();
      void initAnalytics();
      if (!db) {
        setHydrated(true);
        return;
      }
      try {
        const bundle = await loadSiteBundle(db);
        if (cancelled) return;
        syncingRemote.current = true;
        setCompanyState(mergeCompany(bundle.company));
        setWebsiteState({ ...defaultWebsite, ...bundle.website });
        setServicesState(bundle.services);
        setPortfolioState(bundle.portfolio);
        setPostsState(bundle.posts);
        setStaffState(bundle.staff);
        setQuotesState(bundle.quotes);
        setMessagesState(bundle.messages);
        setFirebaseReady(true);
        setFirebaseError(null);
        skipCloud.current = false;

        unsubQuotes = subscribeQuotes(db, (list) => {
          syncingRemote.current = true;
          setQuotesState(list);
        });
        unsubMessages = subscribeMessages(db, (list) => {
          syncingRemote.current = true;
          setMessagesState(list);
        });
      } catch (err) {
        console.error("[firebase] load failed", err);
        setFirebaseError(err instanceof Error ? err.message : "Firebase load failed");
        setFirebaseReady(false);
        skipCloud.current = true;
      } finally {
        if (!cancelled) setHydrated(true);
        queueMicrotask(() => {
          syncingRemote.current = false;
        });
      }
    })();

    return () => {
      cancelled = true;
      unsubQuotes?.();
      unsubMessages?.();
    };
  }, []);

  const persist = useCallback(async (fn: () => Promise<void>) => {
    if (skipCloud.current || syncingRemote.current) return;
    const db = getDb();
    if (!db) return;
    try {
      await fn();
      setFirebaseError(null);
    } catch (err) {
      console.error("[firebase] save failed", err);
      setFirebaseError(err instanceof Error ? err.message : "Firebase save failed");
    }
  }, []);

  const setServices: Dispatch<SetStateAction<Service[]>> = useCallback(
    (action) => {
      setServicesState((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        void persist(() => saveServices(getDb()!, next));
        return next;
      });
    },
    [persist],
  );

  const setPortfolio: Dispatch<SetStateAction<PortfolioItem[]>> = useCallback(
    (action) => {
      setPortfolioState((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        void persist(() => savePortfolio(getDb()!, next));
        return next;
      });
    },
    [persist],
  );

  const setQuotes: Dispatch<SetStateAction<QuoteRequest[]>> = useCallback(
    (action) => {
      setQuotesState((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        void persist(() => saveQuotes(getDb()!, next));
        return next;
      });
    },
    [persist],
  );

  const setMessages: Dispatch<SetStateAction<ContactMessage[]>> = useCallback(
    (action) => {
      setMessagesState((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        void persist(() => saveMessages(getDb()!, next));
        return next;
      });
    },
    [persist],
  );

  const setCompany: Dispatch<SetStateAction<CompanySettings>> = useCallback(
    (action) => {
      setCompanyState((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        void persist(() => saveCompany(getDb()!, next));
        return next;
      });
    },
    [persist],
  );

  const setWebsite: Dispatch<SetStateAction<WebsiteSettings>> = useCallback(
    (action) => {
      setWebsiteState((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        void persist(() => saveWebsite(getDb()!, next));
        return next;
      });
    },
    [persist],
  );

  const setPosts: Dispatch<SetStateAction<BlogPost[]>> = useCallback(
    (action) => {
      setPostsState((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        void persist(() => savePosts(getDb()!, next));
        return next;
      });
    },
    [persist],
  );

  const setStaff: Dispatch<SetStateAction<StaffMember[]>> = useCallback(
    (action) => {
      setStaffState((prev) => {
        const next = typeof action === "function" ? action(prev) : action;
        void persist(() => saveStaff(getDb()!, next));
        return next;
      });
    },
    [persist],
  );

  const addQuote = useCallback<AppDataValue["addQuote"]>(
    (q) => {
      const row: QuoteRequest = {
        ...q,
        id: uid("q"),
        createdAt: new Date().toISOString(),
        status: "new",
        source: "form",
      };
      setQuotesState((list) => [row, ...list]);
      const db = getDb();
      if (db) {
        void addQuoteDoc(db, row).catch((err) => {
          console.error("[firebase] addQuote failed", err);
          setFirebaseError(err instanceof Error ? err.message : "Quote save failed");
        });
      }
    },
    [],
  );

  const addMessage = useCallback<AppDataValue["addMessage"]>(
    (m) => {
      const row: ContactMessage = {
        ...m,
        id: uid("m"),
        createdAt: new Date().toISOString(),
        read: false,
        source: "form",
      };
      setMessagesState((list) => [row, ...list]);
      const db = getDb();
      if (db) {
        void addMessageDoc(db, row).catch((err) => {
          console.error("[firebase] addMessage failed", err);
          setFirebaseError(err instanceof Error ? err.message : "Message save failed");
        });
      }
    },
    [],
  );

  const seedCloud = useCallback(async () => {
    const db = getDb();
    if (!db) throw new Error("Firebase غير متاح");
    await seedFirestoreDefaults(db);
    const bundle = await loadSiteBundle(db);
    syncingRemote.current = true;
    setCompanyState(mergeCompany(bundle.company));
    setWebsiteState({ ...defaultWebsite, ...bundle.website });
    setServicesState(bundle.services);
    setPortfolioState(bundle.portfolio);
    setPostsState(bundle.posts);
    setStaffState(bundle.staff);
    setQuotesState(bundle.quotes);
    setMessagesState(bundle.messages);
    setFirebaseReady(true);
    skipCloud.current = false;
    queueMicrotask(() => {
      syncingRemote.current = false;
    });
  }, []);

  const resetAll = useCallback(() => {
    setServicesState(defaultServices);
    setPortfolioState(defaultPortfolio);
    setQuotesState([]);
    setMessagesState([]);
    setCompanyState(defaultCompany);
    setWebsiteState(defaultWebsite);
    setPostsState(defaultBlogPosts);
    setStaffState(defaultStaff);
    void persist(async () => {
      const db = getDb()!;
      await seedFirestoreDefaults(db);
    });
  }, [persist]);

  const value = useMemo<AppDataValue>(
    () => ({
      hydrated,
      firebaseReady,
      firebaseError,
      services,
      setServices,
      portfolio,
      setPortfolio,
      quotes,
      setQuotes,
      messages,
      setMessages,
      company,
      setCompany,
      website,
      setWebsite,
      posts,
      setPosts,
      staff,
      setStaff,
      addQuote,
      addMessage,
      seedCloud,
      resetAll,
    }),
    [
      hydrated,
      firebaseReady,
      firebaseError,
      services,
      setServices,
      portfolio,
      setPortfolio,
      quotes,
      setQuotes,
      messages,
      setMessages,
      company,
      setCompany,
      website,
      setWebsite,
      posts,
      setPosts,
      staff,
      setStaff,
      addQuote,
      addMessage,
      seedCloud,
      resetAll,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used inside AppDataProvider");
  return ctx;
}

/** Company contact details with ready-to-use links. */
export function useCompany() {
  const { company } = useAppData();
  return useMemo(
    () => ({
      ...company,
      tel: telLink(company.phone),
      wa: (message?: string) => whatsappLink(company.whatsapp, message),
    }),
    [company],
  );
}

export const visibleServices = (list: Service[]) => list.filter((s) => s.visible);
export const publishedPortfolio = (list: PortfolioItem[]) => list.filter((p) => p.published);
