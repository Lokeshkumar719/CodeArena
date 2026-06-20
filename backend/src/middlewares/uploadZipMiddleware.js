const multer = require('multer');
const { MAX_ZIP_SIZE } = require('../constants/storage');

const storage = multer.memoryStorage();

const uploadZip = multer({
  storage,
  limits: {
    fileSize: MAX_ZIP_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
      return cb(null, true);
    }

    cb(new Error('Only ZIP files are allowed'));
  },
});

module.exports = uploadZip;
