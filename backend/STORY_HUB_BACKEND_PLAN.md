# Story Hub — Backend Implementation Plan

> **Reference:** See `BACKEND_GUIDE.md` for all concept explanations. This document is the Story Hub-specific plan — it assumes you have already read that guide.

---

## What We Are Building

Story Hub is a manga/story reading platform. The frontend is complete — all screens are built. Our job is to **build the backend that powers every feature** the frontend shows.

### Frontend → Backend Mapping

| What the User Sees (Frontend) | What the Backend Must Do |
|---|---|
| Sign Up form | Save user to database, return token |
| Login form | Check password, return token |
| Interests page (pick genres) | Save chosen genres to user's profile |
| Home page — "For You" | Return stories filtered by user's interests |
| Home page — "Newly Released" | Return stories sorted by date |
| Home page — "Popular" | Return stories sorted by rating |
| Home page — "Trending" | Return top-ranked stories |
| Continue Reading bar | Return user's unfinished stories with progress |
| Reader page — story info | Return one story's details |
| Reader page — chapters list | Return all chapters for a story |
| Add to Favorites button | Save story to user's favorites |
| Search input | Search stories by title or genre |

---

## Team Division

| Person | Role | Domains |
|---|---|---|
| **Leader (You)** | Framework + Security | Setup, Middleware, JWT, Auth |
| **Member 1** | User Features | User profile, Interests, Favorites |
| **Member 2** | Content Features | Stories, Search, Trending |
| **Member 3** | Reading Features | Chapters, Reading Progress |

**Everyone follows the same 3-step pattern:**
```
Step 1: Write the Model       (data shape)
Step 2: Write the Controller  (business logic)
Step 3: Write the Routes      (URL mapping)
Step 4: Test with Thunder Client
```

---

## Final Folder Structure

```
backend/
│
├── src/
│   ├── config/
│   │   └── db.js                     [LEADER]
│   │
│   ├── models/
│   │   ├── User.js                   [MEMBER 1]
│   │   ├── Story.js                  [MEMBER 2]
│   │   ├── Chapter.js                [MEMBER 3]
│   │   ├── ReadingProgress.js        [MEMBER 3]
│   │   └── Favorite.js               [MEMBER 1]
│   │
│   ├── controllers/
│   │   ├── authController.js         [LEADER]
│   │   ├── userController.js         [MEMBER 1]
│   │   ├── storyController.js        [MEMBER 2]
│   │   ├── chapterController.js      [MEMBER 3]
│   │   ├── progressController.js     [MEMBER 3]
│   │   └── favoriteController.js     [MEMBER 1]
│   │
│   ├── routes/
│   │   ├── authRoutes.js             [LEADER]
│   │   ├── userRoutes.js             [MEMBER 1]
│   │   ├── storyRoutes.js            [MEMBER 2]
│   │   ├── chapterRoutes.js          [MEMBER 3]
│   │   ├── progressRoutes.js         [MEMBER 3]
│   │   └── favoriteRoutes.js         [MEMBER 1]
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js         [LEADER]
│   │   └── errorMiddleware.js        [LEADER]
│   │
│   └── utils/
│       ├── generateToken.js          [LEADER]
│       ├── asyncHandler.js           [LEADER]
│       └── seedData.js               [LEADER — for test data]
│
├── .env                              [LEADER]
├── .env.example                      [LEADER]
├── .gitignore                        [LEADER]
├── app.js                            [LEADER]
├── server.js                         [LEADER]
└── package.json                      [LEADER]
```

---

## Complete API Endpoints Reference

### Auth Routes (Leader)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | Private |

### User Routes (Member 1)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/users/profile` | Get user profile | Private |
| PUT | `/api/users/profile` | Update profile | Private |
| GET | `/api/users/interests` | Get user interests | Private |
| PUT | `/api/users/interests` | Save user interests | Private |

### Story Routes (Member 2)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/stories` | Get all stories | Public |
| GET | `/api/stories/trending` | Get trending stories | Public |
| GET | `/api/stories/for-you` | Get personalized stories | Private |
| GET | `/api/stories/new-releases` | Get newest stories | Public |
| GET | `/api/stories/popular` | Get popular stories | Public |
| GET | `/api/stories/search` | Search stories | Public |
| GET | `/api/stories/:id` | Get one story | Public |
| POST | `/api/stories` | Create story | Private/Admin |
| PUT | `/api/stories/:id` | Update story | Private/Admin |
| DELETE | `/api/stories/:id` | Delete story | Private/Admin |

