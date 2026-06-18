const encodeBase64 = (value) => {
  if (value === null || value === undefined) return '';

  try {
    return Buffer.from(String(value), 'utf-8').toString('base64');
  } catch (error) {
    console.error('Base64 encode failed:', error);
    return value;
  }
};

module.exports = encodeBase64;
