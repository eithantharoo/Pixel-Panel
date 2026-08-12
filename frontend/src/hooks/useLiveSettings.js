import { useEffect, useState } from 'react';
import { loadSettings } from '../utils/settingsState';

// Re-reads settings from localStorage whenever SettingsPanel saves (it
// fires a storage event). Was duplicated identically in HomePage.jsx and
// ReaderPage.jsx.
export function useLiveSettings() {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'pixel-panel-settings') setSettings(loadSettings());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return settings;
}
