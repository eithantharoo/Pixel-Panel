import './InterestCard.css';
import { INTEREST_ICONS } from './interest_icons';

function InterestCard({ id, label, selected = false, onToggle, compact = false }) {
  const icon = INTEREST_ICONS[id];
  if (!icon) return null;

  return (
    <button
      type="button"
      className={`interest-card${selected ? ' interest-card--selected' : ''}${compact ? ' interest-card--compact' : ''}`}
      onClick={onToggle}
      aria-pressed={selected}
      aria-label={label}
    >
      <span className="interest-card__cube-wrap">
        <span className="interest-card__cube">
          {icon}
          <span className="interest-card__tick" aria-hidden="true">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4.2 3.6 6.8 9 1.2" stroke="#3d114b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </span>
      {!compact && <span className="interest-card__label">{label}</span>}
    </button>
  );
}

export default InterestCard;
