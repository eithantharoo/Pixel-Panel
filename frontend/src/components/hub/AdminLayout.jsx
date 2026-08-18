import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookOpenText,
  CircleHelp,
  Heart,
  Settings,
} from 'lucide-react';
import HomeHeader from './HomeHeader';
import AdminSettings from './AdminSettings';
import './AdminLayout.css';

const mainLinks = [
  { label: 'Stories', icon: BookOpenText, to: '/admin/stories' },
  { label: 'Progress', icon: BarChart3, to: '/admin/progress' },
  { label: 'Favorites', icon: Heart, to: '/admin/favorites' },
];

const bottomLinks = [
  { label: 'Help Center', icon: CircleHelp, to: '/admin/help' },
];

function SidebarLink({ link }) {
  const Icon = link.icon;

  return (
    <NavLink
      to={link.to}
      className={({ isActive }) =>
        `admin-sidebar__link${isActive ? ' is-active' : ''}`
      }
    >
      <Icon size={20} aria-hidden="true" />
      <span>{link.label}</span>
    </NavLink>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const adminNotifications = [
    { id: 1, title: 'Story submitted', message: 'A new story is waiting for review.' },
    { id: 2, title: 'Chapter updated', message: 'A published chapter was edited.' },
    { id: 3, title: 'New milestone', message: 'Pixel Panel reached a new reading milestone.' },
  ];

  return (
    <div className="admin-shell">
      <div className="admin-header">
        <HomeHeader
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          notifications={adminNotifications}
          onFavoriteClick={() => navigate('/admin/favorites')}
        />
      </div>

      <aside className="admin-sidebar">
        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          {mainLinks.map((link) => (
            <SidebarLink key={link.to} link={link} />
          ))}
        </nav>

        <nav className="admin-sidebar__bottom" aria-label="Admin support">
          <button
            type="button"
            className="admin-sidebar__link admin-sidebar__button"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings size={20} aria-hidden="true" />
            <span>Settings</span>
          </button>
          {bottomLinks.map((link) => (
            <SidebarLink key={link.to} link={link} />
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-main__inner">
          {/* The selected admin page appears here */}
          <Outlet />
        </div>
      </main>

      <AdminSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}