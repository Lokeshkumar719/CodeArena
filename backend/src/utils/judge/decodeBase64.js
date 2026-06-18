const decodeBase64 = (value) => {
  if (!value) return null;

  try {
    return Buffer.from(value, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Base64 decode failed:', error);
    return value;
  }
};

module.exports = decodeBase64;
