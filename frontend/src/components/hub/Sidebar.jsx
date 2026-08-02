import { CircleHelp, Clock3, Heart, Home, Library, Settings } from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'favorite', label: 'Favorites', Icon: Heart },
  { id: 'library', label: 'Library', Icon: Library },
  { id: 'history', label: 'History', Icon: Clock3 },
];

const BOTTOM_ITEMS = [
  { id: 'setting', label: 'Settings', Icon: Settings },
  { id: 'help', label: 'Help Center', Icon: CircleHelp },
];

function SidebarLink({ item, active, onClick }) {
  const { Icon } = item;

  return (
    <button
      type="button"
      className={`sidebar__link${active ? ' sidebar__link--active' : ''}`}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
      <span>{item.label}</span>
    </button>
  );
}

function Sidebar({ activeItem = 'home', onNavChange, onSettingsClick, onHelpClick }) {
  function handleBottomClick(id) {
    if (id === 'setting') onSettingsClick?.();
    else if (id === 'help') onHelpClick?.();
  }

  return (
    <>
      <aside className="sidebar">
        <nav className="sidebar__nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <SidebarLink
              key={item.id}
              item={item}
              active={activeItem === item.id}
              onClick={() => onNavChange?.(item.id)}
            />
          ))}
        </nav>

        <div className="sidebar__bottom">
          {BOTTOM_ITEMS.map((item) => (
            <SidebarLink
              key={item.id}
              item={item}
              onClick={() => handleBottomClick(item.id)}
            />
          ))}
        </div>
      </aside>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) => {
          const { Icon } = item;
          const active = activeItem === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-nav__item${active ? ' mobile-nav__item--active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => onNavChange?.(item.id)}
            >
              <Icon size={20} strokeWidth={1.9} aria-hidden="true" />
              <span className="mobile-nav__label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default Sidebar;
