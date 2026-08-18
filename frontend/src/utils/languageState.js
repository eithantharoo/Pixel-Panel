/* ── Pixel Panel — shared language state ─────────────────────────
   Mirrors settingsState.js's load/save + change-event pattern.
   Reuses the 'pixel-panel-language' key LanguagePage.jsx already
   writes to — do not rename it, LanguagePage's own dispatch code
   must keep working unmodified. */
export const LANGUAGE_STORAGE_KEY = 'pixel-panel-language';
export const LANGUAGE_CHANGE_EVENT = 'pixel-panel-language-changed';

export const DEFAULT_LANGUAGE = 'en';
export const SUPPORTED_LANGUAGES = ['en', 'my'];

export function loadLanguage() {
  try {
    const raw = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(raw) ? raw : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function saveLanguage(code) {
  if (!SUPPORTED_LANGUAGES.includes(code)) return;
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    // Native storage events only fire in other tabs, so notify this tab too.
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  } catch { /* noop */ }
}
