import { useNavigate } from 'react-router-dom';
import MangaCard from './MangaCard';
import './ContinueReading.css';

function ContinueReading({ items, onViewAll }) {
  const navigate = useNavigate();

  return (
    <section
      className="continue-reading"
      aria-label="Continue reading"
    >
      {/* Toggle button — stays fixed on the left of the bar */}
      <label
        htmlFor="cr-toggle"
        className="continue-reading__toggle"
        aria-label="Toggle continue reading"
      >
        <input
          type="checkbox"
          id="cr-toggle"
          className="continue-reading__checkbox"
          aria-hidden="true"
        />
        <svg
          className="continue-reading__toggle-icon"
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <span>Continue Reading</span>
        <svg
          className="continue-reading__toggle-arrow"
          width="12" height="12" viewBox="0 0 12 12"
          aria-hidden="true"
        >
          <path d="M4.5 3 7.5 6 4.5 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </label>

      {/* Book strip — slides in to the right when open */}
      <div className="continue-reading__items">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="continue-reading__item-btn"
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

      {/* View All — slides in alongside the books */}
      <button
        type="button"
        className="continue-reading__view-all"
        onClick={onViewAll}
      >
        View All
      </button>
    </section>
  );
}

export default ContinueReading;
