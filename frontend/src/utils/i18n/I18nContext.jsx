import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './en.json';
import my from './my.json';
import {
  LANGUAGE_CHANGE_EVENT,
  loadLanguage,
  saveLanguage,
} from '../languageState';

const DICTIONARIES = { en, my };

const I18nContext = createContext(null);

function resolve(dictionary, key) {
  // Supports dotted paths (e.g. "genres.romance") into nested dictionary
  // objects, and plain keys (the vast majority — raw English string as key).
  return key.split('.').reduce((node, part) => (node == null ? node : node[part]), dictionary);
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => loadLanguage());

  useEffect(() => {
    function syncFromStorage() {
      setLanguageState(loadLanguage());
    }
    // LanguagePage.jsx dispatches this on selection — listen for it without
    // modifying that emitter. Also listen for our own change event (same-tab
    // writes via setLanguage) and the native storage event (cross-tab sync).
    window.addEventListener('languagechange', syncFromStorage);
    window.addEventListener(LANGUAGE_CHANGE_EVENT, syncFromStorage);
    window.addEventListener('storage', syncFromStorage);
    return () => {
      window.removeEventListener('languagechange', syncFromStorage);
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, syncFromStorage);
      window.removeEventListener('storage', syncFromStorage);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((code) => {
    saveLanguage(code);
    setLanguageState(code);
  }, []);

  const t = useCallback(
    (key, fallback) => {
      const current = resolve(DICTIONARIES[language], key);
      if (current !== undefined && current !== null) return current;

      const english = resolve(DICTIONARIES.en, key);
      if (english !== undefined && english !== null) return english;

      return fallback ?? key;
    },
    [language]
  );

  const value = useMemo(() => ({ t, language, setLanguage }), [t, language, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return ctx;
}
