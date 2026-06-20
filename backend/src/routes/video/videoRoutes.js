const express = require('express');

const authMiddleware = require('../../middlewares/auth/authMiddleware');
const adminMiddleware = require('../../middlewares/auth/adminMiddleware');

const {
  uploadVideo,
  updateVideo,
  deleteVideo,
} = require('../../controllers/video/videoController');

const videoRouter = express.Router();

videoRouter.post('/upload/:problemId', authMiddleware, adminMiddleware, uploadVideo);

videoRouter.put('/update/:problemId', authMiddleware, adminMiddleware, updateVideo);

videoRouter.delete('/delete/:problemId', authMiddleware, adminMiddleware, deleteVideo);

module.exports = videoRouter;
