const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

// This loads your .env variables safely using your installed dotenv package
require('dotenv').config();

const app = require('./app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Story Hub] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});
