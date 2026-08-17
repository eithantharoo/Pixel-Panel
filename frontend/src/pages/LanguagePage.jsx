import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Globe, MessageCircle } from 'lucide-react';
import './LanguagePage.css';

const STORAGE_KEY = 'pixel-panel-language';

const LANGUAGES = [
  {
    code: 'my',
    shortLabel: 'MM',
    label: 'Burmese',
    nativeLabel: 'Myanmar',
    detail: 'Read translated comics, saved lists, and app labels in Burmese.',
  },
  {
    code: 'en',
    shortLabel: 'EN',
    label: 'English',
    nativeLabel: 'English',
    detail: 'Use Pixel Panel with English menus, story details, and recommendations.',
  },
];

export default function LanguagePage() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(() => (
    localStorage.getItem(STORAGE_KEY) || ''
  ));

  useEffect(() => {
    if (selectedLanguage) {
      document.documentElement.lang = selectedLanguage;
    }
  }, [selectedLanguage]);

  function chooseLanguage(language) {
    localStorage.setItem(STORAGE_KEY, language.code);
    document.documentElement.lang = language.code;
    setSelectedLanguage(language.code);
    window.dispatchEvent(new CustomEvent('languagechange', {
      detail: { language: language.code, label: language.label },
    }));
    navigate('/home');
  }

  return (
    <section className="language-page" aria-labelledby="language-page-title">
      <div className="language-page__pixel-grid language-page__pixel-grid--top" aria-hidden="true" />
      <div className="language-page__pixel-grid language-page__pixel-grid--bottom" aria-hidden="true" />

      <header className="language-page__brand" aria-label="Pixel Panel">
        <span className="language-page__brand-mark" aria-hidden="true">
          <Globe size={30} strokeWidth={2.6} />
        </span>
        <span>Pixel<br />Panel</span>
      </header>

      <main className="language-page__main">
        <div className="language-page__hero">
          <p className="language-page__eyebrow">
            <MessageCircle size={18} strokeWidth={2.4} aria-hidden="true" />
            Language setup
          </p>
          <h1 id="language-page-title">Choose Your Language</h1>
          <p className="language-page__subtitle">
            Pick the language you want to use before entering your personalized home page.
          </p>
        </div>

        <div className="language-page__languages" role="group" aria-label="Available languages">
          {LANGUAGES.map((language) => {
            const isSelected = selectedLanguage === language.code;

            return (
              <article
                className={`language-page__card${isSelected ? ' language-page__card--selected' : ''}`}
                key={language.code}
              >
                <div className="language-page__bubble" aria-hidden="true">
                  {language.shortLabel}
                </div>
                <div className="language-page__copy">
                  <h2>{language.label}</h2>
                  <p>{language.detail}</p>
                </div>
                <button
                  className="language-page__button"
                  type="button"
                  onClick={() => chooseLanguage(language)}
                  aria-pressed={isSelected}
                  aria-label={`Continue in ${language.label}`}
                >
                  <span>{language.nativeLabel}</span>
                  {isSelected ? (
                    <Check size={28} strokeWidth={2.8} aria-hidden="true" />
                  ) : (
                    <ArrowRight size={28} strokeWidth={2.6} aria-hidden="true" />
                  )}
                </button>
              </article>
            );
          })}
        </div>
      </main>
    </section>
  );
}
