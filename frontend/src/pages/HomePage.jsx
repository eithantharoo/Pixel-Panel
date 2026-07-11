import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Topbar from '../components/layout/Topbar';
import Sidebar from '../components/layout/Sidebar';
import TrendingPanel from '../components/layout/TrendingPanel';
import ContinueReadingBar from '../components/layout/ContinueReadingBar';
import MangaCard from '../components/hub/MangaCard';
import FavoritesView from '../components/hub/FavoritesView';
import HistoryView from '../components/hub/HistoryView';
import GenreView from '../components/hub/GenreView';
import { FOR_YOU, NEWLY_RELEASED, POPULAR, TRENDING, CONTINUE_READING, FAVORITES, HISTORY } from '../data/home_data';
import './HomePage.css';

const NAV_IDS = new Set(['home', 'favorite', 'library', 'history']);
const LIBRARY_ITEMS = Array.from(
  new Map([...FOR_YOU, ...NEWLY_RELEASED, ...POPULAR, ...FAVORITES].map((item) => [item.title, item])).values()
);

function normalise(value) {
  return String(value || '').trim().toLowerCase();
}

function matchesSearch(item, query) {
  const q = normalise(query);
  if (!q) return true;
  return [item.title, item.genre, item.chapter].some((value) => normalise(value).includes(q));
}

function filterItems(items, query) {
  return items.filter((item) => matchesSearch(item, query));
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
    <button key={manga.id} type="button" className="home-manga-btn" onClick={() => navigate('/reader')}>
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

  // When a sidebar nav item is selected, clear the genre filter
  function handleNavChange(nav) {
    setActiveNav(nav);
    setActiveGenre(null);
  }

  // When genre is selected, switch back to home view
  function handleGenreSelect(genreId) {
    setActiveGenre(genreId);
    if (genreId !== null) setActiveNav('home');
  }

  const showTrending = activeNav === 'home' && !activeGenre;
  const showContinue = activeNav === 'home';

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
    if (activeNav === 'library')   return <LibraryContent navigate={navigate} searchQuery={searchQuery} />;
    if (activeGenre)               return <GenreView genreId={activeGenre} query={searchQuery} />;
    return <HomeMainContent navigate={navigate} searchQuery={searchQuery} />;
  }

  return (
    <AppLayout
      topbar={(
        <Topbar
          activeGenre={activeGenre}
          onGenreSelect={handleGenreSelect}
          onFavoriteClick={() => handleNavChange('favorite')}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
      sidebar={<Sidebar activeItem={activeNav} onNavChange={handleNavChange} activeGenre={activeGenre} onGenreSelect={handleGenreSelect} />}
      rightPanel={showTrending ? (
        <TrendingPanel items={TRENDING} onCardClick={() => navigate('/reader')} onViewAll={() => handleNavChange('history')} />
      ) : null}
      bottomBar={showContinue ? (
        <ContinueReadingBar items={CONTINUE_READING} onCardClick={() => navigate('/reader')} onViewAll={() => handleNavChange('history')} />
      ) : null}
    >
      <div className="home-content homemainContent">
        {renderContent()}
      </div>
    </AppLayout>
  );
}
