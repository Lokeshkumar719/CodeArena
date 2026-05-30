import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../../utils/axiosClient';
import { useNavigate, useParams, NavLink } from 'react-router';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../utils/errorHandler';
import useRateLimit from '../../hooks/useRateLimit.jsx';
import AdminUploadSkeleton from '../skeletons/AdminUploadSkeleton';

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
  difficulty: z.enum(["easy", "medium", "hard"]),
  inputFormat: z.string().min(1, "Input format is required"),
  outputFormat: z.string().min(1, "Output format is required"),
  constraints: z.string().min(1, "Constraints are required"),

  timeLimit: z.coerce.number().min(1, "Time limit must be at least 1 second"),

  memoryLimit: z.coerce
    .number()
    .min(1024, "Memory limit must be at least 1024 KB"),

  tags: z
    .array(z.string().refine((tag) => tagOptions.includes(tag), "Invalid tag"))
    .min(1, "At least one tag is required"),

  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().min(1, "Explanation is required"),
      }),
    )
    .min(1, "At least one visible test case required"),

  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      }),
    )
    .min(1, "At least one hidden test case required"),

  startCode: z
    .array(
      z.object({
        language: z.enum(["cpp", "java", "javascript"]),
        initialCode: z.string().min(1, "Initial code is required"),
      }),
    )
    .length(3),

  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["cpp", "java", "javascript"]),
        completeCode: z.string().min(1, "Complete code is required"),
      }),
    )
    .length(3),
});

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

function AdminUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const draftKey = `updateProblemDraft-${id}`;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cooldown, startCooldown } = useRateLimit();

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
      timeLimit: 2,
      memoryLimit: 262144,

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

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const savedDraft = sessionStorage.getItem(draftKey);

        if (savedDraft) {
          reset(JSON.parse(savedDraft));
          setLoading(false);
          return;
        }

        const response = await axiosClient.get(
          `/problem/admin/problemById/${id}`,
        );

        reset(response.data.data);
      } catch (error) {
        toast.error(getErrorMessage(error));

        if (import.meta.env.DEV) {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id, reset, draftKey]);

  // Auto-save draft to sessionStorage with debounce
  const watchedData = watch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (watchedData.title || watchedData.description) {
        sessionStorage.setItem(draftKey, JSON.stringify(watchedData));
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [watchedData, draftKey]);

  // Clear draft on navigate away, but NOT on page refresh
  useEffect(() => {
    let isUnloading = false;

    const handleBeforeUnload = () => {
      isUnloading = true;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Only clear draft if navigating away, NOT on page refresh
      if (!isUnloading) {
        sessionStorage.removeItem(draftKey);
      }
    };
  }, [draftKey]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await axiosClient.put(`/problem/update/${id}`, data);
      sessionStorage.removeItem(draftKey);
      toast.success("Problem updated successfully!");
      navigate("/admin/update-list");
    } catch (error) {
      if (error.rateLimitedFor) {
        startCooldown(error.rateLimitedFor);
        toast.error(
          error.response?.data?.message ||
            "Too many requests. Please slow down.",
        );
        return;
      }
      toast.error(getErrorMessage(error));
      if (import.meta.env.DEV) {
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || cooldown > 0;

  if (loading) return <AdminUploadSkeleton />;

  return (
    <div style={s.page}>
      <nav style={s.navbar}>
        <div style={s.navLeft}>
          <button onClick={() => navigate(-1)} style={s.backBtn}>
            ← Back
          </button>

          <NavLink to="/" style={{ textDecoration: "none" }}>
            <span style={s.logo}>CodeArena</span>
          </NavLink>
        </div>

        <NavLink to="/admin" style={s.adminLink}>
          <span style={s.adminBox}>Admin Dashboard</span>
        </NavLink>
      </nav>

      <div style={s.main}>
        <div style={s.header}>
          <h1 style={s.heading}>Update Problem</h1>

          <p style={s.subheading}>Edit the details of this coding problem</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, () => {
            toast.error("Please fix validation errors");
          })}
        >
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

              {errors.title && (
                <p style={s.errorText}>{errors.title.message}</p>
              )}
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

              <textarea
                {...register("inputFormat")}
                rows={3}
                style={s.textarea}
              />
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>Output Format</label>

              <textarea
                {...register("outputFormat")}
                rows={3}
                style={s.textarea}
              />
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>Constraints</label>

              <textarea
                {...register("constraints")}
                rows={3}
                style={s.textarea}
              />
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

          <div style={s.card}>
            <div style={s.sectionHeader}>
              <h2 style={s.cardTitle}>Visible Test Cases</h2>

              <button
                type="button"
                style={s.addBtn}
                onClick={() =>
                  appendVisible({
                    input: "",
                    output: "",
                    explanation: "",
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
              type="visibleTestCases"
              visible
            />
          </div>

          <div style={s.card}>
            <div style={s.sectionHeader}>
              <h2 style={s.cardTitle}>Hidden Test Cases</h2>

              <button
                type="button"
                style={s.addBtn}
                onClick={() =>
                  appendHidden({
                    input: "",
                    output: "",
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
              type="hiddenTestCases"
            />
          </div>

          <div style={s.card}>
            <h2 style={s.cardTitle}>Code Templates</h2>

            <div style={s.langContainer}>
              {languageOptions.map((lang, index) => (
                <div key={lang.value}>
                  <span style={s.langBadge}>{lang.label}</span>

                  <div style={{ marginTop: "14px" }}>
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

          {/* Rate limit banner */}
          {cooldown > 0 && (
            <div style={s.rateLimitBanner}>
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#f87171"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z"
                />
              </svg>
              <span style={{ fontSize: "13px", color: "#f87171" }}>
                Too many requests. Please wait {cooldown}s before submitting again.
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            style={{
              ...s.submitBtn,
              opacity: isDisabled ? 0.7 : 1,
            }}
          >
            {isSubmitting
              ? "Updating Problem..."
              : cooldown > 0
                ? `Wait ${cooldown}s`
                : "Update Problem"}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#080c14",
    color: "#c9d1d9",
    fontFamily: "'Sora', sans-serif",
  },

  loadingContainer: {
    minHeight: "100vh",
    background: "#080c14",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#9ca3af",
  },

  navbar: {
    height: "64px",
    borderBottom: "1px solid #1e2738",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
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
    border: "1px solid #1e2738",
    borderRadius: "8px",
    padding: "8px 14px",
    color: "#6b7280",
  },

  main: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px",
  },

  header: {
    marginBottom: "32px",
  },

  heading: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#f9fafb",
  },

  subheading: {
    color: "#6b7280",
    marginTop: "6px",
  },

  card: {
    background: "#0c1018",
    border: "1px solid #1e2738",
    borderRadius: "16px",
    padding: "28px",
    marginBottom: "24px",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "18px",
  },

  formGroup: {
    marginBottom: "16px",
  },

  formGroupFlex: {
    flex: 1,
    minWidth: "180px",
  },

  row: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: 700,
    textTransform: "uppercase",
  },

  input: {
    width: "100%",
    background: "#080c14",
    border: "1px solid #1e2738",
    borderRadius: "10px",
    color: "#e2e8f0",
    padding: "10px 14px",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    background: "#080c14",
    border: "1px solid #1e2738",
    borderRadius: "10px",
    color: "#e2e8f0",
    padding: "10px 14px",
    boxSizing: "border-box",
    resize: "vertical",
    marginBottom: "10px",
  },

  codeArea: {
    width: "100%",
    background: "#080c14",
    border: "1px solid #1e2738",
    borderRadius: "10px",
    color: "#e2e8f0",
    padding: "10px 14px",
    boxSizing: "border-box",
    resize: "vertical",
    marginBottom: "10px",
    fontFamily: "monospace",
  },

  select: {
    width: "100%",
    background: "#080c14",
    border: "1px solid #1e2738",
    borderRadius: "10px",
    color: "#e2e8f0",
    padding: "10px 14px",
  },

  inputError: {
    borderColor: "#ef4444",
  },

  errorText: {
    color: "#f87171",
    fontSize: "12px",
    marginTop: "5px",
  },

  tagWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginTop: "10px",
  },

  tagPill: {
    background: "rgba(99,102,241,0.1)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: "999px",
    color: "#a5b4fc",
    padding: "4px 10px",
    fontSize: "12px",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  addBtn: {
    background: "rgba(99,102,241,0.1)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: "8px",
    color: "#a5b4fc",
    padding: "8px 14px",
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

  caseHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  caseTitle: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#4b5563",
    textTransform: "uppercase",
  },

  langContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },

  langBadge: {
    background: "rgba(234,179,8,0.1)",
    border: "1px solid rgba(234,179,8,0.25)",
    borderRadius: "8px",
    color: "#eab308",
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: 600,
  },

  submitBtn: {
    width: "100%",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.35)",
    borderRadius: "10px",
    color: "#a5b4fc",
    padding: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },

  rateLimitBanner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: "12px",
    padding: "14px 18px",
    marginBottom: "16px",
  },
};

export default AdminUpdate;
