import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/hub/Sidebar';
import HomeHeader from '../components/hub/HomeHeader';
import MangaCard from '../components/hub/MangaCard';
import TrendingSidebar from '../components/hub/TrendingSidebar';
import ContinueReading from '../components/hub/ContinueReading';
import FavoritesView from '../components/hub/FavoritesView';
import HistoryView from '../components/hub/HistoryView';
import GenreView from '../components/hub/GenreView';
import SettingsPanel from '../components/hub/SettingsPanel';
import HelpPanel from '../components/hub/HelpPanel';
import {
  FOR_YOU,
  NEWLY_RELEASED,
  POPULAR,
  TRENDING,
  CONTINUE_READING,
  FAVORITES,
  HISTORY,
} from '../data/home_data';
import './HomePage.css';

const NAV_IDS = new Set(['home', 'favorite', 'library', 'history']);
const LIBRARY_ITEMS = Array.from(
  new Map([...FOR_YOU, ...NEWLY_RELEASED, ...POPULAR, ...FAVORITES].map((item) => [item.title, item])).values(),
);

function normalise(value) {
  return String(value || '').trim().toLowerCase();
}

function filterItems(items, query) {
  const normalisedQuery = normalise(query);
  if (!normalisedQuery) return items;

  return items.filter((item) =>
    [item.title, item.genre, item.chapter].some((value) => normalise(value).includes(normalisedQuery)),
  );
}

function EmptyResults({ query }) {
  return (
    <div className="home-empty">
      <p className="home-empty__title">No titles found</p>
      <p className="home-empty__text">Try a shorter search or clear the genre filter.</p>
      {query && <span className="home-empty__query">Search: {query}</span>}
    </div>
  );
}

function SectionRow({ title, children }) {
  return (
    <section className="home-section">
      <h2 className="home-section__title">{title}</h2>
      <div className="home-section__row">{children}</div>
    </section>
  );
}

function MangaButton({ manga, navigate, variant }) {
  return (
    <button type="button" className="home-manga-btn" onClick={() => navigate('/reader', { state: { book: manga } })}>
      <MangaCard title={manga.title} color={manga.color} variant={variant} rating={manga.rating} />
    </button>
  );
}

function HomeMainContent({ navigate, searchQuery }) {
  const sections = [
    { title: 'For you', items: filterItems(FOR_YOU, searchQuery), variant: 'overlay' },
    { title: 'Newly released', items: filterItems(NEWLY_RELEASED, searchQuery), variant: 'new' },
    { title: 'Popular', items: filterItems(POPULAR, searchQuery), variant: 'popular' },
  ].filter((section) => section.items.length > 0);

  if (sections.length === 0) return <EmptyResults query={searchQuery} />;

  return sections.map((section) => (
    <SectionRow key={section.title} title={section.title}>
      {section.items.map((manga) => (
        <MangaButton key={manga.id} manga={manga} navigate={navigate} variant={section.variant} />
      ))}
    </SectionRow>
  ));
}

function LibraryContent({ navigate, searchQuery }) {
  const books = filterItems(LIBRARY_ITEMS, searchQuery);
  if (books.length === 0) return <EmptyResults query={searchQuery} />;

  return (
    <section className="home-library">
      <div className="home-library__header">
        <div>
          <h1 className="home-library__title">Library</h1>
          <p className="home-library__subtitle">Browse every available title in one place.</p>
        </div>
        <span className="home-library__count">{books.length} titles</span>
      </div>
      <div className="home-library__grid">
        {books.map((book) => (
          <MangaButton key={book.id} manga={book} navigate={navigate} variant="popular" />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialGenre = location.state?.genreId ?? null;
  const initialNav = initialGenre
    ? 'home'
    : NAV_IDS.has(location.state?.activeNav)
      ? location.state.activeNav
      : 'home';
  const [activeNav, setActiveNav] = useState(initialNav);
  const [activeGenre, setActiveGenre] = useState(initialGenre);
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingExpanded, setTrendingExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  function handleNavChange(nav) {
    setActiveNav(nav);
    setActiveGenre(null);
    // Collapse trending panel whenever user navigates (especially Home)
    setTrendingExpanded(false);
  }

  function handleGenreSelect(genreId) {
    setActiveGenre(genreId);
    if (genreId !== null) setActiveNav('home');
  }

  const showTrending = activeNav === 'home' && !activeGenre;

  function renderContent() {
    if (activeNav === 'favorite') {
      const items = filterItems(FAVORITES, searchQuery);
      return (
        <FavoritesView
          items={items}
          emptyTitle={searchQuery ? 'No favorites found' : undefined}
          emptySubtitle={searchQuery ? 'Try another title or clear search.' : undefined}
        />
      );
    }

    if (activeNav === 'history') {
      const items = filterItems(HISTORY, searchQuery);
      return (
        <HistoryView
          items={items}
          emptyTitle={searchQuery ? 'No history found' : undefined}
          emptySubtitle={searchQuery ? 'Try another title or clear search.' : undefined}
        />
      );
    }

    if (activeNav === 'library') return <LibraryContent navigate={navigate} searchQuery={searchQuery} />;
    if (activeGenre) return <GenreView genreId={activeGenre} query={searchQuery} />;
    return <HomeMainContent navigate={navigate} searchQuery={searchQuery} />;
  }

  return (
    <div className="home-page">
      <HomeHeader
        activeGenre={activeGenre}
        onGenreSelect={handleGenreSelect}
        onFavoriteClick={() => handleNavChange('favorite')}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Sidebar
        activeItem={activeNav}
        onNavChange={handleNavChange}
        activeGenre={activeGenre}
        onGenreSelect={handleGenreSelect}
        onSettingsClick={() => setShowSettings(true)}
        onHelpClick={() => setShowHelp(true)}
      />

      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />
      <HelpPanel open={showHelp} onClose={() => setShowHelp(false)} />

      <div className="home-page__main">
        <div className={`home-page__body${showTrending ? '' : ' home-page__body--full'}`}>
          <main className="home-page__content">{renderContent()}</main>
          {showTrending && (
            <TrendingSidebar
              items={TRENDING}
              onViewAll={() => setTrendingExpanded(true)}
              expanded={trendingExpanded}
              onCollapse={() => setTrendingExpanded(false)}
              onCardClick={(book) => {
                setTrendingExpanded(false);
                navigate('/reader', { state: { book } });
              }}
            />
          )}
        </div>

        <ContinueReading
          items={CONTINUE_READING}
          onViewAll={() => handleNavChange('history')}
        />
      </div>

    </div>
  );
}
