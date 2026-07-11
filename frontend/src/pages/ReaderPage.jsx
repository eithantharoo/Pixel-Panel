import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Topbar from '../components/layout/Topbar';
import Sidebar from '../components/layout/Sidebar';
import TrendingPanel from '../components/layout/TrendingPanel';
import ContinueReadingBar from '../components/layout/ContinueReadingBar';
import HeroCard from '../components/reader/HeroCard';
import ChapterSidebar from '../components/reader/ChapterSidebar';

export default function ReaderPage() {
  const navigate = useNavigate();
  const [showChapters, setShowChapters] = useState(false);

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
    <AppLayout
      topbar={<Topbar onFavoriteClick={() => handleNavChange('favorite')} onGenreSelect={handleGenreSelect} />}
      sidebar={<Sidebar activeItem="home" onNavChange={handleNavChange} onGenreSelect={handleGenreSelect} />}
      rightPanel={showChapters ? <ChapterSidebar /> : <TrendingPanel />}
      bottomBar={!showChapters ? <ContinueReadingBar /> : null}
    >
      <HeroCard
        isReading={showChapters}
        onReadNow={() => setShowChapters(true)}
        onClose={handleClose}
      />
    </AppLayout>
  );
}
