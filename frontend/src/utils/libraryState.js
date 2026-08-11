const FAVORITES_STORAGE_KEY = 'pixel-panel-favorites';

export function getBookKey(book) {
  return String(book?.title || book?.id || '').trim().toLowerCase();
}

export function chapterToNumber(chapter, fallback = 1) {
  const match = String(chapter || '').match(/\d+/);
  return match ? Number(match[0]) : fallback;
}

export function loadFavorites(defaultFavorites = []) {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultFavorites;
  } catch {
    return defaultFavorites;
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    /* noop */
  }
}

export function isFavoriteBook(book, favorites) {
  const key = getBookKey(book);
  return Boolean(key) && favorites.some((favorite) => getBookKey(favorite) === key);
}

export function toggleFavoriteBook(book, favorites) {
  if (!book) return favorites;

  if (isFavoriteBook(book, favorites)) {
    return favorites.filter((favorite) => getBookKey(favorite) !== getBookKey(book));
  }

  return [{ ...book, genre: book.genre ?? 'Action', rating: book.rating ?? 9.0 }, ...favorites];
}
