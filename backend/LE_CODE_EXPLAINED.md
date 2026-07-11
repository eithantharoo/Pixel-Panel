# Leader Part — Explained Simply

> This covers only the files YOU (the leader) own: **Setup, Middleware, JWT, Auth.**
> Every code block below is copied straight from the real files in this repo — nothing made up.
> Goal: after reading this, you can explain each file out loud without reading from a script.

---

## 1. The Setup Files

### `server.js` — "Turn the server ON"

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

**What it does, line by line:**
- `dotenv.config()` — reads the `.env` file and loads its values into `process.env`. **Must be the very first thing that runs**, because every other file below expects `process.env.MONGO_URI`, `process.env.JWT_SECRET`, etc. to already exist.
- `require('./app')` — pulls in the actual Express app (routes, middleware). `server.js` itself has zero routes in it.
- `connectDB().then(...)` — connect to the database **first**, and only start listening for requests once that succeeds. There's no point accepting a login request if the database isn't even connected yet.

**Where is this used?** This is the file you run: `node server.js` or `npm run dev`. Nothing else calls it — it's the entry point.

---

### `app.js` — "What the server can do"

```javascript
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
// ...other route imports
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => res.json({ message: 'Story Hub API is running' }));

app.use('/api/auth', authRoutes);
// ...other route mounts

app.use(notFound);
app.use(errorHandler);

module.exports = app;
```

**What it does:**
- `express()` creates the app object — think of it as the empty restaurant before you add tables (routes).
- Everything under `app.use(...)` runs **in order, top to bottom**, for every single request. This order matters a lot (explained in the Middleware section below).
- `app.use('/api/auth', authRoutes)` — "any request starting with `/api/auth` gets handed to the `authRoutes` file." This is how one big app is split into small files per feature.
- `notFound` and `errorHandler` are registered **last on purpose** — they only catch things nothing else handled.

**Why split `server.js` and `app.js`?** So you (or a testing tool) can import `app.js` alone and send fake requests to it, without needing a real running server or a real database. Not something you'll demo live, but worth mentioning once.

---

### `.env` / `.env.example` / `.gitignore`

```
# .env (real secrets — never committed)
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=pixelpanel-storyhub
JWT_EXPIRE=30d
NODE_ENV=development
```

```
# .gitignore
node_modules/
.env
```

**Beginner explanation:** `.env` holds values that change per machine or must stay secret (database password, JWT secret key). Code never hardcodes these — it reads `process.env.MONGO_URI` instead of typing the URL directly. `.gitignore` tells Git "never upload this file," so your database password never ends up on GitHub. `.env.example` is the safe, fake-value version you DO commit, so teammates know which variables they need to create themselves.

**Where is this used?** Read once, at the very top of `server.js`. After that, any file can read `process.env.WHATEVER` anywhere.

---

### `src/config/db.js` — "Connect to the database"

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

**What it does:** One job only — connect to MongoDB using the URI from `.env`. If it fails (wrong password, MongoDB not running, no internet), it prints the error and kills the process (`process.exit(1)`) instead of letting the server run broken.

**Where is this used?** Called once, from `server.js`, before `app.listen(...)`.

---

## 2. Middleware — "Checkpoints every request passes through"

**Beginner definition:** Middleware is a function that sits *between* a request coming in and a response going out. It can look at the request, change it, block it, or just pass it along to the next thing. Picture airport security: your bag (the request) goes through several checkpoints before it reaches the plane (your controller).

```
Request → [cors] → [express.json] → [protect?] → [your route function] → Response
```

### `src/middleware/errorMiddleware.js`

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

**What each one is for:**
- `notFound` — runs when a request hits a URL that doesn't match any route (e.g., someone types `/api/bananas`). It creates an error and passes it forward with `next(error)`.
- `errorHandler` — catches **any** error from **anywhere** in the app (thrown in a controller, passed via `next(error)`, whatever) and turns it into a clean JSON response instead of crashing the server or leaking a raw stack trace to the user.

