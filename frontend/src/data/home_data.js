// Genre menu metadata (id/label only — icons come from GenreIcon.jsx,
// book data comes from the real backend via services/storyService.js).
//
// NOTE: FOR_YOU, NEWLY_RELEASED, POPULAR, TRENDING, CONTINUE_READING,
// FAVORITES, and HISTORY are kept here as empty arrays for backwards
// compatibility only. Real page data flows through the hooks in
// src/hooks/* (useStoryCatalog, useReadingProgress, useFavorites) and
// falls back to these empty stubs only while the API loads or for
// notifications that still reference static const names.
export const GENRES = [
  { id: 'romance', label: 'Romance' },
  { id: 'mystery', label: 'Mystery' },
  { id: 'comedy', label: 'Comedy' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'horror', label: 'Horror' },
  { id: 'sci-fi', label: 'Sci-Fi' },
  { id: 'slice-of-life', label: 'Slice Of Life' },
  { id: 'historical', label: 'Historical' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'drama', label: 'Drama' },
  { id: 'thriller', label: 'Thriller' },
];

export const FOR_YOU = [];
export const NEWLY_RELEASED = [];
export const POPULAR = [];
export const TRENDING = [];
export const CONTINUE_READING = [];
export const FAVORITES = [];
export const HISTORY = [];
