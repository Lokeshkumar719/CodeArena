const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const videoController = require('../controllers/videoController');

const validateObjectIdParams = require('../validators/validateObjectId');

const videoRouter = express.Router();

videoRouter.post(
  '/upload/:problemId',
  authMiddleware,
  adminMiddleware,
  validateObjectIdParams('problemId'),
  videoController.uploadVideo
);

videoRouter.put(
  '/update/:problemId',
  authMiddleware,
  adminMiddleware,
  validateObjectIdParams('problemId'),
  videoController.updateVideo
);

videoRouter.delete(
  '/delete/:problemId',
  authMiddleware,
  adminMiddleware,
  validateObjectIdParams('problemId'),
  videoController.deleteVideo
);

module.exports = videoRouter;