### Chapter Routes (Member 3)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/stories/:storyId/chapters` | Get all chapters | Public |
| GET | `/api/stories/:storyId/chapters/:num` | Get one chapter | Private |
| POST | `/api/stories/:storyId/chapters` | Add chapter | Private/Admin |

### Reading Progress Routes (Member 3)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/progress` | Get continue reading list | Private |
| POST | `/api/progress` | Save reading progress | Private |
| GET | `/api/progress/:storyId` | Get progress for one story | Private |

### Favorites Routes (Member 1)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/favorites` | Get user's favorites | Private |
| POST | `/api/favorites/:storyId` | Add to favorites | Private |
| DELETE | `/api/favorites/:storyId` | Remove from favorites | Private |

---

# Phase 1 — Foundation (Leader Only)

> Members wait here. The leader completes Phase 1 before anyone writes code.

**Estimated time: 30-45 minutes**

## Step 1.1 — Initialize Project

```bash
cd backend
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken express-validator cors
npm install --save-dev nodemon
```

## Step 1.2 — Create `.gitignore`

```
node_modules/
.env
```

## Step 1.3 — Create `.env`

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/storyhub
JWT_SECRET=storyhub_super_secret_key_2024_change_this
JWT_EXPIRE=30d
NODE_ENV=development
```

## Step 1.4 — Create `package.json` scripts

Add to the `"scripts"` section:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

## Step 1.5 — Create folder structure

```bash
mkdir -p src/config src/models src/controllers src/routes src/middleware src/utils
```

## Step 1.6 — Create all Leader files

The Leader creates all the files listed in `[LEADER]` column above. All code for these files is in Section: **Leader Code Reference** at the bottom of this document.

After the leader finishes, they commit and team members pull the code. **Only then** do members start Phase 2.

---

# Phase 2 — Database Models (All Members — Parallel)

> All three members work on this at the same time after pulling Leader's Phase 1 code.

**Estimated time: 20-30 minutes per member**

## What a Model Is

A Model = the shape of your data in the database. Think of it as a form with required fields.

Before writing your model, ask: **"What information do I need to store?"**

---

## Member 1 — Models: User + Favorite

### User Model — `src/models/User.js`

Ask yourself:
- What info does a user have? → name, email, password
- Does a user have a profile picture? → avatar
- Does a user have preferences? → interests (array of genres)
- Do we need to know when they joined? → timestamps

**Field-by-field review with your mentor before coding**

Fields to implement:
```
name       → String, required, max 50 chars
email      → String, required, unique, lowercase, must be valid email format
password   → String, required, min 6 chars, never returned in queries (select: false)
avatar     → String, optional (URL to profile picture)
interests  → Array of Strings, each must be one of the valid genres
role       → String, either 'user' or 'admin', default 'user'
isActive   → Boolean, default true
timestamps → automatic createdAt + updatedAt
```

**Pre-save hook:** Hash password before saving (use bcryptjs)

**Instance method:** `matchPassword(enteredPassword)` — compare passwords

**Valid interests list:**
```javascript
['Romance', 'Mystery', 'Comedy', 'Fantasy', 'Horror', 'Sci-Fi', 'Slice of Life', 'Historical', 'Adventure', 'Drama', 'Thriller']
```

---

### Favorite Model — `src/models/Favorite.js`

A favorite is just: **"This user saved this story."**

Fields:
```
user   → ObjectId, ref: 'User', required
story  → ObjectId, ref: 'Story', required
```

Special rule: A user can only favorite the same story ONCE.
```javascript
// Add this to schema options to enforce uniqueness:
{ unique: true }  // on a compound index
```

How to add a compound unique index:
```javascript
favoriteSchema.index({ user: 1, story: 1 }, { unique: true });
```

---

## Member 2 — Model: Story

### Story Model — `src/models/Story.js`

A story is the main content. In manga terms, it's the manga itself (not the chapters).

Ask yourself:
- What does a manga/story have? → title, description, cover image, author
- How do we categorize it? → genres (array)
- How do we show it as popular? → rating, ratingCount
- Is it still being published? → status
- Who created it (admin)? → createdBy

Fields:
```
title        → String, required, trimmed
description  → String, required
cover        → String (URL), required
author       → String, required
genres       → Array of Strings, each from valid genre list, min 1 genre required
status       → String, one of: 'ongoing', 'completed', 'hiatus', default 'ongoing'
rating       → Number, min 0, max 10, default 0
ratingCount  → Number, default 0
totalChapters→ Number, default 0
views        → Number, default 0
isFeatured   → Boolean, default false
createdBy    → ObjectId, ref: 'User'
timestamps   → automatic
```

**Add a virtual field** to compute the trending score (views + rating * 100):
```javascript
storySchema.virtual('trendingScore').get(function () {
  return this.views + this.rating * 100;
});
```

---

## Member 3 — Models: Chapter + ReadingProgress

### Chapter Model — `src/models/Chapter.js`

A chapter belongs to ONE story. A story has MANY chapters.

Fields:
```
story        → ObjectId, ref: 'Story', required
number       → Number, required (chapter number: 1, 2, 3...)
title        → String, required (e.g., "Chapter 1: The Beginning")
content      → String (the text content) OR pages (array of image URLs)
pages        → Array of Strings (image URLs)
isPublished  → Boolean, default true
publishedAt  → Date, default Date.now
timestamps   → automatic
```

Compound unique rule: A story cannot have two chapters with the same number:
```javascript
chapterSchema.index({ story: 1, number: 1 }, { unique: true });
```

---

### ReadingProgress Model — `src/models/ReadingProgress.js`

This tracks where a user stopped reading. It powers the "Continue Reading" section.

Fields:
```
user           → ObjectId, ref: 'User', required
story          → ObjectId, ref: 'Story', required
chapterNumber  → Number, required, default 1
progress       → Number (0–100 percentage), default 0
lastReadAt     → Date, default Date.now
timestamps     → automatic
```

Compound unique rule: One progress record per user per story:
```javascript
progressSchema.index({ user: 1, story: 1 }, { unique: true });
```

---

# Phase 3 — Controllers (All Members — Parallel)

> Start after models are done and reviewed by the mentor.

**Estimated time: 45-60 minutes per member**

## What a Controller Is

A controller is a function that:
1. Receives `req` (what the user sent)
2. Talks to the database
3. Sends back `res` (what the user gets)

**Every controller follows this shape:**
```javascript
const myController = asyncHandler(async (req, res) => {
  // 1. Get data from req.body, req.params, req.user
  // 2. Query the database
  // 3. Handle "not found" case
  // 4. Send response
});
```

---

## Member 1 — Controllers: User + Favorite

### `src/controllers/userController.js`

Functions to write:

#### `getProfile`
- Who calls it: Logged-in user hitting GET `/api/users/profile`
- What it does: Return the current user's data
- How to get current user: It's on `req.user` (set by authMiddleware)
- What to return: User object without password
- Status: 200

#### `updateProfile`
- Who calls it: Logged-in user hitting PUT `/api/users/profile`
- What it does: Update name, email, or avatar
- From `req.body`: `{ name, email, avatar }`
- Rules: Find user by `req.user.id`, update only the fields that were sent
- If new password in body → update password (the pre-save hook will hash it)
- What to return: Updated user object
- Status: 200

#### `getUserInterests`
- Who calls it: Logged-in user hitting GET `/api/users/interests`
- What it does: Return just the `interests` array from the user
- What to return: `{ interests: [...] }`
- Status: 200

#### `saveUserInterests`
- Who calls it: Logged-in user hitting PUT `/api/users/interests`
- What it does: Replace the user's interests array
- From `req.body`: `{ interests: ['Romance', 'Fantasy', ...] }`
- Validation: At least 3 interests required
- What to return: `{ message: 'Interests saved', interests: [...] }`
- Status: 200

---

### `src/controllers/favoriteController.js`

Functions to write:

#### `getFavorites`
- Return all favorites for the logged-in user
- Use `.populate('story')` to get full story data instead of just the ID
- Status: 200

#### `addFavorite`
- From `req.params`: `storyId`
- Check if story exists first (use Story model)
- If story not found → 404 error
- Try to create a new Favorite document
- If it already exists (duplicate) → return 400 "Already in favorites"
- Status: 201

#### `removeFavorite`
- From `req.params`: `storyId`
- Find and delete the Favorite where `user = req.user.id` AND `story = storyId`
- If not found → 404 "Not in favorites"
- Status: 200

---

## Member 2 — Controller: Story

### `src/controllers/storyController.js`

Functions to write:

#### `getAllStories`
- Returns paginated list of stories
- Query params: `?page=1&limit=10&genre=Fantasy&status=ongoing`
- Build a filter object from query params
- Use `.skip()` and `.limit()` for pagination
- Status: 200

#### `getStoryById`
- From `req.params`: `id`
- Find story by ID, increment views by 1 on each visit
- If not found → 404
- Status: 200

#### `getTrendingStories`
- Return top 4 stories sorted by views (descending)
- Limit to 4
- Status: 200

#### `getForYou`
- This is the personalized feed — requires auth
- Get `req.user.interests` (the logged-in user's genres)
- Find stories where `genres` array contains any of user's interests
- If user has no interests → fall back to popular stories
- Limit to 10
- Status: 200

#### `getNewReleases`
- Sort by `createdAt` descending, limit 10
- Status: 200

#### `getPopularStories`
- Sort by `rating` descending, limit 10
- Status: 200

#### `searchStories`
- From `req.query`: `?q=demon+slayer`
- Use MongoDB `$regex` to search title and description
- Case-insensitive search
- Status: 200

#### `createStory` (Admin only — Leader will protect this route)
- From `req.body`: all story fields
- Set `createdBy` to `req.user.id`
- Status: 201

#### `updateStory` (Admin only)
- From `req.params`: `id`
- Update only provided fields
- Status: 200

#### `deleteStory` (Admin only)
- From `req.params`: `id`
- Delete the story
- Also delete all related chapters and progress records
- Status: 200

---

## Member 3 — Controllers: Chapter + Progress

### `src/controllers/chapterController.js`

Functions to write:

#### `getChapters`
- From `req.params`: `storyId`
- Find all chapters for that story
- Sort by `number` ascending
- Return list of chapters (without full content — just number, title, publishedAt)
- Status: 200

#### `getChapter`
- From `req.params`: `storyId` and `num` (chapter number)
- Find the specific chapter
- Return full chapter with content/pages
- Auto-update reading progress (call progress update logic here or import progressController)
- Status: 200

#### `createChapter` (Admin only)
- From `req.body`: chapter data
- Set `story` to `req.params.storyId`
- After creating, update the parent Story's `totalChapters` count
- Status: 201

---

### `src/controllers/progressController.js`

Functions to write:

#### `getContinueReading`
- Return reading progress records for the logged-in user
- Only include unfinished stories (progress < 100)
- Populate the `story` field with full story data
- Sort by `lastReadAt` descending (most recently read first)
- Limit to 5
- Status: 200

#### `saveProgress`
- From `req.body`: `{ storyId, chapterNumber, progress }`
- Use `findOneAndUpdate` with `upsert: true`
  - Upsert = update if exists, create if not (perfect for progress tracking)
- Always update `lastReadAt` to `Date.now()`
- Status: 200

#### `getProgressForStory`
- From `req.params`: `storyId`
- Return the progress record for the logged-in user for this story
- If no record → return `{ chapterNumber: 1, progress: 0 }` (start from beginning)
- Status: 200

---

# Phase 4 — Routes (All Members — Parallel)

> Start after controllers are done.

**Estimated time: 15-20 minutes per member**

## What a Route File Does

- Imports the controller functions
- Maps HTTP methods + paths to those functions
- Adds middleware (like `protect`) where needed

## Member 1 — Routes

### `src/routes/userRoutes.js`
```
All routes require: protect middleware
GET  /profile         → userController.getProfile
PUT  /profile         → userController.updateProfile
GET  /interests       → userController.getUserInterests
PUT  /interests       → userController.saveUserInterests
```

### `src/routes/favoriteRoutes.js`
```
All routes require: protect middleware
GET    /              → favoriteController.getFavorites
POST   /:storyId      → favoriteController.addFavorite
DELETE /:storyId      → favoriteController.removeFavorite
```

## Member 2 — Routes

### `src/routes/storyRoutes.js`
```
Public routes (no middleware):
GET  /                → storyController.getAllStories
GET  /trending        → storyController.getTrendingStories
GET  /new-releases    → storyController.getNewReleases
GET  /popular         → storyController.getPopularStories
GET  /search          → storyController.searchStories
GET  /:id             → storyController.getStoryById

