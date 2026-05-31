import { s } from "../../../styles/admin/adminUpdateStyles";

function TestCaseBlock({ fields, register, remove, type, visible }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {fields.map((field, index) => (
        <div key={field.id} style={s.caseCard}>
          <div style={s.caseHeader}>
            <span style={s.caseTitle}>
              {visible ? "Case" : "Hidden Case"} {index + 1}
            </span>

            <button
              type="button"
              style={s.removeBtn}
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>

          <textarea
            {...register(`${type}.${index}.input`)}
            placeholder="Input"
            rows={3}
            style={s.codeArea}
          />

          <textarea
            {...register(`${type}.${index}.output`)}
            placeholder="Output"
            rows={2}
            style={s.codeArea}
          />

          {visible && (
            <textarea
              {...register(`${type}.${index}.explanation`)}
              placeholder="Explanation"
              rows={2}
              style={s.textarea}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default TestCaseBlock;
