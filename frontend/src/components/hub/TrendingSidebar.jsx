import { useNavigate } from 'react-router-dom';
import MangaCard from './MangaCard';
import './TrendingSidebar.css';

function TrendingSidebar({ items }) {
  const navigate = useNavigate();
  const featured = items.find((item) => item.featured);
  const list = items.filter((item) => !item.featured);

  return (
    <aside className="trending">
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
              <MangaCard
                title={featured.title}
                color={featured.color}
                variant="featured"
                rating={featured.rating}
                rank={featured.rank}
              />
            </button>
            <div className="trending__featured-info">
              <span className="trending__featured-rank">#{featured.rank}</span>
              <p className="trending__featured-title">{featured.title}</p>
              <div className="trending__featured-rating">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#fcf807" aria-hidden="true">
                  <path d="M12 2l2.9 6.9H22l-5.8 4.2 2.2 6.9L12 17.8l-6.4 4.2 2.2-6.9L2 8.9h7.1z" />
                </svg>
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
                <MangaCard
                  title={item.title}
                  color={item.color}
                  variant="trending"
                  rating={item.rating}
                  rank={item.rank}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button type="button" className="trending__view-all">View All</button>
    </aside>
  );
}

export default TrendingSidebar;
