// All images live in public/ (served from site root /).
// To swap an image: replace the file in public/ or update the path here.

const p = (file) => (file.includes(' ') ? encodeURI('/images/' + file) : '/images/' + file);

export const images = {
  logoBook: p('logo.png'),
  logoText: p('pixel panel.png'),

  profile: '/images/44234cc2b1f391c26eddaf614bd9b90c8e7a14a4.jpg',

  topbar: {
    search:        '/images/search.png',
    filter:        '/images/filter.png',
    notifications: '/images/notifications.png',
    headset:       '/images/headset.png',
    heart:         '/images/heart.png',
  },

  hero:       '/images/photo_3_2026-06-24_15-49-22.jpg',
  heroBanner: '/images/652aed27b189d19bb89628c139de723b042f56e7.jpg',

  trending: {
    featured: '/images/photo_1_2026-06-24_15-49-22.jpg',
    onePiece: '/images/photo_2_2026-06-24_15-49-22.jpg',
    dandadan: '/images/photo_6_2026-06-24_15-49-22.jpg',
    lookism:  '/images/photo_4_2026-06-24_15-49-22.jpg',
  },

  continueReading: {
    kanKgLoh: '/images/photo_5_2026-06-24_15-49-22.jpg',
    weikzar:  '/images/photo_7_2026-06-24_15-49-22.jpg',
    noragami: '/images/photo_8_2026-06-24_15-49-22.jpg',
  },
};
