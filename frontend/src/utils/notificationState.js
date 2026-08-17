export const READ_NOTIFICATIONS_STORAGE_KEY = 'pixel-panel-read-notifications';

export function loadReadNotificationIds() {
  try {
    const raw = localStorage.getItem(READ_NOTIFICATIONS_STORAGE_KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function saveReadNotificationIds(ids) {
  try {
    const uniqueIds = Array.from(new Set(ids));
    localStorage.setItem(READ_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(uniqueIds));
    window.dispatchEvent(new StorageEvent('storage', {
      key: READ_NOTIFICATIONS_STORAGE_KEY,
      newValue: JSON.stringify(uniqueIds),
    }));
  } catch {
    /* noop */
  }
}

export function markReadNotificationIds(ids) {
  const next = Array.from(new Set([...loadReadNotificationIds(), ...ids]));
  saveReadNotificationIds(next);
  return next;
}

export function getBookNotificationIds(book) {
  if (!book?.id) return [];
  return [
    `followed-book-${book.id}`,
    `followed-author-${book.id}`,
    `read-book-${book.id}`,
    `chapter-${book.id}`,
    `history-${book.id}`,
  ];
}
