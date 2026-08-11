const imagePath = (file) => `/images/${encodeURIComponent(file)}`;

export const BOOK_COVERS = {
  'Attack on Titan': imagePath('Attack on Titan.jpg'),
  Berserk: imagePath('Berserk.jpeg'),
  Bleach: imagePath('Bleach.webp'),
  'Blue Lock': imagePath('Blue Lock.jpeg'),
  'Chainsaw Man': imagePath('Chainsaw Man.jpeg'),
  Dandadan: imagePath('Dandadan.jpeg'),
  'Demon Slayer': imagePath('Demon Slayer.jpeg'),
  Eleceed: imagePath('Eleceed.jpeg'),
  'Fullmetal Alchemist': imagePath('Fullmetal Alchemist.jpeg'),
  'Hunter x Hunter': imagePath('Hunter x Hunter.jpeg'),
  'Jujutsu Kaisen': imagePath('Jujutsu Kaisen.jpeg'),
  Kagurabachi: imagePath('Kagurabachi.jpeg'),
  Noragami: imagePath('Noragami.webp'),
  Lookism: imagePath('Lookism.jpeg'),
  'One Piece': imagePath('One Piece.jpeg'),
  'Solo Leveling': imagePath('solo_leveling.jpg'),
  'Spy x Family': imagePath('Spy x Family.jpeg'),
  'Sweet Home': imagePath('Sweet Home.jpeg'),
  'The Beginning After The End': imagePath('The_Beginning_After_the_End_Season_7.webp'),
  'Tower Of God': imagePath('Tower of god.jpeg'),
  'Tower of God': imagePath('Tower of god.jpeg'),
  Vagabond: imagePath('Vagabond.jpeg'),
  'Vinland Saga': imagePath('Vinland Saga.jpeg'),
};

const withCover = (book) => ({
  ...book,
  cover: book.cover ?? BOOK_COVERS[book.title],
});

const withBookCovers = (books) => books.map(withCover);

export const FOR_YOU = withBookCovers([
  { id: 1, title: 'Solo Leveling',   rating: 9.5, color: '#2d1b4e' },
  { id: 2, title: 'Lookism',         rating: 8.5, color: '#4a2c6a' },
  { id: 3, title: 'Eleceed',         rating: 8.7, color: '#3b2060' },
  { id: 4, title: 'Hunter x Hunter', rating: 9.3, color: '#5c3478' },
  { id: 54, title: 'The Beginning After The End', rating: 9.2, color: '#1e1040' },
  { id: 55, title: 'Fullmetal Alchemist', rating: 9.5, color: '#2e2040' },
  { id: 56, title: 'Jujutsu Kaisen', rating: 9.0, color: '#201440' },
  { id: 57, title: 'Demon Slayer', rating: 8.9, color: '#1c1440' },
  { id: 58, title: 'Attack on Titan', rating: 9.4, color: '#2c1a10' },
  { id: 59, title: 'Chainsaw Man', rating: 8.8, color: '#3a1020' },
  { id: 60, title: 'Spy x Family', rating: 8.8, color: '#1e3040' },
  { id: 61, title: 'Blue Lock', rating: 8.7, color: '#102040' },
  { id: 62, title: 'Vagabond', rating: 9.4, color: '#4a3520' },
  { id: 63, title: 'Berserk', rating: 9.5, color: '#2a1c10' },
]);

