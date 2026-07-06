import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/hub/Sidebar';
import HomeHeader from '../components/hub/HomeHeader';
import MangaCard from '../components/hub/MangaCard';
import TrendingSidebar from '../components/hub/TrendingSidebar';
import ContinueReading from '../components/hub/ContinueReading';
import FavoritesView from '../components/hub/FavoritesView';
import HistoryView from '../components/hub/HistoryView';
import GenreView from '../components/hub/GenreView';
import { FOR_YOU, NEWLY_RELEASED, POPULAR, TRENDING, CONTINUE_READING, FAVORITES, HISTORY } from '../data/home_data';
import './HomePage.css';

function SectionRow({ title, children }) {
  return (
    <section className="home-section">
      <h2 className="home-section__title">{title}</h2>
      <div className="home-section__row">{children}</div>
    </section>
  );
}

function HomeMainContent({ navigate }) {
  return (
    <>
      <SectionRow title="For you">
        {FOR_YOU.map((manga) => (
          <button key={manga.id} type="button" className="home-manga-btn" onClick={() => navigate('/reader')}>
            <MangaCard title={manga.title} color={manga.color} variant="overlay" />
          </button>
        ))}
      </SectionRow>

      <SectionRow title="Newly released">
        {NEWLY_RELEASED.map((manga) => (
          <button key={manga.id} type="button" className="home-manga-btn" onClick={() => navigate('/reader')}>
            <MangaCard title={manga.title} color={manga.color} variant="new" />
          </button>
        ))}
      </SectionRow>

      <SectionRow title="Popular">
        {POPULAR.map((manga) => (
          <button key={manga.id} type="button" className="home-manga-btn" onClick={() => navigate('/reader')}>
            <MangaCard title={manga.title} color={manga.color} variant="popular" rating={manga.rating} />
          </button>
        ))}
      </SectionRow>
    </>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('home');
  const [activeGenre, setActiveGenre] = useState(null);

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

  const showSidebar  = activeNav === 'home' && !activeGenre;
  const showContinue = activeNav === 'home';

  function renderContent() {
    if (activeNav === 'favorite') return <FavoritesView items={FAVORITES} />;
    if (activeNav === 'history')  return <HistoryView  items={HISTORY}   />;
    if (activeGenre)              return <GenreView genreId={activeGenre} />;
    return <HomeMainContent navigate={navigate} />;
  }

  return (
    <div className={`home-page${showContinue ? '' : ' home-page--no-continue'}`}>
      <Sidebar activeItem={activeNav} onNavChange={handleNavChange} activeGenre={activeGenre} onGenreSelect={handleGenreSelect} />

      <div className="home-page__main">
        <HomeHeader />

        <div className={`home-page__body${showSidebar ? '' : ' home-page__body--full'}`}>
          <div className="home-page__content">
            {renderContent()}
          </div>

          {showSidebar && <TrendingSidebar items={TRENDING} />}
        </div>
      </div>

      {showContinue && <ContinueReading items={CONTINUE_READING} onViewAll={() => handleNavChange('history')} />}
    </div>
  );
}
