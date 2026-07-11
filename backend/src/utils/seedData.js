const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Story = require('../models/Story');
const connectDB = require('../config/db');

const stories = [
  {
    title: 'Demon Slayer',
    description: 'A young boy becomes a demon slayer after his family is slaughtered and his sister turned into a demon. He trains to avenge his family and cure his sister.',
    cover: '/images/demon_slayer.jpg',
    author: 'Koyoharu Gotouge',
    genres: ['Fantasy', 'Adventure', 'Drama'],
    status: 'completed',
    rating: 9.3,
    ratingCount: 15000,
    views: 250000,
    isFeatured: true,
  },
  {
    title: 'Solo Leveling',
    description: 'In a world where hunters fight monsters, the weakest hunter awakens a hidden power and rises to become the strongest.',
    cover: '/images/solo_leveling.jpg',
    author: 'Chugong',
    genres: ['Fantasy', 'Adventure'],
    status: 'completed',
    rating: 9.1,
    ratingCount: 12000,
    views: 220000,
    isFeatured: false,
  },
  {
    title: 'Attack on Titan',
    description: 'Humanity lives behind massive walls to protect themselves from giant humanoid Titans. A young soldier fights to uncover the truth about their world.',
    cover: '/images/aot.jpg',
    author: 'Hajime Isayama',
    genres: ['Fantasy', 'Drama', 'Horror', 'Mystery'],
    status: 'completed',
    rating: 9.5,
    ratingCount: 20000,
    views: 300000,
    isFeatured: true,
  },
  {
    title: 'One Piece',
    description: "Monkey D. Luffy sets sail to find the legendary One Piece treasure and become the King of the Pirates.",
    cover: '/images/one_piece.jpg',
    author: 'Eiichiro Oda',
    genres: ['Adventure', 'Comedy', 'Fantasy'],
    status: 'ongoing',
    rating: 9.4,
    ratingCount: 25000,
    views: 400000,
    isFeatured: false,
  },
  {
    title: 'Spy x Family',
    description: 'A spy must build a fake family to complete a mission. But his fake wife is an assassin, and his adopted daughter can read minds.',
    cover: '/images/spy_family.jpg',
    author: 'Tatsuya Endo',
    genres: ['Comedy', 'Slice of Life', 'Drama'],
    status: 'ongoing',
    rating: 8.8,
    ratingCount: 8000,
    views: 150000,
    isFeatured: false,
  },
  {
    title: 'Jujutsu Kaisen',
    description: 'A boy swallows a cursed object containing a powerful demon and is forced to join a school of jujutsu sorcerers to fight curses.',
    cover: '/images/jjk.jpg',
    author: 'Gege Akutami',
    genres: ['Fantasy', 'Horror', 'Adventure'],
    status: 'ongoing',
    rating: 9.0,
    ratingCount: 11000,
    views: 200000,
    isFeatured: false,
  },
  {
    title: 'Your Lie in April',
    description: 'A pianist who lost his ability to hear music meets a free-spirited violin prodigy who changes his world.',
    cover: '/images/your_lie.jpg',
    author: 'Naoshi Arakawa',
    genres: ['Romance', 'Drama', 'Slice of Life'],
    status: 'completed',
    rating: 9.2,
    ratingCount: 7500,
    views: 130000,
    isFeatured: false,
  },
  {
    title: 'Black Clover',
    description: 'In a world where magic is everything, a boy born with no magic at all dreams of becoming the Wizard King.',
    cover: '/images/black_clover.jpg',
    author: 'Yuki Tabata',
    genres: ['Fantasy', 'Adventure', 'Comedy'],
    status: 'ongoing',
    rating: 8.5,
    ratingCount: 9000,
    views: 170000,
    isFeatured: false,
  },
  {
    title: 'Vinland Saga',
    description: 'A young Viking warrior seeks revenge for his father\'s death in the brutal world of Viking Age Europe.',
    cover: '/images/vinland.jpg',
    author: 'Makoto Yukimura',
    genres: ['Historical', 'Adventure', 'Drama'],
    status: 'ongoing',
    rating: 9.0,
    ratingCount: 6000,
    views: 110000,
    isFeatured: false,
  },
  {
    title: 'Classroom of the Elite',
    description: 'In a prestigious school where students are ranked by merit, a boy hides his exceptional intelligence to observe the true nature of his classmates.',
    cover: '/images/cote.jpg',
    author: 'Syougo Kinugasa',
    genres: ['Mystery', 'Drama', 'Thriller'],
    status: 'ongoing',
    rating: 8.7,
    ratingCount: 7000,
    views: 140000,
    isFeatured: false,
  },
];

const seedDatabase = async () => {
  await connectDB();

  await Story.deleteMany({});
  console.log('Existing stories cleared.');

  const created = await Story.insertMany(stories);
  console.log(`${created.length} stories seeded successfully.`);

  process.exit(0);
};

seedDatabase().catch((err) => {
  console.error(err);
  process.exit(1);
});