Private routes (require: protect):
GET  /for-you         → storyController.getForYou

Admin routes (require: protect + adminOnly):
POST   /              → storyController.createStory
PUT    /:id           → storyController.updateStory
DELETE /:id           → storyController.deleteStory
```

**Note for Member 2:** The `/for-you` route must come BEFORE `/:id` in the file. Express matches routes top to bottom, so `/:id` would wrongly catch `/for-you` if placed first.

## Member 3 — Routes

### `src/routes/chapterRoutes.js`
```
Public routes:
GET  /stories/:storyId/chapters       → chapterController.getChapters

Private routes (require: protect):
GET  /stories/:storyId/chapters/:num  → chapterController.getChapter

Admin routes (require: protect + adminOnly):
POST /stories/:storyId/chapters       → chapterController.createChapter
```

### `src/routes/progressRoutes.js`
```
All routes require: protect middleware
GET  /                → progressController.getContinueReading
POST /                → progressController.saveProgress
GET  /:storyId        → progressController.getProgressForStory
```

---

# Phase 5 — Testing Checklist

> All members test their own endpoints after Phase 4.

## Register and get a token first

```
POST http://localhost:5000/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
→ Copy the token from response
```

## Member 1 Tests

```
GET    /api/users/profile          (with token)
PUT    /api/users/profile          (with token, body: { "name": "New Name" })
PUT    /api/users/interests        (with token, body: { "interests": ["Romance","Fantasy","Comedy"] })
GET    /api/users/interests        (with token)
POST   /api/favorites/:storyId     (with token)
GET    /api/favorites              (with token)
DELETE /api/favorites/:storyId     (with token)
```

## Member 2 Tests

```
GET  /api/stories                              (no token needed)
GET  /api/stories/trending                     (no token needed)
GET  /api/stories/popular                      (no token needed)
GET  /api/stories/new-releases                 (no token needed)
GET  /api/stories/search?q=demon               (no token needed)
GET  /api/stories/for-you                      (WITH token)
GET  /api/stories/:id                          (no token needed)
POST /api/stories (need admin role)
```

## Member 3 Tests

```
GET  /api/stories/:storyId/chapters            (no token)
GET  /api/stories/:storyId/chapters/1          (WITH token)
GET  /api/progress                             (WITH token)
POST /api/progress   (body: { storyId, chapterNumber: 1, progress: 30 })
GET  /api/progress/:storyId                    (WITH token)
```

---

# Phase 6 — Connecting to the Frontend

> After all phases pass testing, the leader guides integration.

## What the Frontend Needs to Do

1. **Store the JWT token** after login/register
```javascript
// In browser's localStorage
localStorage.setItem('token', response.token);
```

2. **Send token with every protected request**
```javascript
const token = localStorage.getItem('token');
fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

