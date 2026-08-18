const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Story = require('../models/Story');
const Chapter = require('../models/Chapter');
const connectDB = require('../config/db');

// Cover paths are verified against frontend/public/images — every entry
// below points at a file that actually exists there, since the frontend
// serves /images itself and a typo here just renders a broken cover.
const stories = [
  {
    title: 'Attack on Titan',
    description: 'Humanity lives behind massive walls to protect themselves from giant humanoid Titans. A young soldier fights to uncover the truth about their world.',
    cover: '/images/Attack on Titan.jpg',
    author: 'Hajime Isayama',
    genres: ['Fantasy', 'Drama', 'Horror', 'Mystery'],
    status: 'completed',
    rating: 9.4,
    ratingCount: 20000,
    views: 0,
    isFeatured: true,
    chapterCount: 20,
  },
  {
    title: 'Berserk',
    description: 'A lone mercenary swordsman, branded and cursed, is pursued by demonic forces in a brutal, dark-fantasy medieval world.',
    cover: '/images/Berserk.jpeg',
    author: 'Kentaro Miura',
    genres: ['Fantasy', 'Horror', 'Drama', 'Adventure'],
    status: 'hiatus',
    rating: 9.5,
    ratingCount: 18000,
    views: 0,
    isFeatured: false,
    chapterCount: 14,
  },
  {
    title: 'Bleach',
    description: 'A teenager gains soul-reaper powers and takes on the duty of protecting the living world from lost souls and evil spirits.',
    cover: '/images/Bleach.webp',
    author: 'Tite Kubo',
    genres: ['Fantasy', 'Adventure', 'Comedy'],
    status: 'completed',
    rating: 8.0,
    ratingCount: 14000,
    views: 0,
    isFeatured: false,
    chapterCount: 20,
  },
  {
    title: 'Blue Lock',
    description: 'Japan\'s football federation launches a ruthless program to forge the country\'s most egotistical, prolific striker.',
    cover: '/images/Blue Lock.jpeg',
    author: 'Muneyuki Kaneshiro',
    genres: ['Drama', 'Thriller'],
    status: 'ongoing',
    rating: 8.7,
    ratingCount: 9000,
    views: 0,
    isFeatured: false,
    chapterCount: 12,
  },
  {
    title: 'Chainsaw Man',
    description: 'A young devil hunter merges with his pet devil to become Chainsaw Man, taking on increasingly twisted threats in a world overrun by devils.',
    cover: '/images/Chainsaw Man.jpeg',
    author: 'Tatsuki Fujimoto',
    genres: ['Horror', 'Comedy', 'Fantasy', 'Drama'],
    status: 'ongoing',
    rating: 8.8,
    ratingCount: 13000,
    views: 0,
    isFeatured: false,
    chapterCount: 12,
  },
  {
    title: 'Dandadan',
    description: 'A believer in the occult and a believer in aliens team up after both turn out to be right, in a story that swings wildly between horror and comedy.',
    cover: '/images/Dandadan.jpeg',
    author: 'Yukinobu Tatsu',
    genres: ['Sci-Fi', 'Comedy', 'Horror', 'Romance'],
    status: 'ongoing',
    rating: 8.8,
    ratingCount: 8500,
    views: 0,
    isFeatured: false,
    chapterCount: 12,
  },
  {
    title: 'Demon Slayer',
    description: 'A young boy becomes a demon slayer after his family is slaughtered and his sister is turned into a demon. He trains to avenge his family and cure his sister.',
    cover: '/images/Demon Slayer.jpeg',
    author: 'Koyoharu Gotouge',
    genres: ['Fantasy', 'Adventure', 'Drama'],
    status: 'completed',
    rating: 8.9,
    ratingCount: 15000,
    views: 0,
    isFeatured: true,
    chapterCount: 20,
  },
  {
    title: 'Eleceed',
    description: 'A kind-hearted boy with a secret physical gift teams up with a proud, powerful cat who is far more than he appears.',
    cover: '/images/Eleceed.jpeg',
    author: 'Jeho Son',
    genres: ['Fantasy', 'Comedy', 'Adventure'],
    status: 'ongoing',
    rating: 8.7,
    ratingCount: 8000,
    views: 0,
    isFeatured: false,
    chapterCount: 12,
  },
  {
    title: 'Fullmetal Alchemist',
    description: 'Two brothers use alchemy in a failed attempt to revive their dead mother, and pay a terrible price — now they search for a way to restore what they lost.',
    cover: '/images/Fullmetal Alchemist.jpeg',
    author: 'Hiromu Arakawa',
    genres: ['Fantasy', 'Adventure', 'Drama'],
    status: 'completed',
    rating: 9.5,
    ratingCount: 17000,
    views: 0,
    isFeatured: true,
    chapterCount: 20,
  },
  {
    title: 'Hunter x Hunter',
    description: 'A young boy sets out to become a Hunter like his absent father, uncovering a world of exams, power systems, and moral gray areas along the way.',
    cover: '/images/Hunter x Hunter.jpeg',
    author: 'Yoshihiro Togashi',
    genres: ['Fantasy', 'Adventure', 'Drama'],
    status: 'hiatus',
    rating: 9.3,
    ratingCount: 16000,
    views: 0,
    isFeatured: false,
    chapterCount: 14,
  },
  {
    title: 'Jujutsu Kaisen',
    description: 'A boy swallows a cursed object containing a powerful demon and is forced to join a school of jujutsu sorcerers to fight curses.',
    cover: '/images/Jujutsu Kaisen.jpeg',
    author: 'Gege Akutami',
    genres: ['Fantasy', 'Horror', 'Adventure'],
    status: 'completed',
    rating: 9.0,
    ratingCount: 11000,
    views: 0,
    isFeatured: true,
    chapterCount: 20,
  },
  {
    title: 'Kagurabachi',
    description: 'A young swordsmith\'s son seeks revenge with a set of cursed blades forged by his late father.',
    cover: '/images/Kagurabachi.jpeg',
    author: 'Takeru Hokazono',
    genres: ['Fantasy', 'Adventure', 'Drama'],
    status: 'ongoing',
    rating: 8.6,
    ratingCount: 6000,
    views: 0,
    isFeatured: false,
    chapterCount: 10,
  },
  {
    title: 'Lookism',
    description: 'A bullied high-schooler wakes up with a second body — one that is everything the first was not — and has to navigate life switching between the two.',
    cover: '/images/Lookism.jpg',
    author: 'Taejun Pak',
    genres: ['Drama', 'Slice of Life', 'Comedy'],
    status: 'ongoing',
    rating: 8.5,
    ratingCount: 9500,
    views: 0,
    isFeatured: false,
    chapterCount: 12,
  },
  {
    title: 'Noragami',
    description: 'A minor, penniless god does odd jobs for five yen a pop, hoping to one day build himself a shrine and become a proper deity.',
    cover: '/images/Noragami.webp',
    author: 'Adachitoka',
    genres: ['Fantasy', 'Comedy', 'Adventure'],
    status: 'ongoing',
    rating: 8.4,
    ratingCount: 7000,
    views: 0,
    isFeatured: false,
    chapterCount: 12,
  },
  {
    title: 'One Piece',
    description: 'Monkey D. Luffy sets sail to find the legendary One Piece treasure and become the King of the Pirates.',
    cover: '/images/One Piece.jpeg',
    author: 'Eiichiro Oda',
    genres: ['Adventure', 'Comedy', 'Fantasy'],
    status: 'ongoing',
    rating: 9.4,
    ratingCount: 25000,
    views: 0,
    isFeatured: true,
    chapterCount: 14,
  },
  {
    title: 'Solo Leveling',
    description: 'In a world where hunters fight monsters, the weakest hunter awakens a hidden power and rises to become the strongest.',
    cover: '/images/solo_leveling.jpg',
    author: 'Chugong',
    genres: ['Fantasy', 'Adventure'],
    status: 'completed',
    rating: 9.5,
    ratingCount: 22000,
    views: 0,
    isFeatured: true,
    chapterCount: 20,
  },
  {
    title: 'Spy x Family',
    description: 'A spy must build a fake family to complete a mission. But his fake wife is an assassin, and his adopted daughter can read minds.',
    cover: '/images/Spy x Family.jpeg',
    author: 'Tatsuya Endo',
    genres: ['Comedy', 'Slice of Life', 'Drama'],
    status: 'ongoing',
    rating: 8.8,
    ratingCount: 8000,
    views: 0,
    isFeatured: false,
    chapterCount: 12,
  },
  {
    title: 'Sweet Home',
    description: 'A reclusive teenager holed up in his apartment must fight to survive as the people around him mutate into monsters born from their own desires.',
    cover: '/images/Sweet Home.jpeg',
    author: 'Kim Carnby',
    genres: ['Horror', 'Drama', 'Thriller'],
    status: 'completed',
    rating: 9.0,
    ratingCount: 9000,
    views: 0,
    isFeatured: false,
    chapterCount: 16,
  },
  {
    title: 'The Beginning After The End',
    description: 'A powerful king is reincarnated into a new world as a weak orphan boy, given a second chance to relive his life with the wisdom of his past.',
    cover: '/images/The_Beginning_After_the_End_Season_7.webp',
    author: 'TurtleMe',
    genres: ['Fantasy', 'Adventure', 'Drama'],
    status: 'ongoing',
    rating: 9.2,
    ratingCount: 10000,
    views: 0,
    isFeatured: true,
    chapterCount: 12,
  },
  {
    title: 'Tower Of God',
    description: 'A boy enters a mysterious tower to chase after his closest friend, and must climb through its trials to reach the top.',
    cover: '/images/Tower of god.jpeg',
    author: 'SIU',
    genres: ['Fantasy', 'Adventure', 'Mystery'],
    status: 'ongoing',
    rating: 8.7,
    ratingCount: 9500,
    views: 0,
    isFeatured: false,
    chapterCount: 12,
  },
  {
    title: 'Vagabond',
    description: 'A fictionalized account of the life of legendary swordsman Miyamoto Musashi, from directionless youth to the pursuit of true mastery.',
    cover: '/images/Vagabond.jpeg',
    author: 'Takehiko Inoue',
    genres: ['Historical', 'Drama', 'Adventure'],
    status: 'hiatus',
    rating: 9.4,
    ratingCount: 8000,
    views: 0,
    isFeatured: false,
    chapterCount: 14,
  },
];

