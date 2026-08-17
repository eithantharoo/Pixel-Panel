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
import { chapterToNumber } from '../utils/libraryState';
import { clearAuth } from '../utils/authState';
import { isEditableTarget } from '../utils/isEditableTarget';
import { useStoryCatalog } from '../hooks/useStoryCatalog';
import { useFavorites } from '../hooks/useFavorites';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { useSavedProgress } from '../hooks/useSavedProgress';
import { useChapterContent } from '../hooks/useChapterContent';
import { useLiveSettings } from '../hooks/useLiveSettings';
import { getStoryById } from '../services/storyService';
import { mapStoryToBook } from '../utils/storyAdapter';
import { isRealStoryId } from '../utils/objectId';
import './ReaderPage.css';

const DEFAULT_CHAPTER_COUNT = 20;

export default function ReaderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showChapters, setShowChapters] = useState(Boolean(location.state?.startReading));
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingExpanded, setTrendingExpanded] = useState(false);
  const [selectedBook, setSelectedBook] = useState(location.state?.book ?? null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(() => chapterToNumber(location.state?.chapter ?? location.state?.book?.chapter));

  // Reaching /reader with no book (direct URL nav, or a hard refresh —
  // which loses location.state) used to fall through to HeroCard's
  // built-in sample data, showing a fake "Jujutsu Kaisen" detail page as
  // if it were real. Bounce back to /home instead.
  useEffect(() => {
    if (!location.state?.book) {
      navigate('/home', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only check the book present at initial mount, not on later setSelectedBook(null) from handleClose
  }, []);

  const { trending, newReleases } = useStoryCatalog();
  const { continueReading, history } = useReadingProgress();
  const { favorites, isFavorite: checkFavorite, toggleFavorite } = useFavorites();
  const isFavorite = checkFavorite(selectedBook);
  const totalChapters = selectedBook?.totalChapters || DEFAULT_CHAPTER_COUNT;
  const { chapter: chapterContent, loading: chapterLoading } = useChapterContent(
    selectedBook?.id,
    showChapters ? currentChapter : null,
  );

  useSavedProgress({
    book: selectedBook,
    currentChapter,
    totalChapters,
    isReading: showChapters,
    onResume: setCurrentChapter,
  });

  const settings = useLiveSettings();

  // ── Auto-advance: move to next chapter when the current one ends ──
  function handleChapterEnd() {
    if (!settings.autoAdvance) return;
    if (settings.readDirection === 'rtl') {
      setCurrentChapter((ch) => Math.max(1, ch - 1));
    } else {
      setCurrentChapter((ch) => Math.min(totalChapters, ch + 1));
    }
  }

  function handleBookSelect(book, startReading = false) {
    setSelectedBook(book);
    setShowChapters(startReading);
    setTrendingExpanded(false);
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

  function handleLogout() {
    clearAuth();
    navigate('/');
  }

  function handleSavedChapterSelect(book) {
    handleBookSelect(book, true);
  }

  function handleToggleFavorite() {
    if (!selectedBook) return;
    toggleFavorite(selectedBook);
  }

  // Reviews recalculate the story's average rating server-side — refetch
  // it so the rating shown here updates without a full page reload.
  function handleRatingChange() {
    if (!isRealStoryId(selectedBook?.id)) return;
    getStoryById(selectedBook.id)
      .then((story) => {
        setSelectedBook((current) => (current ? mapStoryToBook(story, { chapter: current.chapter, chapterNumber: current.chapterNumber }) : current));
      })
      .catch(() => {});
  }

  const notifications = useMemo(() => {
    const newBooks = newReleases.slice(0, 2).map((book) => ({
      id: `new-book-${book.id}`,
      title: 'New book',
      message: `${book.title} was added to Pixel Panel.`,
      onClick: () => handleBookSelect(book),
    }));

    const updates = continueReading.slice(0, 2).map((book) => ({
      id: `chapter-${book.id}`,
      title: 'New chapter',
      message: `${book.title} has an update after ${book.chapter}.`,
      onClick: () => handleSavedChapterSelect(book),
    }));

    const historyUpdates = history.slice(0, 1).map((book) => ({
      id: `history-${book.id}`,
      title: 'Reading update',
      message: `${book.title} has a fresh chapter from your history.`,
      onClick: () => handleSavedChapterSelect(book),
    }));

    return [...newBooks, ...updates, ...historyUpdates];
  }, [navigate, favorites, newReleases, continueReading, history]);

  function handleClose() {
    if (showChapters) {
      setShowChapters(false);
      return;
    }
    setSelectedBook(null);
    navigate('/home');
  }

  function handleReadNow() {
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
          if (currentChapter < totalChapters) {
            setCurrentChapter((ch) => Math.min(totalChapters, ch + 1));
          } else {
            handleChapterEnd();
          }
        }
      }
    }

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [favorites, selectedBook, showChapters, showHelp, showSettings, trendingExpanded, settings, currentChapter, totalChapters]);

  // Render nothing while the redirect-to-/home effect above is in flight,
  // rather than flashing HeroCard's fake sample book for a frame.
  if (!selectedBook) return null;

  return (
    <div className="reader-page">
      <HomeHeader
        onGenreSelect={handleGenreSelect}
        onFavoriteClick={() => handleNavChange('favorite')}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        notifications={notifications}
        onLogin={() => navigate('/')}
        onLogout={handleLogout}
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
              chapterContent={chapterContent}
              chapterLoading={chapterLoading}
              onRatingChange={handleRatingChange}
            />
          </main>

          {showChapters ? (
            <aside className="reader-page__right reader-page__right--chapters">
              <ChapterSidebar
                currentChapter={currentChapter}
                totalChapters={totalChapters}
                onChapterSelect={setCurrentChapter}
                readDirection={settings.readDirection}
                onChapterEnd={handleChapterEnd}
              />
            </aside>
          ) : (
            <TrendingSidebar
              items={trending}
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
          items={continueReading}
          onViewAll={() => handleNavChange('history')}
          onCardClick={handleSavedChapterSelect}
          showChapterNumbers={settings.showChapterNumbers}
        />
      </div>
    </div>
  );
}
