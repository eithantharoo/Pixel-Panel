import { Clock3, Trash2 } from 'lucide-react';
import { useTranslation } from '../../utils/i18n/I18nContext';
import './HistoryView.css';

function ClockIcon() {
  return <Clock3 size={14} strokeWidth={1.9} aria-hidden="true" />;
}

function TrashIcon() {
  return <Trash2 size={14} strokeWidth={1.9} aria-hidden="true" />;
}

function HistoryItem({ title, color, cover, chapter, readAt, progress, onBookClick, ...rest }) {
  const { t } = useTranslation();
  const coverStyle = { background: `linear-gradient(160deg, ${color}, ${color}88)` };
  const book = { title, color, cover, chapter, readAt, progress, ...rest };
  const isFinished = progress === 100;
  const openBook = () => onBookClick?.(book);

  return (
    <article
      className="hist-item"
      role="button"
      tabIndex={0}
      aria-label={`Continue reading ${title}`}
      onClick={openBook}
      onKeyDown={(e) => e.key === 'Enter' && openBook()}
    >
      <div className="hist-item__cover" style={coverStyle}>
        {cover && <img src={cover} alt={title} />}
      </div>

      <div className="hist-item__body">
        <div className="hist-item__top">
          <h3 className="hist-item__title">{title}</h3>
          <button
            type="button"
            className="hist-item__remove"
            aria-label={`Remove ${title} from history`}
            onClick={(e) => e.stopPropagation()}
          >
            <TrashIcon />
          </button>
        </div>

        <p className="hist-item__chapter">{chapter}</p>

        <div className="hist-item__bottom">
          <div className="hist-item__time">
            <ClockIcon />
            <span>{readAt}</span>
          </div>
          {isFinished ? (
            <span className="hist-item__badge hist-item__badge--done">{t('Finished')}</span>
          ) : (
            <span className="hist-item__badge">{progress}%</span>
          )}
        </div>

        <div className="hist-item__progress">
          <div className="hist-item__progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </article>
  );
}

function HistoryView({ items, emptyTitle, emptySubtitle, onBookClick }) {
  const { t } = useTranslation();
  if (!items || items.length === 0) {
    return (
      <div className="hist-empty">
        <div className="hist-empty__icon">
          <ClockIcon />
        </div>
        <p className="hist-empty__text">{emptyTitle ?? t('No reading history')}</p>
        <p className="hist-empty__sub">{emptySubtitle ?? t('Books you read will appear here.')}</p>
      </div>
    );
  }

  return (
    <div className="hist-view">
      <div className="hist-view__header">
        <h1 className="hist-view__title">{t('Reading History')}</h1>
        <button type="button" className="hist-view__clear">{t('Clear All')}</button>
      </div>
      <div className="hist-view__list">
        {items.map((item) => (
          <HistoryItem key={item.id} {...item} onBookClick={onBookClick} />
        ))}
      </div>
    </div>
  );
}

export default HistoryView;