export const NEWLY_RELEASED = withBookCovers([
  { id: 5, title: 'Kagurabachi', rating: 8.6, color: '#1a3a5c' },
  { id: 7, title: 'Dandadan',    rating: 8.8, color: '#4a3050' },
  { id: 8, title: 'One Piece',   rating: 9.4, color: '#3a2858' },
  { id: 64, title: 'Sakamoto Days', rating: 8.6, color: '#243850' },
  { id: 65, title: 'Wind Breaker', rating: 8.4, color: '#254060' },
  { id: 66, title: 'Kaiju No. 8', rating: 8.7, color: '#183c3a' },
  { id: 67, title: 'Mashle', rating: 8.2, color: '#3b2858' },
  { id: 68, title: 'Oshi no Ko', rating: 8.9, color: '#5c2c54' },
  { id: 69, title: 'Frieren', rating: 9.4, color: '#284c46' },
  { id: 70, title: 'My Hero Academia', rating: 8.5, color: '#244a6c' },
  { id: 71, title: 'Black Clover', rating: 8.4, color: '#281e48' },
  { id: 72, title: 'Dr. Stone', rating: 8.6, color: '#284a38' },
  { id: 73, title: 'Tokyo Revengers', rating: 8.1, color: '#402858' },
]);


export const POPULAR = withBookCovers([
  { id: 9,  title: 'Sweet Home',   rating: 9.0, color: '#2a2040' },
  { id: 11, title: 'Tower Of God', rating: 8.5, color: '#2e3850' },
  { id: 12, title: 'Bleach',       rating: 8.0, color: '#3a3058' },
  { id: 74, title: 'Noragami', rating: 8.4, color: '#341e50' },
  { id: 75, title: 'Vinland Saga', rating: 9.3, color: '#3a2818' },
  { id: 76, title: 'Demon Slayer', rating: 8.9, color: '#1c1440' },
  { id: 77, title: 'Jujutsu Kaisen', rating: 9.0, color: '#201440' },
  { id: 78, title: 'Attack on Titan', rating: 9.4, color: '#2c1a10' },
  { id: 79, title: 'Chainsaw Man', rating: 8.8, color: '#3a1020' },
  { id: 80, title: 'Spy x Family', rating: 8.8, color: '#1e3040' },
  { id: 81, title: 'Blue Lock', rating: 8.7, color: '#102040' },
  { id: 82, title: 'Fullmetal Alchemist', rating: 9.5, color: '#2e2040' },
  { id: 83, title: 'Berserk', rating: 9.5, color: '#2a1c10' },
]);

export const TRENDING = withBookCovers([
  // Row 1
  { id: 13, title: 'The Beginning After The End', rating: 9.2, rank: 1,  color: '#1e1040', featured: true },
  { id: 14, title: 'One Piece',                   rating: 9.4, rank: 2,  color: '#2a1850' },
  { id: 15, title: 'Dandadan',                    rating: 8.8, rank: 3,  color: '#321e58' },
  { id: 16, title: 'Lookism',                     rating: 8.5, rank: 4,  color: '#281848' },
  { id: 37, title: 'Solo Leveling',               rating: 9.5, rank: 5,  color: '#2d1b4e' },
  { id: 38, title: 'Tower Of God',                rating: 8.7, rank: 6,  color: '#2e3850' },
  { id: 39, title: 'Sweet Home',                  rating: 9.0, rank: 7,  color: '#2a2040' },
  // Row 2
  { id: 40, title: 'Eleceed',                     rating: 8.7, rank: 8,  color: '#3b2060' },
  { id: 41, title: 'Hunter x Hunter',             rating: 9.3, rank: 9,  color: '#5c3478' },
  { id: 42, title: 'Bleach',                      rating: 8.0, rank: 10, color: '#3a3058' },
  { id: 43, title: 'Fullmetal Alchemist',         rating: 9.5, rank: 11, color: '#2e2040' },
  { id: 44, title: 'Kagurabachi',                 rating: 8.6, rank: 12, color: '#1a3a5c' },
  { id: 45, title: 'Vagabond',                    rating: 9.4, rank: 13, color: '#4a3520' },
  { id: 46, title: 'Vinland Saga',                rating: 9.3, rank: 14, color: '#3a2818' },
  // Row 3
  { id: 47, title: 'Berserk',                     rating: 9.5, rank: 15, color: '#2a1c10' },
  { id: 48, title: 'Demon Slayer',                rating: 8.9, rank: 16, color: '#1c1440' },
  { id: 49, title: 'Jujutsu Kaisen',              rating: 9.0, rank: 17, color: '#201440' },
  { id: 50, title: 'Attack on Titan',             rating: 9.4, rank: 18, color: '#2c1a10' },
  { id: 51, title: 'Chainsaw Man',                rating: 8.8, rank: 19, color: '#3a1020' },
  { id: 52, title: 'Spy x Family',                rating: 8.8, rank: 20, color: '#1e3040' },
  { id: 53, title: 'Blue Lock',                   rating: 8.7, rank: 21, color: '#102040' },
]);


