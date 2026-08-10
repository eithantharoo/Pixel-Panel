import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import './styles/global.css';
import { loadSettings, applySettings } from './utils/settingsState';

// Apply persisted accent color + font size before first render
applySettings(loadSettings());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
