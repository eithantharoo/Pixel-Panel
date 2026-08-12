import { useEffect, useState } from 'react';
import { getChapter } from '../services/chapterService';
import { loadAuth } from '../utils/authState';
import { isRealStoryId } from '../utils/objectId';

// Fetches a single chapter's real content whenever the story or chapter
// number changes. Pass chapterNumber={null} to skip fetching (e.g. while
// only viewing book details, not actively reading).
export function useChapterContent(storyId, chapterNumber) {
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const shouldFetch = isRealStoryId(storyId) && Boolean(chapterNumber);
    const token = loadAuth()?.token;

    Promise.resolve()
      .then(() => {
        if (cancelled) return null;
        if (!shouldFetch) {
          setChapter(null);
          setError(null);
          return null;
        }
        setLoading(true);
        setError(null);
        return getChapter(storyId, chapterNumber, token);
      })
      .then((data) => {
        if (!cancelled && data) setChapter(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setChapter(null);
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [storyId, chapterNumber]);

  return { chapter, loading, error };
}
