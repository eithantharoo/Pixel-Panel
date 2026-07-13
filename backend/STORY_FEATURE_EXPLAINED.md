# Stories Feature — Explained Simply

> This is the worked example: the same **Model → Controller → Routes** pattern from
> [`LEADER_CODE_EXPLAINED.md`](./LEADER_CODE_EXPLAINED.md), applied to a real feature.
> Members writing User/Favorite or Chapter/Progress should copy this shape exactly.

---

## 1. The Model — `src/models/Story.js`

**Beginner definition:** the Model is the *shape* of the data — what fields exist, what type they are, and what rules they must follow before MongoDB will save them.

```javascript
const mongoose = require('mongoose');

const VALID_GENRES = [
  'Romance', 'Mystery', 'Comedy', 'Fantasy', 'Horror',
  'Sci-Fi', 'Slice of Life', 'Historical', 'Adventure', 'Drama', 'Thriller',
];

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: { type: String, required: [true, 'Description is required'] },
    cover: { type: String, required: [true, 'Cover image URL is required'] },
    author: { type: String, required: [true, 'Author name is required'], trim: true },
    genres: {
      type: [String],
      enum: VALID_GENRES,
      validate: {
        validator: (v) => v.length >= 1,
        message: 'At least one genre is required',
      },
    },
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'hiatus'],
      default: 'ongoing',
    },
    rating: { type: Number, min: 0, max: 10, default: 0 },
    ratingCount: { type: Number, default: 0 },
    totalChapters: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

storySchema.virtual('trendingScore').get(function () {
  return this.views + this.rating * 100;
});

storySchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Story', storySchema);
```

