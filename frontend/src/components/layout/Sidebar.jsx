import { useState } from 'react';
import { Home, Heart, Library, History, Settings, HelpCircle, ChevronRight, Tags } from 'lucide-react';
import { GENRES } from '../../data/home_data';
import GenreIcon from '../hub/GenreIcon';

const menuItems = [
  { name: 'Home',     Icon: Home,    navId: 'home' },
  { name: 'Favorites', Icon: Heart,   navId: 'favorite' },
  { name: 'Library',  Icon: Library, navId: 'library' },
  { name: 'History',  Icon: History, navId: 'history' },
];

const bottomItems = [
  { name: 'Settings',    Icon: Settings },
  { name: 'Help Center', Icon: HelpCircle },
];

function SidebarItemIcon({ Icon, className }) {
  return <Icon size={18} strokeWidth={2} className={className} />;
}

export default function Sidebar({ activeItem, onNavChange, activeGenre, onGenreSelect }) {
  const [genreOpen, setGenreOpen] = useState(false);

  function handleNavClick(navId) {
    setGenreOpen(false);
    onNavChange?.(navId);
  }

  function handleGenreClick(genreId) {
    onGenreSelect?.(genreId);
  }

  return (
    <aside className="flex h-full w-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--panel-control-border)] bg-[#8a4f9d] px-4 py-5 shadow-[0_22px_44px_rgba(34,16,62,0.3)]">
      <div className="flex flex-1 flex-col gap-1">
        <nav className="flex w-full flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = activeItem === item.navId;
            return (
              <button
                key={item.navId}
                type="button"
                onClick={() => handleNavClick(item.navId)}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex w-full items-center justify-between rounded-lg border border-transparent px-3.5 py-3 text-left text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'border-[var(--panel-control-border-strong)] bg-[var(--panel-control-active)] text-[var(--panel-hover-text)] shadow-[inset_3px_0_0_var(--text-yellow)]'
                    : 'bg-[var(--panel-control-idle)] text-[var(--panel-control-text)] hover:bg-[var(--panel-control-hover)] hover:text-[var(--panel-hover-text)] active:bg-[var(--panel-control-active-strong)]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <SidebarItemIcon Icon={item.Icon} className="h-5 w-5 shrink-0" />
                  <span className="tracking-wide">{item.name}</span>
                </div>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setGenreOpen((v) => !v)}
            aria-expanded={genreOpen}
            className={`group flex w-full items-center justify-between rounded-lg border border-transparent px-3.5 py-3 text-left text-[13px] font-medium transition-all duration-200 ${
              genreOpen || activeGenre
                ? 'border-[var(--panel-control-border-strong)] bg-[var(--panel-control-active)] text-[var(--panel-hover-text)] shadow-[inset_3px_0_0_var(--text-yellow)]'
                : 'bg-[var(--panel-control-idle)] text-[var(--panel-control-text)] hover:bg-[var(--panel-control-hover)] hover:text-[var(--panel-hover-text)] active:bg-[var(--panel-control-active-strong)]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <SidebarItemIcon Icon={Tags} className="h-5 w-5 shrink-0" />
              <span className="tracking-wide">Genres</span>
            </div>
            <ChevronRight
              size={16}
              className={`pr-1 text-base transition-all duration-200 ${
                genreOpen ? 'rotate-90 text-[var(--panel-hover-text)]' : 'text-[var(--panel-control-muted)] group-hover:text-[var(--panel-hover-text)]'
              }`}
            />
          </button>
        </nav>

        <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${genreOpen ? 'max-h-[260px]' : 'max-h-0'}`}>
          <ul className="panel-scroll flex max-h-[240px] flex-col gap-0.5 overflow-y-auto px-2 pb-1 pt-1.5">
            {GENRES.map((genre) => (
              <li key={genre.id}>
                <button
                  type="button"
                  onClick={() => handleGenreClick(genre.id)}
                  aria-current={activeGenre === genre.id ? 'page' : undefined}
                  className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                    activeGenre === genre.id
                      ? 'bg-[var(--panel-control-active)] text-[var(--panel-hover-text)]'
                      : 'bg-[var(--panel-control-idle)] text-[var(--panel-control-muted)] hover:bg-[var(--panel-control-hover)] hover:text-[var(--panel-hover-text)]'
                  }`}
                >
                  <GenreIcon genreId={genre.id} size={14} />
                  <span className="truncate">{genre.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto flex w-full flex-col gap-1.5 border-t border-[var(--panel-divider)] pt-4">
        {bottomItems.map((item) => (
          <button
            key={item.name}
            type="button"
            className="group flex w-full items-center gap-3.5 rounded-lg bg-[var(--panel-control-idle)] px-3.5 py-2.5 text-left text-[13px] font-medium text-[var(--panel-control-text)] transition-all duration-200 hover:bg-[var(--panel-control-hover)] hover:text-[var(--panel-hover-text)]"
          >
            <SidebarItemIcon Icon={item.Icon} className="h-4 w-4 shrink-0" />
            <span className="tracking-wide">{item.name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
