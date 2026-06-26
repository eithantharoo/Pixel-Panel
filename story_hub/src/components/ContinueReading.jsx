import MangaCard from './Manga_card'
import './ContinueReading.css'

function ContinueReading({ items }) {
  return (
    <section className="continue-reading" aria-label="Continue reading">
      <h2 className="continue-reading__title">Continue Reading</h2>

      <div className="continue-reading__items">
        {items.map((item) => (
          <MangaCard
            key={item.id}
            title={item.title}
            color={item.color}
            variant="continue"
            chapter={item.chapter}
            progress={item.progress}
          />
        ))}
      </div>

      <button type="button" className="continue-reading__view-all">View All</button>
    </section>
  )
}

export default ContinueReading
