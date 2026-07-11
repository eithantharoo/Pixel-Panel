import { useState } from 'react';
import { GENRES } from '../../data/home_data';
import './HomeHeader.css';

function HomeHeader({ activeGenre, onGenreSelect }) {
  const [genreOpen, setGenreOpen] = useState(false);

  function handleGenreToggle() {
    setGenreOpen(v => !v);
  }

  function handleGenrePick(genreId) {
    onGenreSelect && onGenreSelect(genreId);
    setGenreOpen(false);
  }

  return (
    <header className="home-header">
      <div className="home-header__search-row">
        <div className="home-header__search">
          <svg className="home-header__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            className="home-header__search-input"
            placeholder="Search"
            aria-label="Search manga"
          />
        </div>

        {/* Genre dropdown beside search bar */}
        <div className="home-header__genre-dropdown">
          <button
            type="button"
            id="header-genres-btn"
            className={`home-header__genre-btn${genreOpen ? ' home-header__genre-btn--open' : ''}${activeGenre ? ' home-header__genre-btn--active' : ''}`}
            aria-expanded={genreOpen}
            aria-haspopup="listbox"
            onClick={handleGenreToggle}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="4" width="7" height="7" rx="1" />
              <rect x="13" y="4" width="7" height="7" rx="1" />
              <rect x="4" y="13" width="7" height="7" rx="1" />
              <rect x="13" y="13" width="7" height="7" rx="1" />
            </svg>
            <span className="home-header__genre-label">Genres</span>
            <svg
              className={`home-header__genre-arrow${genreOpen ? ' home-header__genre-arrow--up' : ''}`}
              width="12" height="12" viewBox="0 0 12 12"
              aria-hidden="true"
            >
              <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {genreOpen && (
            <div className="home-header__genre-panel" role="listbox" aria-label="Genre options">
              {GENRES.map(genre => (
                <button
                  key={genre.id}
                  type="button"
                  role="option"
                  aria-selected={activeGenre === genre.id}
                  className={`home-header__genre-item${activeGenre === genre.id ? ' home-header__genre-item--active' : ''}`}
                  onClick={() => handleGenrePick(genre.id)}
                >
                  <span className="home-header__genre-icon">{genre.icon}</span>
                  <span>{genre.label}</span>
                  {activeGenre === genre.id && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="home-header__actions">
        <button type="button" className="home-header__icon-btn" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
            <path d="M10 20a2 2 0 0 0 4 0" />
          </svg>
        </button>

        <div className="home-header__profile">
          <span className="home-header__name">User Name</span>
          <div className="home-header__avatar" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}

export default HomeHeader;
