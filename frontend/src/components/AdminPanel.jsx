import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate, NavLink } from "react-router";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/errorHandler";

const tagOptions = [
  "array",
  "string",
  "stack",
  "queue",
  "hashing",
  "sorting",
  "binarySearch",
  "twoPointers",
  "slidingWindow",
  "recursion",
  "backtracking",
  "greedy",
  "heap",
  "trie",
  "graph",
  "dfs",
  "bfs",
  "dp",
  "bitManipulation",
  "math",
  "prefixSum",
  "matrix",
  "unionFind",
  "segmentTree",
  "topologicalSort",
  "shortestPath",
];

const languageOptions = [
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "javascript", label: "JavaScript" },
];

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  inputFormat: z.string().min(1, "Input format is required"),
  outputFormat: z.string().min(1, "Output format is required"),
  constraints: z.string().min(1, "Constraints are required"),

  timeLimit: z.coerce
    .number()
    .min(1, "Time limit must be at least 1 second"),

  memoryLimit: z.coerce
    .number()
    .min(1024, "Memory limit must be at least 1024 KB"),

  difficulty: z.enum(["easy", "medium", "hard"]),

  tags: z
    .array(
      z.string().refine(
        (tag) => tagOptions.includes(tag),
        "Invalid tag"
      )
    )
    .min(1, "At least one tag is required"),

  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1),
        output: z.string().min(1),
        explanation: z.string().min(1),
      })
    )
    .min(1),

  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1),
        output: z.string().min(1),
      })
    )
    .min(1),

  startCode: z
    .array(
      z.object({
        language: z.enum(["cpp", "java", "javascript"]),
        initialCode: z.string().min(1),
      })
    )
    .length(3),

  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["cpp", "java", "javascript"]),
        completeCode: z.string().min(1),
      })
    )
    .length(3),
});

