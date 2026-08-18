import { useCallback, useEffect, useState } from 'react';
import { clearReadingHistory, deleteProgress, getContinueReading, getReadingHistory } from '../services/progressService';
import { mapProgressListToBooks } from '../utils/storyAdapter';
import { loadAuth } from '../utils/authState';

// Fetches the user's "Continue Reading" (in-progress only) and full
// reading-history lists once on mount. Both come from the same
// ReadingProgress collection, just filtered/limited differently server-side.
export function useReadingProgress() {
  const [continueReading, setContinueReading] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const token = loadAuth()?.token;

    Promise.resolve()
      .then(() => Promise.all([getContinueReading(token), getReadingHistory(token)]))
      .then(([continueDocs, historyDocs]) => {
        if (cancelled) return;
        setContinueReading(mapProgressListToBooks(continueDocs));
        setHistory(mapProgressListToBooks(historyDocs));
      })
      .catch(() => {
        if (cancelled) return;
        setContinueReading([]);
        setHistory([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const removeFromHistory = useCallback(async (storyId) => {
    const token = loadAuth()?.token;
    try {
      await deleteProgress(storyId, token);
    } catch {
      // If the record was already gone server-side, fall through and
      // still drop it from local state so the UI stays consistent.
    }
    setHistory((current) => current.filter((book) => book.id !== storyId));
    setContinueReading((current) => current.filter((book) => book.id !== storyId));
  }, []);

  const clearHistory = useCallback(async () => {
    const token = loadAuth()?.token;
    try {
      await clearReadingHistory(token);
    } catch {
      // Fall through and clear local state anyway so the UI doesn't get stuck.
    }
    setHistory([]);
    setContinueReading([]);
  }, []);

  return { continueReading, history, loading, removeFromHistory, clearHistory };
}
