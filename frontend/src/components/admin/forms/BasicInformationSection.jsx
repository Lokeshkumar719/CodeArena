import { Controller } from "react-hook-form";
import { s } from "../../../styles/admin/adminUpdateStyles";

function BasicInformationSection({ register, errors, control, tagOptions }) {
  return (
    <>
      <div style={s.card}>
        <h2 style={s.cardTitle}>Basic Information</h2>

        <div style={s.formGroup}>
          <label style={s.label}>Title</label>

          <input
            {...register("title")}
            style={{
              ...s.input,
              ...(errors.title ? s.inputError : {}),
            }}
            placeholder="Problem title"
          />

          {errors.title && <p style={s.errorText}>{errors.title.message}</p>}
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Description</label>

          <textarea
            {...register("description")}
            rows={5}
            style={{
              ...s.textarea,
              ...(errors.description ? s.inputError : {}),
            }}
            placeholder="Problem description..."
          />

          {errors.description && (
            <p style={s.errorText}>{errors.description.message}</p>
          )}
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Input Format</label>

          <textarea {...register("inputFormat")} rows={3} style={s.textarea} />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Output Format</label>

          <textarea {...register("outputFormat")} rows={3} style={s.textarea} />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Constraints</label>

          <textarea {...register("constraints")} rows={3} style={s.textarea} />
        </div>

        <div style={s.row}>
          <div style={s.formGroupFlex}>
            <label style={s.label}>Time Limit</label>

            <input
              type="number"
              min="1"
              {...register("timeLimit")}
              style={{
                ...s.input,
                ...(errors.timeLimit ? s.inputError : {}),
              }}
            />
          </div>

          <div style={s.formGroupFlex}>
            <label style={s.label}>Memory Limit</label>

            <input
              type="number"
              min="1024"
              {...register("memoryLimit")}
              style={{
                ...s.input,
                ...(errors.memoryLimit ? s.inputError : {}),
              }}
            />
          </div>
        </div>

        <div style={s.row}>
          <div style={s.formGroupFlex}>
            <label style={s.label}>Difficulty</label>

            <select {...register("difficulty")} style={s.select}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <div
                style={{
                  ...s.formGroupFlex,
                  flex: 2,
                }}
              >
                <label style={s.label}>Tags</label>

                <select
                  multiple
                  value={field.value || []}
                  onChange={(e) =>
                    field.onChange(
                      Array.from(e.target.selectedOptions, (o) => o.value),
                    )
                  }
                  style={{
                    ...s.select,
                    height: "160px",
                  }}
                >
                  {tagOptions.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>

                {field.value?.length > 0 && (
                  <div style={s.tagWrapper}>
                    {field.value.map((tag) => (
                      <span key={tag} style={s.tagPill}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </div>
    </>
  );
}

export default BasicInformationSection;