3. **Replace mock data with real API calls** in each page

### Frontend File → API Endpoint Mapping

| Frontend File | Mock Data Location | Replace With |
|---|---|---|
| `SignUpPage.jsx` | No API call | `POST /api/auth/register` |
| `LoginPage.jsx` | No API call | `POST /api/auth/login` |
| `InterestsPage.jsx` | Client-side only | `PUT /api/users/interests` |
| `HomePage.jsx` | `src/data/home_data.js` | Multiple story endpoints |
| `ReaderPage.jsx` | Hardcoded story | `GET /api/stories/:id` + chapters |

---

# Leader Code Reference

> Complete code for all Leader files. Members do NOT edit these files.

## `server.js`

```javascript
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Story Hub] Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
```

## `app.js`

```javascript
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const storyRoutes = require('./src/routes/storyRoutes');
const chapterRoutes = require('./src/routes/chapterRoutes');
const progressRoutes = require('./src/routes/progressRoutes');
const favoriteRoutes = require('./src/routes/favoriteRoutes');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.json({ message: 'Story Hub API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api', chapterRoutes);       // /api/stories/:storyId/chapters
app.use('/api/progress', progressRoutes);
app.use('/api/favorites', favoriteRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
```

## `src/config/db.js`

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## `src/utils/asyncHandler.js`

