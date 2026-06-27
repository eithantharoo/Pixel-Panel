import React from 'react';
import IconSwap from './IconSwap';

export default function Sidebar() {
  const menuItems = [
    { name: 'Home', iconKey: 'home' },
    { name: 'Favorite', iconKey: 'heart' },
    { name: 'Library', iconKey: 'library' },
    { name: 'History', iconKey: 'recents' },
    { name: 'Genres', iconKey: 'genre' },
  ];

  const bottomItems = [
    { name: 'Setting', iconKey: 'settings' },
    { name: 'Help Center', iconKey: 'help center' },
  ];

  return (
    <aside className="sidebar-gradient w-[220px] h-full rounded-[20px] flex flex-col justify-between py-8 px-5 shrink-0 shadow-lg">
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <button
            key={item.name}
            type="button"
            className="sidebar-item group flex items-center justify-between w-full text-left py-2.5 px-2 rounded-xl transition-all text-white font-medium text-[13px]"
          >
            <div className="flex items-center gap-3.5">
              <IconSwap iconKey={item.iconKey} alt={item.name} />
              <span>{item.name}</span>
            </div>
            {item.name === 'Genres' && <span className="text-sm text-white/70 pr-1">›</span>}
          </button>
        ))}
      </nav>

      <div className="flex flex-col gap-1">
        {bottomItems.map((item) => (
          <button
            key={item.name}
            type="button"
            className="sidebar-item group flex items-center gap-3.5 py-2.5 px-2 rounded-xl text-[13px] font-medium w-full text-left text-white transition-all"
          >
            <IconSwap iconKey={item.iconKey} alt={item.name} className="w-4" />
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
