import { useNavigate } from 'react-router-dom';
import './HistoryView.css';

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function HistoryItem({ title, color, chapter, readAt, progress }) {
  const navigate = useNavigate();
  const coverStyle = { background: `linear-gradient(160deg, ${color}, ${color}88)` };
  const isFinished = progress === 100;

  return (
    <article
      className="hist-item"
      role="button"
      tabIndex={0}
      aria-label={`Continue reading ${title}`}
      onClick={() => navigate('/reader')}
      onKeyDown={(e) => e.key === 'Enter' && navigate('/reader')}
    >
      <div className="hist-item__cover" style={coverStyle} />

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
            <span className="hist-item__badge hist-item__badge--done">Finished</span>
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

function HistoryView({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="hist-empty">
        <div className="hist-empty__icon">
          <ClockIcon />
        </div>
        <p className="hist-empty__text">No reading history</p>
        <p className="hist-empty__sub">Books you read will appear here</p>
      </div>
    );
  }

  return (
    <div className="hist-view">
      <div className="hist-view__header">
        <h1 className="hist-view__title">Reading History</h1>
        <button type="button" className="hist-view__clear">Clear All</button>
      </div>
      <div className="hist-view__list">
        {items.map((item) => (
          <HistoryItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}

export default HistoryView;
