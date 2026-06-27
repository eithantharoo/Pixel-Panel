import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'home',     label: 'Home',     icon: 'home' },
  { id: 'favorite', label: 'Favorite', icon: 'heart' },
  { id: 'library',  label: 'Library',  icon: 'library' },
  { id: 'history',  label: 'History',  icon: 'history' },
  { id: 'genres',   label: 'Genres',   icon: 'genres', hasArrow: true },
];

const BOTTOM_ITEMS = [
  { id: 'setting', label: 'Setting',     icon: 'setting' },
  { id: 'help',    label: 'Help Center', icon: 'help' },
];

function NavIcon({ type }) {
  const icons = {
    home: <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />,
    heart: <path d="M12 20.5s-6.5-4.2-6.5-9.1a3.6 3.6 0 0 1 6.4-2.2A3.6 3.6 0 0 1 18.5 11.4c0 4.9-6.5 9.1-6.5 9.1z" />,
    library: (
      <>
        <path d="M5 4h5v16H6a1 1 0 0 1-1-1zM14 4h5v16h-4a1 1 0 0 1-1-1z" />
        <path d="M5 4a1 1 0 0 1 1-1h4M14 3h4a1 1 0 0 1 1 1" />
      </>
    ),
    history: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </>
    ),
    genres: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1" />
        <rect x="13" y="4" width="7" height="7" rx="1" />
        <rect x="4" y="13" width="7" height="7" rx="1" />
        <rect x="13" y="13" width="7" height="7" rx="1" />
      </>
    ),
    setting: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 0 1 4 2c0 2-2.5 2-2.5 4M12 17h.01" />
      </>
    ),
  };

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[type]}
    </svg>
  );
}

function Sidebar({ activeItem = 'home' }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar__nav" aria-label="Sidebar navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sidebar__link${activeItem === item.id ? ' sidebar__link--active' : ''}`}
          >
            <NavIcon type={item.icon} />
            <span>{item.label}</span>
            {item.hasArrow && (
              <svg className="sidebar__arrow" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar__bottom">
        {BOTTOM_ITEMS.map((item) => (
          <button key={item.id} type="button" className="sidebar__link">
            <NavIcon type={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
