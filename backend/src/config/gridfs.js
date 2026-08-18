const mongoose = require('mongoose');

const BUCKET_NAME = 'chapterPdfs';

// Lazily creates the GridFSBucket off the active mongoose connection —
// connection.db only exists once connectDB() has resolved, so this can't
// be constructed at module-load time.
function getPdfBucket() {
  if (!mongoose.connection.db) {
    throw new Error('Database connection is not ready yet');
  }
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: BUCKET_NAME });
}

module.exports = { getPdfBucket, BUCKET_NAME };
