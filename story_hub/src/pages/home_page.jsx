import Sidebar from '../components/Sidebar'
import HomeHeader from '../components/HomeHeader'
import MangaCard from '../components/Manga_card'
import TrendingSidebar from '../components/TrendingSidebar'
import ContinueReading from '../components/ContinueReading'
import {
  FOR_YOU,
  NEWLY_RELEASED,
  POPULAR,
  TRENDING,
  CONTINUE_READING,
} from '../data/home_data'
import './home_page.css'

function SectionRow({ title, children }) {
  return (
    <section className="home-section">
      <h2 className="home-section__title">{title}</h2>
      <div className="home-section__row">{children}</div>
    </section>
  )
}

function HomePage() {
  return (
    <div className="home-page">
      <Sidebar activeItem="home" />

      <div className="home-page__main">
        <HomeHeader />

        <div className="home-page__body">
          <div className="home-page__content">
            <SectionRow title="For you">
              {FOR_YOU.map((manga) => (
                <MangaCard
                  key={manga.id}
                  title={manga.title}
                  color={manga.color}
                  variant="overlay"
                />
              ))}
            </SectionRow>

            <SectionRow title="Newly released">
              {NEWLY_RELEASED.map((manga) => (
                <MangaCard
                  key={manga.id}
                  title={manga.title}
                  color={manga.color}
                  variant="new"
                />
              ))}
            </SectionRow>

            <SectionRow title="Popular">
              {POPULAR.map((manga) => (
                <MangaCard
                  key={manga.id}
                  title={manga.title}
                  color={manga.color}
                  variant="popular"
                  rating={manga.rating}
                />
              ))}
            </SectionRow>
          </div>

          <TrendingSidebar items={TRENDING} />
        </div>
      </div>

      <ContinueReading items={CONTINUE_READING} />
    </div>
  )
}

export default HomePage
