import { useEffect, useState } from 'react';
import {
  applySettings,
  loadSettings,
  SETTINGS_CHANGE_EVENT,
  SETTINGS_STORAGE_KEY,
} from '../utils/settingsState';

// Keep page settings synchronized with saves in this tab and native storage
// events from other tabs. This was previously duplicated in both page files.
export function useLiveSettings() {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    function syncSettings() {
      const next = loadSettings();
      applySettings(next);
      setSettings(next);
    }

    function onStorage(e) {
      if (e.key === SETTINGS_STORAGE_KEY) syncSettings();
    }

    window.addEventListener('storage', onStorage);
    window.addEventListener(SETTINGS_CHANGE_EVENT, syncSettings);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(SETTINGS_CHANGE_EVENT, syncSettings);
    };
  }, []);

  return settings;
}
