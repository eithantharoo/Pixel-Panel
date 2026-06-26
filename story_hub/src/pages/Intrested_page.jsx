import { useState } from 'react'
import InterestCard from '../components/Instreset_card'
import './Intrested_page.css'

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
]

const ALL_INTERESTS = INTEREST_ROWS.flat()

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
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M2 2l8 8M10 2L2 10"
            stroke="#000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </span>
  )
}

function InterestsPage({ onContinue, minSelection = 3 }) {
  const [selected, setSelected] = useState([])

  function toggleInterest(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  function removeInterest(id) {
    setSelected((prev) => prev.filter((item) => item !== id))
  }

  const selectedItems = ALL_INTERESTS.filter((item) => selected.includes(item.id))
  const canContinue = selected.length >= minSelection

  function handleContinue() {
    if (canContinue) {
      onContinue()
    }
  }

  return (
    <section className="interests-page">
      <div className="interests-page__picker">
        <h2 className="interests-page__heading">Choose Your interests</h2>
        <p className="interests-page__subheading">select three or more</p>

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
          onClick={handleContinue}
          disabled={!canContinue}
          title={
            canContinue
              ? 'Continue to home page'
              : `Select at least ${minSelection} interests to continue`
          }
        >
          Continue
        </button>
      </div>
    </section>
  )
}

export default InterestsPage
