import { s } from '../../../styles/admin/updateProblemStyles';

function VisibleTestCasesSection({
  appendVisible,
  visibleFields,
  register,
  removeVisible,
  TestCaseBlock,
}) {
  return (
    <div style={s.card}>
      <div style={s.sectionHeader}>
        <h2 style={s.cardTitle}>Visible Test Cases</h2>

        <button
          type='button'
          style={s.addBtn}
          onClick={() =>
            appendVisible({
              input: '',
              output: '',
              explanation: '',
            })
          }
        >
          + Add Case
        </button>
      </div>

      <TestCaseBlock
        fields={visibleFields}
        register={register}
        remove={removeVisible}
        type='visibleTestCases'
        visible
      />
    </div>
  );
}

export default VisibleTestCasesSection;