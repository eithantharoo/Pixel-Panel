import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  BookOpen,
  Check,
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

const ACCENT_MAP = {
  yellow: { accent: '#fff43d', accentHover: '#e9df2e' },
  cyan:   { accent: '#4df5ff', accentHover: '#36dfe8' },
  rose:   { accent: '#ff6b9d', accentHover: '#e8578a' },
};

const FONT_MAP = { small: '13px', medium: '15px', large: '18px' };

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

/*
 * applySettings — injects a <style> tag so overrides win over the
 * scoped `.home-page { --home-accent }` declarations in HomePage.css.
 */
function applySettings(settings) {
  const { accent, accentHover } = ACCENT_MAP[settings.accentColor] ?? ACCENT_MAP.yellow;
  const fontSize = FONT_MAP[settings.fontSize] ?? '15px';

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

/* ── Toast ───────────────────────────────────────────────────────── */
function Toast({ message }) {
  return (
    <div className="sp-toast" role="status" aria-live="polite">
      <Check size={14} aria-hidden="true" />
      {message}
    </div>
  );
}

/* ── Privacy Policy Modal ────────────────────────────────────────── */
function PrivacyModal({ onClose }) {
  return (
    <div className="sp-modal-backdrop" onClick={onClose}>
      <div className="sp-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Privacy Policy">
        <div className="sp-modal__header">
          <h2 className="sp-modal__title">Privacy Policy</h2>
          <button type="button" className="sp-panel__close" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        <div className="sp-modal__body">
          <p><strong>Data We Collect</strong></p>
          <p>Pixel Panel stores your reading history, bookmarks, and preferences locally on your device using localStorage. No personal data is sent to external servers.</p>
          <p><strong>Reading History</strong></p>
          <p>Your chapter progress and history are stored locally. You can clear this at any time by toggling "Save Reading History" off in Settings → Privacy.</p>
          <p><strong>Notifications</strong></p>
          <p>Notification preferences are saved locally and are not used to send real push notifications in this version of the app.</p>
          <p><strong>Third-Party Services</strong></p>
          <p>Pixel Panel does not share any data with third parties. All content is served locally for demonstration purposes.</p>
          <p><strong>Contact</strong></p>
          <p>For privacy enquiries, email us at <a href="mailto:privacy@pixelpanel.io" className="sp-modal__link">privacy@pixelpanel.io</a></p>
        </div>
      </div>
    </div>
  );
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
  const navigate = useNavigate();
  const [settings, setSettings] = useState(loadSettings);
  const [toast, setToast] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const panelRef = useRef(null);
  const toastTimer = useRef(null);

  /* Apply on mount + whenever settings change */
  useEffect(() => {
    applySettings(settings);
    saveSettings(settings);
  }, [settings]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    function onKey(e) { if (e.key === 'Escape' && !showPrivacy) onClose?.(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, showPrivacy]);

  /* Focus panel when open */
  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  /* Show a brief toast confirmation */
  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

  function set(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    showToast('Setting saved');
  }

  function handleSignOut() {
    localStorage.removeItem(STORAGE_KEY);
    onClose?.();
    navigate('/');
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

          {/* Toast */}
          {toast && <Toast message={toast} />}

          {/* ─ Account card ─ */}
          <div className="sp-account">
            <div className="sp-account__avatar">
              <img src={images.profile} alt="Hsu Myat" />
            </div>
            <div className="sp-account__info">
              <p className="sp-account__name">Hsu Myat</p>
              <p className="sp-account__email">hsu.myat@pixelpanel.io</p>
            </div>
            <button
              type="button"
              className="sp-account__edit"
              aria-label="Edit profile"
              onClick={() => showToast('Profile editing coming soon!')}
            >
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

            <button
              type="button"
              className="sp-link-row"
              aria-label="View privacy policy"
              onClick={() => setShowPrivacy(true)}
            >
              <Eye size={14} aria-hidden="true" />
              Privacy Policy
              <ChevronRight size={14} className="sp-link-row__arrow" aria-hidden="true" />
            </button>
          </section>

          {/* ─ Sign out ─ */}
          <section className="sp-section sp-section--danger">
            <button type="button" className="sp-signout" onClick={handleSignOut}>
              <LogOut size={16} aria-hidden="true" />
              Sign out
            </button>
          </section>

        </div>
      </aside>

      {/* Privacy Policy Modal */}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </>
  );
}
