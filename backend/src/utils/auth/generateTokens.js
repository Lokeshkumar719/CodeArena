const {generateAccessToken,generateRefreshToken,} = require("../../services/auth/tokenService");

const generateTokens = (user) => {
  const payload = {
    id: user._id,
    emailId: user.emailId,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);

  const refreshToken = generateRefreshToken(payload);

  return{
    accessToken,
    refreshToken,
  };
};

module.exports = generateTokens;
