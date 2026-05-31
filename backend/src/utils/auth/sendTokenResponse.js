const sendTokenResponse = (
  res,
  user,
  message,
  statusCode,
) => {
  const reply = {
    firstName: user.firstName,
    emailId: user.emailId,
    _id: user._id,
    role: user.role,
  };

  return res.status(statusCode).json({
    success: true,
    message,
    data: reply,
  });
};

module.exports = sendTokenResponse;