```javascript
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
```

## `src/utils/generateToken.js`

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

module.exports = generateToken;
```

## `src/middleware/authMiddleware.js`

```javascript
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    return next();
  }
  res.status(401);
  throw new Error('Not authorized, no token');
});

const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403);
  throw new Error('Access denied: Admins only');
};

module.exports = { protect, adminOnly };
```

## `src/middleware/errorMiddleware.js`

```javascript
const notFound = (req, res, next) => {
  const error = new Error(`Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
```

## `src/controllers/authController.js`

```javascript
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    interests: user.interests,
    token: generateToken(user._id),
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    interests: user.interests,
    token: generateToken(user._id),
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

module.exports = { registerUser, loginUser, getMe };
```

## `src/routes/authRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
```

---

# Member Code Reference

> Complete code for all member files.

## MEMBER 1 Code — `src/models/User.js`

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const VALID_INTERESTS = [
  'Romance', 'Mystery', 'Comedy', 'Fantasy', 'Horror',
  'Sci-Fi', 'Slice of Life', 'Historical', 'Adventure', 'Drama', 'Thriller',
];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    interests: {
      type: [String],
      enum: VALID_INTERESTS,
      default: [],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

## MEMBER 1 Code — `src/models/Favorite.js`

```javascript
const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
    },
  },
  { timestamps: true }
);

