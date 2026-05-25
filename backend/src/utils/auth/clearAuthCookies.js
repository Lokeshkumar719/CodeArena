const clearAuthCookies = (res) => {
  // clear access token cookie
  res.cookie("accessToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "strict",
  });

  // clear refresh token cookie
  res.cookie("refreshToken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "strict",
  });
};

module.exports = clearAuthCookies;