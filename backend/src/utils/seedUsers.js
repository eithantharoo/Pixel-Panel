const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Story = require('../models/Story');
const Favorite = require('../models/Favorite');
const ReadingProgress = require('../models/ReadingProgress');
const connectDB = require('../config/db');

const ADMIN = {
  name: 'Admin',
  email: 'admin@pixelpanel.com',
  password: 'Admin@12345',
  role: 'admin',
};

const SAMPLE_USERS = [
  { name: 'Aiko Tanaka', email: 'aiko.tanaka@example.com', password: 'Password123', interests: ['Romance', 'Slice of Life'] },
  { name: 'Marcus Reed', email: 'marcus.reed@example.com', password: 'Password123', interests: ['Fantasy', 'Adventure'] },
  { name: 'Sofia Ramirez', email: 'sofia.ramirez@example.com', password: 'Password123', interests: ['Mystery', 'Thriller'] },
  { name: 'Kenji Watanabe', email: 'kenji.watanabe@example.com', password: 'Password123', interests: ['Sci-Fi', 'Horror'] },
  { name: 'Lily Chen', email: 'lily.chen@example.com', password: 'Password123', interests: ['Comedy', 'Drama'] },
  { name: 'Noah Williams', email: 'noah.williams@example.com', password: 'Password123', interests: ['Historical', 'Adventure'], isActive: false },
];

// findOne + create (not findOneAndUpdate) so User's pre-save hash hook runs
// and we never touch/re-hash an existing user's password on re-run.
async function ensureUser(data) {
  const existing = await User.findOne({ email: data.email });
  if (existing) return { user: existing, created: false };
  const user = await User.create(data);
  return { user, created: true };
}

const seed = async () => {
  await connectDB();

  const { user: admin, created: adminCreated } = await ensureUser(ADMIN);
  console.log(`Admin ${adminCreated ? 'created' : 'already existed'}: ${admin.email} (role: ${admin.role})`);

  const sampleUsers = [];
  let createdCount = 0;
  for (const data of SAMPLE_USERS) {
    const { user, created } = await ensureUser(data);
    sampleUsers.push(user);
    if (created) createdCount++;
  }
  console.log(`${createdCount} new sample user(s) created (${sampleUsers.length} total available).`);

  const stories = await Story.find().limit(15);
  if (stories.length) {
    let favCount = 0;
    let progressCount = 0;
    for (const user of sampleUsers) {
      const picks = [...stories].sort(() => 0.5 - Math.random()).slice(0, 3);
      for (const story of picks) {
        const existingFav = await Favorite.findOne({ user: user._id, story: story._id });
        if (!existingFav) {
          await Favorite.create({ user: user._id, story: story._id });
          favCount++;
        }

        const existingProgress = await ReadingProgress.findOne({ user: user._id, story: story._id });
        if (!existingProgress) {
          const chapterNumber = Math.max(1, Math.floor(Math.random() * (story.totalChapters || 1)) + 1);
          await ReadingProgress.create({
            user: user._id,
            story: story._id,
            chapterNumber,
            progress: Math.floor(Math.random() * 100),
          });
          progressCount++;
        }
      }
    }
    console.log(`${favCount} favorite(s) and ${progressCount} reading-progress record(s) created.`);
  } else {
    console.log('No stories found — run `npm run seed` first to seed stories/chapters.');
  }

  console.log('\nAdmin login:');
  console.log(`  email:    ${ADMIN.email}`);
  console.log(`  password: ${ADMIN.password}`);

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
