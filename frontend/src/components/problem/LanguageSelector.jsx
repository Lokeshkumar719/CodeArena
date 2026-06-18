function LanguageSelector({ LANGS, selectedLanguage, handleLanguageChange }) {
  return (
    <div className="lang-bar">
      {LANGS.map((language) => (
        <button
          key={language.key}
          className={`
            lang-btn
            ${selectedLanguage === language.key ? 'active-lang' : 'inactive'}
          `}
          onClick={() => handleLanguageChange(language.key)}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSelector;