favoriteSchema.index({ user: 1, story: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
```

## MEMBER 1 Code — `src/controllers/userController.js`

```javascript
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const VALID_INTERESTS = [
  'Romance', 'Mystery', 'Comedy', 'Fantasy', 'Horror',
  'Sci-Fi', 'Slice of Life', 'Historical', 'Adventure', 'Drama', 'Thriller',
];

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('+password');

  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  if (req.body.avatar) user.avatar = req.body.avatar;
  if (req.body.password) user.password = req.body.password;

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    avatar: updatedUser.avatar,
    interests: updatedUser.interests,
  });
});

const getUserInterests = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('interests');
  res.json({ interests: user.interests });
});

const saveUserInterests = asyncHandler(async (req, res) => {
  const { interests } = req.body;

  if (!Array.isArray(interests) || interests.length < 3) {
    res.status(400);
    throw new Error('Please select at least 3 interests');
  }

  const invalid = interests.filter((i) => !VALID_INTERESTS.includes(i));
  if (invalid.length > 0) {
    res.status(400);
    throw new Error(`Invalid interests: ${invalid.join(', ')}`);
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { interests },
    { new: true, runValidators: true }
  );

  res.json({ message: 'Interests saved successfully', interests: user.interests });
});

module.exports = { getProfile, updateProfile, getUserInterests, saveUserInterests };
```

## MEMBER 1 Code — `src/controllers/favoriteController.js`

```javascript
const asyncHandler = require('../utils/asyncHandler');
const Favorite = require('../models/Favorite');
const Story = require('../models/Story');

const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user.id })
    .populate('story')
    .sort('-createdAt');
  res.json(favorites);
});

const addFavorite = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.storyId);
  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  try {
    const favorite = await Favorite.create({
      user: req.user.id,
      story: req.params.storyId,
    });
    res.status(201).json({ message: 'Added to favorites', favorite });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      throw new Error('Story is already in your favorites');
    }
    throw error;
  }
});

const removeFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOneAndDelete({
    user: req.user.id,
    story: req.params.storyId,
  });

  if (!favorite) {
    res.status(404);
    throw new Error('Story is not in your favorites');
  }

  res.json({ message: 'Removed from favorites' });
});

module.exports = { getFavorites, addFavorite, removeFavorite };
```

## MEMBER 1 Code — `src/routes/userRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getUserInterests, saveUserInterests } =
  require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/interests', getUserInterests);
router.put('/interests', saveUserInterests);

module.exports = router;
```

## MEMBER 1 Code — `src/routes/favoriteRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } =
  require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getFavorites);
router.post('/:storyId', addFavorite);
router.delete('/:storyId', removeFavorite);

module.exports = router;
```

---

## MEMBER 2 Code — `src/models/Story.js`

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
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    cover: {
      type: String,
      required: [true, 'Cover image URL is required'],
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
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
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    totalChapters: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
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

## MEMBER 2 Code — `src/controllers/storyController.js`

```javascript
const asyncHandler = require('../utils/asyncHandler');
const Story = require('../models/Story');

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

const getTrendingStories = asyncHandler(async (req, res) => {
  const stories = await Story.find().sort('-views -rating').limit(4);
  res.json(stories);
});

const getForYou = asyncHandler(async (req, res) => {
  const { interests } = req.user;

  let stories;
  if (interests && interests.length > 0) {
    stories = await Story.find({ genres: { $in: interests } })
      .sort('-rating')
      .limit(10);
  } else {
    stories = await Story.find().sort('-rating').limit(10);
  }

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

const searchStories = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
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

const createStory = asyncHandler(async (req, res) => {
  const story = await Story.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json(story);
});

const updateStory = asyncHandler(async (req, res) => {
  const story = await Story.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }
  res.json(story);
});

const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }
  await story.deleteOne();
  res.json({ message: 'Story deleted successfully' });
});

