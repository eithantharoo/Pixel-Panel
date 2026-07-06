import { useNavigate } from 'react-router-dom';
import MangaCard from './MangaCard';
import './ContinueReading.css';

function ContinueReading({ items, onViewAll }) {
  const navigate = useNavigate();

  return (
    <section className="continue-reading" aria-label="Continue reading">
      <h2 className="continue-reading__title">Continue Reading</h2>

      <div className="continue-reading__items">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="continue-reading__btn"
            aria-label={`Continue reading ${item.title}`}
            onClick={() => navigate('/reader')}
          >
            <MangaCard
              title={item.title}
              color={item.color}
              variant="continue"
              chapter={item.chapter}
              progress={item.progress}
            />
          </button>
        ))}
      </div>

      <button type="button" className="continue-reading__view-all" onClick={onViewAll}>View All</button>
    </section>
  );
}

export default ContinueReading;
