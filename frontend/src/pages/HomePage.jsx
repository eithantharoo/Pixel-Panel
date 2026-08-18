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
import {
  FOR_YOU,
  NEWLY_RELEASED,
  POPULAR,
  HISTORY,
} from '../data/home_data';
import { chapterToNumber } from '../utils/libraryState';
import { getBookNotificationIds, loadReadNotificationIds, markReadNotificationIds, READ_NOTIFICATIONS_STORAGE_KEY } from '../utils/notificationState';
import { clearAuth, loadAuth } from '../utils/authState';
import { useStoryCatalog } from '../hooks/useStoryCatalog';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { useFavorites } from '../hooks/useFavorites';
import { useLiveSettings } from '../hooks/useLiveSettings';
import { useServerNotifications } from '../hooks/useServerNotifications';
import { searchStories } from '../services/storyService';
import { mapStoriesToBooks, mapStoryToBook } from '../utils/storyAdapter';
import { useTranslation } from '../utils/i18n/I18nContext';
import './HomePage.css';

const NAV_IDS = new Set(['home', 'favorite', 'library', 'history']);
function buildLibraryItems(forYou, newReleases, popular, favorites) {
  return Array.from(
    new Map([...forYou, ...newReleases, ...popular, ...favorites].map((item) => [item.title, item])).values(),
  );
}

