# Leader Guide — Integration, Bug Fix & Testing

> This is the coordination role: fix a bug that's already in the code, wire in each member's work as they finish it, seed test data, and be the one who tests everything end to end. Members do a quick self-check on their own code, but **you own the full test plan** before anything is considered "done."

---

## Task 1 — Fix a real bug that's already in the code

Open `backend/src/routes/storyRoutes.js`. Look at this line:

```js
router.post('/', createStory);
```

Compare it to the other admin routes right below it:

```js
router.put('/:id', protect, adminOnly, updateStory);
router.delete('/:id', protect, adminOnly, deleteStory);
```

See the difference? `POST /api/stories` (creating a new story) is currently missing `protect, adminOnly` — which means **anyone, logged in or not, can currently create stories**. That's a security hole. Fix it to match the pattern:

```js
router.post('/', protect, adminOnly, createStory);
```

**Why this matters to understand, not just fix:** `protect` checks "is there a valid login token?" and sets `req.user`. `adminOnly` checks "is `req.user.role === 'admin'`?" — but it can only run that check because `protect` ran first and set `req.user`. Order matters: `protect, adminOnly` — never the other way around, and never `adminOnly` alone.

Test it after fixing: try `POST /api/stories` with no token → you should now get `401` instead of it succeeding.

---

## Task 2 — Wire in each member's routes as they finish

Open `backend/app.js`. Right now it looks like this:

```js
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);
// app.use('/api', chapterRoutes);
// app.use('/api/progress', progressRoutes);
// app.use('/api/favorites', favoriteRoutes);
```

| Line | Owner |
|---|---|
| `userRoutes` | Member 1 |
| `chapterRoutes` | Member 2 |
| `favoriteRoutes` + `progressRoutes` | Member 3 |

As each member finishes and does their own self-check, your job is to:

1. Pull their code
2. Uncomment the matching line
3. Restart the server (`npm run dev`) and confirm it boots with no errors
4. Run the relevant section of the test plan below before telling them it's merged

**Why this file matters:** the string you pass to `app.use('/api/whatever', someRoutes)` becomes the **prefix** for every route defined inside that file. That's why `favoriteRoutes.js` can just say `router.get('/', ...)` — Express turns that into `/api/favorites` because of how it's mounted here, not because of anything inside `favoriteRoutes.js` itself.

**One mounting detail to double check:** `chapterRoutes` mounts at `/api`, **not** `/api/chapters` — because the paths inside that file already start with `/stories/:storyId/chapters`, so the final URL comes out to `/api/stories/:storyId/chapters`. Don't "fix" this to `/api/chapters` — it would break the URL shape the frontend expects.

**One ordering trap to watch for:** Express matches routes top to bottom, and `/:id`-style routes match *anything* in that spot. `storyRoutes.js` already gets this right — `/for-you` is listed before `/:id` — but if any member adds a new named route to their file, it must go before that file's `/:something` catch-all, or it'll never get hit. Check this when reviewing their routes files.

---

## Task 3 — Get real data into the database

Run the seed script to populate stories for testing:

```bash
cd backend
npm run seed
```

(If `"seed": "node src/utils/seedData.js"` isn't in `package.json` yet, add it to the `"scripts"` section.)

This clears existing stories and inserts ~10 sample manga/story entries. Once Member 2's Chapter model exists, grab a couple of real chapter numbers for one of the seeded stories so you have something to test chapter/progress endpoints against.

---

## Task 4 — End-to-end test plan

Use Thunder Client (VS Code extension) or Postman. Work through this **every time a member's feature gets wired in** — not just once at the end.

### Setup
```
POST http://localhost:5000/api/auth/register
{ "name": "Test User", "email": "test@example.com", "password": "password123" }
```
Copy the `token` from the response. Add `Authorization: Bearer <token>` to every "private" request below.

### Auth
```
POST /api/auth/register   (repeat with same email → expect 400 "already exists")
POST /api/auth/login      (wrong password → expect 401)
GET  /api/auth/me         (no token → expect 401)
```

### Stories (already built — confirm it still works after your Task 1 fix)
```
GET  /api/stories
GET  /api/stories/trending
GET  /api/stories/popular
GET  /api/stories/new-releases
GET  /api/stories/search?q=demon
GET  /api/stories/for-you        (with token)
GET  /api/stories/:id
POST /api/stories                (no token → expect 401 now; with admin token → expect 201)
```

### Users (Member 1)
```
GET  /api/users/profile
PUT  /api/users/profile     body: { "name": "New Name" }
PUT  /api/users/interests   body: { "interests": ["Romance","Fantasy","Comedy"] }
GET  /api/users/interests
```

### Chapters (Member 2)
```
GET  /api/stories/:storyId/chapters
POST /api/stories/:storyId/chapters   (admin token) body: { "number": 1, "title": "Chapter 1", "content": "..." }
GET  /api/stories/:storyId/chapters/:num   (with token)
```

### Favorites & Progress (Member 3)
```
POST   /api/favorites/:storyId
GET    /api/favorites
DELETE /api/favorites/:storyId
GET    /api/progress
POST   /api/progress   body: { "storyId": "...", "chapterNumber": 1, "progress": 30 }
GET    /api/progress/:storyId
```

### The failure paths — just as important as the happy path
For every endpoint above that requires login, confirm:
- No token → `401`
- A made-up/fake ID → `404`
- Missing required fields in the body → `400`
- (Favorites) Adding the same story twice → `400`, not a crash
- (Progress) Checking progress for a story never read → `200` with `{ chapterNumber: 1, progress: 0 }`, not an error

If a feature only ever gets tested with valid data and a valid token, its error handling is unverified — and that's usually where real bugs hide.

**To test admin-only routes:** a freshly registered user has `role: 'user'` by default. Manually set a test user's `role` to `'admin'` directly in the database to get an admin token.

---

## Task 5 — Connect the frontend

Once the backend endpoints you've tested are working, wire the frontend to them:

1. **Store the token after login/register:**
   ```js
   localStorage.setItem('token', response.token);
   ```
2. **Send it with every private request:**
   ```js
   fetch('/api/users/profile', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('token')}`,
       'Content-Type': 'application/json',
     },
   });
   ```
3. **Replace mock data** with real fetch calls, roughly:

| Frontend file | Currently uses | Replace with |
|---|---|---|
| `SignUpPage.jsx` | nothing | `POST /api/auth/register` |
| `LoginPage.jsx` | nothing | `POST /api/auth/login` |
| `InterestsPage.jsx` | client-side only | `PUT /api/users/interests` |
| `HomePage.jsx` | `src/data/home_data.js` | trending / popular / new-releases / for-you endpoints |
| `ReaderPage.jsx` | hardcoded story | `GET /api/stories/:id` + chapters endpoints |

If you hit a CORS error in the browser console, check that `app.use(cors())` in `app.js` is registered before the routes (it already is — but it's the first thing to check if this ever breaks).

---

## Final checklist

- [ ] `storyRoutes.js` — `POST /` now requires `protect, adminOnly`
- [ ] All four remaining route files uncommented in `app.js` once their owners finish
- [ ] Server boots clean with `npm run dev` — no "Cannot find module" errors
- [ ] Seed data loaded (`npm run seed`)
- [ ] Every endpoint in the test plan above tested: happy path + no-token + bad-ID + bad-data
- [ ] Frontend successfully logs in, stores a token, and loads at least one real (non-mock) list of stories
