const { LANGUAGE_IDS } = require("../constants/judge0");

const getLanguageById = (lang) => {
  return LANGUAGE_IDS[lang.toLowerCase()];
};

module.exports = { getLanguageById };
