const express = require('express');

const authMiddleware = require('../middlewares/authMiddleware');

const profileController = require('../controllers/profileController');

const { validateProfileUpdate } = require('../validators/profileValidation');

const profileRouter = express.Router();

profileRouter.get('/me', authMiddleware, profileController.getMyProfile);

profileRouter.patch(
  '/me',
  authMiddleware,
  validateProfileUpdate,
  profileController.updateMyProfile
);

profileRouter.get('/:username', profileController.getPublicProfile);

module.exports = profileRouter;
