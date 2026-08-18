import { useCallback, useEffect, useState } from 'react';
import { getMyRating, rateStory } from '../services/ratingService';
import { loadAuth } from '../utils/authState';
import { isRealStoryId } from '../utils/objectId';

// Tracks the signed-in user's own 1-5 star rating for a story, and lets them
// set/change it. Only wired up for real backend stories — mock/local data
// (see utils/objectId.isRealStoryId) has no id to rate against.
export function useMyRating(storyId) {
  const [myRating, setMyRating] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = loadAuth()?.token;
    if (!isRealStoryId(storyId) || !token) {
      Promise.resolve().then(() => setMyRating(null));
      return;
    }

    let cancelled = false;
    getMyRating(storyId, token)
      .then((data) => {
        if (!cancelled) setMyRating(data?.value ?? null);
      })
      .catch(() => {
        if (!cancelled) setMyRating(null);
      });

    return () => {
      cancelled = true;
    };
  }, [storyId]);

  const submitRating = useCallback(
    async (value) => {
      const token = loadAuth()?.token;
      if (!isRealStoryId(storyId) || !token) return null;

      setSubmitting(true);
      try {
        const result = await rateStory(storyId, value, token);
        setMyRating(value);
        return result;
      } finally {
        setSubmitting(false);
      }
    },
    [storyId]
  );

  return { myRating, submitRating, submitting };
}
