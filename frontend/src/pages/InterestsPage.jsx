import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import InterestCard from '../components/hub/InterestCard';
import './InterestsPage.css';

const INTEREST_ROWS = [
  [
    { id: 'romance', label: 'Romance' },
    { id: 'mystery', label: 'Mystery' },
    { id: 'comedy', label: 'Comedy' },
    { id: 'fantasy', label: 'Fantasy' },
    { id: 'horror', label: 'Horror' },
  ],
  [
    { id: 'sci-fi', label: 'Sci-Fi' },
    { id: 'slice of life', label: 'Slice of Life' },
    { id: 'historical', label: 'Historical' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'drama', label: 'Drama' },
    { id: 'thriller', label: 'Thriller' },
  ],
];

const ALL_INTERESTS = INTEREST_ROWS.flat();
const MIN_INTERESTS = 3;

function SelectedTag({ label, onRemove }) {
  return (
    <span className="interests-page__tag">
      <span className="interests-page__tag-label">{label}</span>
      <button
        type="button"
        className="interests-page__tag-remove"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
      >
        <X size={12} strokeWidth={2.4} aria-hidden="true" />
      </button>
    </span>
  );
}

export default function InterestsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  function toggleInterest(id) {
    setSelected((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  }

  function removeInterest(id) {
    setSelected((prev) => prev.filter((item) => item !== id));
  }

  const selectedItems = ALL_INTERESTS.filter((item) => selected.includes(item.id));
  const canContinue = selected.length >= MIN_INTERESTS;

  return (
    <section className="interests-page">
      <div className="interests-page__picker">
        <h2 className="interests-page__heading">Choose Your interests</h2>
        <p className="interests-page__subheading">select at least three or more</p>

        <div className="interests-page__rows">
          {INTEREST_ROWS.map((row) => (
            <div key={row.map((i) => i.id).join('-')} className="interests-page__row">
              {row.map((interest) => (
                <InterestCard
                  key={interest.id}
                  id={interest.id}
                  label={interest.label}
                  selected={selected.includes(interest.id)}
                  onToggle={() => toggleInterest(interest.id)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="interests-page__footer">
        <div className="interests-page__footer-content">
          <h3 className="interests-page__footer-title">Your selection</h3>
          <div className="interests-page__tags">
            {selectedItems.map((item) => (
              <SelectedTag
                key={item.id}
                label={item.label}
                onRemove={() => removeInterest(item.id)}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          className={`interests-page__continue${canContinue ? ' interests-page__continue--ready' : ''}`}
          onClick={() => canContinue && navigate('/language')}
          disabled={!canContinue}
          title={canContinue ? 'Continue to language page' : `Select at least ${MIN_INTERESTS} interests`}
        >
          Continue
        </button>
      </div>
    </section>
  );
}