**What's worth pointing out, piece by piece:**
- `required: [true, 'message']` — the array form gives you a custom error message instead of Mongoose's default ugly one. Same pattern used in `User.js`.
- `enum: VALID_GENRES` — MongoDB will **reject** any genre not in that list. This is validation happening at the data layer, before it ever reaches a controller.
- `genres.validate` — a **custom** rule (`enum` alone can't say "at least 1 item"), so a validator function is added by hand. Point this out: "when the built-in options aren't enough, you write your own function."
- `createdBy: { ref: 'User' }` — this doesn't store a whole User, just their `_id`. It's how MongoDB links two collections together (like a foreign key in SQL). `Favorite.js` and `ReadingProgress.js` will use this exact same `ref` pattern to link to both `User` and `Story`.
- `timestamps: true` — auto-adds `createdAt`/`updatedAt`. Free, no extra code needed.
- **The virtual** — `trendingScore` is *not* stored in the database. It's calculated on the fly every time a Story is read (`views + rating * 100`). `toJSON: { virtuals: true }` is required or the virtual won't show up when you send the story back as JSON — easy thing to forget.
- **The text index** — `storySchema.index({ title: 'text', description: 'text' })` tells MongoDB to build a search index over these two fields, which `searchStories` below depends on.

**Where is this used?** Every controller function below starts with `const Story = require('../models/Story')` and calls methods like `Story.find()`, `Story.create()` on it. The model is never called directly by a route — always through a controller.

---

## 2. The Controller — `src/controllers/storyController.js`

**Beginner definition:** the Controller is the actual logic — receive the request, talk to the database via the Model, send back a response. Every function below follows the same shape you saw in `authController.js`: get input → query DB → handle not-found → respond.

### Simple read — `getAllStories`

```javascript
const getAllStories = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.genre) filter.genres = req.query.genre;
  if (req.query.status) filter.status = req.query.status;

  const total = await Story.countDocuments(filter);
  const stories = await Story.find(filter).skip(skip).limit(limit).sort('-createdAt');

  res.json({ stories, page, totalPages: Math.ceil(total / limit), total });
});
```

**Step by step:** read `page`/`limit` from the URL query string (`?page=2&limit=10`), build a `filter` object only from query params that were actually sent, count how many total matches exist, then fetch just one "page" of them using `.skip()`/`.limit()`. This is the standard pagination recipe — members will reuse this exact pattern for `getChapters`.

### Read-and-modify — `getStoryById`

```javascript
const getStoryById = asyncHandler(async (req, res) => {
  const story = await Story.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  res.json(story);
});
```

**Worth calling out:** this isn't a plain "find" — it's `findByIdAndUpdate` with `$inc: { views: 1 }`, so every time someone opens a story, the view count goes up by 1 **in the same database call** that fetches it. `{ new: true }` means "give me back the document *after* the update, not before." The 404 check always comes right after the query — that pattern repeats in nearly every controller in this codebase.

### Sorting variations — `getTrendingStories`, `getNewReleases`, `getPopularStories`

```javascript
const getTrendingStories = asyncHandler(async (req, res) => {
  const stories = await Story.find().sort('-views -rating').limit(4);
  res.json(stories);
});

const getNewReleases = asyncHandler(async (req, res) => {
  const stories = await Story.find().sort('-createdAt').limit(10);
  res.json(stories);
});

const getPopularStories = asyncHandler(async (req, res) => {
  const stories = await Story.find().sort('-rating -ratingCount').limit(10);
  res.json(stories);
});
```

**The lesson here:** three "different" homepage sections turn out to be the *same one line of code* with a different `.sort()` string. `-` means descending. This is a good one to show members writing `ReadingProgress` — "Continue Reading" sorted by `-lastReadAt` is this same pattern.

### Personalized data — `getForYou`

```javascript
const getForYou = asyncHandler(async (req, res) => {
  const { interests } = req.user;

  let stories;
  if (interests && interests.length > 0) {
    stories = await Story.find({ genres: { $in: interests } }).sort('-rating').limit(10);
  } else {
    stories = await Story.find().sort('-rating').limit(10);
  }

  res.json(stories);
});
```

**Why this one matters most for the handoff:** it's the first function that reads `req.user` — which only exists because the route has `protect` in front of it (covered in the Leader doc). `{ genres: { $in: interests } }` means "any story whose genres array contains **at least one** of the user's interests." The `if/else` fallback (no interests → just show popular stories) is a pattern worth naming explicitly: **always have a sane fallback instead of returning an empty list.**

### Search — `searchStories`

```javascript
const searchStories = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    res.status(400);
    throw new Error('Search query is required');
  }

  const stories = await Story.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } },
    ],
  }).limit(20);

  res.json(stories);
});
```

**What's new:** `$or` checks multiple fields at once. `$regex` with `$options: 'i'` means "match this text anywhere in the field, case-insensitive" — so searching `demon` matches `Demon Slayer`. Validate input **before** querying (`if (!q...)`) — same "fail fast" habit as `registerUser`'s missing-field check in the Leader doc.

### Write operations — `createStory` / `updateStory` / `deleteStory`

```javascript
const createStory = asyncHandler(async (req, res) => {
  const story = await Story.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json(story);
});

const updateStory = asyncHandler(async (req, res) => {
  const story = await Story.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!story) { res.status(404); throw new Error('Story not found'); }
  res.json(story);
});

const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) { res.status(404); throw new Error('Story not found'); }
  await story.deleteOne();
  res.json({ message: 'Story deleted successfully' });
});
```

**Points to make:**
- `createStory` spreads whatever the frontend sent (`...req.body`) but **overrides** `createdBy` with the logged-in user's own ID — never trust the client to tell you who they are; take that from `req.user` instead.
- `updateStory` needs `runValidators: true` explicitly — by default, Mongoose does **not** re-check schema rules (like `enum`, `min/max`) on an update, only on create. Easy bug to hit if forgotten.
- `201` = "I created something." `200` (the default) = everything else. `404` = "I looked, it's not there."

---

## 3. The Routes — `src/routes/storyRoutes.js`

```javascript
const router = express.Router();

// Public routes
router.get('/', getAllStories);
router.get('/trending', getTrendingStories);
router.get('/new-releases', getNewReleases);
router.get('/popular', getPopularStories);
router.get('/search', searchStories);

// Private route — must come BEFORE /:id
router.get('/for-you', protect, getForYou);

// Public route — comes after named routes
router.get('/:id', getStoryById);

// Admin routes
router.post('/', protect, adminOnly, createStory);
router.put('/:id', protect, adminOnly, updateStory);
router.delete('/:id', protect, adminOnly, deleteStory);

module.exports = router;
```

**The one bug this file protects against:** Express matches routes **top to bottom**, and `/:id` matches *literally anything* — including the word `for-you`. If `/:id` were listed first, a request to `/api/stories/for-you` would be treated as "find a story with the ID `for-you`" instead of running `getForYou`. **Named routes always go before parameterized ones.**

**This is the #1 thing to warn members about**, because they're about to write:
- `chapterRoutes.js` — `/stories/:storyId/chapters/:num` needs care with ordering too.
- `progressRoutes.js` — `/:storyId` at the end, after `/` — same rule applies.

---

## The Full Loop, One More Time

```
Model (Story.js)        → title, genres, rating... + a virtual + a search index
Controller (storyController.js) → 10 functions, every one: get input → query → check → respond
Routes (storyRoutes.js) → map URL + method → controller, protect/adminOnly where needed, named routes before /:id
```

Hand members this: **"Open `storyController.js` side-by-side with your own controller file. Every function you write should look like one of the ones you just watched me explain — same asyncHandler wrapper, same 404 pattern, same res.status()/res.json() ending."**
