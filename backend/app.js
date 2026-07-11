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
// app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);
// app.use('/api', chapterRoutes);
// app.use('/api/progress', progressRoutes);
// app.use('/api/favorites', favoriteRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
