// All images live in pixel-panel/public/ (served from site root /)
// To change an image: replace the file in public/ OR update the path below.

const p = (file) => (file.includes(' ') ? encodeURI('/' + file) : '/' + file);

export const images = {
  logoBook: p('logo.png'),
  logoText: p('pixel panel.png'),

  profile: '/44234cc2b1f391c26eddaf614bd9b90c8e7a14a4.jpg',

  topbar: {
    search: '/search.png',
    filter: '/filter.png',
    notifications: '/notifications.png',
    headset: '/headset.png',
    heart: '/heart.png',
  },

  hero: '/photo_3_2026-06-24_15-49-22.jpg',

  trending: {
    featured: '/photo_1_2026-06-24_15-49-22.jpg',
    onePiece: '/photo_2_2026-06-24_15-49-22.jpg',
    dandadan: '/photo_6_2026-06-24_15-49-22.jpg',
    lookism: '/photo_4_2026-06-24_15-49-22.jpg',
  },

  continueReading: {
    kanKgLoh: '/photo_5_2026-06-24_15-49-22.jpg',
    weikzar: '/photo_7_2026-06-24_15-49-22.jpg',
    noragami: '/photo_8_2026-06-24_15-49-22.jpg',
  },
};

export const sidebarIcons = {
  home: { default: '/home.png', hover: p('home green.png') },
  heart: { default: '/heart.png', hover: p('heart green.png') },
  library: { default: '/library.png', hover: p('library green.png') },
  recents: { default: '/recents.png', hover: p('recents green.png') },
  genre: { default: '/genre.png', hover: p('genre green.png') },
  settings: { default: '/settings.png', hover: p('setting green.png') },
  'help center': { default: p('help center.png'), hover: p('help green.png') },
};
