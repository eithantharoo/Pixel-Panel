import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import './styles/global.css';
import { loadSettings, applySettings } from './utils/settingsState';
import { I18nProvider } from './utils/i18n/I18nContext';

// Apply persisted accent color + font size before first render
applySettings(loadSettings());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <App />
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>
);
