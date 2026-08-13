import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Clock3 } from 'lucide-react';
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
import { chapterToNumber } from '../utils/libraryState';
import { clearAuth } from '../utils/authState';
import { isEditableTarget } from '../utils/isEditableTarget';
import { useStoryCatalog } from '../hooks/useStoryCatalog';
import { useFavorites } from '../hooks/useFavorites';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { useLiveSettings } from '../hooks/useLiveSettings';
import { searchStories as searchStoriesApi } from '../services/storyService';
import { mapStoriesToBooks } from '../utils/storyAdapter';
import './HomePage.css';

const NAV_IDS = new Set(['home', 'favorite', 'library', 'history']);
function buildLibraryItems(forYou, newReleases, popular, favorites) {
  return Array.from(
    new Map([...forYou, ...newReleases, ...popular, ...favorites].map((item) => [item.title, item])).values(),
  );
}

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

function LoadingResults() {
  return (
    <div className="home-empty">
      <p className="home-empty__title">Loading...</p>
    </div>
  );
}

// Global search results — hits the real /api/stories/search endpoint
function GlobalSearchResults({ navigate, searchQuery, results, loading }) {
  if (loading) return <LoadingResults />;
  if (results.length === 0) return <EmptyResults query={searchQuery} />;
  return (
    <section className="home-library">
      <div className="home-library__header">
        <div>
          <h1 className="home-library__title">Search Results</h1>
          <p className="home-library__subtitle">Showing results for "{searchQuery}" across all titles</p>
        </div>
        <span className="home-library__count">{results.length} found</span>
      </div>
      <div className="home-library__grid">
        {results.map((book) => (
          <MangaButton key={book.id} manga={book} navigate={navigate} variant="popular" />
        ))}
      </div>
    </section>
  );
}


function SectionRow({ title, expanded, onToggleExpanded, children }) {
  return (
    <section className={`home-section${expanded ? ' home-section--expanded' : ''}`}>
      <div className="home-section__header">
        <h2 className="home-section__title">{title}</h2>
        <div className="home-section__controls">
          <button
            type="button"
            className={`home-section__show-all${expanded ? ' home-section__show-all--open' : ''}`}
            aria-expanded={expanded}
            aria-label={expanded ? `Collapse ${title}` : `Show all ${title}`}
            title={expanded ? 'Show less' : 'Show all'}
            onClick={onToggleExpanded}
          >
            <ChevronDown size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="home-section__row">{children}</div>
    </section>
  );
}

function MangaButton({ manga, navigate, variant }) {
  return (
    <button type="button" className="home-manga-btn" onClick={() => navigate('/reader', { state: { book: manga } })}>
      <MangaCard {...manga} variant={variant} />
    </button>
  );
}

function HomeMainContent({ navigate, forYou, newReleases, popular, loading }) {
  const [expandedSections, setExpandedSections] = useState({});

  if (loading) return <LoadingResults />;

  const sections = [
    { title: 'For you', items: forYou, variant: 'overlay' },
    { title: 'Newly released', items: newReleases, variant: 'new' },
    { title: 'Popular', items: popular, variant: 'popular' },
  ].filter((section) => section.items.length > 0);

  if (sections.length === 0) return <EmptyResults query="" />;

  return sections.map((section) => (
    <SectionRow
      key={section.title}
      title={section.title}
      expanded={Boolean(expandedSections[section.title])}
      onToggleExpanded={() => {
        setExpandedSections((current) => ({
          ...current,
          [section.title]: !current[section.title],
        }));
      }}
    >
      {section.items.map((manga) => (
        <MangaButton key={manga.id} manga={manga} navigate={navigate} variant={section.variant} />
      ))}
    </SectionRow>
  ));
}