export const CONTINUE_READING = withBookCovers([
  { id: 17, title: 'Dandadan',    chapter: 'Chapter 12', progress: 75, color: '#4a3050' },
  { id: 18, title: 'One Piece',   chapter: 'Chapter 110', progress: 35, color: '#3a2858' },
  { id: 19, title: 'Noragami',    chapter: 'Chapter 22', progress: 85, color: '#341e50' },
  { id: 36, title: 'Solo Leveling', chapter: 'Chapter 45', progress: 60, color: '#2d1b4e' },
]);

export const FAVORITES = withBookCovers([
  { id: 20, title: 'Solo Leveling',              color: '#2d1b4e', rating: 9.5, genre: 'Action' },
  { id: 21, title: 'The Beginning After The End', color: '#1e1040', rating: 9.2, genre: 'Fantasy' },
  { id: 22, title: 'Tower Of God',               color: '#2e3850', rating: 8.5, genre: 'Adventure' },
  { id: 23, title: 'Sweet Home',                 color: '#2a2040', rating: 9.0, genre: 'Horror' },
  { id: 24, title: 'Dandadan',                   color: '#4a3050', rating: 8.8, genre: 'Sci-Fi' },
  { id: 25, title: 'Lookism',                    color: '#4a2c6a', rating: 8.5, genre: 'Drama' },
  { id: 26, title: 'Eleceed',                    color: '#3b2060', rating: 8.7, genre: 'Action' },
  { id: 27, title: 'Bleach',                     color: '#3a3058', rating: 8.0, genre: 'Action' },
]);

export const HISTORY = withBookCovers([
  { id: 28, title: 'Solo Leveling',   color: '#2d1b4e', chapter: 'Chapter 45', readAt: '2 hours ago',   progress: 80 },
  { id: 29, title: 'Dandadan',        color: '#4a3050', chapter: 'Chapter 12', readAt: 'Yesterday',      progress: 100 },
  { id: 30, title: 'One Piece',       color: '#3a2858', chapter: 'Chapter 110', readAt: '2 days ago',   progress: 55 },
  { id: 31, title: 'Tower Of God',    color: '#2e3850', chapter: 'Chapter 78', readAt: '3 days ago',    progress: 100 },
  { id: 32, title: 'Sweet Home',      color: '#2a2040', chapter: 'Chapter 33', readAt: '5 days ago',    progress: 40 },
  { id: 33, title: 'Kagurabachi',     color: '#1a3a5c', chapter: 'Chapter 6',  readAt: 'Last week',     progress: 100 },
  { id: 34, title: 'Hunter x Hunter', color: '#5c3478', chapter: 'Chapter 51', readAt: '2 weeks ago',   progress: 70 },
  { id: 35, title: 'Lookism',         color: '#4a2c6a', chapter: 'Chapter 22', readAt: '3 weeks ago',   progress: 100 },
]);

