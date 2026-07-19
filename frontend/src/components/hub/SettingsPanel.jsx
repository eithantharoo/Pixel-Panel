import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  BookOpen,
  ChevronRight,
  Eye,
  Globe,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Settings,
  Shield,
  Type,
  User,
  X,
} from 'lucide-react';
import { images } from '../../assets/images';
import './SettingsPanel.css';

/* ── Persisted settings helpers ─────────────────────────────────── */
const STORAGE_KEY = 'pixel-panel-settings';

const DEFAULTS = {
  accentColor: 'yellow',   // yellow | cyan | rose
  fontSize: 'medium',      // small | medium | large
  readDirection: 'ltr',    // ltr | rtl
  autoAdvance: false,
  showChapterNumbers: true,
  notifNewChapter: true,
  notifRecommendations: true,
  notifDigest: false,
  saveHistory: true,
  syncDevices: false,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveSettings(settings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch { /* noop */ }
}

/* Apply accent + font-size CSS variables to the root element */
function applySettings(settings) {
  const root = document.documentElement;

  const ACCENT_MAP = {
    yellow: { accent: '#fff43d', accentHover: '#e9df2e' },
    cyan:   { accent: '#4df5ff', accentHover: '#36dfe8' },
    rose:   { accent: '#ff6b9d', accentHover: '#e8578a' },
  };
  const { accent, accentHover } = ACCENT_MAP[settings.accentColor] ?? ACCENT_MAP.yellow;
  root.style.setProperty('--home-accent', accent);
  root.style.setProperty('--home-accent-hover', accentHover);
  root.style.setProperty('--text-yellow', accent);
  root.style.setProperty('--color-accent-yellow', accent);

  const FONT_MAP = { small: '14px', medium: '16px', large: '18px' };
  root.style.setProperty('--app-font-size', FONT_MAP[settings.fontSize] ?? '16px');
  root.style.fontSize = FONT_MAP[settings.fontSize] ?? '16px';
}

/* ── Sub-components ──────────────────────────────────────────────── */
function SectionHeader({ icon: Icon, label }) {
  return (
    <div className="sp-section__header">
      <Icon size={15} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange, id }) {
  return (
    <label className="sp-toggle-row" htmlFor={id}>
      <div className="sp-toggle-row__text">
        <span className="sp-toggle-row__label">{label}</span>
        {description && <span className="sp-toggle-row__desc">{description}</span>}
      </div>
      <div className="sp-toggle" aria-hidden="true">
        <input
          type="checkbox"
          id={id}
          className="sp-toggle__input"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="sp-toggle__track">
          <span className="sp-toggle__thumb" />
        </span>
      </div>
    </label>
  );
}

function ChipGroup({ options, value, onChange }) {
  return (
    <div className="sp-chip-group" role="group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`sp-chip${value === opt.value ? ' sp-chip--active' : ''}`}
          onClick={() => onChange(opt.value)}
          style={value === opt.value && opt.color ? { borderColor: opt.color, color: opt.color } : undefined}
        >
          {opt.swatch && (
            <span className="sp-chip__swatch" style={{ background: opt.color }} />
          )}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export default function SettingsPanel({ open, onClose }) {
  const [settings, setSettings] = useState(loadSettings);
  const panelRef = useRef(null);

  /* Apply on mount + whenever settings change */
  useEffect(() => { applySettings(settings); saveSettings(settings); }, [settings]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape') onClose?.(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  /* Trap focus inside panel when open */
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  function set(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`sp-backdrop${open ? ' sp-backdrop--visible' : ''}`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        className={`sp-panel${open ? ' sp-panel--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        tabIndex={-1}
      >
        {/* ── Header ── */}
        <div className="sp-panel__header">
          <div className="sp-panel__title">
            <Settings size={18} className="sp-panel__title-icon" aria-hidden="true" />
            <span>Settings</span>
          </div>
          <button
            type="button"
            className="sp-panel__close"
            aria-label="Close settings"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="sp-panel__body">

          {/* ─ Account card ─ */}
          <div className="sp-account">
            <div className="sp-account__avatar">
              <img src={images.profile} alt="Hsu Myat" />
            </div>
            <div className="sp-account__info">
              <p className="sp-account__name">Hsu Myat</p>
              <p className="sp-account__email">hsu.myat@pixelpanel.io</p>
            </div>
            <button type="button" className="sp-account__edit" aria-label="Edit profile">
              <User size={15} />
              <span>Edit</span>
            </button>
          </div>

          {/* ─ Appearance ─ */}
          <section className="sp-section">
            <SectionHeader icon={Palette} label="Appearance" />

            <div className="sp-row">
              <span className="sp-row__label">
                <Moon size={14} aria-hidden="true" />
                Theme
              </span>
              <span className="sp-badge">
                <Monitor size={12} aria-hidden="true" />
                Dark Mode
              </span>
            </div>

            <div className="sp-row sp-row--col">
              <span className="sp-row__label">
                <Palette size={14} aria-hidden="true" />
                Accent Color
              </span>
              <ChipGroup
                value={settings.accentColor}
                onChange={(v) => set('accentColor', v)}
                options={[
                  { value: 'yellow', label: 'Yellow', color: '#fff43d', swatch: true },
                  { value: 'cyan',   label: 'Cyan',   color: '#4df5ff', swatch: true },
                  { value: 'rose',   label: 'Rose',   color: '#ff6b9d', swatch: true },
                ]}
              />
            </div>

            <div className="sp-row sp-row--col">
              <span className="sp-row__label">
                <Type size={14} aria-hidden="true" />
                Font Size
              </span>
              <ChipGroup
                value={settings.fontSize}
                onChange={(v) => set('fontSize', v)}
                options={[
                  { value: 'small',  label: 'Small'  },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large',  label: 'Large'  },
                ]}
              />
            </div>
          </section>

          {/* ─ Reading ─ */}
          <section className="sp-section">
            <SectionHeader icon={BookOpen} label="Reading" />

            <div className="sp-row sp-row--col">
              <span className="sp-row__label">
                <Globe size={14} aria-hidden="true" />
                Reading Direction
              </span>
              <ChipGroup
                value={settings.readDirection}
                onChange={(v) => set('readDirection', v)}
                options={[
                  { value: 'ltr', label: '← Left to Right' },
                  { value: 'rtl', label: 'Right to Left →' },
                ]}
              />
            </div>

            <ToggleRow
              id="auto-advance"
              label="Auto-advance Chapters"
              description="Jump to next chapter when you finish reading"
              checked={settings.autoAdvance}
              onChange={(v) => set('autoAdvance', v)}
            />

            <ToggleRow
              id="chapter-numbers"
              label="Show Chapter Numbers"
              description="Display chapter numbers on manga covers"
              checked={settings.showChapterNumbers}
              onChange={(v) => set('showChapterNumbers', v)}
            />
          </section>

          {/* ─ Notifications ─ */}
          <section className="sp-section">
            <SectionHeader icon={Bell} label="Notifications" />

            <ToggleRow
              id="notif-new"
              label="New Chapter Alerts"
              description="Get notified when a new chapter drops"
              checked={settings.notifNewChapter}
              onChange={(v) => set('notifNewChapter', v)}
            />

            <ToggleRow
              id="notif-recs"
              label="Recommendations"
              description="Personalised picks based on your reads"
              checked={settings.notifRecommendations}
              onChange={(v) => set('notifRecommendations', v)}
            />

            <ToggleRow
              id="notif-digest"
              label="Weekly Digest"
              description="A roundup of trending titles every Sunday"
              checked={settings.notifDigest}
              onChange={(v) => set('notifDigest', v)}
            />
          </section>

          {/* ─ Privacy ─ */}
          <section className="sp-section">
            <SectionHeader icon={Shield} label="Privacy" />

            <ToggleRow
              id="save-history"
              label="Save Reading History"
              description="Keep track of chapters you've read"
              checked={settings.saveHistory}
              onChange={(v) => set('saveHistory', v)}
            />

            <ToggleRow
              id="sync-devices"
              label="Sync Across Devices"
              description="Continue where you left off on any device"
              checked={settings.syncDevices}
              onChange={(v) => set('syncDevices', v)}
            />

            <button type="button" className="sp-link-row" aria-label="View privacy policy">
              <Eye size={14} aria-hidden="true" />
              Privacy Policy
              <ChevronRight size={14} className="sp-link-row__arrow" aria-hidden="true" />
            </button>
          </section>

          {/* ─ Sign out ─ */}
          <section className="sp-section sp-section--danger">
            <button type="button" className="sp-signout">
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </button>
          </section>

        </div>
      </aside>
    </>
  );
}
