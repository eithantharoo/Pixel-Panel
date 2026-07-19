import { Flame, Star, X } from 'lucide-react';
import MangaCard from './MangaCard';
import './TrendingSidebar.css';

/* ── Compact sidebar (normal mode) ─────────────────────────────── */
function TrendingSidebarCompact({ items, onViewAll, onCardClick }) {
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
              onClick={() => onCardClick?.(featured)}
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
                onClick={() => onCardClick?.(item)}
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

/* ── Expanded overlay panel — always in DOM for CSS transition ─── */
function TrendingSidebarExpanded({ items, onCollapse, expanded, onCardClick }) {
  const allItems = [
    ...items.filter((i) => i.featured),
    ...items.filter((i) => !i.featured),
  ];

  return (
    <div
      className={`trending-expanded${expanded ? ' trending-expanded--open' : ''}`}
      aria-label="All trending manga"
      aria-hidden={!expanded}
    >
      {/* Header */}
      <div className="trending-expanded__header">
        <h2 className="trending-expanded__title">
          <Flame size={18} className="trending-expanded__flame" aria-hidden="true" />
          Trending
          <span className="trending-expanded__badge">Top {allItems.length}</span>
        </h2>
        <button
          type="button"
          className="trending-expanded__close"
          aria-label="Close trending panel"
          onClick={onCollapse}
          tabIndex={expanded ? 0 : -1}
        >
          <X size={18} />
        </button>
      </div>

      {/* 7-book grid */}
      <div className="trending-expanded__grid">
        {allItems.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className="trending-expanded__item"
            aria-label={`Read ${item.title}`}
            onClick={() => onCardClick?.(item)}
            tabIndex={expanded ? 0 : -1}
          >
            <div className="trending-expanded__cover-wrap">
              <div
                className="trending-expanded__cover"
                style={{ background: `linear-gradient(160deg, ${item.color || '#3a2858'}, ${(item.color || '#3a2858')}88)` }}
              >
                <span className="trending-expanded__rank">{item.rank ?? idx + 1}</span>
                {item.featured && (
                  <span className="trending-expanded__hot">🔥 Hot</span>
                )}
              </div>
            </div>
            <div className="trending-expanded__info">
              <p className="trending-expanded__item-title">{item.title}</p>
              {item.rating != null && (
                <div className="trending-expanded__rating">
                  <Star size={11} className="manga-card__star" aria-hidden="true" />
                  <span>{item.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Public component — renders both; expanded panel is always in DOM ─ */
function TrendingSidebar({ items = [], onViewAll, expanded = false, onCollapse, onCardClick }) {
  return (
    <>
      {/* Compact sidebar — hidden via CSS when expanded */}
      <div className={`trending-compact-wrapper${expanded ? ' trending-compact-wrapper--hidden' : ''}`}>
        <TrendingSidebarCompact items={items} onViewAll={onViewAll} onCardClick={onCardClick} />
      </div>

      {/* Expanded panel — always mounted, transitions via CSS */}
      <TrendingSidebarExpanded
        items={items}
        onCollapse={onCollapse}
        expanded={expanded}
        onCardClick={onCardClick}
      />
    </>
  );
}

export default TrendingSidebar;
