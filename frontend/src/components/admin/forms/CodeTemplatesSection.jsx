import { s } from '../../../styles/admin/updateProblemStyles';

function CodeTemplatesSection({ languageOptions, register }) {
  return (
    <div style={s.card}>
      <h2 style={s.cardTitle}>Code Templates</h2>

      <div style={s.langContainer}>
        {languageOptions.map((lang, index) => (
          <div key={lang.value}>
            <span style={s.langBadge}>{lang.label}</span>

            <div style={{ marginTop: '14px' }}>
              <textarea
                {...register(`startCode.${index}.initialCode`)}
                rows={7}
                style={s.codeArea}
                placeholder={`// ${lang.label} starter code`}
              />

              <textarea
                {...register(`referenceSolution.${index}.completeCode`)}
                rows={7}
                style={s.codeArea}
                placeholder={`// ${lang.label} solution`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CodeTemplatesSection;
