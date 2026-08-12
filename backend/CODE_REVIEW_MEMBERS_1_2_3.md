# Backend Code Review — Members 1, 2, 3

Scope: files owned per `MEMBER_1_GUIDE.md`, `MEMBER_2_GUIDE.md`, `MEMBER_3_GUIDE.md`.

| Member | Files |
|---|---|
| 1 — User Profile | `models/User.js`, `controllers/userController.js`, `routes/userRoutes.js` |
| 2 — Chapters | `models/Chapter.js`, `controllers/chapterController.js`, `routes/chapterRoutes.js` |
| 3 — Favorites & Progress | `models/Favorite.js`, `models/ReadingProgress.js`, `controllers/favoriteController.js`, `controllers/progressController.js`, `routes/favoriteRoutes.js`, `routes/progressRoutes.js` |

All three members followed their model/controller/route specs closely — schemas, indexes, `asyncHandler` usage and status codes all match the guides. The issues below are the gaps between "matches the guide" and "safe / correct in practice."

Severity legend: 🔴 Critical (breaks the feature or is a real security hole) · 🟠 Medium (real bug, works most of the time) · 🟡 Low (hardening / best practice).

---

## Cross-cutting (blocks Members 2 & 3 entirely)

### 🔴 `chapterRoutes`, `progressRoutes`, `favoriteRoutes` were never mounted in `app.js`
```js
// app.use('/api', chapterRoutes);
// app.use('/api/progress', progressRoutes);
// app.use('/api/favorites', favoriteRoutes);
```
All three routers were left commented out. Every endpoint Member 2 and Member 3 built (chapters, favorites, reading progress) currently 404s — none of it is reachable from outside the codebase, regardless of how correct the controllers are.
**Fix applied:** uncommented and mounted all three routers.

---

## Member 1 — User Profile

### 🟠 `updateProfile` lets a raw MongoDB duplicate-key error leak to the client
`user.email = req.body.email` is applied and saved with no uniqueness pre-check. If the new email belongs to another account, `user.save()` throws Mongo's `E11000` error, which isn't caught anywhere — it falls through to the generic error handler as a 500 with a raw driver message instead of a clean `400 Email already in use`.
**Fix applied:** check for an existing user with that email (excluding the current user) before assigning, return `400` with a clear message.

### 🟠 Password can be changed with no proof of the current password
Any request carrying a valid JWT can silently overwrite the password via `PUT /api/users/profile`. If a token is ever exposed (XSS, shared/unlocked device, leaked logs), an attacker can lock the real owner out permanently without knowing the original password.
**Fix applied:** when `req.body.password` is present, also require `req.body.currentPassword` and verify it with `matchPassword` before allowing the change (`401` if missing/wrong).

### 🟡 Email format check is weak
`/^\S+@\S+\.\S+$/` accepts things like `a@b.c..` — matches the guide's spec exactly, so left as-is, but flagging in case stricter validation is wanted later.

---

## Member 2 — Chapters

### 🟠 `createChapter` mass-assigns the entire request body
```js
const created_chapter = await Chapter.create({ ...req.body, story: req.params.storyId });
```
Any field an admin's client happens to send passes straight to `Chapter.create` (e.g. `isPublished`, `publishedAt`, arbitrary extras). Mongoose's schema strictness limits real damage, but nothing stops an admin caller from silently creating an unpublished chapter or backdating `publishedAt` by accident.
**Fix applied:** whitelist to the four fields the guide actually specifies (`number`, `title`, `content`, `pages`).

### 🟠 Duplicate chapter number crashes instead of returning a clean error
The compound unique index (`story + number`) is correct, but nothing catches the resulting `E11000` — posting the same chapter number twice returns a raw 500, the same class of bug as Member 1's email issue.
**Fix applied:** wrap the create in try/catch, return `400 "Chapter number already exists for this story"` on `error.code === 11000`.

### 🟡 Style: tabs instead of spaces
`Chapter.js`, `chapterController.js`, `chapterRoutes.js` use tab indentation while the rest of the codebase (`Story.js`, `storyController.js`, etc.) uses 2-space. Not a bug, but worth normalizing for consistency. Left as-is (cosmetic-only, out of scope for a fix pass) — flagging for a follow-up lint/format pass.

---

## Member 3 — Favorites & Reading Progress

### 🔴 `saveProgress` doesn't enforce the `progress` field's `min:0`/`max:100` bounds
```js
await ReadingProgress.findOneAndUpdate({ ... }, { chapterNumber, progress, ... }, { upsert: true, new: true });
```
Mongoose does **not** run schema validators on `findOneAndUpdate` by default — only on `.save()` and `.create()`. Since this uses `findOneAndUpdate` without `runValidators: true`, the `min: 0, max: 100` constraint on `progress` in `ReadingProgress.js` is silently bypassed. A client can currently persist `progress: -5` or `progress: 9999`, which would corrupt anything relying on that field being a real percentage (e.g. "Continue Reading" UI, completion checks).
**Fix applied:** added `runValidators: true, context: 'query'` to the `findOneAndUpdate` call, plus an explicit numeric-type check on `chapterNumber`/`progress` before hitting the DB (so a non-numeric value fails with a clean `400` instead of a Mongoose `CastError`).

### Everything else in Member 3's code is solid
`addFavorite`'s duplicate-key handling, `getProgressForStory`'s default-object-instead-of-404 pattern, and both compound unique indexes all match the guide and hold up under review — no changes needed there.

---

## General / infra notes (not member-specific, informational only — not fixed here)

- No rate limiting on any route (login/register in particular are brute-forceable). Consider `express-rate-limit` on `/api/auth`.
- No `helmet()` for standard security headers.
- `express-validator` is in `package.json` but unused anywhere — either wire it in for request validation or drop the dependency.
- `cors()` is wide open (all origins) — fine for local dev, should be restricted to the real frontend origin before production.
- `.env` is correctly gitignored and was never committed — good.

---

## Summary of fixes applied in this pass

1. `app.js` — mounted `chapterRoutes`, `progressRoutes`, `favoriteRoutes` (previously commented out).
2. `userController.js` — `updateProfile` now checks email uniqueness before saving, and requires+verifies `currentPassword` before allowing a password change.
3. `chapterController.js` — `createChapter` now whitelists input fields and returns a clean `400` on duplicate chapter number instead of a raw 500.
4. `progressController.js` — `saveProgress` now runs schema validators on upsert and validates numeric input before writing.
