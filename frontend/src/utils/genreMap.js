// Maps the frontend's kebab-case genre ids (used for routing/menu state)
// to the exact genre strings the backend's VALID_GENRES enum expects
// (see backend/src/models/Story.js and User.js) — these are NOT always
// the same as the display label (e.g. 'slice-of-life' displays as
// "Slice Of Life" but the backend enum value is "Slice of Life").
export const GENRE_ID_TO_LABEL = {
  romance: 'Romance',
  mystery: 'Mystery',
  comedy: 'Comedy',
  fantasy: 'Fantasy',
  horror: 'Horror',
  'sci-fi': 'Sci-Fi',
  'slice-of-life': 'Slice of Life',
  historical: 'Historical',
  adventure: 'Adventure',
  drama: 'Drama',
  thriller: 'Thriller',
};
