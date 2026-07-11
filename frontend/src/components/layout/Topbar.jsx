import { useState } from 'react';
import {
  Bell,
  ChevronDown,
  Heart,
  Headphones,
  Menu,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { images } from '../../assets/images';
import { GENRES } from '../../data/home_data';
import GenreIcon from '../hub/GenreIcon';

function TopbarIconButton({ label, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[var(--purple-darker)] transition-colors hover:bg-gray-100 active:bg-gray-200 ${className}`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

export default function Topbar({
  activeGenre,
  onGenreSelect,
  onFavoriteClick,
  onMenuClick,
  searchValue,
  onSearchChange,
}) {
  const [genreOpen, setGenreOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const isSearchControlled = searchValue !== undefined;
  const query = isSearchControlled ? searchValue : localSearch;
  const activeGenreData = GENRES.find((genre) => genre.id === activeGenre);

  function handlePick(genreId) {
    setGenreOpen(false);
    onGenreSelect?.(genreId);
  }

  function handleSearchChange(event) {
    const nextValue = event.target.value;
    if (!isSearchControlled) setLocalSearch(nextValue);
    onSearchChange?.(nextValue);
  }

  function handleClearSearch() {
    if (!isSearchControlled) setLocalSearch('');
    onSearchChange?.('');
  }

  return (
    <header className="relative z-20 flex min-h-[64px] w-full shrink-0 items-center gap-3 border-b border-black/5 bg-white px-3 py-2 shadow-sm sm:px-5 lg:px-6">
      <TopbarIconButton label="Open navigation" onClick={onMenuClick} className="lg:hidden">
        <Menu size={21} strokeWidth={2.3} />
      </TopbarIconButton>

      <div className="flex min-w-0 shrink-0 items-center gap-2.5 sm:min-w-[178px]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--purple-light)] ring-1 ring-[var(--purple-light-active)]">
          <img src={images.logoBook} alt="" className="h-7 w-7 object-contain" aria-hidden="true" />
        </div>
        <div className="hidden min-w-0 sm:block">
          <h1 className="truncate text-[21px] font-extrabold leading-none text-[var(--purple-darker)]">Pixel Panel</h1>
        </div>
      </div>

      <div className="flex min-w-[130px] flex-1 justify-center md:px-4">
        <div className="relative flex w-full max-w-[560px] items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder={activeGenreData ? `Search ${activeGenreData.label}` : 'Search titles'}
              aria-label="Search manga"
              className="h-10 w-full rounded-lg border border-transparent bg-[var(--purple-light)] py-2 pl-10 pr-20 text-sm text-[var(--purple-darker)] placeholder-[var(--purple-normal)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--purple-normal)]"
            />
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--purple-normal)]">
              <Search size={17} strokeWidth={2.2} />
            </div>
          </div>

          <div className="absolute right-1.5 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--purple-dark)] transition-colors hover:bg-white/70"
              >
                <X size={15} strokeWidth={2.4} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setGenreOpen((v) => !v)}
              aria-expanded={genreOpen}
              aria-haspopup="listbox"
              aria-label="Filter by genre"
              title="Filter by genre"
              className={`relative flex h-8 w-8 items-center justify-center rounded-md text-[var(--purple-darker)] transition-colors hover:bg-white/70 ${
                activeGenre ? 'bg-[var(--yellow-normal)]' : ''
              }`}
            >
              <SlidersHorizontal size={16} strokeWidth={2.3} />
            </button>

            {genreOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setGenreOpen(false)} />
                <div
                  role="listbox"
                  aria-label="Genres"
                  className="panel-scroll absolute right-0 top-[calc(100%+10px)] z-30 max-h-80 w-64 overflow-y-auto rounded-xl border border-[#ddd1ea] bg-white p-2 shadow-[0_18px_36px_rgba(50,24,82,0.18)]"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={!activeGenre}
                    onClick={() => handlePick(null)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#3b2853] transition-colors hover:bg-[#f5effa] ${
                      !activeGenre ? 'bg-[#f3edf8] font-semibold' : ''
                    }`}
                  >
                    <SlidersHorizontal size={16} />
                    <span className="truncate">All genres</span>
                  </button>
                  {GENRES.map((genre) => (
                    <button
                      key={genre.id}
                      type="button"
                      role="option"
                      aria-selected={activeGenre === genre.id}
                      onClick={() => handlePick(genre.id)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[#3b2853] transition-colors hover:bg-[#f5effa] ${
                        activeGenre === genre.id ? 'bg-[#f3edf8] font-semibold' : ''
                      }`}
                    >
                      <GenreIcon genreId={genre.id} size={16} />
                      <span className="truncate">{genre.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-2">
        <TopbarIconButton label="Notifications">
          <Bell size={20} strokeWidth={2.1} />
        </TopbarIconButton>

        <button
          type="button"
          className="hidden cursor-pointer items-center gap-2 rounded-lg border border-[var(--purple-light-active)] bg-[var(--purple-light)] py-1 pl-1.5 pr-2.5 transition-all hover:bg-[var(--purple-light-hover)] md:flex"
          aria-label="Open profile menu"
        >
          <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white bg-white shadow-sm">
            <img src={images.profile} alt="Hsu Myat" className="h-full w-full object-cover" />
          </div>
          <span className="text-[13px] font-bold leading-none text-[var(--purple-darker)]">Hsu Myat</span>
          <ChevronDown size={15} className="text-[var(--purple-normal)]" strokeWidth={2.4} />
        </button>

        <TopbarIconButton label="Favorites" onClick={onFavoriteClick}>
          <Heart size={20} strokeWidth={2.1} />
        </TopbarIconButton>
        <TopbarIconButton label="Support" className="hidden sm:flex">
          <Headphones size={20} strokeWidth={2.1} />
        </TopbarIconButton>
      </div>
    </header>
  );
}