function AdminPanel() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),

    defaultValues: {
      difficulty: "easy",
      tags: [],
      inputFormat: "",
      outputFormat: "",
      constraints: "",
      timeLimit: 2,
      memoryLimit: 256000,

      visibleTestCases: [
        {
          input: "",
          output: "",
          explanation: "",
        },
      ],

      hiddenTestCases: [
        {
          input: "",
          output: "",
        },
      ],

      startCode: languageOptions.map((lang) => ({
        language: lang.value,
        initialCode: "",
      })),

      referenceSolution: languageOptions.map((lang) => ({
        language: lang.value,
        completeCode: "",
      })),
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

  const watchedData = watch();

  useEffect(() => {
    const savedForm = localStorage.getItem(
      "createProblemDraft"
    );

    if (savedForm) {
      reset(JSON.parse(savedForm));
    }
  }, [reset]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        watchedData.title ||
        watchedData.description
      ) {
        localStorage.setItem(
          "createProblemDraft",
          JSON.stringify(watchedData)
        );
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [watchedData]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      await axiosClient.post("/problem/create", data);

      localStorage.removeItem("createProblemDraft");

      toast.success("Problem created successfully!");

      navigate("/admin");
    } catch (error) {
      toast.error(getErrorMessage(error));

      if (import.meta.env.DEV) {
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.navbar}>
        <div style={s.navLeft}>
          <button
            onClick={() => navigate(-1)}
            style={s.backBtn}
          >
            ← Back
          </button>

          <NavLink
            to="/"
            style={{ textDecoration: "none" }}
          >
            <span style={s.logo}>LeetLab</span>
          </NavLink>
        </div>

        <NavLink
          to="/admin"
          style={s.adminLink}
        >
          <span style={s.adminBox}>
            Admin Dashboard
          </span>
        </NavLink>
      </nav>

      <div style={s.main}>
        <div style={s.header}>
          <h1 style={s.heading}>
            Create New Problem
          </h1>

          <p style={s.subheading}>
            Add a new coding problem to the
            platform
          </p>
        </div>

        <form
          onSubmit={handleSubmit(
            onSubmit,
            () => {
              toast.error(
                "Please fix validation errors"
              );
            }
          )}
        >
          {/* Basic Information */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>
              Basic Information
            </h2>

            <div style={s.formGroup}>
              <label style={s.label}>
                Title
              </label>

              <input
                {...register("title")}
                style={{
                  ...s.input,
                  ...(errors.title
                    ? s.inputError
                    : {}),
                }}
                placeholder="Problem title"
              />

              {errors.title && (
                <p style={s.errorText}>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>
                Description
              </label>

              <textarea
                {...register("description")}
                rows={5}
                style={{
                  ...s.textarea,
                  ...(errors.description
                    ? s.inputError
                    : {}),
                }}
                placeholder="Problem description..."
              />

              {errors.description && (
                <p style={s.errorText}>
                  {errors.description.message}
                </p>
              )}
            </div>

            {[
              {
                name: "inputFormat",
                label: "Input Format",
                placeholder:
                  "Describe the input format...",
              },
              {
                name: "outputFormat",
                label: "Output Format",
                placeholder:
                  "Describe the output format...",
              },
              {
                name: "constraints",
                label: "Constraints",
                placeholder:
                  "e.g. 1 ≤ n ≤ 10^5",
              },
            ].map((field) => (
              <div
                style={s.formGroup}
                key={field.name}
              >
                <label style={s.label}>
                  {field.label}
                </label>

                <textarea
                  {...register(field.name)}
                  rows={3}
                  style={{
                    ...s.textarea,
                    ...(errors[field.name]
                      ? s.inputError
                      : {}),
                  }}
                  placeholder={field.placeholder}
                />

                {errors[field.name] && (
                  <p style={s.errorText}>
                    {
                      errors[field.name]
                        ?.message
                    }
                  </p>
                )}
              </div>
            ))}

            <div style={s.row}>
              <div
                style={{
                  ...s.formGroup,
                  flex: 1,
                }}
              >
                <label style={s.label}>
                  Time Limit (sec)
                </label>

                <input
                  type="number"
                  min="1"
                  {...register("timeLimit")}
                  style={s.input}
                />

                {errors.timeLimit && (
                  <p style={s.errorText}>
                    {
                      errors.timeLimit
                        .message
                    }
                  </p>
                )}
              </div>

              <div
                style={{
                  ...s.formGroup,
                  flex: 1,
                }}
              >
                <label style={s.label}>
                  Memory Limit (KB)
                </label>

                <input
                  type="number"
                  min="1024"
                  {...register("memoryLimit")}
                  style={s.input}
                />

                {errors.memoryLimit && (
                  <p style={s.errorText}>
                    {
                      errors.memoryLimit
                        .message
                    }
                  </p>
                )}
              </div>
            </div>

            <div style={s.row}>
              <div
                style={{
                  ...s.formGroup,
                  flex: 1,
                }}
              >
                <label style={s.label}>
                  Difficulty
                </label>

                <select
                  {...register("difficulty")}
                  style={s.select}
                >
                  <option value="easy">
                    Easy
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="hard">
                    Hard
                  </option>
                </select>
              </div>

              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <div
                    style={{
                      ...s.formGroup,
                      flex: 2,
                    }}
                  >
                    <label style={s.label}>
                      Tags
                    </label>

                    <select
                      multiple
                      value={field.value || []}
                      onChange={(e) =>
                        field.onChange(
                          Array.from(
                            e.target
                              .selectedOptions,
                            (o) => o.value
                          )
                        )
                      }
                      style={{
                        ...s.select,
                        height: "160px",
                      }}
                    >
                      {tagOptions.map(
                        (tag) => (
                          <option
                            key={tag}
                            value={tag}
                          >
                            {tag}
                          </option>
                        )
                      )}
                    </select>

                    {field.value?.length >
                      0 && (
                      <div style={s.tagWrap}>
                        {field.value.map(
                          (tag) => (
                            <span
                              key={tag}
                              style={
                                s.tagPill
                              }
                            >
                              {tag}
                            </span>
                          )
                        )}
                      </div>
                    )}

                    {errors.tags && (
                      <p style={s.errorText}>
                        {
                          errors.tags
                            .message
                        }
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Test Cases */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>
              Test Cases
            </h2>

            <TestCaseSection
              title="Visible Test Cases"
              fields={visibleFields}
              append={appendVisible}
              remove={removeVisible}
              register={register}
              type="visibleTestCases"
              visible
            />

            <TestCaseSection
              title="Hidden Test Cases"
              fields={hiddenFields}
              append={appendHidden}
              remove={removeHidden}
              register={register}
              type="hiddenTestCases"
            />
          </div>

          {/* Code Templates */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>
              Code Templates
            </h2>

            <div style={s.codeWrap}>
              {languageOptions.map(
                (lang, index) => (
                  <div key={lang.value}>
                    <span style={s.langBadge}>
                      {lang.label}
                    </span>

                    <div
                      style={{
                        marginTop: "14px",
                      }}
                    >
                      <div
                        style={s.formGroup}
                      >
                        <label
                          style={s.label}
                        >
                          Starter Code
                        </label>

                        <textarea
                          {...register(
                            `startCode.${index}.initialCode`
                          )}
                          rows={7}
                          style={{
                            ...s.textarea,
                            fontFamily:
                              "monospace",
                          }}
                        />
                      </div>

                      <div
                        style={s.formGroup}
                      >
                        <label
                          style={s.label}
                        >
                          Reference
                          Solution
                        </label>

                        <textarea
                          {...register(
                            `referenceSolution.${index}.completeCode`
                          )}
                          rows={7}
                          style={{
                            ...s.textarea,
                            fontFamily:
                              "monospace",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...s.submitBtn,
              opacity: isSubmitting
                ? 0.7
                : 1,
            }}
          >
            {isSubmitting
              ? "Creating Problem..."
              : "Create Problem"}
          </button>
        </form>
      </div>
    </div>
  );
}

function TestCaseSection({
  title,
  fields,
  append,
  remove,
  register,
  type,
  visible = false,
}) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <div style={s.sectionHeader}>
        <h3 style={s.sectionTitle}>
          {title}
        </h3>

        <button
          type="button"
          style={s.addBtn}
          onClick={() =>
            append(
              visible
                ? {
                    input: "",
                    output: "",
                    explanation: "",
                  }
                : {
                    input: "",
                    output: "",
                  }
            )
          }
        >
          + Add Case
        </button>
      </div>

      <div style={s.column}>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={s.caseCard}
          >
            <div style={s.caseTop}>
              <span style={s.caseLabel}>
                Case {index + 1}
              </span>

              <button
                type="button"
                style={s.removeBtn}
                onClick={() =>
                  remove(index)
                }
              >
                Remove
              </button>
            </div>

            <textarea
              {...register(
                `${type}.${index}.input`
              )}
              placeholder="Input"
              rows={3}
              style={s.codeArea}
            />

            <textarea
              {...register(
                `${type}.${index}.output`
              )}
              placeholder="Output"
              rows={2}
              style={s.codeArea}
            />

            {visible && (
              <textarea
                {...register(
                  `${type}.${index}.explanation`
                )}
                placeholder="Explanation"
                rows={2}
                style={s.textarea}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#080c14",
    fontFamily: "'Sora', sans-serif",
    color: "#c9d1d9",
  },

  navbar: {
    height: "64px",
    background: "#080c14",
    borderBottom: "1px solid #1e2738",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  backBtn: {
    background: "transparent",
    border: "1px solid #1e2738",
    borderRadius: "8px",
    color: "#9ca3af",
    padding: "8px 14px",
    cursor: "pointer",
  },

  logo: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#a5b4fc",
  },

  adminLink: {
    textDecoration: "none",
  },

  adminBox: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: 500,
    border: "1px solid #1e2738",
    borderRadius: "8px",
    padding: "6px 14px",
    background: "#0c1018",
  },

  main: {
    padding: "48px 40px",
    maxWidth: "950px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "36px",
  },

  heading: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#f9fafb",
  },

  subheading: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "8px",
  },

  card: {
    background: "#0c1018",
    border: "1px solid #1e2738",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "28px",
  },

  cardTitle: {
    fontSize: "16px",
    fontWeight: 700,
    marginBottom: "20px",
    paddingBottom: "12px",
    borderBottom: "1px solid #1e2738",
  },

  formGroup: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    color: "#4b5563",
    textTransform: "uppercase",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    background: "#080c14",
    border: "1px solid #1e2738",
    borderRadius: "10px",
    color: "#e2e8f0",
    padding: "12px 14px",
    outline: "none",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    background: "#080c14",
    border: "1px solid #1e2738",
    borderRadius: "10px",
    color: "#e2e8f0",
    padding: "12px 14px",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    lineHeight: 1.6,
  },

  select: {
    width: "100%",
    background: "#080c14",
    border: "1px solid #1e2738",
    borderRadius: "10px",
    color: "#e2e8f0",
    padding: "12px 14px",
    outline: "none",
  },

  inputError: {
    borderColor: "#ef4444",
  },

  errorText: {
    fontSize: "12px",
    color: "#f87171",
    marginTop: "6px",
  },

  row: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  tagWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "10px",
  },

  tagPill: {
    background: "rgba(99,102,241,0.1)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "999px",
    color: "#a5b4fc",
    fontSize: "11px",
    padding: "4px 10px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },

  sectionTitle: {
    fontSize: "14px",
    fontWeight: 600,
  },

  addBtn: {
    background: "rgba(99,102,241,0.1)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "8px",
    color: "#a5b4fc",
    padding: "7px 14px",
    cursor: "pointer",
  },

  removeBtn: {
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "6px",
    color: "#f87171",
    padding: "4px 10px",
    cursor: "pointer",
  },

  caseCard: {
    background: "#080c14",
    border: "1px solid #1e2738",
    borderRadius: "12px",
    padding: "16px",
  },

  caseTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  caseLabel: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#6b7280",
  },

  column: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  codeArea: {
    width: "100%",
    background: "#080c14",
    border: "1px solid #1e2738",
    borderRadius: "10px",
    color: "#e2e8f0",
    padding: "12px 14px",
    marginBottom: "10px",
    resize: "vertical",
    fontFamily: "monospace",
    boxSizing: "border-box",
  },

  langBadge: {
    background: "rgba(234,179,8,0.1)",
    border: "1px solid rgba(234,179,8,0.25)",
    borderRadius: "8px",
    color: "#eab308",
    padding: "5px 12px",
    fontSize: "12px",
    fontWeight: 600,
  },

  codeWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },

  submitBtn: {
    width: "100%",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.35)",
    borderRadius: "12px",
    color: "#a5b4fc",
    fontSize: "15px",
    fontWeight: 700,
    padding: "15px",
    cursor: "pointer",
  },
};

export default AdminPanel;