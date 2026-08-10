import { useEffect, useRef, useState } from 'react';
import { Bell, Camera, Check, ChevronDown, Grid3X3, Heart, LogIn, LogOut, Search, User, X } from 'lucide-react';
import { images } from '../../assets/images';
import { GENRES } from '../../data/home_data';
import GenreIcon from './GenreIcon';
import './HomeHeader.css';

const PROFILE_STORAGE_KEY = 'pixel-panel-profile';

const DEFAULT_PROFILE = {
  name: 'Hsu Myat',
  image: images.profile,
  isLoggedIn: true,
};

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : { ...DEFAULT_PROFILE };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* noop */
  }
}

function NotificationMenu({ notifications, onClose }) {
  return (
    <div className="home-header__menu home-header__notifications" role="dialog" aria-label="Notifications">
      <div className="home-header__menu-head">
        <span className="home-header__notif-heading">
          Notifications
          {notifications.length > 0 && (
            <span className="home-header__notif-count">{notifications.length}</span>
          )}
        </span>
        <button type="button" className="home-header__menu-close" aria-label="Close notifications" onClick={onClose}>
          <X size={14} aria-hidden="true" />
        </button>
      </div>
      {notifications.length > 0 ? (
        <div className="home-header__notification-list">
          {notifications.map((item) => (
            <button
              key={item.id}
              type="button"
              className="home-header__notification"
              onClick={() => {
                item.onClick?.();
                onClose();
              }}
            >
              <span className="home-header__notification-dot" aria-hidden="true" />
              <span className="home-header__notification-copy">
                <span className="home-header__notification-title">{item.title}</span>
                <span className="home-header__notification-text">{item.message}</span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="home-header__empty">No new updates yet.</p>
      )}
    </div>
  );
}


function ProfileMenu({ profile, draftName, onDraftNameChange, onImageChange, onSave, onLogin, onLogout }) {
  return (
    <div className="home-header__menu home-header__profile-menu" role="dialog" aria-label="Profile menu">
      <div className="home-header__profile-preview">
        <span className="home-header__profile-large">
          <img src={profile.image} alt={profile.name} />
        </span>
        <label className="home-header__image-edit">
          <Camera size={14} aria-hidden="true" />
          <span>Edit image</span>
          <input type="file" accept="image/*" onChange={onImageChange} />
        </label>
      </div>

      <label className="home-header__field">
        <span>Edit name</span>
        <input value={draftName} onChange={(event) => onDraftNameChange(event.target.value)} />
      </label>

      <button type="button" className="home-header__profile-action" onClick={onSave}>
        <User size={15} aria-hidden="true" />
        Save profile
      </button>

      {profile.isLoggedIn ? (
        <button type="button" className="home-header__profile-action home-header__profile-action--danger" onClick={onLogout}>
          <LogOut size={15} aria-hidden="true" />
          Log out
        </button>
      ) : (
        <button type="button" className="home-header__profile-action" onClick={onLogin}>
          <LogIn size={15} aria-hidden="true" />
          Log in
        </button>
      )}
    </div>
  );
}

function HomeHeader({
  activeGenre,
  onGenreSelect,
  onFavoriteClick,
  searchValue = '',
  onSearchChange,
  notifications = [],
  onLogin,
  onLogout,
}) {
  const [genreOpen, setGenreOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(loadProfile);
  const [draftName, setDraftName] = useState(profile.name);
  const actionsRef = useRef(null);
  const genreRef = useRef(null);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    function handleClick(event) {
      if (!genreRef.current?.contains(event.target)) {
        setGenreOpen(false);
      }

      if (!actionsRef.current?.contains(event.target)) {
        setNotificationOpen(false);
        setProfileOpen(false);
      }
    }

    function handleKey(event) {
      if (event.key === 'Escape') {
        setNotificationOpen(false);
        setProfileOpen(false);
        setGenreOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  function handleGenrePick(genreId) {
    onGenreSelect?.(genreId);
    setGenreOpen(false);
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((current) => ({ ...current, image: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function handleSaveProfile() {
    const nextName = draftName.trim() || DEFAULT_PROFILE.name;
    setProfile((current) => ({ ...current, name: nextName }));
    setProfileOpen(false);
  }

  function handleLogin() {
    setProfile((current) => ({ ...current, isLoggedIn: true }));
    onLogin?.();
  }

  function handleLogout() {
    setProfile((current) => ({ ...current, isLoggedIn: false }));
    onLogout?.();
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
            type="text"
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

        <div className="home-header__genre-dropdown" ref={genreRef}>
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

      <div className="home-header__actions" ref={actionsRef}>
        <button
          type="button"
          className={`home-header__icon-btn home-header__icon-btn--badge${notificationOpen ? ' home-header__icon-btn--active' : ''}`}
          aria-label={`Notifications${notifications.length ? `, ${notifications.length} new` : ''}`}
          title="Notifications"
          aria-expanded={notificationOpen}
          onClick={() => {
            setNotificationOpen((isOpen) => !isOpen);
            setProfileOpen(false);
          }}
        >
          <Bell size={20} aria-hidden="true" />
          {notifications.length > 0 && <span className="home-header__badge">{notifications.length}</span>}
        </button>
        {notificationOpen && (
          <NotificationMenu
            notifications={notifications}
            onClose={() => setNotificationOpen(false)}
          />
        )}

        <button
          type="button"
          className={`home-header__profile${profileOpen ? ' home-header__profile--open' : ''}`}
          aria-label="Open profile menu"
          aria-expanded={profileOpen}
          onClick={() => {
            setProfileOpen((isOpen) => !isOpen);
            setNotificationOpen(false);
          }}
        >
          <span className="home-header__avatar">
            <img src={profile.image} alt={profile.name} />
          </span>
          <span className="home-header__name">{profile.name}</span>
          <ChevronDown className={`home-header__profile-arrow${profileOpen ? ' home-header__profile-arrow--up' : ''}`} size={15} aria-hidden="true" />
        </button>
        {profileOpen && (
          <ProfileMenu
            profile={profile}
            draftName={draftName}
            onDraftNameChange={setDraftName}
            onImageChange={handleImageChange}
            onSave={handleSaveProfile}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        )}

        <button
          type="button"
          className="home-header__icon-btn"
          aria-label="Favorites"
          title="Favorites"
          onClick={onFavoriteClick}
        >
          <Heart size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

export default HomeHeader;
