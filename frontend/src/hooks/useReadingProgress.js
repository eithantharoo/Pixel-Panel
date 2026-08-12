import { useEffect, useState } from 'react';
import { getContinueReading, getReadingHistory } from '../services/progressService';
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

  return { continueReading, history, loading };
}
