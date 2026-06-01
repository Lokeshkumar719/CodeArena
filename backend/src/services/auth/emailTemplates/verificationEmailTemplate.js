const verificationEmailTemplate = (verificationUrl) => {
  return `
    <h2>Welcome to CodeArena</h2>

    <p>Please verify your email by clicking the link below:</p>

    <a href="${verificationUrl}">
      Verify Email
    </a>

    <p>This verification link will expire in 2 hours.</p>
  `;
};

module.exports = verificationEmailTemplate;
