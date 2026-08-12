// Genre menu metadata (id/label only — icons come from GenreIcon.jsx,
// book data comes from the real backend via services/storyService.js).
// This file used to also hold ~280 lines of mock book data (FOR_YOU,
// NEWLY_RELEASED, POPULAR, TRENDING, CONTINUE_READING, FAVORITES,
// HISTORY, and a .books array per genre) — all of that has been replaced
// by real API data and was removed once nothing referenced it anymore.
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
