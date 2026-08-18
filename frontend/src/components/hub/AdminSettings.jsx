import { useEffect, useState } from 'react';
import {
  Database,
  Download,
  Palette,
  RotateCcw,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  X,
} from 'lucide-react';
import './AdminSettings.css';

const STORAGE_KEY = 'pixel-panel-admin-settings';

const DEFAULTS = {
  accent: 'cyan',
  fontSize: 'medium',
  defaultStatus: 'Draft',
  reviewBeforePublish: true,
  matureWarning: true,
  autoModeration: true,
  allowRegistration: true,
  maintenanceMode: false,
  auditLog: true,
  automaticBackup: true,
  backupFrequency: 'Daily',
};

const ACCENTS = {
  yellow: { accent: '#f6e522', glow: 'rgba(246,229,34,.18)' },
  cyan: { accent: '#43e7f4', glow: 'rgba(67,231,244,.18)' },
  rose: { accent: '#ff63ad', glow: 'rgba(255,99,173,.18)' },
};

const FONT_SIZES = { small: '14px', medium: '16px', large: '18px' };

function loadSettings() {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return { ...DEFAULTS };
  }
}

function applyAppearance(settings) {
  const root = document.documentElement;
  const colors = ACCENTS[settings.accent] || ACCENTS.cyan;
  root.style.setProperty('--admin-cyan', colors.accent);
  root.style.setProperty('--admin-accent', colors.accent);
  root.style.setProperty('--admin-accent-glow', colors.glow);
  root.style.setProperty('--home-accent', colors.accent);
  root.style.setProperty('--app-font-size', FONT_SIZES[settings.fontSize] || FONT_SIZES.medium);
  root.style.fontSize = FONT_SIZES[settings.fontSize] || FONT_SIZES.medium;
}

function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" className={`admin-setting-toggle${checked ? ' is-on' : ''}`} aria-label={label} aria-pressed={checked} onClick={() => onChange(!checked)}>
      <span />
    </button>
  );
}

function Row({ title, description, children }) {
  return (
    <div className="admin-setting-row">
      <div><strong>{title}</strong>{description && <small>{description}</small>}</div>
      {children}
    </div>
  );
}

export default function AdminSettings({ open, onClose }) {
  const [settings, setSettings] = useState(loadSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    applyAppearance(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    const timer = window.setTimeout(() => setSaved(false), 900);
    return () => window.clearTimeout(timer);
  }, [settings]);

  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open, onClose]);

  function update(key, value) {
    setSettings((current) => ({ ...current, [key]: value }));
  }

  function resetSettings() {
    setSettings({ ...DEFAULTS });
  }

  function exportSettings() {
    const file = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pixel-panel-admin-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!open) return null;

  return (
    <div className="admin-settings-layer">
      <button className="admin-settings-backdrop" type="button" aria-label="Close settings" onClick={onClose} />
      <aside className="admin-settings-panel" role="dialog" aria-modal="true" aria-label="Administrator settings">
        <header className="admin-settings-head">
          <h2><Settings size={21} /> Admin Settings</h2>
          <div>{saved && <span className="admin-settings-saved">Saved</span>}<button type="button" onClick={onClose} aria-label="Close settings"><X size={22} /></button></div>
        </header>

        <div className="admin-settings-scroll">
          <section className="admin-settings-section">
            <h3><Palette size={17} /> Appearance</h3>
            <Row title="Theme"><span className="admin-setting-value">Dark Mode</span></Row>
            <div className="admin-setting-block"><strong>Accent Color</strong><div className="admin-setting-options">
              {Object.keys(ACCENTS).map((color) => <button key={color} type="button" className={`admin-option admin-option--${color}${settings.accent === color ? ' is-selected' : ''}`} onClick={() => update('accent', color)}><i />{color[0].toUpperCase() + color.slice(1)}</button>)}
            </div></div>
            <div className="admin-setting-block"><strong>Interface Font Size</strong><div className="admin-setting-options">
              {Object.keys(FONT_SIZES).map((size) => <button key={size} type="button" className={`admin-option${settings.fontSize === size ? ' is-selected' : ''}`} onClick={() => update('fontSize', size)}>{size[0].toUpperCase() + size.slice(1)}</button>)}
            </div></div>
          </section>

          <section className="admin-settings-section admin-settings-section--admin">
            <h3><SlidersHorizontal size={17} /> Publishing</h3>
            <Row title="Default Story Status" description="Initial status for a new story"><select value={settings.defaultStatus} onChange={(e) => update('defaultStatus', e.target.value)}><option>Draft</option><option>Ongoing</option><option>Completed</option></select></Row>
            <Row title="Review Before Publish" description="Require confirmation before a story goes live"><Toggle checked={settings.reviewBeforePublish} onChange={(value) => update('reviewBeforePublish', value)} label="Review before publish" /></Row>
            <Row title="Mature Content Warning" description="Require a warning on mature stories"><Toggle checked={settings.matureWarning} onChange={(value) => update('matureWarning', value)} label="Mature content warning" /></Row>
          </section>

          <section className="admin-settings-section admin-settings-section--admin">
            <h3><ShieldCheck size={17} /> Moderation & Security</h3>
            <Row title="Automatic Moderation" description="Flag suspicious story text for manual review"><Toggle checked={settings.autoModeration} onChange={(value) => update('autoModeration', value)} label="Automatic moderation" /></Row>
            <Row title="Administrator Audit Log" description="Record publish, edit and delete actions"><Toggle checked={settings.auditLog} onChange={(value) => update('auditLog', value)} label="Administrator audit log" /></Row>
          </section>

          <section className="admin-settings-section admin-settings-section--admin">
            <h3><UsersRound size={17} /> Platform Access</h3>
            <Row title="Allow New Registrations" description="Let new readers create Pixel Panel accounts"><Toggle checked={settings.allowRegistration} onChange={(value) => update('allowRegistration', value)} label="Allow new registrations" /></Row>
            <Row title="Maintenance Mode" description="Temporarily restrict the website to administrators"><Toggle checked={settings.maintenanceMode} onChange={(value) => update('maintenanceMode', value)} label="Maintenance mode" /></Row>
          </section>

          <section className="admin-settings-section admin-settings-section--admin">
            <h3><Database size={17} /> Data & Backup</h3>
            <Row title="Automatic Story Backup" description="Keep recovery copies of story changes"><Toggle checked={settings.automaticBackup} onChange={(value) => update('automaticBackup', value)} label="Automatic story backup" /></Row>
            <Row title="Backup Frequency"><select disabled={!settings.automaticBackup} value={settings.backupFrequency} onChange={(e) => update('backupFrequency', e.target.value)}><option>Daily</option><option>Weekly</option><option>Monthly</option></select></Row>
          </section>

          <div className="admin-settings-actions">
            <button type="button" onClick={resetSettings}><RotateCcw size={16} /> Reset</button>
            <button type="button" onClick={exportSettings}><Download size={16} /> Export Settings</button>
          </div>
        </div>
      </aside>
    </div>
  );
}