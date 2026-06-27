import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/hub/Sidebar';
import HomeHeader from '../components/hub/HomeHeader';
import MangaCard from '../components/hub/MangaCard';
import TrendingSidebar from '../components/hub/TrendingSidebar';
import ContinueReading from '../components/hub/ContinueReading';
import { FOR_YOU, NEWLY_RELEASED, POPULAR, TRENDING, CONTINUE_READING } from '../data/home_data';
import './HomePage.css';

function SectionRow({ title, children }) {
  return (
    <section className="home-section">
      <h2 className="home-section__title">{title}</h2>
      <div className="home-section__row">{children}</div>
    </section>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Sidebar activeItem="home" />

      <div className="home-page__main">
        <HomeHeader />

        <div className="home-page__body">
          <div className="home-page__content">
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
          </div>

          <TrendingSidebar items={TRENDING} />
        </div>
      </div>

      <ContinueReading items={CONTINUE_READING} />
    </div>
  );
}
