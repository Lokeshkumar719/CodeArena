const isProduction = process.env.NODE_ENV === 'production';

const clearAuthCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'strict',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};

module.exports = clearAuthCookies;
