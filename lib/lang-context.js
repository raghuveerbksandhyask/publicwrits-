'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const LangContext = createContext({
  lang: 'kn',
  setLang: () => {},
  toggleLang: () => {},
});

const STORAGE_KEY = 'publicwrits-lang';

export function LangProvider({ children }) {
  const [lang, setLang] = useState('kn');
  const [hydrated, setHydrated] = useState(false);

  // Read saved preference on mount (client only)
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'kn' || stored === 'en') {
      setLang(stored);
    }
    setHydrated(true);
  }, []);

  // Persist + reflect on <html lang="">
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang, hydrated]);

  const toggleLang = () => setLang((prev) => (prev === 'kn' ? 'en' : 'kn'));

  return (
    <LangContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

// Small helper: pick the right string from a {kn, en} object
export function t(field, lang) {
  if (!field) return '';
  return field[lang] ?? field.kn ?? field.en ?? '';
}
