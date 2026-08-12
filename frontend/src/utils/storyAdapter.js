import { formatRelativeTime } from './formatRelativeTime';

// Adapts a backend Story document to the "book" shape the existing UI
// components (MangaCard, HeroCard, GenreView, etc.) already expect.
export function mapStoryToBook(story, extra = {}) {
  return {
    id: story._id,
    title: story.title,
    cover: story.cover ? encodeURI(story.cover) : undefined,
    rating: story.rating,
    genre: story.genres?.join(', '),
    genres: story.genres,
    author: story.author,
    status: story.status,
    description: story.description,
    totalChapters: story.totalChapters,
    featured: story.isFeatured,
    ...extra,
  };
}

export function mapStoriesToBooks(stories = []) {
  return stories.map((story) => mapStoryToBook(story));
}

// Adapts a backend ReadingProgress document (populated with its story) to
// the "book" shape MangaCard's "continue" variant and HistoryView expect.
export function mapProgressToBook(doc) {
  return mapStoryToBook(doc.story, {
    chapter: `Chapter ${doc.chapterNumber}`,
    chapterNumber: doc.chapterNumber,
    progress: doc.progress,
    lastReadAt: doc.lastReadAt,
    readAt: formatRelativeTime(doc.lastReadAt),
  });
}

export function mapProgressListToBooks(docs = []) {
  return docs.filter((doc) => doc.story).map(mapProgressToBook);
}
