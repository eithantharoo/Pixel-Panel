/* ── Pixel Panel — shared settings state ────────────────────────── */
export const SETTINGS_STORAGE_KEY = 'pixel-panel-settings';

export const SETTINGS_DEFAULTS = {
  theme: 'dark',           // 'light' | 'dark'
  accentColor: 'yellow',
  fontSize: 'medium',
  readDirection: 'ltr',
  autoAdvance: false,
  showChapterNumbers: true,
  notifNewChapter: true,
  notifRecommendations: true,
  notifDigest: false,
  saveHistory: true,
  syncDevices: false,
};

export const ACCENT_MAP = {
  yellow: { accent: '#fff43d', accentHover: '#e9df2e' },
  cyan:   { accent: '#4df5ff', accentHover: '#36dfe8' },
  rose:   { accent: '#ff6b9d', accentHover: '#e8578a' },
};

export const FONT_MAP = { small: '13px', medium: '15px', large: '18px' };

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? { ...SETTINGS_DEFAULTS, ...JSON.parse(raw) } : { ...SETTINGS_DEFAULTS };
  } catch {
    return { ...SETTINGS_DEFAULTS };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    // Notify same-tab listeners (storage event only fires cross-tab normally)
    window.dispatchEvent(new StorageEvent('storage', {
      key: SETTINGS_STORAGE_KEY,
      newValue: JSON.stringify(settings),
    }));
  } catch { /* noop */ }
}

/**
 * Injects / updates a <style id="pp-theme-override"> tag so CSS
 * custom-property overrides win over scoped declarations in HomePage.css.
 * Also sets data-theme on <html> for the dark-mode selector blocks.
 */
export function applySettings(settings) {
  const { accent, accentHover } = ACCENT_MAP[settings.accentColor] ?? ACCENT_MAP.yellow;
  const fontSize = FONT_MAP[settings.fontSize] ?? '15px';
  const isDark = settings.theme === 'dark';

  // Toggle the data-theme attribute — CSS dark-mode overrides key off this
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

  let el = document.getElementById('pp-theme-override');
  if (!el) {
    el = document.createElement('style');
    el.id = 'pp-theme-override';
    document.head.appendChild(el);
  }

  el.textContent = `
    .home-page, .reader-page {
      --home-accent: ${accent} !important;
      --home-accent-hover: ${accentHover} !important;
    }
    :root {
      --text-yellow: ${accent};
      --color-accent-yellow: ${accent};
    }
    html { font-size: ${fontSize}; }
    .manga-card__star { fill: ${accent} !important; color: ${accent} !important; }
    .btn-yellow { background: ${accent} !important; }
    .sp-panel__title-icon, .hp-panel__title-icon,
    .hp-hero__icon, .trending-expanded__flame { color: ${accent} !important; }
  `;
}
