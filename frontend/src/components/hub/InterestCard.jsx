import { Check } from 'lucide-react';
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
            <Check size={11} strokeWidth={2.5} />
          </span>
        </span>
      </span>
      {!compact && <span className="interest-card__label">{label}</span>}
    </button>
  );
}

export default InterestCard;