function LibraryContent({ navigate, searchQuery, libraryItems }) {
  const books = filterItems(libraryItems, searchQuery);
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
  const { favorites, loading: favoritesLoading, toggleFavorite } = useFavorites();

  const { trending, newReleases, popular, forYou, loading: catalogLoading } = useStoryCatalog();
  const { continueReading, history, loading: progressLoading } = useReadingProgress();
  const libraryItems = useMemo(
    () => buildLibraryItems(forYou, newReleases, popular, favorites),
    [forYou, newReleases, popular, favorites],
  );

  // ── Global search — debounced against the real /api/stories/search ──
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  useEffect(() => {
    const query = searchQuery.trim();
    let cancelled = false;

    if (!query) {
      Promise.resolve().then(() => {
        if (!cancelled) {
          setSearchResults([]);
          setSearchLoading(false);
        }
      });
      return () => {
        cancelled = true;
      };
    }

    Promise.resolve().then(() => {
      if (!cancelled) setSearchLoading(true);
    });

    const timer = setTimeout(async () => {
      try {
        const stories = await searchStoriesApi(query);
        if (!cancelled) setSearchResults(mapStoriesToBooks(stories));
      } catch {
        if (!cancelled) setSearchResults([]);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const settings = useLiveSettings();

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

  const openSavedChapter = useCallback((book) => {
    navigate('/reader', {
      state: {
        book,
        startReading: true,
        chapter: book.chapterNumber ?? chapterToNumber(book.chapter),
      },
    });
  }, [navigate]);

  function handleLogout() {
    clearAuth();
    navigate('/');
  }

  function handleFavoriteRemove(book) {
    toggleFavorite(book);
  }

  const notifications = useMemo(() => {
    const newBooks = settings.notifNewChapter
      ? newReleases.map((book) => ({
        id: `new-book-${book.id}`,
        title: 'New Release',
        message: `${book.title} is now available on Pixel Panel.`,
        onClick: () => navigate('/reader', { state: { book } }),
      }))
      : [];

    const updates = settings.notifRecommendations
      ? continueReading.map((book) => ({
        id: `chapter-${book.id}`,
        title: '🔔 Chapter Update',
        message: `${book.title} — new chapter available after ${book.chapter}.`,
        onClick: () => openSavedChapter(book),
      }))
      : [];

    const popularNotifs = settings.notifRecommendations
      ? popular.slice(0, 2).map((book) => ({
        id: `popular-${book.id}`,
        title: '🔥 Trending Now',
        message: `${book.title} is trending this week. Don't miss it!`,
        onClick: () => navigate('/reader', { state: { book } }),
      }))
      : [];

    const forYouNotifs = settings.notifRecommendations
      ? forYou.slice(0, 2).map((book) => ({
        id: `foryou-${book.id}`,
        title: '⭐ Recommended',
        message: `Based on your reads: ${book.title} is a great pick.`,
        onClick: () => navigate('/reader', { state: { book } }),
      }))
      : [];

    const historyUpdates = settings.notifDigest
      ? history.map((book) => ({
        id: `history-${book.id}`,
        title: '📖 Weekly Digest',
        message: `${book.title} has a fresh chapter. Continue from ${book.chapter}.`,
        onClick: () => openSavedChapter(book),
      }))
      : [];

    // Merge all, deduplicate by id, then cap to 10
    const all = [...newBooks, ...updates, ...popularNotifs, ...forYouNotifs, ...historyUpdates];
    const seen = new Set();
    const unique = all.filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    });
    return unique.slice(0, 10);
  }, [navigate, openSavedChapter, settings.notifNewChapter, settings.notifRecommendations, settings.notifDigest, newReleases, popular, forYou, continueReading, history]);


  const showTrending = activeNav === 'home' && !activeGenre;

  const getFirstVisibleBook = useCallback(() => {
    if (activeNav === 'favorite') return filterItems(favorites, searchQuery)[0];
    if (activeNav === 'history') return filterItems(history, searchQuery)[0];
    if (activeNav === 'library') return filterItems(libraryItems, searchQuery)[0];
    return filterItems([...forYou, ...newReleases, ...popular], searchQuery)[0];
  }, [activeNav, favorites, forYou, history, libraryItems, newReleases, popular, searchQuery]);

  useEffect(() => {
    function handleShortcut(event) {
      if (isEditableTarget(event.target) && event.key !== 'Escape') return;

      if (event.key === 'Escape') {
        if (showHelp) {
          setShowHelp(false);
          return;
        }
        if (showSettings) {
          setShowSettings(false);
          return;
        }
        if (trendingExpanded) {
          setTrendingExpanded(false);
          return;
        }
        if (activeGenre) {
          setActiveGenre(null);
          return;
        }
        if (activeNav !== 'home') {
          setActiveNav('home');
        }
        return;
      }

      if (event.key.toLowerCase() === 'r') {
        const book = getFirstVisibleBook();
        if (!book) return;
        event.preventDefault();
        navigate('/reader', { state: { book } });
        return;
      }

      if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        handleNavChange('favorite');
      }
    }

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [activeGenre, activeNav, getFirstVisibleBook, navigate, showHelp, showSettings, trendingExpanded]);

  function renderContent() {
    // ── Global search: always search ALL books, deduplicated ──────
    if (searchQuery.trim()) {
      return (
        <GlobalSearchResults
          navigate={navigate}
          searchQuery={searchQuery}
          results={searchResults}
          loading={searchLoading}
        />
      );
    }

    if (activeNav === 'favorite') {
      if (favoritesLoading) return <LoadingResults />;
      return (
        <FavoritesView
          items={favorites}
          onRemove={handleFavoriteRemove}
        />
      );
    }

    if (activeNav === 'history') {
      if (!settings.saveHistory) {
        return (
          <div className="home-empty">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}><Clock3 size={40} color="var(--home-text-muted)" /></div>
            <p className="home-empty__title">Reading history is disabled</p>
            <p className="home-empty__text">Enable "Save Reading History" in Settings → Privacy to track your progress.</p>
          </div>
        );
      }
      if (progressLoading) return <LoadingResults />;
      return (
        <HistoryView
          items={history}
          onBookClick={openSavedChapter}
        />
      );
    }

    if (activeNav === 'library') return <LibraryContent navigate={navigate} searchQuery="" libraryItems={libraryItems} />;
    if (activeGenre) return <GenreView genreId={activeGenre} query="" />;
    return (
      <HomeMainContent
        navigate={navigate}
        forYou={forYou}
        newReleases={newReleases}
        popular={popular}
        loading={catalogLoading}
      />
    );
  }

  return (
    <div className="home-page">
      <HomeHeader
        activeGenre={activeGenre}
        onGenreSelect={handleGenreSelect}
        onFavoriteClick={() => handleNavChange('favorite')}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        notifications={notifications}
        onLogin={() => navigate('/')}
        onLogout={handleLogout}
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
              items={trending}
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
      </div>

      <div className="home-page__footer">
        <ContinueReading
          items={continueReading}
          onViewAll={() => handleNavChange('history')}
          onCardClick={openSavedChapter}
          showChapterNumbers={settings.showChapterNumbers}
        />
      </div>

    </div>
  );
}
