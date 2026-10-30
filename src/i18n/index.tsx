import { createContext, useContext, useEffect, type ReactNode } from "react";
import { dict } from "./dictionary";

/** Site is Arabic-only. Kept as a type alias for bilingual content fields. */
export type Lang = "ar" | "en";

export interface Bilingual {
  ar: string;
  en: string;
}

interface LangContextValue {
  lang: Lang;
  dir: "rtl";
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** Translate a dictionary key, optionally interpolating `{name}` placeholders */
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Always returns the Arabic side of a bilingual value */
  bi: (b: Bilingual | undefined | null) => string;
  /** Locale-aware date formatting (Arabic) */
  formatDate: (iso: string, opts?: Intl.DateTimeFormatOptions) => string;
}

const LanguageContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = "roead-lang";

export function LanguageProvider({ children }: { children: ReactNode; defaultLang?: Lang }) {
  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value: LangContextValue = {
    lang: "ar",
    dir: "rtl",
    setLang: () => {},
    toggle: () => {},
    t: (key, vars) => {
      const entry = dict[key];
      let text = entry ? entry.ar : key;
      if (vars)
        for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, String(v));
      return text;
    },
    bi: (b) => (b ? b.ar || b.en || "" : ""),
    formatDate: (iso, opts) => {
      try {
        return new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
          year: "numeric",
          month: "short",
          day: "numeric",
          ...opts,
        }).format(new Date(iso));
      } catch {
        return iso.slice(0, 10);
      }
    },
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
