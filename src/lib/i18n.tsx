import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "en" | "ar";

/** A value that exists in both supported languages. */
export interface Localized<T> {
  en: T;
  ar: T;
}

export function pick<T>(value: Localized<T>, lang: Language): T {
  return value[lang];
}

const STORAGE_KEY = "driver2x_lang";

interface LanguageContextValue {
  lang: Language;
  dir: "ltr" | "rtl";
  isRtl: boolean;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function dirFor(lang: Language): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

/**
 * Applies dir/lang to <html> as a side effect and persists the choice to
 * localStorage. SSR always renders English/LTR (no way to know the stored
 * preference before hydration without a backend); the client corrects this
 * on mount before paint is visible to the user in practice, matching the
 * "no backend required" constraint.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "ar") setLangState(stored);
    } catch {
      // localStorage unavailable (private mode, etc.) -- default to English.
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = dirFor(lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Best-effort only.
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "ar" : "en");
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider
      value={{ lang, dir: dirFor(lang), isRtl: lang === "ar", setLang, toggleLang }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
