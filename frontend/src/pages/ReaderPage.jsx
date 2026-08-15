import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeHeader from '../components/hub/HomeHeader';
import Sidebar from '../components/hub/Sidebar';
import TrendingSidebar from '../components/hub/TrendingSidebar';
import ContinueReading from '../components/hub/ContinueReading';
import HeroCard from '../components/reader/HeroCard';
import ChapterSidebar from '../components/reader/ChapterSidebar';
import SettingsPanel from '../components/hub/SettingsPanel';
import HelpPanel from '../components/hub/HelpPanel';
import { CONTINUE_READING, FAVORITES, HISTORY, NEWLY_RELEASED, TRENDING } from '../data/home_data';
import { chapterToNumber, isFavoriteBook, loadFavorites, saveFavorites, toggleFavoriteBook } from '../utils/libraryState';
import { getBookNotificationIds, loadReadNotificationIds, markReadNotificationIds, READ_NOTIFICATIONS_STORAGE_KEY } from '../utils/notificationState';
import { loadSettings, applySettings } from '../utils/settingsState';
import './ReaderPage.css';

const CHAPTER_COUNT = 20;

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

export default function ReaderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showChapters, setShowChapters] = useState(Boolean(location.state?.startReading));
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingExpanded, setTrendingExpanded] = useState(false);
  const [selectedBook, setSelectedBook] = useState(location.state?.book ?? null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [favorites, setFavorites] = useState(() => loadFavorites(FAVORITES));
  const [readNotificationIds, setReadNotificationIds] = useState(loadReadNotificationIds);
  const [notificationReason, setNotificationReason] = useState(location.state?.notificationReason ?? '');
  const [isFavorite, setIsFavorite] = useState(() => isFavoriteBook(location.state?.book, loadFavorites(FAVORITES)));
  const [currentChapter, setCurrentChapter] = useState(() => chapterToNumber(location.state?.chapter ?? location.state?.book?.chapter));
  const filteredTrending = useMemo(() => filterItems(TRENDING, searchQuery), [searchQuery]);
  const latestUnfinishedReads = useMemo(
    () => HISTORY.filter((book) => book.progress < 100).slice(0, 4),
    [],
  );

  // ── Live settings ─────────────────────────────────────────────
  const [settings, setSettings] = useState(loadSettings);

  // Re-read settings whenever the panel saves (SettingsPanel fires a storage event)
  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'pixel-panel-settings') {
        const next = loadSettings();
        applySettings(next);
        setSettings(next);
      }

      if (e.key === READ_NOTIFICATIONS_STORAGE_KEY) {
        setReadNotificationIds(loadReadNotificationIds());
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // ── Auto-advance: move to next chapter when the current one ends ──
  function handleChapterEnd() {
    if (!settings.autoAdvance) return;
    if (settings.readDirection === 'rtl') {
      setCurrentChapter((ch) => Math.max(1, ch - 1));
    } else {
      setCurrentChapter((ch) => Math.min(CHAPTER_COUNT, ch + 1));
    }
  }

  function handleBookSelect(book, startReading = false, reason = '') {
    setSelectedBook(book);
    setShowChapters(startReading);
    setTrendingExpanded(false);
    setNotificationReason(reason);
    setIsFavorite(isFavoriteBook(book, favorites));
    setCurrentChapter(chapterToNumber(book.chapter));
  }

  function handleNavChange(navId) {
    setTrendingExpanded(false);
    if (navId === 'home') {
      navigate('/home');
      return;
    }
    navigate('/home', { state: { activeNav: navId } });
  }

  function handleGenreSelect(genreId) {
    navigate('/home', { state: { genreId } });
  }

  function handleSavedChapterSelect(book, reason = '') {
    markNotificationsRead(getBookNotificationIds(book));
    handleBookSelect(book, true, reason);
  }

  function markNotificationsRead(ids) {
    setReadNotificationIds(markReadNotificationIds(ids));
  }

  function handleNotificationClick(notification) {
    markNotificationsRead([notification.id]);
    notification.onClick?.();
  }

  function handleToggleFavorite() {
    if (!selectedBook) return;

    setFavorites((current) => {
      const nextFavorites = toggleFavoriteBook(selectedBook, current);
      saveFavorites(nextFavorites);
      setIsFavorite(isFavoriteBook(selectedBook, nextFavorites));
      return nextFavorites;
    });
  }

  const notifications = useMemo(() => {
    const followedBookUpdates = favorites.slice(0, 4).map((book) => ({
      id: `followed-book-${book.id}`,
      title: 'New chapter',
      message: `${book.title} has a new chapter because you follow this book.`,
      onClick: () => handleBookSelect(book, false, `You received this because ${book.title} is in your favorites.`),
    }));

    const followedAuthorUpdates = NEWLY_RELEASED.slice(0, 2).map((book) => ({
      id: `followed-author-${book.id}`,
      title: 'Author update',
      message: `${book.title} was added by an author you follow.`,
      onClick: () => handleBookSelect(book, false, 'You received this because you follow this author.'),
    }));

    const readingUpdates = CONTINUE_READING.slice(0, 3).map((book) => ({
      id: `read-book-${book.id}`,
      title: 'Reading update',
      message: `${book.title} has an update after ${book.chapter}.`,
      onClick: () => handleSavedChapterSelect(book, `You received this because you have read ${book.title} before.`),
    }));

    const historyUpdates = HISTORY.slice(0, 1).map((book) => ({
      id: `history-${book.id}`,
      title: 'Reading update',
      message: `${book.title} has a fresh chapter from your history.`,
      onClick: () => handleSavedChapterSelect(book, `You received this because ${book.title} is in your reading history.`),
    }));

    const read = new Set(readNotificationIds);
    return [...followedBookUpdates, ...followedAuthorUpdates, ...readingUpdates, ...historyUpdates]
      .slice(0, 10)
      .filter((notification) => !read.has(notification.id));
  }, [favorites, readNotificationIds]);

  function handleClose() {
    if (showChapters) {
      setShowChapters(false);
      return;
    }
    setSelectedBook(null);
    navigate('/home');
  }

  function handleReadNow() {
    markNotificationsRead(getBookNotificationIds(selectedBook));
    setShowChapters(true);
    setCurrentChapter((chapter) => chapter || 1);
  }

  useEffect(() => {
    function handleShortcut(event) {
      if (isEditableTarget(event.target) && event.key !== 'Escape') return;

      if (event.key === 'Escape') {
        if (showHelp) { setShowHelp(false); return; }
        if (showSettings) { setShowSettings(false); return; }
        if (trendingExpanded) { setTrendingExpanded(false); return; }
        handleClose();
        return;
      }

      if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        handleReadNow();
        return;
      }

      if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        handleToggleFavorite();
        return;
      }

      if (showChapters) {
        const prevKey = settings.readDirection === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
        const nextKey = settings.readDirection === 'rtl' ? 'ArrowLeft' : 'ArrowRight';

        if (event.key === prevKey) {
          event.preventDefault();
          setCurrentChapter((ch) => Math.max(1, ch - 1));
          return;
        }
        if (event.key === nextKey) {
          event.preventDefault();
          if (currentChapter < CHAPTER_COUNT) {
            setCurrentChapter((ch) => Math.min(CHAPTER_COUNT, ch + 1));
          } else {
            handleChapterEnd();
          }
        }
      }
    }

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [favorites, selectedBook, showChapters, showHelp, showSettings, trendingExpanded, settings, currentChapter]);

  return (
    <div className="reader-page">
      <HomeHeader
        onGenreSelect={handleGenreSelect}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onLogin={() => navigate('/')}
        onLogout={() => navigate('/')}
      />

      <Sidebar
        activeItem="home"
        onNavChange={handleNavChange}
        onSettingsClick={() => setShowSettings(true)}
        onHelpClick={() => setShowHelp(true)}
      />

      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />
      <HelpPanel open={showHelp} onClose={() => setShowHelp(false)} />

      <div className="reader-page__main">
        <div className={`reader-page__body${showChapters ? ' reader-page__body--reading' : ''}`}>
          <main className={`reader-page__content${showChapters ? ' reader-page__content--reading' : ''}`}>
            <HeroCard
              isReading={showChapters}
              onReadNow={handleReadNow}
              onClose={handleClose}
              book={selectedBook}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
              notificationReason={notificationReason}
            />
          </main>

          {showChapters ? (
            <aside className="reader-page__right reader-page__right--chapters">
              <ChapterSidebar
                currentChapter={currentChapter}
                onChapterSelect={setCurrentChapter}
                readDirection={settings.readDirection}
                onChapterEnd={handleChapterEnd}
              />
            </aside>
          ) : (
            <TrendingSidebar
              items={filteredTrending}
              onViewAll={() => setTrendingExpanded(true)}
              expanded={trendingExpanded}
              onCollapse={() => setTrendingExpanded(false)}
              onCardClick={handleBookSelect}
            />
          )}
        </div>
      </div>

      <div className="reader-page__footer">
        <ContinueReading
          items={latestUnfinishedReads}
          onViewAll={() => handleNavChange('history')}
          onCardClick={handleSavedChapterSelect}
          showChapterNumbers={settings.showChapterNumbers}
        />
      </div>
    </div>
  );
}
