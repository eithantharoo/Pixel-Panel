# Member 2 Guide — Chapters

> Read `BACKEND_GUIDE.md` first if you haven't already. This file is just **your assignment**, step by step.
>
> Reference example to copy the *pattern* from (not the code): `src/models/Story.js` and `src/controllers/storyController.js` are already done and working — open them side by side while you work. Chapters connect directly to Story (`ref: 'Story'`), so you'll be reading that file a lot.

---

## What you own

You're building "the actual content people read" — one story has many chapters:

| File | Status |
|---|---|
| `src/models/Chapter.js` | empty — you write this |
| `src/controllers/chapterController.js` | empty — you write this |
| `src/routes/chapterRoutes.js` | empty — you write this |

Build in this order: **Model → Controller → Routes → hand off to the leader for wiring and testing.**

---

## Step 1 — `src/models/Chapter.js`

A chapter belongs to exactly ONE story. A story has MANY chapters.

```
story        ObjectId, ref: 'Story', required
number       Number, required        (chapter number: 1, 2, 3...)
title        String, required, trim
content      String, default ''      (text content, if it's a text story)
pages        [String], default []    (image URLs, if it's a manga/comic)
isPublished  Boolean, default true
publishedAt  Date, default Date.now
timestamps: true
```

Rule: a story can't have two "Chapter 5"s. Add this after the schema:

```js
chapterSchema.index({ story: 1, number: 1 }, { unique: true });
```

**Checklist before moving on:**
- [ ] `ref: 'Story'` is spelled exactly right (case-sensitive, must match the string used in `mongoose.model('Story', ...)`)
- [ ] Compound unique index added
- [ ] Ends with `module.exports = mongoose.model('Chapter', chapterSchema);`

---

## Step 2 — `src/controllers/chapterController.js`

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

| Function | What it does |
|---|---|
| `getChapters` | From `req.params.storyId`. **First check the parent story exists** (404 if not) — this two-step "check the parent, then list the children" pattern matters for the next one too. Then `Chapter.find({ story: storyId, isPublished: true })`, sorted by `number` ascending. Use `.select('number title publishedAt')` so you don't send full chapter content in a list view. Status 200. |
| `getChapter` | From `req.params.storyId` **and** `req.params.num` (two URL params, not one). `Chapter.findOne({ story: storyId, number: num, isPublished: true })` — note `findOne`, not `findById`, since you're matching by story+number, not by Mongo `_id`. 404 if not found. Return the full chapter (with content/pages this time). Status 200. |
| `createChapter` (admin only) | From `req.body` plus `story: req.params.storyId`. Check the parent story exists first (404 if not). After creating the chapter, also `Story.findByIdAndUpdate(storyId, { $inc: { totalChapters: 1 } })` — a single write that touches **two** collections, same `$inc` trick `storyController.getStoryById` uses for view counts. Status 201. |

**Checklist:**
- [ ] Every function wrapped in `asyncHandler`
- [ ] `getChapters`/`createChapter` both check the parent story exists before touching chapters
- [ ] `createChapter` updates the parent story's `totalChapters`

---

## Step 3 — `src/routes/chapterRoutes.js`

Mixed public/private — apply `protect`/`adminOnly` per line, not with `router.use`:

```
GET  /stories/:storyId/chapters       → getChapters                       (public)
GET  /stories/:storyId/chapters/:num  → protect, getChapter               (private)
POST /stories/:storyId/chapters       → protect, adminOnly, createChapter (admin)
```

Note the path starts with `/stories/...` even though it's chapter routes — that's intentional. The leader mounts this router at `/api` (not `/api/chapters`), so the final URL ends up `/api/stories/:storyId/chapters`. Don't add `/chapters` to the mount prefix or paths yourself — just write the paths as shown above and let the leader handle mounting.

**Checklist:**
- [ ] `protect`/`adminOnly` imported from `../middleware/authMiddleware`, `protect` always listed before `adminOnly` (order matters — `adminOnly` reads `req.user`, which only exists after `protect` ran)
- [ ] `module.exports = router;` at the bottom

---

## Step 4 — Quick self-check before handing off

You don't need to run the full test suite — the leader handles end-to-end testing and wiring your routes into `app.js`. But do a quick sanity check yourself first:

1. Run `npm run dev` and confirm the server boots with no errors.
2. Temporarily add `app.use('/api', require('./src/routes/chapterRoutes'))` in your own local `app.js` (don't commit this — the leader will do the real wiring) just to hit your routes locally, or ask the leader to do a quick pairing session once they've wired it in.
3. Grab a real `storyId` from `GET /api/stories` and confirm `POST /api/stories/<storyId>/chapters` creates a chapter and bumps that story's `totalChapters`.

Then tell the leader your files are ready.

---

## Final PR checklist

- [ ] `Chapter.js` matches the field spec above, with the compound unique index
- [ ] `getChapters`/`createChapter` check the parent story exists before doing anything else
- [ ] `createChapter` increments the parent story's `totalChapters`
- [ ] Routes have correct `protect`/`adminOnly`, in that order
- [ ] No `console.log` debugging left in, no hardcoded secrets
