const express = require('express');
const authRouter = express.Router();
const {
  register,
  login,
  logout,
  refreshAccessToken,
  adminRegister,
  deleteProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  resendVerificationEmail,
} = require('../../controllers/auth/authController');

const authMiddleware = require('../../middlewares/auth/authMiddleware');
const adminMiddleware = require('../../middlewares/auth/adminMiddleware');
const {
  limitLogin,
  limitRegister,
  limitChangePassword,
} = require('../../middlewares/rateLimitMiddleware');

// register and login routes are public routes so we don't need to add authMiddleware in them but logout route is a private route so we need to add authMiddleware in it
authRouter.post('/register', limitRegister, register);
authRouter.post('/login', limitLogin, login);
// before logout we need to check whether the user is authenticated or not so we will use authMiddleware
authRouter.post('/logout', authMiddleware, logout);
authRouter.post('/refresh', refreshAccessToken);
authRouter.post('/forgot-password', limitLogin, forgotPassword);
authRouter.post('/reset-password/:token', resetPassword);
authRouter.get('/verify-email/:token', verifyEmail);
authRouter.post('/change-password', authMiddleware, limitChangePassword, changePassword);
authRouter.post('/resend-verification', limitLogin, resendVerificationEmail);

authRouter.post('/admin/Register', authMiddleware, adminMiddleware, adminRegister);

authRouter.delete('/profile', authMiddleware, deleteProfile);

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
