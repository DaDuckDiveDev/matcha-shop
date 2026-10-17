import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STRINGS } from '../data/i18n.js';

const LangContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k, pick: (o) => o });

const KEY = 'mochiko.lang';

function detect() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'sr') return saved;
  } catch {}
  const nav = (navigator.language || 'en').toLowerCase();
  return nav.startsWith('sr') || nav.startsWith('hr') || nav.startsWith('bs') ? 'sr' : 'en';
}

function get(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(detect);

  const setLang = useCallback((next) => {
    setLangState(next);
    try { localStorage.setItem(KEY, next); } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => {
    const dict = STRINGS[lang] || STRINGS.en;
    const t = (key, ...args) => {
      const v = get(dict, key) ?? get(STRINGS.en, key) ?? key;
      return typeof v === 'function' ? v(...args) : v;
    };
    // pick({en, sr}) → the current language's string
    const pick = (o) => (o && typeof o === 'object' ? o[lang] ?? o.en ?? '' : o);
    return { lang, setLang, t, pick };
  }, [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
