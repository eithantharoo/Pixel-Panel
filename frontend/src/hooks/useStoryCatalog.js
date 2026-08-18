import { useEffect, useState } from 'react';
import { getForYou, getNewReleases, getPopularStories, getTrendingStories } from '../services/storyService';
import { mapStoriesToBooks } from '../utils/storyAdapter';
import { loadAuth } from '../utils/authState';

const EMPTY_CATALOG = { trending: [], newReleases: [], popular: [], forYou: [], loading: true, error: null };

// Fetches the home page's browsing sections from the real backend once on
// mount. Kept out of HomePage.jsx so the fetch/loading/error concern is
// testable and reusable on its own, separate from the page's UI state.
export function useStoryCatalog() {
  const [state, setState] = useState(EMPTY_CATALOG);

  useEffect(() => {
    let cancelled = false;
    const token = loadAuth()?.token;

    async function load() {
      try {
        const [trending, newReleases, popular, forYou] = await Promise.all([
          getTrendingStories(),
          getNewReleases(),
          getPopularStories(),
          token ? getForYou(token) : Promise.resolve([]),
        ]);

        if (cancelled) return;

        const trendingBooks = mapStoriesToBooks(trending).map((book, index) => ({
          ...book,
          rank: index + 1,
          featured: index === 0,
        }));

        setState({
          trending: trendingBooks,
          newReleases: mapStoriesToBooks(newReleases),
          popular: mapStoriesToBooks(popular),
          forYou: mapStoriesToBooks(forYou),
          loading: false,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;
        setState((current) => ({ ...current, loading: false, error: err.message }));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
