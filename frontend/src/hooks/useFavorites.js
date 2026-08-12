import { useCallback, useEffect, useState } from 'react';
import { addFavorite, getFavorites, removeFavorite } from '../services/favoriteService';
import { mapStoryToBook } from '../utils/storyAdapter';
import { loadAuth } from '../utils/authState';
import { isRealStoryId } from '../utils/objectId';
import {
  isFavoriteBook as isMockFavoriteBook,
  loadFavorites as loadMockFavorites,
  saveFavorites as saveMockFavorites,
  toggleFavoriteBook,
} from '../utils/libraryState';

// Continue Reading / History are still backed by mock data (a later step),
// so a book opened from there won't have a real story id. Those keep using
// the old localStorage-only favorite toggle so nothing regresses; anything
// with a real backend id goes through the actual Favorites API.
export function useFavorites(defaultMockFavorites = []) {
  const [realFavorites, setRealFavorites] = useState([]);
  const [mockFavorites, setMockFavorites] = useState(() => loadMockFavorites(defaultMockFavorites));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const token = loadAuth()?.token;

    Promise.resolve()
      .then(() => getFavorites(token))
      .then((docs) => {
        if (cancelled) return;
        const books = docs.filter((doc) => doc.story).map((doc) => mapStoryToBook(doc.story));
        setRealFavorites(books);
      })
      .catch(() => {
        if (!cancelled) setRealFavorites([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const isFavorite = useCallback(
    (book) => {
      if (!book) return false;
      if (isRealStoryId(book.id)) return realFavorites.some((fav) => fav.id === book.id);
      return isMockFavoriteBook(book, mockFavorites);
    },
    [realFavorites, mockFavorites],
  );

  const toggleFavorite = useCallback(
    async (book) => {
      if (!book) return;

      if (isRealStoryId(book.id)) {
        const token = loadAuth()?.token;
        const currentlyFavorite = realFavorites.some((fav) => fav.id === book.id);
        try {
          if (currentlyFavorite) {
            await removeFavorite(book.id, token);
            setRealFavorites((current) => current.filter((fav) => fav.id !== book.id));
          } else {
            await addFavorite(book.id, token);
            setRealFavorites((current) => [book, ...current]);
          }
        } catch {
          // Leave state as-is on failure — next reload re-syncs from the server.
        }
        return;
      }

      setMockFavorites((current) => {
        const next = toggleFavoriteBook(book, current);
        saveMockFavorites(next);
        return next;
      });
    },
    [realFavorites],
  );

  return {
    favorites: [...realFavorites, ...mockFavorites],
    loading,
    isFavorite,
    toggleFavorite,
  };
}
