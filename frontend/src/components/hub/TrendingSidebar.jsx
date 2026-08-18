import { Flame, X } from 'lucide-react';
import MangaCard from './MangaCard';
import { useTranslation } from '../../utils/i18n/I18nContext';
import './TrendingSidebar.css';

/* ── Compact sidebar (normal mode) ─────────────────────────────── */
function TrendingSidebarCompact({ items, onViewAll, onCardClick }) {
  const { t } = useTranslation();
  const featured = items.find((item) => item.featured);
  const list = items.filter((item) => !item.featured).slice(0, 3);

  return (
    <aside className="trending" aria-label="Trending manga">
      <div className="trending__panel">
        <h2 className="trending__title">{t('Trending')}</h2>

        {items.length === 0 ? (
          <p className="trending__empty">{t('No trending matches.')}</p>
        ) : (
          <>
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
          </>
        )}
      </div>

      <button type="button" className="trending__view-all" onClick={onViewAll} disabled={items.length === 0}>
        {t('View all')}
      </button>
    </aside>
  );
}

/* ── Expanded overlay panel — always in DOM for CSS transition ─── */
function TrendingSidebarExpanded({ items, onCollapse, expanded, onCardClick }) {
  const { t } = useTranslation();
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
          {t('Trending')}
          <span className="trending-expanded__badge">{t('Top')} {allItems.length}</span>
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

      {allItems.length === 0 ? (
        <p className="trending-expanded__empty">{t('No trending books match this search.')}</p>
      ) : (
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
              <MangaCard
                {...item}
                variant="popular"
                rank={item.rank ?? idx + 1}
              />
            </button>
          ))}
        </div>
      )}
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
