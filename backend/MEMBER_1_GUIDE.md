# Member 1 Guide — User Profile

> Read `BACKEND_GUIDE.md` first if you haven't already (it explains what a Model/Controller/Route even is). This file is just **your assignment**, step by step.
>
> Reference example to copy the *pattern* from (not the code): `src/models/Story.js` and `src/controllers/storyController.js` are already done and working — open them side by side while you work.

---

## What you own

You're building everything about "the logged-in user's own account":

| File | Status |
|---|---|
| `src/models/User.js` | empty — you write this |
| `src/controllers/userController.js` | empty — you write this |
| `src/routes/userRoutes.js` | empty — you write this |

**Important:** `authController.js` and `authMiddleware.js` are already done (by someone else) and both `require('../models/User')`. That means **the app is currently broken** until you create `User.js` — registration and login can't work without it. You're unblocking the whole app, not just adding a feature. This is the highest-priority piece of remaining work.

Build in this order: **Model → Controller → Routes → hand off to the leader for wiring and testing.**

---

## Step 1 — `src/models/User.js`

Ask yourself these questions before typing anything:

1. What does a user absolutely need? → `name`, `email`, `password`
2. What's optional / has a default? → `avatar`, `role`, `isActive`
3. What has extra rules beyond "it's a string"? → `email` must be unique + valid format, `password` must be at least 6 characters and never come back in a normal query, `interests` must only contain values from the genre list

Field spec:

```
name       String, required, trim, max 50 chars
email      String, required, unique, lowercase, trim, must match an email pattern
password   String, required, min 6 chars, select: false   ← hidden from normal queries
avatar     String, optional, default ''
interests  [String], must be from the valid genre list below, default []
role       String, enum: ['user', 'admin'], default 'user'
isActive   Boolean, default true
timestamps: true
```

Valid genres (copy this exact list — Story uses the same one):
```js
['Romance', 'Mystery', 'Comedy', 'Fantasy', 'Horror', 'Sci-Fi', 'Slice of Life', 'Historical', 'Adventure', 'Drama', 'Thriller']
```

**Two things User needs that Story didn't:**

1. **`select: false` on password** — means `User.find()` never returns it unless you explicitly ask with `.select('+password')` (the login controller already does this).
2. **A pre-save hook to hash the password**, using `bcryptjs` (already installed):

```js
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // don't re-hash on every unrelated save
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

3. **An instance method to check a password on login:**

```js
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

Don't forget `module.exports = mongoose.model('User', userSchema);` at the bottom.

**Checklist before moving on:**
- [ ] Every field has a `type`
- [ ] `password` has `select: false`
- [ ] Pre-save hook + `matchPassword` method added
- [ ] Ends with `module.exports = mongoose.model('User', userSchema);`

---

## Step 2 — `src/controllers/userController.js`

Every controller function in this codebase follows this shape (look at `storyController.js` for real examples):

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
| `getProfile` | Return `req.user` (already loaded by the `protect` middleware). No `:id` param — a user can only see their own profile. Status 200. |
| `updateProfile` | Read `req.user.id`, load the user, update **only the fields actually sent** (`if (req.body.name) user.name = req.body.name`, etc. — don't blindly overwrite with `undefined`). If `req.body.password` is sent, set it too (the pre-save hook re-hashes it). Call `user.save()` — **not** `findByIdAndUpdate`, because only `.save()` triggers the pre-save hook. Return the updated user (without password). Status 200. |
| `getUserInterests` | Return `{ interests: user.interests }` — just that one field, not the whole user. Status 200. |
| `saveUserInterests` | Read `interests` from `req.body`. **Validate first, before touching the DB**: must be an array, must have at least 3 items, every item must be in the valid genre list — if not, `res.status(400); throw new Error(...)`. Then update and return `{ message: '...', interests: [...] }`. Status 200. |

**Checklist:**
- [ ] Every function wrapped in `asyncHandler`
- [ ] Nothing trusts `req.body` for *who the user is* — always `req.user.id` from the token, never something the client sends
- [ ] Validation happens before any database write

---

## Step 3 — `src/routes/userRoutes.js`

Every route here needs login, so use `router.use(protect)` once at the top instead of repeating it on each line:

```
router.use(protect)
GET  /profile      → getProfile
PUT  /profile      → updateProfile
GET  /interests    → getUserInterests
PUT  /interests    → saveUserInterests
```

**Checklist:**
- [ ] `protect` imported from `../middleware/authMiddleware`
- [ ] Controller functions imported and named exactly like the controller's `module.exports`
- [ ] `module.exports = router;` at the bottom

---

## Step 4 — Quick self-check before handing off

You don't need to run the full test suite — the leader handles end-to-end testing and wiring your routes into `app.js`. But do a quick sanity check yourself first so you're not handing off obviously broken code:

1. Run `npm run dev` and confirm the server boots with no errors (a typo in `User.js` will crash it immediately).
2. Register a test user via `POST /api/auth/register` and confirm it succeeds — this alone proves your model works, since `authController.js` depends on it.
3. Open the database (Compass or `mongosh`) and check the stored password looks hashed (`$2a$10$...`), not plain text.

Then tell the leader your files are ready — they'll uncomment your line in `app.js` and run the full test plan.

---

## Final PR checklist

- [ ] `User.js` matches the field spec above
- [ ] Password hashing verified (checked in the database directly)
- [ ] `updateProfile` uses `.save()`, not `findByIdAndUpdate`
- [ ] Routes have `protect` applied, function names match between controller and routes
- [ ] Registration/login works end to end with your model
- [ ] No `console.log` debugging left in, no hardcoded secrets