module.exports = {
  getAllStories,
  getStoryById,
  getTrendingStories,
  getForYou,
  getNewReleases,
  getPopularStories,
  searchStories,
  createStory,
  updateStory,
  deleteStory,
};
```

## MEMBER 2 Code — `src/routes/storyRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const {
  getAllStories, getStoryById, getTrendingStories, getForYou,
  getNewReleases, getPopularStories, searchStories,
  createStory, updateStory, deleteStory,
} = require('../controllers/storyController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

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

---

## MEMBER 3 Code — `src/models/Chapter.js`

```javascript
const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema(
  {
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
    },
    number: {
      type: Number,
      required: [true, 'Chapter number is required'],
    },
    title: {
      type: String,
      required: [true, 'Chapter title is required'],
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    pages: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

chapterSchema.index({ story: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('Chapter', chapterSchema);
```

## MEMBER 3 Code — `src/models/ReadingProgress.js`

```javascript
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
    },
    chapterNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, story: 1 }, { unique: true });

module.exports = mongoose.model('ReadingProgress', progressSchema);
```

## MEMBER 3 Code — `src/controllers/chapterController.js`

```javascript
const asyncHandler = require('../utils/asyncHandler');
const Chapter = require('../models/Chapter');
const Story = require('../models/Story');

const getChapters = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.storyId);
  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  const chapters = await Chapter.find({
    story: req.params.storyId,
    isPublished: true,
  })
    .select('number title publishedAt')
    .sort('number');

  res.json(chapters);
});

const getChapter = asyncHandler(async (req, res) => {
  const chapter = await Chapter.findOne({
    story: req.params.storyId,
    number: req.params.num,
    isPublished: true,
  });

  if (!chapter) {
    res.status(404);
    throw new Error('Chapter not found');
  }

  res.json(chapter);
});

const createChapter = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.storyId);
  if (!story) {
    res.status(404);
    throw new Error('Story not found');
  }

  const chapter = await Chapter.create({
    ...req.body,
    story: req.params.storyId,
  });

  // Keep story's totalChapters count up to date
  await Story.findByIdAndUpdate(req.params.storyId, {
    $inc: { totalChapters: 1 },
  });

  res.status(201).json(chapter);
});

module.exports = { getChapters, getChapter, createChapter };
```

## MEMBER 3 Code — `src/controllers/progressController.js`

```javascript
const asyncHandler = require('../utils/asyncHandler');
const ReadingProgress = require('../models/ReadingProgress');

const getContinueReading = asyncHandler(async (req, res) => {
  const progressList = await ReadingProgress.find({
    user: req.user.id,
    progress: { $lt: 100 },
  })
    .populate('story')
    .sort('-lastReadAt')
    .limit(5);

  res.json(progressList);
});

const saveProgress = asyncHandler(async (req, res) => {
  const { storyId, chapterNumber, progress } = req.body;

  if (!storyId || chapterNumber === undefined || progress === undefined) {
    res.status(400);
    throw new Error('storyId, chapterNumber, and progress are required');
  }

  const record = await ReadingProgress.findOneAndUpdate(
    { user: req.user.id, story: storyId },
    {
      chapterNumber,
      progress,
      lastReadAt: Date.now(),
    },
    { upsert: true, new: true }
  );

  res.json({ message: 'Progress saved', record });
});

const getProgressForStory = asyncHandler(async (req, res) => {
  const record = await ReadingProgress.findOne({
    user: req.user.id,
    story: req.params.storyId,
  });

  if (!record) {
    return res.json({ chapterNumber: 1, progress: 0 });
  }

  res.json(record);
});

module.exports = { getContinueReading, saveProgress, getProgressForStory };
```

## MEMBER 3 Code — `src/routes/chapterRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const { getChapters, getChapter, createChapter } =
  require('../controllers/chapterController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stories/:storyId/chapters', getChapters);
router.get('/stories/:storyId/chapters/:num', protect, getChapter);
router.post('/stories/:storyId/chapters', protect, adminOnly, createChapter);

module.exports = router;
```

## MEMBER 3 Code — `src/routes/progressRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const { getContinueReading, saveProgress, getProgressForStory } =
  require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getContinueReading);
router.post('/', saveProgress);
router.get('/:storyId', getProgressForStory);