**Where is this used?** Registered in `app.js`, always **last** — `app.use(notFound); app.use(errorHandler);`. Express has a rule: an error-handling middleware is any function with **4 parameters** (`err, req, res, next`), and it only gets called when something calls `next(error)`. That's why order matters — if you put these before your routes, they'd fire on every request incorrectly.

---

### `src/middleware/authMiddleware.js`

```javascript
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
```

**What each one is for:**
- `protect` — the bouncer at the door. It reads the `Authorization: Bearer <token>` header, verifies the token is real and not expired, looks up that user in the database, and attaches it to `req.user` so every controller after it can use `req.user.id`. If there's no valid token, it blocks the request with a 401 error — the controller function never even runs.
- `adminOnly` — a second, stricter checkpoint. It assumes `protect` already ran (so `req.user` exists) and additionally checks `req.user.role === 'admin'`.

**Where is this used?** Not in `app.js` — it's applied **per route**, wherever a feature needs to be private. Examples from your own routes:
```javascript
router.get('/me', protect, getMe);                          // authRoutes.js — must be logged in
router.post('/', protect, adminOnly, createStory);           // storyRoutes.js — must be logged in AND admin
```
That's the pattern to teach members: "if your endpoint should require login, add `protect` as a middleware argument before your controller function. If it should be admin-only, add `protect, adminOnly` — in that order."

---

## 3. JWT (JSON Web Token) — "The digital hotel key card"

**Beginner analogy:** Log in once → get a key card (token). Show that key card on every door (protected route) after that. No need to re-enter your password every time.

### `src/utils/generateToken.js`

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

module.exports = generateToken;
```

**What it does:** Takes a user's database ID, and packs it into a signed token using your secret key from `.env`. `expiresIn` (30 days here) means the card stops working after that.

**Where is this used?** Called inside `authController.js`, right after a user registers or logs in successfully — the token gets sent back in the response so the frontend can store it.

### `src/utils/asyncHandler.js`

```javascript
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
```

**What it does:** A small wrapper so you don't have to write `try { ... } catch (err) { next(err) }` in every single controller function. Any error thrown inside gets automatically forwarded to `errorHandler`.

**Where is this used?** Wrapped around **every** controller function in the whole project — `protect`, `registerUser`, `getAllStories`, all of them. This is a pattern members must copy exactly for their own controllers.

---

## 4. Auth — Register / Login, tied together

### `src/controllers/authController.js`

```javascript
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
```

**Step by step, in plain English:**
1. Pull `name`, `email`, `password` out of the request body (what the frontend sent).
2. If any of them are missing, stop and send back a 400 error.
3. Check the database — does a user with this email already exist? If yes, stop, 400 error.
4. Create the user. (Note: the password gets scrambled/hashed automatically here — that happens inside `User.js`'s `pre('save')` hook, not in this file. Worth pointing out to members: "the model protects itself, the controller doesn't have to think about hashing.")
5. Send back user info **plus a token** — this is the "key card" they get for logging in immediately after registering, no separate login step needed.

```javascript
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // ...
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  res.json({ /* ...user info + new token */ });
});
```

**What's new here:** `.select('+password')` — normally the User model hides the password field (`select: false` in the schema). Login is the one place we need it, to compare it, so we explicitly ask for it back. `user.matchPassword(password)` is a method defined on the User model that uses `bcrypt.compare` under the hood.

### `src/routes/authRoutes.js`

```javascript
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
```

**What it does:** Maps URLs to the controller functions above. Notice `/me` has `protect` in front — that's the only one of the three that requires a token, because it needs to know *who* is asking.

---

## The Pattern to Hand Off

Every feature in this codebase — including the ones members are about to write — follows the same shape:

```
Model    → what the data looks like (fields, validation, hooks)
Controller → get data from req → talk to DB → send res
Routes   → map a URL + HTTP method to a controller function, add protect/adminOnly if needed
```

You've just walked through exactly that shape for **Auth**. When you cover **Stories** next, point out it's the *identical* shape — just a different feature. That repetition is the whole lesson.
