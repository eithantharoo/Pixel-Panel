const multer = require('multer');

const MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

// Buffers the upload in memory (not disk) so it can be streamed straight
// into GridFS. Real MIME/magic-byte validation happens in the controller —
// this fileFilter is just an early, cheap rejection of obviously-wrong
// uploads before spending time buffering them.
const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PDF_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files are allowed'));
      return;
    }
    cb(null, true);
  },
});

module.exports = { uploadPdf, MAX_PDF_SIZE_BYTES };
