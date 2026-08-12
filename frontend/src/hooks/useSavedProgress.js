import { useEffect } from 'react';
import { getProgressForStory, saveProgress } from '../services/progressService';
import { loadAuth } from '../utils/authState';
import { isRealStoryId } from '../utils/objectId';

// Resumes a real story at its last-read chapter, and persists progress back
// to the backend as the user moves through chapters. No-ops entirely for
// books without a real backend id (still-mock Continue Reading/History
// entries) so nothing breaks before those are wired up too.
export function useSavedProgress({ book, currentChapter, totalChapters, isReading, onResume }) {
  const storyId = book?.id;

  // Resume: fetch the last-read chapter whenever a real book is selected.
  useEffect(() => {
    if (!isRealStoryId(storyId)) return;
    let cancelled = false;
    const token = loadAuth()?.token;

    getProgressForStory(storyId, token)
      .then((data) => {
        if (!cancelled) onResume(data.chapterNumber || 1);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onResume is a setState setter, stable by identity
  }, [storyId]);

  // Save: persist progress whenever the current chapter changes while reading.
  useEffect(() => {
    if (!isReading || !isRealStoryId(storyId)) return;
    const token = loadAuth()?.token;
    const total = totalChapters || 1;
    const progress = Math.min(100, Math.round((currentChapter / total) * 100));

    saveProgress({ storyId, chapterNumber: currentChapter, progress }, token).catch(() => {});
  }, [storyId, currentChapter, totalChapters, isReading]);
}
