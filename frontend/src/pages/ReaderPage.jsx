import { useState } from 'react';
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

export default function ReaderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showChapters, setShowChapters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingExpanded, setTrendingExpanded] = useState(false);
  const [selectedBook, setSelectedBook] = useState(location.state?.book ?? null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  function handleBookSelect(book) {
    setSelectedBook(book);
    setShowChapters(false);    // switch back to detail view
    setTrendingExpanded(false); // collapse the expanded trending panel
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
              onReadNow={() => setShowChapters(true)}
              onClose={handleClose}
              book={selectedBook}
            />
          </main>

          {showChapters ? (
            <aside className="reader-page__right">
              <ChapterSidebar />
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
