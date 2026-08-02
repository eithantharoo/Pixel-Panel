import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeHeader from '../components/hub/HomeHeader';
import Sidebar from '../components/hub/Sidebar';
import TrendingSidebar from '../components/hub/TrendingSidebar';
import ContinueReading from '../components/hub/ContinueReading';
import HeroCard from '../components/reader/HeroCard';
import ChapterSidebar from '../components/reader/ChapterSidebar';
import SettingsPanel from '../components/hub/SettingsPanel';
import HelpPanel from '../components/hub/HelpPanel';
import { CONTINUE_READING, TRENDING } from '../data/home_data';
import './ReaderPage.css';

const CHAPTER_COUNT = 20;

function isEditableTarget(target) {
  const tagName = target?.tagName?.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || target?.isContentEditable;
}

export default function ReaderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showChapters, setShowChapters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingExpanded, setTrendingExpanded] = useState(false);
  const [selectedBook, setSelectedBook] = useState(location.state?.book ?? null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);

  function handleBookSelect(book) {
    setSelectedBook(book);
    setShowChapters(false);    // switch back to detail view
    setTrendingExpanded(false); // collapse the expanded trending panel
    setIsFavorite(false);
    setCurrentChapter(1);
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
        setIsFavorite((favorite) => !favorite);
        return;
      }

      if (event.key === 'ArrowLeft' && showChapters) {
        event.preventDefault();
        setCurrentChapter((chapter) => Math.max(1, chapter - 1));
        return;
      }

      if (event.key === 'ArrowRight' && showChapters) {
        event.preventDefault();
        setCurrentChapter((chapter) => Math.min(CHAPTER_COUNT, chapter + 1));
      }
    }

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [showChapters, showHelp, showSettings, trendingExpanded]);

  return (
    <div className="reader-page">
      <HomeHeader
        onGenreSelect={handleGenreSelect}
        onFavoriteClick={() => handleNavChange('favorite')}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
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
        <div className="reader-page__body">
          <main className="reader-page__content">
            <HeroCard
              isReading={showChapters}
              onReadNow={handleReadNow}
              onClose={handleClose}
              book={selectedBook}
              isFavorite={isFavorite}
              onToggleFavorite={() => setIsFavorite((favorite) => !favorite)}
            />
          </main>

          {showChapters ? (
            <aside className="reader-page__right">
              <ChapterSidebar currentChapter={currentChapter} onChapterSelect={setCurrentChapter} />
            </aside>
          ) : (
            <TrendingSidebar
              items={TRENDING}
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
          items={CONTINUE_READING}
          onViewAll={() => handleNavChange('history')}
        />
      </div>
    </div>
  );
}