export const GENRES = [
  {
    id: 'romance',
    label: 'Romance',
    icon: '💕',
    books: withBookCovers([
      { id: 'g1',  title: 'True Beauty',           color: '#6b2d82', rating: 9.1 },
      { id: 'g2',  title: 'My Love Story',          color: '#7a3590', rating: 8.7 },
      { id: 'g3',  title: 'Horimiya',               color: '#5c2870', rating: 9.3 },
      { id: 'g4',  title: 'Ao Haru Ride',           color: '#8a3d9e', rating: 8.5 },
      { id: 'g5',  title: 'Kimi ni Todoke',         color: '#4e2060', rating: 8.8 },
      { id: 'g6',  title: 'Fruits Basket',          color: '#7a2e8e', rating: 9.0 },
    ]),
  },
  {
    id: 'mystery',
    label: 'Mystery',
    icon: '🔍',
    books: withBookCovers([
      { id: 'g7',  title: 'Detective Conan',        color: '#1a3a5c', rating: 9.2 },
      { id: 'g8',  title: 'Monster',                color: '#12284a', rating: 9.4 },
      { id: 'g9',  title: 'Moriarty the Patriot',  color: '#0e2038', rating: 8.9 },
      { id: 'g10', title: 'Q.E.D.',                 color: '#1e3850', rating: 8.3 },
      { id: 'g11', title: '20th Century Boys',      color: '#152d48', rating: 9.1 },
      { id: 'g12', title: 'The Promised Neverland', color: '#0a2240', rating: 9.5 },
    ]),
  },
  {
    id: 'comedy',
    label: 'Comedy',
    icon: '😂',
    books: withBookCovers([
      { id: 'g13', title: 'Gintama',                color: '#2a5c1e', rating: 9.3 },
      { id: 'g14', title: 'Gekkan Shoujo',          color: '#3a6828', rating: 8.7 },
      { id: 'g15', title: 'Grand Blue',             color: '#1e4a30', rating: 8.9 },
      { id: 'g16', title: 'Nisekoi',                color: '#2e5a22', rating: 8.2 },
      { id: 'g17', title: 'Saiki K',                color: '#225018', rating: 9.0 },
      { id: 'g18', title: 'Daily Lives',            color: '#3a6030', rating: 8.5 },
    ]),
  },
  {
    id: 'fantasy',
    label: 'Fantasy',
    icon: '🐉',
    books: withBookCovers([
      { id: 'g19', title: 'The Beginning After The End', color: '#1e1040', rating: 9.2 },
      { id: 'g20', title: 'Overlord',              color: '#281848', rating: 8.8 },
      { id: 'g21', title: 'That Time I Got Reincarnated', color: '#201438', rating: 8.5 },
      { id: 'g22', title: 'Re:Zero',               color: '#2a1c50', rating: 8.7 },
      { id: 'g23', title: 'Mushoku Tensei',         color: '#181030', rating: 8.9 },
      { id: 'g24', title: 'KonoSuba',              color: '#241845', rating: 8.6 },
    ]),
  },
  {
    id: 'horror',
    label: 'Horror',
    icon: '👻',
    books: withBookCovers([
      { id: 'g25', title: 'Sweet Home',             color: '#1a0a0a', rating: 9.0 },
      { id: 'g26', title: 'Uzumaki',                color: '#200808', rating: 8.8 },
      { id: 'g27', title: 'Junji Ito Collection',   color: '#180606', rating: 9.1 },
      { id: 'g28', title: 'I Am a Hero',            color: '#221010', rating: 8.4 },
      { id: 'g29', title: 'Biomega',                color: '#1e0e0e', rating: 8.0 },
      { id: 'g30', title: 'Prophecy',               color: '#280c0c', rating: 8.3 },
    ]),
  },
  {
    id: 'sci-fi',
    label: 'Sci-Fi',
    icon: '🚀',
    books: withBookCovers([
      { id: 'g31', title: 'Dandadan',               color: '#4a3050', rating: 8.8 },
      { id: 'g32', title: 'Blame!',                 color: '#1a2040', rating: 8.5 },
      { id: 'g33', title: 'Pluto',                  color: '#2a3060', rating: 9.0 },
      { id: 'g34', title: 'Knights of Sidonia',     color: '#1e2850', rating: 8.3 },
      { id: 'g35', title: 'Gantz',                  color: '#142030', rating: 8.6 },
      { id: 'g36', title: 'Sidooh',                 color: '#1a2848', rating: 8.1 },
    ]),
  },
  {
    id: 'slice-of-life',
    label: 'Slice Of Life',
    icon: '🌸',
    books: withBookCovers([
      { id: 'g37', title: 'Yotsuba&!',             color: '#1a4a2a', rating: 9.0 },
      { id: 'g38', title: 'Barakamon',              color: '#2a5a3a', rating: 8.7 },
      { id: 'g39', title: 'Mushishi',               color: '#204838', rating: 8.8 },
      { id: 'g40', title: 'Non Non Biyori',         color: '#1e4030', rating: 8.5 },
      { id: 'g41', title: 'Silver Spoon',           color: '#2e5c40', rating: 8.6 },
      { id: 'g42', title: 'March Comes in Like a Lion', color: '#183828', rating: 9.1 },
    ]),
  },
  {
    id: 'historical',
    label: 'Historical',
    icon: '🏯',
    books: withBookCovers([
      { id: 'g43', title: 'Vagabond',               color: '#4a3520', rating: 9.4 },
      { id: 'g44', title: 'Vinland Saga',           color: '#3a2818', rating: 9.3 },
      { id: 'g45', title: 'Berserk',                color: '#2a1c10', rating: 9.5 },
      { id: 'g46', title: 'Kingdom',                color: '#402e18', rating: 9.1 },
      { id: 'g47', title: 'Rurouni Kenshin',        color: '#382a14', rating: 8.8 },
      { id: 'g48', title: 'Lone Wolf and Cub',      color: '#301e0a', rating: 8.9 },
    ]),
  },
  {
    id: 'adventure',
    label: 'Adventure',
    icon: '⚔️',
    books: withBookCovers([
      { id: 'g49', title: 'One Piece',              color: '#3a2858', rating: 9.4 },
      { id: 'g50', title: 'Hunter x Hunter',        color: '#5c3478', rating: 9.3 },
      { id: 'g51', title: 'Fullmetal Alchemist',    color: '#2e2040', rating: 9.5 },
      { id: 'g52', title: 'Tower of God',           color: '#2e3850', rating: 8.7 },
      { id: 'g53', title: 'Magi',                   color: '#3a3060', rating: 8.5 },
      { id: 'g54', title: 'Black Clover',           color: '#281e48', rating: 8.4 },
    ]),
  },
  {
    id: 'drama',
    label: 'Drama',
    icon: '🎭',
    books: withBookCovers([
      { id: 'g55', title: 'Lookism',                color: '#4a2c6a', rating: 8.5 },
      { id: 'g56', title: 'Slam Dunk',              color: '#2a4858', rating: 9.1 },
      { id: 'g57', title: 'Nana',                   color: '#482060', rating: 8.9 },
      { id: 'g58', title: 'Beck',                   color: '#3a2858', rating: 8.6 },
      { id: 'g59', title: 'Welcome to the NHK',     color: '#302050', rating: 8.7 },
      { id: 'g60', title: 'Goodnight Punpun',       color: '#281840', rating: 9.0 },
    ]),
  },
  {
    id: 'thriller',
    label: 'Thriller',
    icon: '😱',
    books: withBookCovers([
      { id: 'g61', title: 'Liar Game',              color: '#1a2a1a', rating: 8.9 },
      { id: 'g62', title: 'Doubt',                  color: '#101a10', rating: 8.5 },
      { id: 'g63', title: 'Alice in Borderland',    color: '#0e1a0e', rating: 9.0 },
      { id: 'g64', title: 'Bloody Monday',          color: '#182818', rating: 8.4 },
      { id: 'g65', title: 'Ajin: Demi-Human',       color: '#162416', rating: 8.7 },
      { id: 'g66', title: 'Deadman Wonderland',     color: '#1e2e1e', rating: 8.3 },
    ]),
  },
];