function isEditableTarget(target) {
  const tagName = target?.tagName?.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || target?.isContentEditable;
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

function LoadingResults() {
  const { t } = useTranslation();
  return (
    <div className="home-empty">
      <p className="home-empty__title">{t('Loading...')}</p>
      <p className="home-empty__text">Fetching the latest stories for you.</p>
    </div>
  );
}

function EmptyResults({ query }) {
  const { t } = useTranslation();
  return (
    <div className="home-empty">
      <p className="home-empty__title">{t('No titles found')}</p>
      <p className="home-empty__text">{t('Try a shorter search or clear the genre filter.')}</p>
      {query && <span className="home-empty__query">{t('Search:')} {query}</span>}
    </div>
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
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState({});

  if (loading) return <LoadingResults />;

  const sections = [
    { key: 'For you', title: t('For you'), items: forYou, variant: 'overlay' },
    { key: 'Newly released', title: t('Newly released'), items: newReleases, variant: 'new' },
    { key: 'Popular', title: t('Popular'), items: popular, variant: 'popular' },
  ].filter((section) => section.items.length > 0);

  if (sections.length === 0) return <EmptyResults query="" />;

  return sections.map((section) => (
    <SectionRow
      key={section.key}
      title={section.title}
      expanded={Boolean(expandedSections[section.key])}
      onToggleExpanded={() => {
        setExpandedSections((current) => ({
          ...current,
          [section.key]: !current[section.key],
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
  const { t } = useTranslation();
  const books = filterItems(libraryItems, searchQuery);
  if (books.length === 0) return <EmptyResults query={searchQuery} />;

  return (
    <section className="home-library">
      <div className="home-library__header">
        <div>
          <h1 className="home-library__title">{t('Library')}</h1>
          <p className="home-library__subtitle">{t('Browse every available title in one place')}.</p>
        </div>
        <span className="home-library__count">{books.length} {t('titles')}</span>
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
  const { t } = useTranslation();
  const isAdmin = loadAuth()?.user?.role === 'admin';
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
  const [readNotificationIds, setReadNotificationIds] = useState(loadReadNotificationIds);
  const latestUnfinishedReads = useMemo(
    () => HISTORY.filter((book) => book.progress < 100).slice(0, 4),
    [],
  );

  const settings = useLiveSettings();
  const { trending, newReleases, popular, forYou, loading: catalogLoading } = useStoryCatalog();
  const filteredTrending = useMemo(() => filterItems(trending, searchQuery), [trending, searchQuery]);
  const { continueReading, history, loading: progressLoading } = useReadingProgress();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const {
    notifications: serverNotifications,
    markRead: markServerNotificationRead,
  } = useServerNotifications();
  const libraryItems = useMemo(
    () => buildLibraryItems(forYou, newReleases, popular, favorites),
    [forYou, newReleases, popular, favorites],
  );

  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    function onStorage(e) {
      if (e.key === READ_NOTIFICATIONS_STORAGE_KEY) {
        setReadNotificationIds(loadReadNotificationIds());
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const query = searchQuery;

    Promise.resolve().then(() => {
      if (!cancelled) setSearchLoading(true);
    });

    const timer = setTimeout(async () => {
      try {
        const stories = await searchStories(query);
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

  function handleNavChange(nav) {
    setActiveNav(nav);
    setActiveGenre(null);
    setTrendingExpanded(false);
  }

  function handleGenreSelect(genreId) {
    setActiveGenre(genreId);
    if (genreId !== null) setActiveNav('home');
  }

  function openSavedChapter(book, reason = '') {
    markNotificationsRead(getBookNotificationIds(book));
    navigate('/reader', {
      state: {
        book,
        startReading: true,
        chapter: chapterToNumber(book.chapter),
        notificationReason: reason,
      },
    });
  }

  function handleLogout() {
    clearAuth();
    navigate('/');
  }

  function openNotificationBook(book, reason) {
    navigate('/reader', {
      state: {
        book,
        notificationReason: reason,
      },
    });
  }

  function markNotificationsRead(ids) {
    setReadNotificationIds(markReadNotificationIds(ids));
  }

  function handleNotificationClick(notification) {
    markNotificationsRead([notification.id]);
    notification.onClick?.();
  }

  function handleFavoriteRemove(book) {
    toggleFavorite(book);
  }

  const notifications = useMemo(() => {
    const serverUpdates = settings.notifNewChapter
      ? serverNotifications
        .filter((n) => !n.read)
        .map((n) => ({
          id: `srv-${n._id}`,
          title: t(n.title, n.title),
          message: n.message,
          onClick: () => {
            markServerNotificationRead(n._id);
            if (n.relatedStory) {
              navigate('/reader', { state: { book: mapStoryToBook(n.relatedStory) } });
            }
          },
        }))
      : [];

    const followedBookUpdates = settings.notifNewChapter
      ? favorites.slice(0, 4).map((book) => ({
        id: `followed-book-${book.id}`,
        title: 'New chapter',
        message: `${book.title} has a new chapter because you follow this book.`,
        onClick: () => openNotificationBook(book, `You received this because ${book.title} is in your favorites.`),
      }))
      : [];

    const followedAuthorUpdates = settings.notifNewChapter
      ? NEWLY_RELEASED.slice(0, 3).map((book) => ({
        id: `followed-author-${book.id}`,
        title: 'Author update',
        message: `${book.title} was added by an author you follow.`,
        onClick: () => openNotificationBook(book, 'You received this because you follow this author.'),
      }))
      : [];

    const readBookUpdates = settings.notifRecommendations
      ? HISTORY.map((book) => ({
        id: `read-book-${book.id}`,
        title: 'Reading update',
        message: `${book.title} has a new chapter after ${book.chapter}.`,
        onClick: () => openSavedChapter(book, `You received this because you have read ${book.title} before.`),
      }))
      : [];

    const recommendations = settings.notifRecommendations
      ? FOR_YOU.slice(0, 2).map((book) => ({
        id: `foryou-${book.id}`,
        title: 'Recommended',
        message: `Based on your reads: ${book.title} is a great pick.`,
        onClick: () => openNotificationBook(book, 'You received this because it matches books in your reading history.'),
      }))
      : [];

    const historyUpdates = settings.notifDigest
      ? history.map((book) => ({
        id: `history-${book.id}`,
        title: 'Weekly digest',
        message: `${book.title} has a fresh chapter. Continue from ${book.chapter}.`,
        onClick: () => openSavedChapter(book, `You received this because ${book.title} is in your reading history.`),
      }))
      : [];

    const all = [...serverUpdates, ...followedBookUpdates, ...followedAuthorUpdates, ...readBookUpdates, ...recommendations, ...historyUpdates];
    const seen = new Set();
    const unique = all.filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    });
    const read = new Set(readNotificationIds);
    return unique.slice(0, 10).filter((notification) => !read.has(notification.id));
  }, [favorites, readNotificationIds, serverNotifications, settings.notifNewChapter, settings.notifRecommendations, settings.notifDigest, t, navigate, markServerNotificationRead]);


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
    if (activeNav === 'favorite') {
      const filteredFavorites = filterItems(favorites, searchQuery);
      return (
        <FavoritesView
          items={filteredFavorites}
          emptyTitle={searchQuery ? t('No favorites found') : undefined}
          emptySubtitle={searchQuery ? t('Try another search in your favorites.') : undefined}
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
      const filteredHistory = filterItems(HISTORY, searchQuery);
      return (
        <HistoryView
          items={filteredHistory}
          emptyTitle={searchQuery ? t('No history found') : undefined}
          emptySubtitle={searchQuery ? t('Try another search in your reading history.') : undefined}
          onBookClick={openSavedChapter}
        />
      );
    }

    if (activeNav === 'library') return <LibraryContent navigate={navigate} searchQuery={searchQuery} libraryItems={libraryItems} />;
    if (activeGenre) return <GenreView genreId={activeGenre} query={searchQuery} />;
    return <HomeMainContent navigate={navigate} forYou={forYou} newReleases={newReleases} popular={popular} loading={catalogLoading} />;
  }

  return (
    <div className="home-page">
      <HomeHeader
        activeGenre={activeGenre}
        onGenreSelect={handleGenreSelect}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onLogin={() => navigate('/')}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        onAdminClick={() => navigate('/admin')}
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
              items={filteredTrending}
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
          items={latestUnfinishedReads}
          onViewAll={() => handleNavChange('history')}
          onCardClick={openSavedChapter}
          showChapterNumbers={settings.showChapterNumbers}
        />
      </div>

    </div>
  );
}
