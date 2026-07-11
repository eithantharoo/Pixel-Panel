import { useState } from 'react';
import { Bell, Check, ChevronDown, Grid3X3, Headphones, Heart, Search, X } from 'lucide-react';
import { images } from '../../assets/images';
import { GENRES } from '../../data/home_data';
import GenreIcon from './GenreIcon';
import './HomeHeader.css';

function HomeHeader({ activeGenre, onGenreSelect, onFavoriteClick, searchValue = '', onSearchChange }) {
  const [genreOpen, setGenreOpen] = useState(false);

  function handleGenrePick(genreId) {
    onGenreSelect?.(genreId);
    setGenreOpen(false);
  }

  return (
    <header className="home-header">
      <div className="home-header__brand">
        <div className="home-header__logo">
          <img src={images.logoBook} alt="" aria-hidden="true" />
        </div>
        <span className="home-header__brand-name">Pixel Panel</span>
      </div>

      <div className="home-header__search-row">
        <label className="home-header__search">
          <Search className="home-header__search-icon" size={18} aria-hidden="true" />
          <input
            type="search"
            className="home-header__search-input"
            placeholder="Search manga"
            aria-label="Search manga"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
          />
          {searchValue && (
            <button
              type="button"
              className="home-header__clear"
              aria-label="Clear search"
              title="Clear search"
              onClick={() => onSearchChange?.('')}
            >
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </label>

        <div className="home-header__genre-dropdown">
          <button
            type="button"
            id="header-genres-btn"
            className={`home-header__genre-btn${genreOpen ? ' home-header__genre-btn--open' : ''}${activeGenre ? ' home-header__genre-btn--active' : ''}`}
            aria-expanded={genreOpen}
            aria-haspopup="listbox"
            onClick={() => setGenreOpen((isOpen) => !isOpen)}
          >
            <Grid3X3 size={16} aria-hidden="true" />
            <span className="home-header__genre-label">Genres</span>
            <ChevronDown
              className={`home-header__genre-arrow${genreOpen ? ' home-header__genre-arrow--up' : ''}`}
              size={14}
              aria-hidden="true"
            />
          </button>

          {genreOpen && (
            <div className="home-header__genre-panel" role="listbox" aria-label="Genre options">
              {GENRES.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  role="option"
                  aria-selected={activeGenre === genre.id}
                  className={`home-header__genre-item${activeGenre === genre.id ? ' home-header__genre-item--active' : ''}`}
                  onClick={() => handleGenrePick(genre.id)}
                >
                  <GenreIcon genreId={genre.id} size={16} />
                  <span>{genre.label}</span>
                  {activeGenre === genre.id && <Check className="home-header__genre-check" size={14} aria-hidden="true" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="home-header__actions">
        <button type="button" className="home-header__icon-btn" aria-label="Notifications" title="Notifications">
          <Bell size={20} aria-hidden="true" />
        </button>

        <button type="button" className="home-header__profile" aria-label="Open profile menu">
          <span className="home-header__avatar">
            <img src={images.profile} alt="Hsu Myat" />
          </span>
          <span className="home-header__name">Hsu Myat</span>
          <ChevronDown className="home-header__profile-arrow" size={15} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="home-header__icon-btn"
          aria-label="Favorites"
          title="Favorites"
          onClick={onFavoriteClick}
        >
          <Heart size={20} aria-hidden="true" />
        </button>

        <button type="button" className="home-header__icon-btn home-header__support" aria-label="Support" title="Support">
          <Headphones size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

export default HomeHeader;
