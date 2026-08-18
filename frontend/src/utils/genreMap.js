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

// Reverse lookup for places that only have a display label on hand (e.g. a
// story's raw genres[] array from the backend, or home_data.js's title-cased
// "Slice Of Life"). Case-insensitive so both label casings resolve to the
// same id — used by the i18n layer to translate genres via `genres.<id>`
// instead of the raw label, since raw labels collide across differing casing.
const NORMALIZED_LABEL_TO_ID = Object.entries(GENRE_ID_TO_LABEL).reduce(
  (map, [id, label]) => {
    map[label.toLowerCase()] = id;
    return map;
  },
  {}
);

export function labelToGenreId(label) {
  if (!label) return undefined;
  return NORMALIZED_LABEL_TO_ID[String(label).toLowerCase()];
}
