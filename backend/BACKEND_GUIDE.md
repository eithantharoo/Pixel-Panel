# Backend Development Guide — Express + MongoDB

> **For Mentors:** This guide is structured to be explained step by step. Each section builds on the previous one. Start from Section 1 and do not skip ahead. Every concept is introduced before it is used.

---

## Table of Contents

1. [What Is a Backend?](#1-what-is-a-backend)
2. [Tools and Prerequisites](#2-tools-and-prerequisites)
3. [Project Structure Overview](#3-project-structure-overview)
4. [Setting Up the Project](#4-setting-up-the-project)
5. [Understanding package.json](#5-understanding-packagejson)
6. [Environment Variables (.env)](#6-environment-variables-env)
7. [Connecting to MongoDB](#7-connecting-to-mongodb)
8. [The Entry Point — server.js](#8-the-entry-point--serverjs)
9. [The App File — app.js](#9-the-app-file--appjs)
10. [Models — Defining Your Data Shape](#10-models--defining-your-data-shape)
11. [Controllers — The Business Logic](#11-controllers--the-business-logic)
12. [Routes — The URL Map](#12-routes--the-url-map)
13. [Middleware — The Gatekeeper](#13-middleware--the-gatekeeper)
14. [Authentication with JWT](#14-authentication-with-jwt)
15. [Error Handling](#15-error-handling)
16. [Input Validation](#16-input-validation)
17. [Complete Request Flow Diagram](#17-complete-request-flow-diagram)
18. [Testing Your API](#18-testing-your-api)
19. [Common Mistakes and How to Fix Them](#19-common-mistakes-and-how-to-fix-them)
20. [Glossary](#20-glossary)

---

## 1. What Is a Backend?

Think of an app as a restaurant:

| Restaurant | Web Application |
|---|---|
| Customer | Browser / Mobile App (Frontend) |
| Waiter | API (the backend routes) |
| Kitchen | Controller (business logic) |
| Recipe Book | Model (data structure) |
| Storage Room | Database (MongoDB) |

The **frontend** is what users see. The **backend** is everything happening behind the scenes — storing data, checking passwords, sending emails, and enforcing rules.

### How a Request Works (Plain English)

```
User clicks "Login"
  → Frontend sends a request to the backend (POST /api/auth/login)
    → Backend receives the request
      → Checks if email and password match
        → If yes: sends back a token
        → If no: sends back an error message
  → Frontend shows the result to the user
```

---

## 2. Tools and Prerequisites

### Install These First

| Tool | Purpose | Download |
|---|---|---|
| Node.js (v18+) | Runs JavaScript on the server | nodejs.org |
| npm | Package manager (comes with Node) | Included |
| MongoDB | The database | mongodb.com |
| VS Code | Code editor | code.visualstudio.com |
| Thunder Client / Postman | Test your API | VS Code Extension / postman.com |

### Verify Installation

Open your terminal and run:

```bash
node --version     # Should show v18.x.x or higher
npm --version      # Should show 9.x.x or higher
```

---

## 3. Project Structure Overview

This is the full folder layout we will build. Do not create all these files at once — we will create each file when we reach its section.

```
backend/
│
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   │
│   ├── models/
│   │   ├── User.js            # User data shape
│   │   └── Product.js         # Product data shape (example)
│   │
│   ├── controllers/
│   │   ├── authController.js  # Login, Register logic
│   │   └── userController.js  # User CRUD logic
│   │
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth/...
│   │   └── userRoutes.js      # /api/users/...
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js  # Protect routes (JWT check)
│   │   └── errorMiddleware.js # Global error handler
│   │
│   └── utils/
│       └── generateToken.js   # Helper: create JWT token
│
├── .env                       # Secret keys (NEVER commit this)
├── .gitignore                 # Files git should ignore
├── app.js                     # Express app setup
├── server.js                  # Start the server
└── package.json               # Project info + dependencies
```

### Why This Structure?

Each folder has **one clear job**:
- `models/` — describes the shape of data
- `controllers/` — contains the logic (what to do with data)
- `routes/` — maps URLs to controller functions
- `middleware/` — code that runs between request and response
- `config/` — setup and configuration files
- `utils/` — small reusable helper functions

---

## 4. Setting Up the Project

### Step 1: Create the project folder

```bash
mkdir backend
cd backend
```

### Step 2: Initialize the project

```bash
npm init -y
```

This creates `package.json`. The `-y` flag accepts all default values.

### Step 3: Install required packages

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken express-validator cors
```

```bash
npm install --save-dev nodemon
```

### What each package does

| Package | What It Does |
|---|---|
| `express` | The web framework — handles HTTP requests |
| `mongoose` | Connects to MongoDB and defines data models |
| `dotenv` | Reads secret values from your `.env` file |
| `bcryptjs` | Hashes (scrambles) passwords so they are safe to store |
| `jsonwebtoken` | Creates and verifies JWT tokens for authentication |
| `express-validator` | Checks that user input is valid before processing |
| `cors` | Allows your frontend (on a different port) to talk to your backend |
| `nodemon` | Automatically restarts server when you save a file (dev only) |

### Step 4: Create the folder structure

```bash
mkdir -p src/config src/models src/controllers src/routes src/middleware src/utils
```

---

## 5. Understanding package.json

After setup, your `package.json` should look like this. Add the `"scripts"` section manually if it is not there.

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Express + MongoDB backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.0",
    "express-validator": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^8.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

**Mentor Note:** Explain the difference between `dependencies` (needed in production) and `devDependencies` (only needed while developing). `nodemon` is only for development.

---

## 6. Environment Variables (.env)

Create a file called `.env` at the root of your backend folder:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/pixelpanel
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=30d
NODE_ENV=development
```

### What is an environment variable?

It is a value that can change depending on where the app runs (your computer vs. a live server). You never hardcode secrets like passwords or API keys directly in your code.

**Why?** If you push your code to GitHub with a hardcoded secret, anyone can see it.

### Create .gitignore immediately

Create a file called `.gitignore`:

```
node_modules/
.env
```

This tells Git to never upload these files. `node_modules` is huge and can be rebuilt from `package.json`. `.env` contains secrets.

---

## 7. Connecting to MongoDB

Create `src/config/db.js`:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Stop the app if DB fails to connect
  }
};

module.exports = connectDB;
```

### Breaking This Down

```javascript
const mongoose = require('mongoose');
```
We import mongoose — the library that lets us talk to MongoDB.

```javascript
const connectDB = async () => {
```
We define an `async` function because connecting to a database takes time. We use `async/await` to wait for it properly.

```javascript
const conn = await mongoose.connect(process.env.MONGO_URI);
```
`process.env.MONGO_URI` reads the value from your `.env` file. We do NOT write the database URL directly here.

```javascript
process.exit(1);
```
If the database fails to connect, there is no point running the server. Code `1` means "exited with an error."

---

## 8. The Entry Point — server.js

Create `server.js` at the root:

```javascript
const dotenv = require('dotenv');
dotenv.config(); // Load .env FIRST before anything else

const app = require('./app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to database, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
```

### Why is this a separate file from app.js?

- `server.js` — starts the server and connects to the DB
- `app.js` — defines the Express app (routes, middleware)

Keeping them separate makes it easier to test the app without actually starting a real server.

**Mentor Note:** Explain the concept of `process.env.PORT || 5000`. In production hosting services, the PORT is set automatically by the host. The `|| 5000` is the fallback for local development.

---

## 9. The App File — app.js

Create `app.js` at the root:

```javascript
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

const app = express();

// --- Middleware ---
app.use(cors());                        // Allow cross-origin requests
app.use(express.json());                // Parse JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parse form data

// --- Routes ---
app.use('/api/auth', authRoutes);       // Authentication routes
app.use('/api/users', userRoutes);      // User routes

// --- Health Check ---
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// --- Error Handling (must be LAST) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
```

### What is Middleware?

Middleware is code that runs **between** receiving a request and sending a response. Think of it as a series of checkpoints.

```
Request → [cors()] → [express.json()] → [Your Route] → Response
```

`app.use()` registers middleware. Order matters — they run top to bottom.

---

## 10. Models — Defining Your Data Shape

A **Model** tells MongoDB what fields a document should have.

### User Model — `src/models/User.js`

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,          // Remove extra spaces
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,        // No two users can share an email
      lowercase: true,     // Always store as lowercase
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,       // Never return password in queries by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Only these two values are allowed
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// --- Hash password before saving ---
userSchema.pre('save', async function (next) {
  // Only hash if the password field was changed
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Method to compare passwords ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Breaking Down the Schema

```javascript
const userSchema = new mongoose.Schema({ ... }, { timestamps: true });
```
A Schema is the blueprint. `timestamps: true` automatically adds `createdAt` and `updatedAt` to every document.

```javascript
required: [true, 'Name is required'],
```
The first value is the rule, the second is the error message when the rule is broken.

```javascript
select: false,
```
Passwords are never returned in a database query unless you explicitly ask for them. This prevents accidentally leaking passwords.

```javascript
userSchema.pre('save', async function (next) { ... });
```
A **pre-save hook** — this code runs automatically every time before a user document is saved. We use it to hash the password.

```javascript
userSchema.methods.matchPassword = async function (enteredPassword) { ... };
```
A **method** — a function we attach to every user object. We can call it like `user.matchPassword('abc123')`.

---

### Product Model — `src/models/Product.js` (Example)

```javascript
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // A reference to a User document
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
```

**Mentor Note:** Point out `createdBy` — this is a **reference** to another collection. It stores the `_id` of a User document. This is how MongoDB links data across collections (similar to a foreign key in SQL).

---

## 11. Controllers — The Business Logic

Controllers contain the actual logic for each action. They receive a request, do something (query DB, process data), and send a response.

### Auth Controller — `src/controllers/authController.js`

```javascript
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  // Step 1: Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Step 2: Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Step 3: Create the user (password is hashed in the model's pre-save hook)
    const user = await User.create({ name, email, password });

    // Step 4: Send back the user data and a token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Find user and include the password (normally excluded by select: false)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private (requires token)
const getMe = async (req, res) => {
  // req.user is set by the authMiddleware
  const user = await User.findById(req.user.id);
  res.json(user);
};

module.exports = { registerUser, loginUser, getMe };
```

### Understanding HTTP Status Codes

| Code | Meaning | When to Use |
|---|---|---|
| `200` | OK | Successful GET, PUT request |
| `201` | Created | Successful POST that created something |
| `400` | Bad Request | User sent invalid data |
| `401` | Unauthorized | Not logged in / bad token |
| `403` | Forbidden | Logged in but not allowed |
| `404` | Not Found | Resource does not exist |
| `500` | Server Error | Something crashed on our side |

---

### User Controller — `src/controllers/userController.js`

```javascript
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.deleteOne();
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
```

---

## 12. Routes — The URL Map

Routes connect a URL path and an HTTP method to a controller function.

### Auth Routes — `src/routes/authRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// Validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Route definitions
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.get('/me', protect, getMe);       // 'protect' runs before getMe

module.exports = router;
```

### User Routes — `src/routes/userRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All routes below require the user to be logged in
router.use(protect);

router.get('/', adminOnly, getAllUsers);        // Only admins can see all users
router.get('/:id', getUserById);               // Any logged-in user
router.put('/:id', updateUser);                // Any logged-in user
router.delete('/:id', adminOnly, deleteUser);  // Only admins can delete

module.exports = router;
```

### REST API Convention

| Method | URL | Action |
|---|---|---|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get one user |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

**Mentor Note:** `:id` is a **route parameter**. It is a placeholder. When someone visits `/api/users/abc123`, the value `abc123` is available as `req.params.id` inside the controller.

---

## 13. Middleware — The Gatekeeper

### Error Middleware — `src/middleware/errorMiddleware.js`

```javascript
// Handle 404 — route not found
const notFound = (req, res, next) => {
  const error = new Error(`Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next error handler
};

// Global error handler — handles ALL errors
const errorHandler = (err, req, res, next) => {
  // Sometimes status is still 200 even on error — fix that
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Only show full error trace in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
```

**Mentor Note:** The error handler takes **4 parameters** (`err, req, res, next`). Express recognizes any middleware with 4 parameters as an error handler. That is why it must always come **last** in `app.js`.

---

## 14. Authentication with JWT

### What is JWT?

JWT stands for **JSON Web Token**. Think of it as a hotel key card:

```
When you check in (login):
  → Hotel gives you a key card (JWT token)

When you enter your room (access protected route):
  → You show your key card
  → If it is valid: door opens
  → If it is fake or expired: door stays locked
```

A JWT looks like this:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyJ9.abc123signature
```

It has three parts separated by dots:
1. **Header** — algorithm used
2. **Payload** — the data stored (user ID, role, etc.)
3. **Signature** — proves nobody tampered with it

### Generate Token — `src/utils/generateToken.js`

```javascript
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign(
    { id },                          // Payload: what we store inside the token
    process.env.JWT_SECRET,          // Secret key: used to sign and verify
    { expiresIn: process.env.JWT_EXPIRE } // Token expires after this time
  );
};

module.exports = generateToken;
```

### Auth Middleware — `src/middleware/authMiddleware.js`

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware: Verify token and attach user to request
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token: "Bearer eyJ..." → "eyJ..."
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user (without password) to the request object
      req.user = await User.findById(decoded.id).select('-password');

      next(); // All good — move on to the next function
    } catch (error) {
      res.status(401).json({ message: 'Token is invalid or expired' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Middleware: Admin check (must run AFTER protect)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

module.exports = { protect, adminOnly };
```

### How the Client Sends the Token

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The client stores the token (usually in `localStorage`) and sends it in the `Authorization` header with every request to a protected route.

---

## 15. Error Handling

### The Recommended Pattern

Instead of writing `try/catch` in every controller, we can create a wrapper:

Create `src/utils/asyncHandler.js`:

```javascript
// Wraps async controllers so we don't repeat try/catch everywhere
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
```

Then use it in controllers:

```javascript
const asyncHandler = require('../utils/asyncHandler');

// Before (with try/catch):
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// After (with asyncHandler — much cleaner):
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found'); // asyncHandler sends this to errorHandler
  }
  res.json(user);
});
```

---

## 16. Input Validation

Never trust data from the user. Always validate it before using it.

```javascript
const { body, validationResult } = require('express-validator');

// Define rules
const registerValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name too long'),

  body('email')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),    // Converts "User@Example.COM" to "user@example.com"

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain a number'),
];

// Check results in controller
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
  // Sends: [{ field: "email", message: "Must be a valid email" }]
}
```

---

## 17. Complete Request Flow Diagram

```
CLIENT (Browser / Mobile App)
  │
  │  POST /api/auth/login
  │  Body: { email: "user@example.com", password: "abc123" }
  │  Header: (no token needed for login)
  ▼
EXPRESS SERVER (app.js)
  │
  ├─ cors() middleware → Allow the request from this origin
  ├─ express.json() → Parse the JSON body
  │
  ├─ Match route: POST /api/auth → authRoutes.js
  │
  ▼
ROUTE (authRoutes.js)
  │
  ├─ Run: loginValidation middleware → Check email/password format
  ├─ If invalid → return 400 error
  │
  ▼
CONTROLLER (authController.js → loginUser)
  │
  ├─ Query DB: User.findOne({ email })
  ├─ If not found → return 401 error
  ├─ Compare password → user.matchPassword()
  ├─ If wrong → return 401 error
  ├─ Generate token → generateToken(user._id)
  │
  ▼
RESPONSE to CLIENT
  { _id, name, email, role, token }
  Status: 200 OK
```

---

## 18. Testing Your API

Use **Thunder Client** (VS Code extension) or **Postman**.

### Register a User

```
Method: POST
URL:    http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Expected Response (201 Created):
```json
{
  "_id": "64abc123...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "eyJhbGciOi..."
}
```

### Login

```
Method: POST
URL:    http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Access a Protected Route

```
Method: GET
URL:    http://localhost:5000/api/auth/me
Header: Authorization: Bearer <paste your token here>
```

### Running the Server

```bash
npm run dev
```

You should see:
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

---

## 19. Common Mistakes and How to Fix Them

### Mistake 1: `.env` not loading

```
Error: JWT_SECRET is undefined
```

**Fix:** Make sure `dotenv.config()` is called at the very top of `server.js`, before any other `require()` that uses `process.env`.

---

### Mistake 2: Circular dependency

```
Error: Cannot access before initialization
```

**Fix:** Check your `require()` imports. Model files should never import from controllers. Controllers import models, never the other way.

---

### Mistake 3: JWT token not being received

```
Error: Not authorized, no token provided
```

**Fix:** The Authorization header must be exactly: `Bearer eyJ...` — note the space between `Bearer` and the token.

---

### Mistake 4: Password not being hashed

This happens when you update the password using `User.findByIdAndUpdate()` instead of finding the user, changing the field, and calling `user.save()`. The pre-save hook only runs on `.save()`.

**Fix:**
```javascript
// WRONG — skips the pre-save hook
await User.findByIdAndUpdate(id, { password: newPassword });

// CORRECT — triggers the pre-save hook
const user = await User.findById(id);
user.password = newPassword;
await user.save();
```

---

### Mistake 5: CORS error in browser

```
Error: Access to fetch blocked by CORS policy
```

**Fix:** Make sure `app.use(cors())` is the **first** middleware in `app.js`, before your routes.

---

### Mistake 6: `Cannot read property of undefined`

Usually means the request body is empty. **Fix:** Make sure `app.use(express.json())` is in `app.js` and the request has `Content-Type: application/json` header.

---

## 20. Glossary

| Term | Plain English Explanation |
|---|---|
| **API** | A set of URLs your backend exposes. Frontend calls these URLs to get or send data. |
| **REST** | A naming convention for API URLs. Uses HTTP methods (GET, POST, PUT, DELETE). |
| **HTTP Method** | The type of action. GET = read, POST = create, PUT = update, DELETE = delete. |
| **Request Body** | Data sent to the server (usually JSON). Only POST and PUT have a body. |
| **Request Params** | Values in the URL path. `/users/:id` — id is a param. |
| **Request Query** | Values after `?` in the URL. `/users?sort=name` — sort is a query param. |
| **Middleware** | A function that runs between request and response. Can modify req/res or end the cycle. |
| **Controller** | A function that handles the business logic for one specific route. |
| **Model** | A blueprint for how data is shaped and stored in MongoDB. |
| **Schema** | The detailed definition inside a model — field names, types, rules. |
| **JWT** | A signed token that proves who a user is. Sent with every protected request. |
| **Hashing** | One-way transformation of a password. Cannot be reversed. |
| **Salt** | Random data added before hashing to make identical passwords hash differently. |
| **Async/Await** | Modern JavaScript way to handle operations that take time (like DB queries). |
| **Promise** | Represents a future value from an async operation. |
| **CORS** | Browser security rule. The backend must explicitly allow requests from the frontend's origin. |
| **Environment Variable** | A configuration value loaded at runtime, not hardcoded. Stored in `.env`. |
| **Mongoose** | An npm package that provides a structure for working with MongoDB from Node.js. |
| **Document** | A single record in MongoDB (like a row in SQL). Stored as JSON-like objects. |
| **Collection** | A group of documents (like a table in SQL). |
| **ObjectId** | MongoDB's unique identifier for every document. Looks like `64abc123def456`. |
| **populate()** | Mongoose method that replaces an ObjectId reference with the actual document. |
| **next()** | Express function to move to the next middleware or error handler. |
| **status code** | A number in the HTTP response that tells the client if it succeeded or failed. |

---

## Final Checklist Before Running

- [ ] `node_modules/` exists (ran `npm install`)
- [ ] `.env` file is created with all required values
- [ ] `.gitignore` includes `.env` and `node_modules/`
- [ ] MongoDB is running locally, or `MONGO_URI` points to MongoDB Atlas
- [ ] `server.js` calls `dotenv.config()` at the very top
- [ ] `app.js` has `express.json()` middleware before routes
- [ ] Error middleware is registered last in `app.js`
- [ ] Run `npm run dev` and see "MongoDB Connected" and "Server running"

---

> **Mentor Tip:** After completing this guide, have the student build one complete feature from scratch — Model → Controller → Route → Test in Thunder Client — without looking at the examples. That is the real test of understanding.
