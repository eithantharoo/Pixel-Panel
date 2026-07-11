import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MangaCard from './MangaCard';
import './TrendingSidebar.css';

function TrendingSidebar({ items = [], onViewAll }) {
  const navigate = useNavigate();
  const featured = items.find((item) => item.featured);
  const list = items.filter((item) => !item.featured);

  return (
    <aside className="trending" aria-label="Trending manga">
      <div className="trending__panel">
        <h2 className="trending__title">Trending</h2>

        {featured && (
          <div className="trending__featured">
            <button
              type="button"
              className="trending__card-btn"
              aria-label={`Read ${featured.title}`}
              onClick={() => navigate('/reader')}
            >
              <MangaCard {...featured} variant="featured" />
            </button>
            <div className="trending__featured-info">
              <span className="trending__featured-rank">#{featured.rank}</span>
              <p className="trending__featured-title">{featured.title}</p>
              <div className="trending__featured-rating">
                <Star size={12} className="manga-card__star" aria-hidden="true" />
                <span>{featured.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}

        <ul className="trending__list">
          {list.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="trending__card-btn"
                aria-label={`Read ${item.title}`}
                onClick={() => navigate('/reader')}
              >
                <MangaCard {...item} variant="trending" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button type="button" className="trending__view-all" onClick={onViewAll}>
        View All
      </button>
    </aside>
  );
}

export default TrendingSidebar;
