import './Manga_card.css'

function MangaCard({
  title,
  cover,
  color = '#3a2858',
  variant = 'default',
  rating,
  chapter,
  progress,
  rank,
}) {
  const style = cover ? undefined : { background: `linear-gradient(160deg, ${color}, ${color}88)` }

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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#fcf807" aria-hidden="true">
              <path d="M12 2l2.9 6.9H22l-5.8 4.2 2.2 6.9L12 17.8l-6.4 4.2 2.2-6.9L2 8.9h7.1z" />
            </svg>
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
      </article>
    )
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
    )
  }

  return (
    <article className={`manga-card manga-card--${variant}`}>
      <div className="manga-card__cover" style={style}>
        {cover && <img src={cover} alt={title} />}
        {variant === 'new' && <span className="manga-card__badge">New</span>}
        {variant === 'overlay' && (
          <div className="manga-card__overlay">
            <h3 className="manga-card__overlay-title">{title}</h3>
          </div>
        )}
        {variant === 'popular' && rating != null && (
          <div className="manga-card__rating">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#fcf807" aria-hidden="true">
              <path d="M12 2l2.9 6.9H22l-5.8 4.2 2.2 6.9L12 17.8l-6.4 4.2 2.2-6.9L2 8.9h7.1z" />
            </svg>
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
        {variant === 'featured' && rank != null && (
          <span className="manga-card__rank manga-card__rank--featured">{rank}</span>
        )}
      </div>

      {variant !== 'overlay' && variant !== 'featured' && (
        <h3 className="manga-card__title">{title}</h3>
      )}
    </article>
  )
}

export default MangaCard
