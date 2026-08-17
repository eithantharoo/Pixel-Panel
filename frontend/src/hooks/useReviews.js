import { useCallback, useEffect, useState } from 'react';
import { deleteReview, getMyReview, getReviews, saveReview } from '../services/reviewService';
import { loadAuth } from '../utils/authState';
import { isRealStoryId } from '../utils/objectId';

// Reviews for a story: the public list, the current user's own review (if
// any), and submit/remove actions. onRatingChange is called after a
// successful submit/remove so the caller can refresh the story's displayed
// average rating, which the backend recalculates server-side.
export function useReviews(storyId, onRatingChange) {
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    let cancelled = false;
    const token = loadAuth()?.token;
    const shouldFetch = isRealStoryId(storyId);

    Promise.resolve()
      .then(() => {
        if (cancelled) return null;
        if (!shouldFetch) {
          setReviews([]);
          setMyReview(null);
          return null;
        }
        setLoading(true);
        return Promise.all([getReviews(storyId), token ? getMyReview(storyId, token) : Promise.resolve(null)]);
      })
      .then((result) => {
        if (cancelled || !result) return;
        const [list, mine] = result;
        setReviews(list);
        setMyReview(mine);
      })
      .catch(() => {
        if (!cancelled) {
          setReviews([]);
          setMyReview(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [storyId]);

  useEffect(() => load(), [load]);

  const submitReview = useCallback(
    async (rating, text) => {
      const token = loadAuth()?.token;
      setSubmitting(true);
      setError(null);
      try {
        await saveReview(storyId, { rating, text }, token);
        load();
        onRatingChange?.();
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
    [storyId, load, onRatingChange],
  );

  const removeReview = useCallback(async () => {
    const token = loadAuth()?.token;
    setSubmitting(true);
    setError(null);
    try {
      await deleteReview(storyId, token);
      load();
      onRatingChange?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [storyId, load, onRatingChange]);

  return { reviews, myReview, loading, submitting, error, submitReview, removeReview };
}
