const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const storyRoutes = require("./src/routes/storyRoutes");
const chapterRoutes = require("./src/routes/chapterRoutes");
const progressRoutes = require("./src/routes/progressRoutes");
const favoriteRoutes = require("./src/routes/favoriteRoutes");
const ratingRoutes = require("./src/routes/ratingRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const embedRoutes = require("./src/routes/embedRoutes");
const { errorHandler, notFound } = require("./src/middleware/errorMiddleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());

// Auth endpoints are the most attractive brute-force/credential-stuffing
// target and have no account lockout, so they get a tighter limit than
// the rest of the API.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later" },
});

app.get("/", (req, res) => res.json({ message: "Story Hub API is running" }));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api", chapterRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/embed", embedRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
