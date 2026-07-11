import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHeader from '../components/hub/HomeHeader';
import Sidebar from '../components/hub/Sidebar';
import TrendingSidebar from '../components/hub/TrendingSidebar';
import ContinueReading from '../components/hub/ContinueReading';
import HeroCard from '../components/reader/HeroCard';
import ChapterSidebar from '../components/reader/ChapterSidebar';
import { CONTINUE_READING, TRENDING } from '../data/home_data';
import './ReaderPage.css';

export default function ReaderPage() {
  const navigate = useNavigate();
  const [showChapters, setShowChapters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  function handleNavChange(navId) {
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

      <Sidebar activeItem="home" onNavChange={handleNavChange} />

      <div className="reader-page__main">
        <div className="reader-page__body">
          <main className="reader-page__content">
            <HeroCard
              isReading={showChapters}
              onReadNow={() => setShowChapters(true)}
              onClose={handleClose}
            />
          </main>

          <aside className="reader-page__right">
            {showChapters ? (
              <ChapterSidebar />
            ) : (
              <TrendingSidebar
                items={TRENDING}
                onViewAll={() => handleNavChange('history')}
              />
            )}
          </aside>
        </div>

        <ContinueReading
          items={CONTINUE_READING}
          onViewAll={() => handleNavChange('history')}
        />
      </div>
    </div>
  );
}
