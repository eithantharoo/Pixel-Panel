import { useEffect, useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatRelativeTime';
import { useReviews } from '../../hooks/useReviews';
import { loadAuth } from '../../utils/authState';

function StarRatingInput({ value, onChange, disabled }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} out of 10`}
          disabled={disabled}
          className="text-[var(--text-yellow)] disabled:opacity-50"
          onClick={() => onChange(n)}
        >
          <Star size={20} strokeWidth={1.8} fill={n <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const name = review.user?.name || 'Anonymous';

  return (
    <article className="rounded-xl border border-[var(--home-border)] bg-black/[0.12] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--home-control)] text-sm font-bold text-[var(--home-ink)]">
          {review.user?.avatar ? (
            <img src={review.user.avatar} alt={name} className="h-full w-full object-cover" />
          ) : (
            name[0]?.toUpperCase() ?? '?'
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[var(--home-text)]">{name}</p>
          <p className="text-xs text-[var(--home-text-muted)]">{formatRelativeTime(review.createdAt)}</p>
        </div>

        <span className="flex shrink-0 items-center gap-1 rounded-md bg-black/[0.2] px-2 py-1 text-xs font-bold text-[var(--home-accent)]">
          <Star size={12} className="fill-[var(--text-yellow)] text-[var(--text-yellow)]" aria-hidden="true" />
          {review.rating}/10
        </span>
      </div>

      {review.text && (
        <p className="mt-2 whitespace-pre-line text-sm leading-[1.6] text-[var(--home-text)]">{review.text}</p>
      )}
    </article>
  );
}

export default function ReviewsSection({ storyId, onRatingChange }) {
  const { reviews, myReview, loading, submitting, error, submitReview, removeReview } = useReviews(storyId, onRatingChange);
  const [draftRating, setDraftRating] = useState(0);
  const [draftText, setDraftText] = useState('');
  const [initialized, setInitialized] = useState(false);
  const isLoggedIn = Boolean(loadAuth()?.token);

  // Pre-fill the form with the user's existing review once it loads, without
  // clobbering anything they're actively typing on a later re-render.
  useEffect(() => {
    if (loading || initialized) return;
    Promise.resolve().then(() => {
      setDraftRating(myReview?.rating || 0);
      setDraftText(myReview?.text || '');
      setInitialized(true);
    });
  }, [loading, initialized, myReview]);

  const otherReviews = reviews.filter((r) => r.user?._id !== myReview?.user);

  function handleSubmit(e) {
    e.preventDefault();
    if (draftRating < 1) return;
    submitReview(draftRating, draftText.trim());
  }

  function handleDelete() {
    removeReview();
    setDraftRating(0);
    setDraftText('');
  }

  return (
    <div className="mt-7">
      <h3 className="mb-4 text-xl font-bold text-[var(--home-accent)] sm:text-2xl">
        Reviews{reviews.length > 0 ? ` (${reviews.length})` : ''}
      </h3>

      {isLoggedIn && (
        <form
          onSubmit={handleSubmit}
          className="mb-5 rounded-xl border border-[var(--home-border)] bg-black/[0.12] p-4"
        >
          <p className="mb-2 text-sm font-bold text-[var(--home-text)]">
            {myReview ? 'Update your review' : 'Leave a review (optional)'}
          </p>

          <StarRatingInput value={draftRating} onChange={setDraftRating} disabled={submitting} />

          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            disabled={submitting}
            placeholder="What did you think? (optional)"
            rows={3}
            maxLength={2000}
            className="mt-3 w-full resize-none rounded-lg border border-[var(--home-border)] bg-[var(--home-panel-deep)] px-3 py-2 text-sm text-[var(--home-text)] placeholder:text-[var(--home-text-muted)] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--home-accent)]"
          />

          {error && <p className="mt-2 text-xs font-semibold text-red-400">{error}</p>}

          <div className="mt-3 flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting || draftRating < 1}
              className="btn-yellow rounded-lg px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Saving...' : myReview ? 'Update Review' : 'Submit Review'}
            </button>

            {myReview && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--home-border)] px-3 py-2 text-sm font-semibold text-[var(--home-text-muted)] transition-colors hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={14} aria-hidden="true" />
                Remove
              </button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-[var(--home-text-muted)]">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-[var(--home-text-muted)]">
          No reviews yet — {isLoggedIn ? 'be the first to leave one.' : 'log in to be the first to leave one.'}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {myReview && reviews.find((r) => r.user?._id === myReview.user) && (
            <ReviewCard review={reviews.find((r) => r.user?._id === myReview.user)} />
          )}
          {otherReviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
