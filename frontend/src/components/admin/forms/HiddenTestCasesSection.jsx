import { s } from '../../../styles/admin/updateProblemStyles';

function HiddenTestCasesSection({
  appendHidden,
  hiddenFields,
  register,
  removeHidden,
  TestCaseBlock,
}) {
  return (
    <div style={s.card}>
      <div style={s.sectionHeader}>
        <h2 style={s.cardTitle}>Hidden Test Cases</h2>

        <button
          type='button'
          style={s.addBtn}
          onClick={() =>
            appendHidden({
              input: '',
              output: '',
            })
          }
        >
          + Add Case
        </button>
      </div>

      <TestCaseBlock
        fields={hiddenFields}
        register={register}
        remove={removeHidden}
        type='hiddenTestCases'
      />
    </div>
  );
}

export default HiddenTestCasesSection;