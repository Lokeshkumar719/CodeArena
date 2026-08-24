const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const rateLimitMiddleware = require('../middlewares/rateLimitMiddleware');

const validateUserRegistration = require('../validators/validateUserRegistration');

// authController.register and authController.login routes are public routes so we don't need to add authMiddleware in them but authController.logout route is a private route so we need to add authMiddleware in it
authRouter.post(
  '/register',
  rateLimitMiddleware.limitRegister,
  validateUserRegistration,
  authController.register
);
authRouter.post('/login', rateLimitMiddleware.limitLogin, authController.login);
// before authController.logout we need to check whether the user is authenticated or not so we will use authMiddleware
authRouter.post('/logout', authMiddleware, authController.logout);
authRouter.post('/refresh', authController.refreshAccessToken);
authRouter.post('/forgot-password', rateLimitMiddleware.limitLogin, authController.forgotPassword);
authRouter.post('/reset-password/:token', authController.resetPassword);
authRouter.get('/verify-email/:token', authController.verifyEmail);
authRouter.post(
  '/change-password',
  authMiddleware,
  rateLimitMiddleware.limitChangePassword,
  authController.changePassword
);
authRouter.post(
  '/resend-verification',
  rateLimitMiddleware.limitLogin,
  authController.resendVerificationEmail
);

authRouter.post(
  '/admin/register',
  authMiddleware,
  adminMiddleware,
  validateUserRegistration,
  authController.adminRegister
);

authRouter.delete('/profile', authMiddleware, authController.deleteProfile);

authRouter.get('/check', authMiddleware, (req, res) => {
  const reply = {
    username: req.user.username,
    emailId: req.user.emailId,
    _id: req.user._id,
    role: req.user.role,
  };

  res.status(200).json({
    success: true,
    message: 'Valid user',
    data: reply,
  });
});

module.exports = authRouter;
