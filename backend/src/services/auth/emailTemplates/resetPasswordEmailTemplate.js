const resetPasswordEmailTemplate = (resetPasswordUrl) => {
  return `
    <h2>Password Reset Request</h2>

    <p>Click the link below to reset your password:</p>

    <a href="${resetPasswordUrl}">
      Reset Password
    </a>

    <p>This link will expire in 10 minutes.</p>
  `;
};

module.exports = resetPasswordEmailTemplate;
