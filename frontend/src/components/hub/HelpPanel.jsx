import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Check,
  ChevronDown,
  HelpCircle,
  Keyboard,
  Lightbulb,
  MessageSquare,
  Plus,
  Search,
  Send,
  X,
} from 'lucide-react';
import './HelpPanel.css';

/* ── FAQ data ────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    id: 'faq-1',
    q: 'How do I start reading a manga?',
    a: 'From the Home page, click on any manga card in the "For You", "Newly Released", or "Popular" sections. You can also click any book in the Trending sidebar. This opens the book detail view — hit the "Read" button to jump into the chapter list.',
  },
  {
    id: 'faq-2',
    q: 'How do I bookmark or favorite a title?',
    a: 'Open the book detail view and press the ❤ Favorite button. All favorited titles appear under the "Favorites" section in the sidebar. You can also click the heart icon in the header at any time.',
  },
  {
    id: 'faq-3',
    q: 'Can I read manga offline?',
    a: 'Offline reading is coming soon! We are working on a download feature that lets you cache chapters to your device. Enable "Sync Across Devices" in Settings to be notified when it launches.',
  },
  {
    id: 'faq-4',
    q: 'Where can I find my reading history?',
    a: 'Click "History" in the left sidebar to see every chapter you have opened, along with your progress and when you last read it. You can also toggle history tracking in Settings → Privacy.',
  },
  {
    id: 'faq-5',
    q: 'How does the Trending sidebar work?',
    a: 'The Trending sidebar shows the top-ranked titles updated daily. Click "View All" to expand a full grid of all trending titles. Clicking any trending book opens it directly in the Reader.',
  },
  {
    id: 'faq-6',
    q: 'Can I change the reading direction?',
    a: 'Yes! Go to Settings → Reading → Reading Direction and switch between Left-to-Right (Western style) and Right-to-Left (Japanese manga style). The setting is saved automatically.',
  },
  {
    id: 'faq-7',
    q: 'How do I search for a specific title?',
    a: 'Use the search bar at the top of the header. Type any part of a title, genre, or chapter name. Results filter instantly across the current view. You can also combine search with the Genres dropdown.',
  },
  {
    id: 'faq-8',
    q: 'How do I report a missing chapter or wrong content?',
    a: 'Use the "Report a Bug" quick link below. Describe the manga title, chapter number, and what you expected to see. Our team reviews reports within 24–48 hours.',
  },
  {
    id: 'faq-9',
    q: 'Is Pixel Panel free to use?',
    a: 'Yes — Pixel Panel is completely free. We plan to introduce an optional Supporter tier in the future that unlocks early-access chapters and removes ads, but the core reading experience will always be free.',
  },
  {
    id: 'faq-10',
    q: 'How do I request a title to be added?',
    a: 'Click "Request a Title" in the quick links below and fill in the form. Popular requests are reviewed weekly and the most-requested titles are prioritised for addition.',
  },
];

/* ── Keyboard shortcuts ──────────────────────────────────────────── */
const SHORTCUTS = [
  { keys: ['R'],      action: 'Start reading selected book'  },
  { keys: ['F'],      action: 'Toggle favorite'              },
  { keys: ['Esc'],    action: 'Close panel / go back'        },
  { keys: ['←', '→'], action: 'Previous / next chapter page' },
];

/* ── Accordion item — uses a fixed large max-height for animation ── */
function FaqItem({ item, open, onToggle }) {
  return (
    <div className={`hp-faq-item${open ? ' hp-faq-item--open' : ''}`}>
      <button
        type="button"
        className="hp-faq-item__question"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{item.q}</span>
        <ChevronDown size={16} className="hp-faq-item__arrow" aria-hidden="true" />
      </button>
      {/* Use a large fixed max-height so the CSS transition works reliably
          (measuring scrollHeight during render gives 0 because the div is hidden) */}
      <div
        className="hp-faq-item__body"
        style={{ maxHeight: open ? '400px' : '0px' }}
      >
        <p className="hp-faq-item__answer">{item.a}</p>
      </div>
    </div>
  );
}