// Generic placeholder body text — this is demo/seed content, not the
// actual manga script, so it stays intentionally generic rather than
// reproducing any real published chapter text.
const FILLER_PARAGRAPHS = [
  'The city held its breath as the story pressed forward, old promises colliding with new dangers no one saw coming.',
  'Every choice carried weight now. What began as a small spark of defiance had grown into something the whole world could feel.',
  'Silence stretched across the room until it broke — not with words, but with the kind of resolve that changes everything after it.',
  'Somewhere between the plan and the moment it fell apart, a different kind of courage took over.',
];

function buildChapterContent(title, number) {
  const para = FILLER_PARAGRAPHS[(number - 1) % FILLER_PARAGRAPHS.length];
  return `Chapter ${number} of ${title}. ${para}`;
}

const seedDatabase = async () => {
  await connectDB();

  await Chapter.deleteMany({});
  await Story.deleteMany({});
  console.log('Existing stories and chapters cleared.');

  let totalChapters = 0;

  for (const { chapterCount, ...storyData } of stories) {
    const story = await Story.create({ ...storyData, totalChapters: chapterCount });

    const chapters = Array.from({ length: chapterCount }, (_, i) => {
      const number = i + 1;
      return {
        story: story._id,
        number,
        title: `Chapter ${number}`,
        content: buildChapterContent(story.title, number),
        isPublished: true,
      };
    });

    await Chapter.insertMany(chapters);
    totalChapters += chapters.length;
  }

  console.log(`${stories.length} stories seeded successfully.`);
  console.log(`${totalChapters} chapters seeded successfully.`);

  process.exit(0);
};

seedDatabase().catch((err) => {
  console.error(err);
  process.exit(1);
});
