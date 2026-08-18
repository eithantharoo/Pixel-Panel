import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Eye,
  Globe,
  Palette,
  Settings,
  Shield,
  Type,
  X,
} from 'lucide-react';
import {
  loadSettings,
  saveSettings,
  applySettings,
  SETTINGS_DEFAULTS as DEFAULTS,
} from '../../utils/settingsState';
import { useTranslation } from '../../utils/i18n/I18nContext';
import './SettingsPanel.css';


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
  const { t } = useTranslation();
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
    showToast(t('Setting saved'));
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
            <span>{t('Settings')}</span>
          </div>
          <button
            type="button"
            className="sp-panel__close"
            aria-label={t('Close settings')}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="sp-panel__body">

          {/* Toast */}
          {toast && <Toast message={toast} />}

          {/* ─ Appearance ─ */}
          <section className="sp-section">
            <SectionHeader icon={Palette} label={t('Appearance')} />

            <div className="sp-row sp-row--col">
              <span className="sp-row__label">
                <Palette size={14} aria-hidden="true" />
                {t('Accent Color')}
              </span>
              <ChipGroup
                value={settings.accentColor}
                onChange={(v) => set('accentColor', v)}
                options={[
                  { value: 'yellow', label: t('Yellow'), color: '#fff43d', swatch: true },
                  { value: 'cyan', label: t('Cyan'), color: '#4df5ff', swatch: true },
                  { value: 'rose', label: t('Rose'), color: '#ff6b9d', swatch: true },
                ]}
              />
            </div>

            <div className="sp-row sp-row--col">
              <span className="sp-row__label">
                <Type size={14} aria-hidden="true" />
                {t('Font Size')}
              </span>
              <ChipGroup
                value={settings.fontSize}
                onChange={(v) => set('fontSize', v)}
                options={[
                  { value: 'small', label: t('Small') },
                  { value: 'medium', label: t('Medium') },
                  { value: 'large', label: t('Large') },
                ]}
              />
            </div>
          </section>

          {/* ─ Reading ─ */}
          <section className="sp-section">
            <SectionHeader icon={BookOpen} label={t('Reading')} />

            <div className="sp-row sp-row--col">
              <span className="sp-row__label">
                <Globe size={14} aria-hidden="true" />
                {t('Reading Direction')}
              </span>
              <ChipGroup
                value={settings.readDirection}
                onChange={(v) => set('readDirection', v)}
                options={[
                  { value: 'ltr', label: t('Left to Right') },
                  { value: 'rtl', label: t('Right to Left') },
                ]}
              />
            </div>

            <ToggleRow
              id="auto-advance"
              label={t('Auto-advance Chapters')}
              description={t('Jump to next chapter when you finish reading')}
              checked={settings.autoAdvance}
              onChange={(v) => set('autoAdvance', v)}
            />

            <ToggleRow
              id="chapter-numbers"
              label={t('Show Chapter Numbers')}
              description={t('Display chapter numbers on manga covers')}
              checked={settings.showChapterNumbers}
              onChange={(v) => set('showChapterNumbers', v)}
            />
          </section>

          {/* ─ Notifications ─ */}
          <section className="sp-section">
            <SectionHeader icon={Bell} label={t('Notifications')} />

            <ToggleRow
              id="notif-new"
              label={t('New Chapter Alerts')}
              description={t('Get notified when a new chapter drops')}
              checked={settings.notifNewChapter}
              onChange={(v) => set('notifNewChapter', v)}
            />

            <ToggleRow
              id="notif-recs"
              label={t('Recommendations', 'Recommendations')}
              description={t('Personalised picks based on your reads')}
              checked={settings.notifRecommendations}
              onChange={(v) => set('notifRecommendations', v)}
            />

            <ToggleRow
              id="notif-digest"
              label={t('Weekly Digest')}
              description={t('A roundup of trending titles every Sunday')}
              checked={settings.notifDigest}
              onChange={(v) => set('notifDigest', v)}
            />
          </section>

          {/* ─ Privacy ─ */}
          <section className="sp-section">
            <SectionHeader icon={Shield} label={t('Privacy')} />

            <ToggleRow
              id="save-history"
              label={t('Save Reading History')}
              description={t("Keep track of chapters you've read")}
              checked={settings.saveHistory}
              onChange={(v) => set('saveHistory', v)}
            />

            <ToggleRow
              id="sync-devices"
              label={t('Sync Across Devices')}
              description={t('Continue where you left off on any device')}
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
              {t('Privacy Policy')}
              <ChevronRight size={14} className="sp-link-row__arrow" aria-hidden="true" />
            </button>
          </section>

        </div>
      </aside>

      {/* Privacy Policy Modal */}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </>
  );
}
