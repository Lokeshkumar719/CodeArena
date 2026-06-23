const express = require('express');

const authMiddleware = require('../../middlewares/auth/authMiddleware');

const {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
} = require('../../controllers/profile/profileController');

const profileRouter = express.Router();

profileRouter.get('/me', authMiddleware, getMyProfile);

profileRouter.patch('/me', authMiddleware, updateMyProfile);

profileRouter.get('/:username', getPublicProfile);

module.exports = profileRouter;