/* ── Inline form modal (Report / Request) ────────────────────────── */
function FormModal({ title, placeholder, onClose, onSubmit }) {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    setSent(true);
    setTimeout(() => { onSubmit?.(); onClose(); }, 1400);
  }

  return (
    <div className="hp-modal-backdrop" onClick={onClose}>
      <div
        className="hp-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="hp-modal__header">
          <h3 className="hp-modal__title">{title}</h3>
          <button type="button" className="hp-panel__close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {sent ? (
          <div className="hp-modal__success">
            <Check size={28} className="hp-modal__check" aria-hidden="true" />
            <p>Submitted! We'll review it soon.</p>
          </div>
        ) : (
          <form className="hp-modal__form" onSubmit={handleSubmit}>
            <textarea
              className="hp-modal__textarea"
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
              autoFocus
            />
            <div className="hp-modal__actions">
              <button type="button" className="hp-modal__cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="hp-modal__submit" disabled={!value.trim()}>
                <Send size={14} aria-hidden="true" />
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export default function HelpPanel({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'bug' | 'request' | 'support'
  const panelRef = useRef(null);
  const searchRef = useRef(null);

  /* Close on Escape (but not when a modal is open) */
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      e.stopImmediatePropagation?.();
      if (activeModal) {
        setActiveModal(null);
        return;
      }
      onClose?.();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, activeModal]);

  /* Focus search when panel opens */
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 350);
  }, [open]);

  const filtered = query.trim()
    ? FAQ_ITEMS.filter(
        (item) =>
          item.q.toLowerCase().includes(query.toLowerCase()) ||
          item.a.toLowerCase().includes(query.toLowerCase()),
      )
    : FAQ_ITEMS;

  function handleQuickLink(key) {
    if (key === 'support') {
      window.location.href = 'mailto:support@pixelpanel.io?subject=Support%20Request';
    } else {
      setActiveModal(key);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`hp-backdrop${open ? ' hp-backdrop--visible' : ''}`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        className={`hp-panel${open ? ' hp-panel--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Help Center"
        tabIndex={-1}
      >
        {/* ── Header ── */}
        <div className="hp-panel__header">
          <div className="hp-panel__title">
            <HelpCircle size={18} className="hp-panel__title-icon" aria-hidden="true" />
            <span>Help Center</span>
          </div>
          <button
            type="button"
            className="hp-panel__close"
            aria-label="Close help center"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Hero blurb ── */}
        <div className="hp-hero">
          <Lightbulb size={28} className="hp-hero__icon" aria-hidden="true" />
          <div>
            <p className="hp-hero__title">How can we help?</p>
            <p className="hp-hero__sub">Search our FAQ or browse quick links below.</p>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="hp-search-wrap">
          <label className="hp-search">
            <Search size={16} className="hp-search__icon" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              className="hp-search__input"
              placeholder="Search help articles…"
              aria-label="Search FAQ"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpenFaq(null); }}
            />
            {query && (
              <button
                type="button"
                className="hp-search__clear"
                aria-label="Clear search"
                onClick={() => setQuery('')}
              >
                <X size={13} />
              </button>
            )}
          </label>
        </div>

        {/* ── Scrollable body ── */}
        <div className="hp-panel__body">

          {/* ─ FAQ accordion ─ */}
          <section className="hp-section">
            <h3 className="hp-section__title">
              <BookOpen size={14} aria-hidden="true" />
              Frequently Asked Questions
            </h3>

            {filtered.length === 0 ? (
              <div className="hp-empty">
                <Search size={28} className="hp-empty__icon" aria-hidden="true" />
                <p className="hp-empty__text">No results for "{query}"</p>
                <button type="button" className="hp-empty__reset" onClick={() => setQuery('')}>
                  Clear search
                </button>
              </div>
            ) : (
              <div className="hp-faq-list">
                {filtered.map((item) => (
                  <FaqItem
                    key={item.id}
                    item={item}
                    open={openFaq === item.id}
                    onToggle={() => setOpenFaq((prev) => (prev === item.id ? null : item.id))}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ─ Quick links ─ */}
          <section className="hp-section">
            <h3 className="hp-section__title">
              <Plus size={14} aria-hidden="true" />
              Quick Links
            </h3>
            <div className="hp-quicklinks">
              <button
                type="button"
                className="hp-quicklink"
                aria-label="Report a Bug"
                onClick={() => handleQuickLink('bug')}
              >
                <span className="hp-quicklink__icon" style={{ color: '#ff6b9d' }}>
                  <AlertCircle size={18} aria-hidden="true" />
                </span>
                <div className="hp-quicklink__text">
                  <span className="hp-quicklink__label">Report a Bug</span>
                  <span className="hp-quicklink__desc">Something broken? Let us know.</span>
                </div>
                <span className="hp-quicklink__arrow">→</span>
              </button>

              <button
                type="button"
                className="hp-quicklink"
                aria-label="Request a Title"
                onClick={() => handleQuickLink('request')}
              >
                <span className="hp-quicklink__icon" style={{ color: 'var(--home-accent, #fff43d)' }}>
                  <BookOpen size={18} aria-hidden="true" />
                </span>
                <div className="hp-quicklink__text">
                  <span className="hp-quicklink__label">Request a Title</span>
                  <span className="hp-quicklink__desc">Suggest a manga to be added.</span>
                </div>
                <span className="hp-quicklink__arrow">→</span>
              </button>

              <button
                type="button"
                className="hp-quicklink"
                aria-label="Contact Support"
                onClick={() => handleQuickLink('support')}
              >
                <span className="hp-quicklink__icon" style={{ color: '#4df5ff' }}>
                  <MessageSquare size={18} aria-hidden="true" />
                </span>
                <div className="hp-quicklink__text">
                  <span className="hp-quicklink__label">Contact Support</span>
                  <span className="hp-quicklink__desc">Opens your email client.</span>
                </div>
                <span className="hp-quicklink__arrow">→</span>
              </button>
            </div>
          </section>

          {/* ─ Keyboard shortcuts ─ */}
          <section className="hp-section">
            <h3 className="hp-section__title">
              <Keyboard size={14} aria-hidden="true" />
              Keyboard Shortcuts
            </h3>
            <div className="hp-shortcuts">
              {SHORTCUTS.map(({ keys, action }) => (
                <div key={action} className="hp-shortcut">
                  <div className="hp-shortcut__keys">
                    {keys.map((k) => (
                      <kbd key={k} className="hp-kbd">{k}</kbd>
                    ))}
                  </div>
                  <span className="hp-shortcut__action">{action}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ─ Footer ─ */}
          <div className="hp-footer">
            <p>Still need help?</p>
            <button
              type="button"
              className="hp-footer__btn"
              onClick={() => handleQuickLink('support')}
            >
              <MessageSquare size={14} aria-hidden="true" />
              Contact Support
            </button>
          </div>

        </div>
      </aside>

      {/* ── Inline modals ── */}
      {activeModal === 'bug' && (
        <FormModal
          title="Report a Bug"
          placeholder="Describe the issue — which page, what happened, and what you expected…"
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'request' && (
        <FormModal
          title="Request a Title"
          placeholder="Enter the manga/manhwa title you'd like to see added…"
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}
