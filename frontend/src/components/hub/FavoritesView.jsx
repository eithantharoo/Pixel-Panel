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

function FavoriteCard({ title, color, cover, rating, genre, onRemove }) {
  const navigate = useNavigate();
  const style = { background: `linear-gradient(160deg, ${color}, ${color}88)` };
  const book = { title, color, cover, rating, genre };

  return (
    <article
      className="fav-card"
      role="button"
      tabIndex={0}
      aria-label={`Read ${title}`}
      onClick={() => navigate('/reader', { state: { book } })}
      onKeyDown={(e) => e.key === 'Enter' && navigate('/reader', { state: { book } })}
    >
      <div className="fav-card__cover" style={style}>
        {cover && <img src={cover} alt={title} />}
        <span className="fav-card__genre">{genre}</span>
        <button
          type="button"
          className="fav-card__heart"
          aria-label={`Remove ${title} from favorites`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.(book);
          }}
        >
          <HeartIcon filled />
        </button>
        {/* Book footer overlay */}
        <div className="fav-card__book-footer">
          <p className="fav-card__book-footer-name">{title}</p>
          <div className="fav-card__book-footer-rating">
            <StarIcon />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
        {/* Genres-style hover overlay */}
        <div className="fav-card__hover-overlay">
          <span className="fav-card__read-btn">Read Now</span>
        </div>
      </div>
    </article>
  );
}

function FavoritesView({ items, emptyTitle = 'No favorites yet', emptySubtitle = 'Saved titles will appear here.', onRemove }) {
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
          <FavoriteCard key={book.id} {...book} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}

export default FavoritesView;
