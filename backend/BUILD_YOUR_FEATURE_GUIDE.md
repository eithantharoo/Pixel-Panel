# Build Your Feature — Step-by-Step Guide for Members

> Read [`LEADER_CODE_EXPLAINED.md`](./LEADER_CODE_EXPLAINED.md) and [`STORY_FEATURE_EXPLAINED.md`](./STORY_FEATURE_EXPLAINED.md) first.
> Story is already built. This guide teaches you **how to think** through building your own feature the same way — not just what code to copy.
> Every step below shows the Story equivalent side-by-side, so you always have a working example to check yourself against.

---

## The Big Picture — 4 Steps, Always in This Order

```
1. MODEL       → What does one record of your data look like?
2. CONTROLLER  → What actions can happen to it? (get input → query DB → handle errors → respond)
3. ROUTES      → What URLs trigger those actions, and who's allowed to call them?
4. PLUG IN     → Leader wires your routes into app.js (you don't touch this file)
```

Never skip ahead. Don't write a controller before the model is finished and reviewed — the controller depends on knowing exactly what fields exist.

---

## STEP 1 — Design Your Model

### The thinking process (ask yourself these, in order)

1. **What is one record of this thing?** (One Story = one manga title. One Favorite = one "user saved this story" fact.)
2. **What information does it absolutely need?** These become `required: true` fields.
3. **What information is optional or has a sensible default?** These get a `default: ...`.
4. **Does this connect to another collection?** (A Favorite always belongs to a User AND a Story — that's two `ref` fields.)
5. **Is there a rule beyond "what type"?** (Only certain values allowed → `enum`. A number in a range → `min`/`max`. Custom logic → a `validate` function.)
6. **Can the same combination happen twice, and should it be blocked?** → a compound unique index.

### How Story answered these questions

| Question | Story's answer |
|---|---|
| What is one record? | One manga/story title |
| Required fields? | `title`, `description`, `cover`, `author`, `genres` |
| Optional/default fields? | `status` (default `'ongoing'`), `rating` (default `0`), `views` (default `0`) |
| Connects to another collection? | `createdBy` → `ref: 'User'` |
| Rule beyond type? | `genres` must come from a fixed list (`enum`) AND have at least 1 item (custom `validate`) |
| Duplicate-blocking needed? | No — many stories can share a title |

```javascript
// The pattern every field follows:
fieldName: {
  type: String | Number | Boolean | [String] | mongoose.Schema.Types.ObjectId,
  required: [true, 'Custom error message'],   // only if step 2 said "yes"
  default: someValue,                          // only if step 3 said "yes"
  ref: 'CollectionName',                        // only if step 4 said "yes"
  enum: [...],                                  // only if step 5 said "fixed list"
}
```

### Now do it for your feature

Pull your field list from `STORY_HUB_BACKEND_PLAN.md` (search for your name), but **don't just transcribe it** — for every field, answer "why is this required/optional/a ref?" out loud before typing it. That's the difference between copying and understanding.

**If you're Member 1 (User + Favorite):**
- `User` — walk through the 6 questions above. Notice `password` has `select: false` — that's a **7th consideration Story didn't need**: "should this field ever be hidden by default?" Only sensitive data gets this.
- `Favorite` — this is the simplest possible model: two `ref` fields, nothing else. But it needs a compound unique index (question 6: "can the same user+story pair happen twice?" → no):
  ```javascript
  favoriteSchema.index({ user: 1, story: 1 }, { unique: true });
  ```
  Compare: Story never needed this because nothing about a Story is "one per something."

**If you're Member 3 (Chapter + ReadingProgress):**
- `Chapter` — notice it has a `ref: 'Story'` (question 4), plus its own version of question 6: a story can't have two "Chapter 5"s.
  ```javascript
  chapterSchema.index({ story: 1, number: 1 }, { unique: true });
  ```
- `ReadingProgress` — same shape as Favorite (two `ref` fields) but with extra tracking fields (`chapterNumber`, `progress`). Compound unique index again: one progress record per user per story.

**Pre-save hooks / methods?** Only `User` needs one (hash the password before saving — copy the *pattern* from `User.js`, not the exact code, and understand why: `isModified('password')` prevents re-hashing an already-hashed password every time you save the user for an unrelated reason).

**Checklist before moving to Step 2:**
- [ ] Every field has a `type`
- [ ] Every field you'd be embarrassed to leave blank has `required: [true, 'message']`
- [ ] Any field linking to another collection has `ref` set correctly
- [ ] `timestamps: true` is on the schema options
- [ ] Compound unique indexes added if "can this happen twice?" was a "no"
- [ ] Get this reviewed **before** writing any controller code

---

## STEP 2 — Write Your Controller

### The thinking process

Every controller function in this codebase — no exceptions — follows this shape:

```javascript
const functionName = asyncHandler(async (req, res) => {
  // 1. Get input — from req.body (POST/PUT data), req.params (URL pieces like :id),
  //    req.query (?stuff=like this), or req.user (set by `protect`)
  // 2. Query the database using your Model
  // 3. If something should exist but doesn't → res.status(404); throw new Error('...')
  // 4. res.status(...).json(...) to respond
});
```

Before writing a single line, categorize each endpoint from your plan section into one of these **five shapes** (all five exist in `storyController.js` — go reread the matching one before you write yours):

| Shape | Story example | What makes it this shape |
|---|---|---|
| **Simple read (list)** | `getAllStories` | Returns a list, maybe paginated/filtered from `req.query` |
| **Read-and-modify** | `getStoryById` (increments views) | A GET that also changes something as a side effect |
| **Personalized** | `getForYou` | Uses `req.user` — only works because the route has `protect` |
| **Search** | `searchStories` | Uses `$regex`/`$or`, validates the query isn't empty first |
| **Write (create/update/delete)** | `createStory`/`updateStory`/`deleteStory` | Takes `req.body`, may need `runValidators: true` on update |

### Map your endpoints to these shapes

**Member 1 — `userController.js`:**
| Function | Shape | Notes |
|---|---|---|
| `getProfile` | Simple read (single) | Uses `req.user.id` — no `:id` param needed, they can only see their own |
| `updateProfile` | Write (update) | Only update fields that were actually sent — check `if (req.body.name) ...` per field, don't blindly overwrite with `undefined` |
| `getUserInterests` | Simple read (single) | Return just one field, not the whole user |
| `saveUserInterests` | Write (update) | Has a **validation rule Story never needed**: "at least 3 interests." Validate in the controller before touching the DB — same "fail fast" habit as `searchStories` checking for an empty `q` |

**Member 1 — `favoriteController.js`:**
| Function | Shape | Notes |
|---|---|---|
| `getFavorites` | Simple read (list) | Use `.populate('story')` — turns the stored `story` ObjectId into the full Story document. This is *why* `ref` mattered in Step 1 |
| `addFavorite` | Write (create) | Check the story exists first (404 if not) — same pattern as `createChapter` checking the parent story exists. Then wrap `Favorite.create()` in try/catch for error code `11000` (MongoDB's "duplicate key" error, triggered by your unique index from Step 1) |
| `removeFavorite` | Write (delete) | `findOneAndDelete({ user, story })` — if nothing was deleted, 404 |

**Member 3 — `chapterController.js`:**
| Function | Shape | Notes |
|---|---|---|
| `getChapters` | Simple read (list) | Check the parent story exists first (404 if not), THEN list chapters — two-step existence check, same idea as `addFavorite` |
| `getChapter` | Simple read (single) | Uses two URL params (`:storyId` and `:num`) instead of one — `findOne({ story, number })` instead of `findById` |
| `createChapter` | Write (create) | After creating, also `$inc` the parent Story's `totalChapters` — a write that touches **two** collections. Same `$inc` technique as `getStoryById`'s view counter |

**Member 3 — `progressController.js`:**
| Function | Shape | Notes |
|---|---|---|
| `getContinueReading` | Simple read (list) | `.populate('story')`, sorted `-lastReadAt`, filtered to `progress: { $lt: 100 }` — three techniques you've now seen in Story (`sort`), Favorite (`populate`), and a new one (`$lt` — "less than") |
| `saveProgress` | Write (upsert) | **New technique**: `findOneAndUpdate(filter, data, { upsert: true, new: true })` — updates if a record exists, creates one if it doesn't. Useful because "save progress" should never fail just because it's the user's first time reading |
| `getProgressForStory` | Simple read (single) | If no record found, don't 404 — return a sensible default (`{ chapterNumber: 1, progress: 0 }`, meaning "start from the beginning"). Compare to `getForYou`'s fallback-instead-of-empty pattern |

**Checklist before moving to Step 3:**
- [ ] Every function is wrapped in `asyncHandler`
- [ ] Every function that looks something up checks for "not found" before using the result
- [ ] Nothing trusts `req.body` for identity — `req.user.id` comes from the token, never from what the client claims
- [ ] Validation happens before the database call, not after

---

## STEP 3 — Write Your Routes

### The thinking process

For every endpoint, ask two questions:
1. **Does it need login?** → add `protect`
2. **Does it need admin?** → add `protect, adminOnly` (in that order — `adminOnly` reads `req.user`, which only exists after `protect` ran)

If **every** route in the file needs login, don't repeat `protect` on each line — use `router.use(protect)` once at the top (see `userRoutes.js` in the plan, and `progressRoutes.js`). If it's a **mix** of public and private (like Story), add `protect` individually per line instead.

### The one rule that will bite you if you forget it

Express matches routes **top to bottom**. A route like `/:id` matches *any* text in that position — including words that were meant to hit a different, more specific route.

```javascript
// storyRoutes.js got this right:
router.get('/for-you', protect, getForYou);   // named route FIRST
router.get('/:id', getStoryById);              // catch-all LAST
```

**This directly affects you:**
- `chapterRoutes.js` — `/stories/:storyId/chapters` (list) vs `/stories/:storyId/chapters/:num` (one chapter). These don't actually collide since one has an extra path segment, but keep the more specific route first as a habit.
- `progressRoutes.js` — `/` (continue reading) vs `/:storyId` (one story's progress). `/` has no param so there's no collision, but if you ever add something like `/summary`, it MUST go before `/:storyId`, or `:storyId` will swallow it.

**Checklist before moving to Step 4:**
- [ ] Public endpoints have no `protect`
- [ ] Private endpoints have `protect`
- [ ] Admin-only endpoints have `protect, adminOnly` in that order
- [ ] Named/specific routes are listed before `/:param` routes
- [ ] `module.exports = router;` at the bottom

---

## STEP 4 — How It Plugs Into app.js (you don't do this part)

This is the Leader's job, but understand what happens so you know what to ask for:

```javascript
// app.js — leader adds one line per feature:
const userRoutes = require('./src/routes/userRoutes');
app.use('/api/users', userRoutes);
```

The path you give `app.use()` becomes the **prefix** for everything inside your routes file. That's why `favoriteRoutes.js` can just say `router.get('/', ...)` — the full path `/api/favorites` comes from how it's mounted, not from anything inside your file.

**What to give the leader:** your finished, tested routes file — nothing else needs to change in `app.js` beyond that one `require` + `app.use` pair.

---

## STEP 5 — Test With Thunder Client

Use the Phase 5 checklist in `STORY_HUB_BACKEND_PLAN.md` for your name. General rule for testing anything:

1. Register/login first, copy the token.
2. Test the "happy path" (valid data, correct token) — expect success.
3. Test **without** a token on a private route — expect `401`.
4. Test with a made-up ID — expect `404`.
5. Test invalid data (missing required field, bad enum value) — expect `400`.

If you only ever test the happy path, you haven't actually verified your error handling works — and Step 2's whole point was writing that error handling correctly.

---

## Cheat Sheet — Story vs. Your Feature

| | Story (done, reference) | Your feature |
|---|---|---|
| Model file | `src/models/Story.js` | `src/models/YourModel.js` |
| Controller file | `src/controllers/storyController.js` | `src/controllers/yourController.js` |
| Routes file | `src/routes/storyRoutes.js` | `src/routes/yourRoutes.js` |
| Uses `ref`? | Yes (`createdBy` → User) | Check Step 1 |
| Has a compound unique index? | No | Check Step 1 |
| Has a personalized (`req.user`) endpoint? | Yes (`getForYou`) | Check Step 2 |
| Has an upsert? | No | Progress does |
| Route ordering risk? | Yes (`/for-you` vs `/:id`) | Check Step 3 |

---

## Final PR Checklist

- [ ] Model reviewed and matches the field spec in the plan
- [ ] Every controller function wrapped in `asyncHandler`, has a not-found check where relevant
- [ ] Routes have correct `protect`/`adminOnly`, named routes before `/:param`
- [ ] Tested happy path + no-token + bad-ID + bad-data cases in Thunder Client
- [ ] No hardcoded secrets, no `console.log` debugging left in
