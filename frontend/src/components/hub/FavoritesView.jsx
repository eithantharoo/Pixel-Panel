import { useNavigate } from 'react-router-dom';
import './FavoritesView.css';

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fcf807" aria-hidden="true">
      <path d="M12 2l2.9 6.9H22l-5.8 4.2 2.2 6.9L12 17.8l-6.4 4.2 2.2-6.9L2 8.9h7.1z" />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#e85d8a' : 'none'} stroke={filled ? '#e85d8a' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20.5s-6.5-4.2-6.5-9.1a3.6 3.6 0 0 1 6.4-2.2A3.6 3.6 0 0 1 18.5 11.4c0 4.9-6.5 9.1-6.5 9.1z" />
    </svg>
  );
}

function FavoriteCard({ title, color, rating, genre }) {
  const navigate = useNavigate();
  const style = { background: `linear-gradient(160deg, ${color}, ${color}88)` };

  return (
    <article
      className="fav-card"
      role="button"
      tabIndex={0}
      aria-label={`Read ${title}`}
      onClick={() => navigate('/reader')}
      onKeyDown={(e) => e.key === 'Enter' && navigate('/reader')}
    >
      <div className="fav-card__cover" style={style}>
        <span className="fav-card__genre">{genre}</span>
        <button
          type="button"
          className="fav-card__heart"
          aria-label={`Remove ${title} from favorites`}
          onClick={(e) => e.stopPropagation()}
        >
          <HeartIcon filled />
        </button>
      </div>
      <div className="fav-card__info">
        <h3 className="fav-card__title">{title}</h3>
        <div className="fav-card__rating">
          <StarIcon />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
}

function FavoritesView({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="fav-empty">
        <div className="fav-empty__icon">
          <HeartIcon />
        </div>
        <p className="fav-empty__text">No favorites yet</p>
        <p className="fav-empty__sub">Books you heart will appear here</p>
      </div>
    );
  }

  return (
    <div className="fav-view">
      <div className="fav-view__header">
        <h1 className="fav-view__title">My Favorites</h1>
        <span className="fav-view__count">{items.length} books</span>
      </div>
      <div className="fav-view__grid">
        {items.map((book) => (
          <FavoriteCard key={book.id} {...book} />
        ))}
      </div>
    </div>
  );
}

export default FavoritesView;
