import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import './FavoritesView.css';

function StarIcon() {
  return <Star size={12} className="fill-[var(--text-yellow)] text-[var(--text-yellow)]" aria-hidden="true" />;
}

function HeartIcon({ filled }) {
  return (
    <Heart size={16} fill={filled ? '#e85d8a' : 'none'} strokeWidth={1.9} aria-hidden="true" />
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

function FavoritesView({ items, emptyTitle = 'No favorites yet', emptySubtitle = 'Saved titles will appear here.' }) {
  if (!items || items.length === 0) {
    return (
      <div className="fav-empty">
        <div className="fav-empty__icon">
          <HeartIcon />
        </div>
        <p className="fav-empty__text">{emptyTitle}</p>
        <p className="fav-empty__sub">{emptySubtitle}</p>
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