module.exports = router;
```

---

## Seed Data — `src/utils/seedData.js`

> Run this once to populate the database with test stories.

```javascript
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const Story = require('../models/Story');
const connectDB = require('../config/db');

const stories = [
  {
    title: 'Demon Slayer',
    description: 'A young boy becomes a demon slayer after his family is slaughtered by demons.',
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
    description: 'The weakest hunter must become the strongest to survive.',
    cover: '/images/solo_leveling.jpg',
    author: 'Chugong',
    genres: ['Fantasy', 'Adventure'],
    status: 'completed',
    rating: 9.1,
    ratingCount: 12000,
    views: 220000,
  },
  {
    title: 'Attack on Titan',
    description: 'Humanity fights for survival against giant humanoid Titans.',
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
    description: 'Monkey D. Luffy sets out to find the legendary One Piece treasure.',
    cover: '/images/one_piece.jpg',
    author: 'Eiichiro Oda',
    genres: ['Adventure', 'Comedy', 'Fantasy'],
    status: 'ongoing',
    rating: 9.4,
    ratingCount: 25000,
    views: 400000,
  },
  {
    title: 'Spy x Family',
    description: 'A spy builds a fake family but everyone has a secret.',
    cover: '/images/spy_family.jpg',
    author: 'Tatsuya Endo',
    genres: ['Comedy', 'Slice of Life', 'Drama'],
    status: 'ongoing',
    rating: 8.8,
    ratingCount: 8000,
    views: 150000,
  },
  {
    title: 'Jujutsu Kaisen',
    description: 'A boy swallows a cursed object and joins a school of jujutsu sorcerers.',
    cover: '/images/jjk.jpg',
    author: 'Gege Akutami',
    genres: ['Fantasy', 'Horror', 'Adventure'],
    status: 'ongoing',
    rating: 9.0,
    ratingCount: 11000,
    views: 200000,
  },
  {
    title: 'Your Lie in April',
    description: 'A pianist who lost his ability to hear music meets a violin prodigy.',
    cover: '/images/your_lie.jpg',
    author: 'Naoshi Arakawa',
    genres: ['Romance', 'Drama', 'Slice of Life'],
    status: 'completed',
    rating: 9.2,
    ratingCount: 7500,
    views: 130000,
  },
  {
    title: 'Black Clover',
    description: 'A boy born without magic aims to become the Wizard King.',
    cover: '/images/black_clover.jpg',
    author: 'Yuki Tabata',
    genres: ['Fantasy', 'Adventure', 'Comedy'],
    status: 'ongoing',
    rating: 8.5,
    ratingCount: 9000,
    views: 170000,
  },
];

const seedDatabase = async () => {
  await connectDB();

  await Story.deleteMany({});
  console.log('Old stories cleared');

  await Story.insertMany(stories);
  console.log(`${stories.length} stories seeded successfully`);

  process.exit(0);
};

seedDatabase();
```

Add to `package.json` scripts:
```json
"seed": "node src/utils/seedData.js"
```

Run with:
```bash
npm run seed
```

---

## Quick Reference Card (Print This)

```
STORY HUB BACKEND — QUICK REFERENCE

Auth:
  POST   /api/auth/register   →  body: { name, email, password }
  POST   /api/auth/login      →  body: { email, password }
  GET    /api/auth/me         →  header: Bearer <token>

User:
  GET    /api/users/profile   →  header: Bearer <token>
  PUT    /api/users/profile   →  header + body: { name?, email?, avatar? }
  GET    /api/users/interests →  header: Bearer <token>
  PUT    /api/users/interests →  header + body: { interests: [...] }

Stories:
  GET    /api/stories                    →  public
  GET    /api/stories/trending           →  public
  GET    /api/stories/popular            →  public
  GET    /api/stories/new-releases       →  public
  GET    /api/stories/search?q=keyword   →  public
  GET    /api/stories/for-you            →  Bearer token required
  GET    /api/stories/:id                →  public

Chapters:
  GET    /api/stories/:id/chapters       →  public
  GET    /api/stories/:id/chapters/:num  →  Bearer token required

Progress:
  GET    /api/progress                   →  Bearer token required
  POST   /api/progress                   →  body: { storyId, chapterNumber, progress }
  GET    /api/progress/:storyId          →  Bearer token required

Favorites:
  GET    /api/favorites                  →  Bearer token required
  POST   /api/favorites/:storyId         →  Bearer token required
  DELETE /api/favorites/:storyId         →  Bearer token required
```
