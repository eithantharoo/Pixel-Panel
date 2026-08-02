import { Star } from 'lucide-react';
import './MangaCard.css';

function MangaCard({ title, cover, color = '#3a2858', variant = 'default', rating, chapter, progress, rank }) {
  const style = cover ? undefined : { background: `linear-gradient(160deg, ${color}, ${color}88)` };

  if (variant === 'trending') {
    return (
      <article className="manga-card manga-card--trending">
        <div className="manga-card__cover" style={style}>
          {cover && <img src={cover} alt={title} />}
          {rank != null && <span className="manga-card__rank">{rank}</span>}
        </div>
        <h3 className="manga-card__title">{title}</h3>
        {rating != null && (
          <div className="manga-card__rating manga-card__rating--inline">
            <Star size={12} className="manga-card__star" aria-hidden="true" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
      </article>
    );
  }

  if (variant === 'continue') {
    return (
      <article className="manga-card manga-card--continue">
        <div className="manga-card__cover" style={style}>
          {cover && <img src={cover} alt={title} />}
        </div>
        <div className="manga-card__continue-info">
          <p className="manga-card__continue-title">{title}</p>
          {chapter && <p className="manga-card__continue-chapter">{chapter}</p>}
          {progress != null && (
            <div className="manga-card__progress">
              <div className="manga-card__progress-bar" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className={`manga-card manga-card--${variant}`}>
      <div className="manga-card__cover" style={style}>
        {cover && <img src={cover} alt={title} />}
        {variant === 'new' && <span className="manga-card__badge">New</span>}

        {variant === 'featured' && rank != null && (
          <span className="manga-card__rank manga-card__rank--featured">{rank}</span>
        )}

        {/* Book info footer — shown on overlay/new/popular/featured variants */}
        {(variant === 'overlay' || variant === 'new' || variant === 'popular' || variant === 'featured') && (
          <div className="manga-card__book-footer">
            <p className="manga-card__book-footer-name">{title}</p>
            {rating != null && (
              <div className="manga-card__book-footer-rating">
                <Star size={10} className="manga-card__star" aria-hidden="true" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        )}

        {/* Hover overlay — genre-style pill button */}
        <div className="manga-card__hover-overlay">
          <span className="manga-card__read-btn">Read Now</span>
        </div>
      </div>

      {variant !== 'overlay' && variant !== 'featured' && variant !== 'new' && variant !== 'popular' && (
        <h3 className="manga-card__title">{title}</h3>
      )}
    </article>
  );
}

export default MangaCard;
