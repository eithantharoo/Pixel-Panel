# Member 3 Guide — Favorites & Reading Progress

> Read `BACKEND_GUIDE.md` first if you haven't already. This file is just **your assignment**, step by step.
>
> Reference example to copy the *pattern* from (not the code): `src/models/Story.js` and `src/controllers/storyController.js` are already done and working — open them side by side while you work. Both of your models connect to Story and User via `ref`, so this guide leans on that pattern a lot.

---

## What you own

You're building "the logged-in user's relationship to a story" — two separate small features that share the same shape:

| File | Status |
|---|---|
| `src/models/Favorite.js` | empty — you write this |
| `src/models/ReadingProgress.js` | empty — you write this |
| `src/controllers/favoriteController.js` | empty — you write this |
| `src/controllers/progressController.js` | empty — you write this |
| `src/routes/favoriteRoutes.js` | empty — you write this |
| `src/routes/progressRoutes.js` | empty — you write this |

Build in this order: **Models → Controllers → Routes → hand off to the leader for wiring and testing.** You can do Favorite fully, then Progress fully, or both models first then both controllers — whichever feels more natural, since they don't depend on each other.

---

## Step 1 — Models

### `src/models/Favorite.js`

This is the simplest model in the whole app: "this user saved this story."

```
user   ObjectId, ref: 'User', required
story  ObjectId, ref: 'Story', required
timestamps: true
```

Rule: a user can't favorite the same story twice. Enforce it with a compound unique index (add this line after the schema):

```js
favoriteSchema.index({ user: 1, story: 1 }, { unique: true });
```

### `src/models/ReadingProgress.js`

Tracks where a user stopped reading — this is what powers the "Continue Reading" row on the home page.

```
user           ObjectId, ref: 'User', required
story          ObjectId, ref: 'Story', required
chapterNumber  Number, required, default 1
progress       Number, min 0, max 100, default 0
lastReadAt     Date, default Date.now
timestamps: true
```

Rule: one progress record per user per story (they overwrite it as they read more, they don't get a new one per chapter):

```js
progressSchema.index({ user: 1, story: 1 }, { unique: true });
```

**Checklist before moving on:**
- [ ] Both files have `ref: 'User'` / `ref: 'Story'` spelled exactly right (case-sensitive, must match the strings used in `mongoose.model('User', ...)` and `mongoose.model('Story', ...)`)
- [ ] Both compound unique indexes added
- [ ] Both end with `module.exports = mongoose.model(...)`

---

## Step 2 — Controllers

Every controller function follows this shape (see `storyController.js` for real examples):

```js
const asyncHandler = require('../utils/asyncHandler');

const myFunction = asyncHandler(async (req, res) => {
  // 1. get input from req.body / req.params / req.user
  // 2. query the database
  // 3. if something should exist but doesn't → res.status(404); throw new Error('...')
  // 4. res.status(...).json(...)
});
```

### `src/controllers/favoriteController.js`

| Function | What it does |
|---|---|
| `getFavorites` | `Favorite.find({ user: req.user.id })`, then `.populate('story')` so you get the full story object instead of just its ID, sorted newest first. Status 200. |
| `addFavorite` | Get `storyId` from `req.params`. First check the story actually exists (`Story.findById`) — if not, 404. Then try `Favorite.create({ user: req.user.id, story: storyId })` inside a try/catch. If it throws with `error.code === 11000`, that's MongoDB's duplicate-key error (from your unique index) — respond 400 "already in favorites" instead of crashing. Status 201 on success. |
| `removeFavorite` | `Favorite.findOneAndDelete({ user: req.user.id, story: req.params.storyId })`. If nothing was found/deleted, 404. Status 200. |

### `src/controllers/progressController.js`

| Function | What it does |
|---|---|
| `getContinueReading` | `ReadingProgress.find({ user: req.user.id, progress: { $lt: 100 } })` — `$lt` means "less than", so finished stories (100%) are excluded. `.populate('story')` to get full story data. Sort `-lastReadAt` (most recent first), `.limit(5)`. Status 200. |
| `saveProgress` | From `req.body`: `{ storyId, chapterNumber, progress }` — validate all three are present, 400 if not. Use `findOneAndUpdate({ user: req.user.id, story: storyId }, { chapterNumber, progress, lastReadAt: Date.now() }, { upsert: true, new: true })`. **`upsert: true` is the key new idea here**: it updates the record if one exists, or creates it if this is the user's first time reading that story — either way it succeeds. Status 200. |
| `getProgressForStory` | From `req.params.storyId`. Find the record for `req.user.id` + that story. **If none exists, don't 404** — return a sensible default: `{ chapterNumber: 1, progress: 0 }`, meaning "start from the beginning." A first-time reader isn't an error. Status 200. |

**Checklist:**
- [ ] Every function wrapped in `asyncHandler`
- [ ] `addFavorite` checks the story exists before creating, and catches the duplicate-key error (`11000`) instead of letting it crash
- [ ] `saveProgress` uses `upsert: true` — the first save for a story should succeed just like the tenth
- [ ] `getProgressForStory` returns a default object instead of erroring when nothing exists yet

---

## Step 3 — Routes

### `src/routes/favoriteRoutes.js`

Every route here needs login, so use `router.use(protect)` once at the top:

```
router.use(protect)
GET    /            → getFavorites
POST   /:storyId    → addFavorite
DELETE /:storyId    → removeFavorite
```

### `src/routes/progressRoutes.js`

Also all-private:

```
router.use(protect)
GET  /            → getContinueReading
POST /            → saveProgress
GET  /:storyId    → getProgressForStory
```

**Checklist:**
- [ ] `protect` imported from `../middleware/authMiddleware` in both files
- [ ] Controller functions imported and named exactly like each controller's `module.exports`
- [ ] `module.exports = router;` at the bottom of both files

---

## Step 4 — Quick self-check before handing off

You don't need to run the full test suite — the leader handles end-to-end testing and wiring your routes into `app.js`. But do a quick sanity check yourself first:

1. Run `npm run dev` and confirm the server boots with no errors.
2. Ask Member 2 for a real chapter number once theirs exists, or just use `chapterNumber: 1` for now — Progress doesn't actually check that a chapter exists, it just stores the number.
3. If you can get a route mounted locally for a quick check (or pair with the leader once they wire it in), confirm: adding the same story to favorites twice returns a clean 400 instead of a raw MongoDB error, and saving progress twice for the same story updates the existing record instead of creating a second one.

Then tell the leader your files are ready.

---

## Final PR checklist

- [ ] `Favorite.js` and `ReadingProgress.js` match the field specs above, both with compound unique indexes
- [ ] `addFavorite` handles the duplicate case cleanly (400, not a crash)
- [ ] `saveProgress` upserts correctly
- [ ] `getProgressForStory` returns a default instead of 404 when nothing exists
- [ ] Routes have `protect` applied on every route in both files
- [ ] No `console.log` debugging left in, no hardcoded secrets
