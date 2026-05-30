import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../../utils/axiosClient";
import { useNavigate, NavLink } from "react-router";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/errorHandler";
import useRateLimit from "../../hooks/useRateLimit.jsx";

import { tagOptions } from "../../constants/problemTags";
import { languageOptions } from "../../constants/problemLanguages";

import { s } from "../../styles/admin/adminPanelStyles";

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  inputFormat: z.string().min(1, "Input format is required"),
  outputFormat: z.string().min(1, "Output format is required"),
  constraints: z.string().min(1, "Constraints are required"),
  timeLimit: z.coerce.number().min(1, "Time limit must be at least 1 second"),
  memoryLimit: z.coerce
    .number()
    .min(1024, "Memory limit must be at least 1024 KB"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z
    .array(z.string().refine((tag) => tagOptions.includes(tag), "Invalid tag"))
    .min(1, "At least one tag is required"),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1),
        output: z.string().min(1),
        explanation: z.string().min(1),
      }),
    )
    .min(1),
  hiddenTestCases: z
    .array(z.object({ input: z.string().min(1), output: z.string().min(1) }))
    .min(1),
  startCode: z
    .array(
      z.object({
        language: z.enum(["cpp", "java", "javascript"]),
        initialCode: z.string().min(1),
      }),
    )
    .length(3),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["cpp", "java", "javascript"]),
        completeCode: z.string().min(1),
      }),
    )
    .length(3),
});

function AdminPanel() {
  const navigate = useNavigate();
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
      tags: [],
      inputFormat: "",
      outputFormat: "",
      constraints: "",
      timeLimit: 2,
      memoryLimit: 262144,
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [{ input: "", output: "" }],
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
  } = useFieldArray({ control, name: "visibleTestCases" });
  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({ control, name: "hiddenTestCases" });

  const watchedData = watch();

  useEffect(() => {
    const savedForm = localStorage.getItem("createProblemDraft");
    if (savedForm) reset(JSON.parse(savedForm));
  }, [reset]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (watchedData.title || watchedData.description) {
        localStorage.setItem("createProblemDraft", JSON.stringify(watchedData));
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
      if (error.rateLimitedFor) {
        startCooldown(error.rateLimitedFor);
        toast.error(
          error.response?.data?.message ||
            "Too many requests. Please slow down.",
        );
        return;
      }
      toast.error(getErrorMessage(error));
      if (import.meta.env.DEV) console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || cooldown > 0;

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.navbar}>
        <div style={s.navLeft}>
          <button onClick={() => navigate(-1)} style={s.backBtn}>
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
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
          <h1 style={s.heading}>Create New Problem</h1>
          <p style={s.subheading}>Add a new coding problem to the platform</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, () =>
            toast.error("Please fix validation errors"),
          )}
        >
          {/* Basic Information */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>Basic Information</h2>

            <div style={s.formGroup}>
              <label style={s.label}>Title</label>
              <input
                {...register("title")}
                style={{ ...s.input, ...(errors.title ? s.inputError : {}) }}
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

            {[
              {
                name: "inputFormat",
                label: "Input Format",
                placeholder: "Describe the input format...",
              },
              {
                name: "outputFormat",
                label: "Output Format",
                placeholder: "Describe the output format...",
              },
              {
                name: "constraints",
                label: "Constraints",
                placeholder: "e.g. 1 ≤ n ≤ 10^5",
              },
            ].map((field) => (
              <div style={s.formGroup} key={field.name}>
                <label style={s.label}>{field.label}</label>
                <textarea
                  {...register(field.name)}
                  rows={3}
                  style={{
                    ...s.textarea,
                    ...(errors[field.name] ? s.inputError : {}),
                  }}
                  placeholder={field.placeholder}
                />
                {errors[field.name] && (
                  <p style={s.errorText}>{errors[field.name]?.message}</p>
                )}
              </div>
            ))}

            <div style={s.row}>
              <div style={{ ...s.formGroup, flex: 1 }}>
                <label style={s.label}>Time Limit (sec)</label>
                <input
                  type="number"
                  min="1"
                  {...register("timeLimit")}
                  style={s.input}
                />
                {errors.timeLimit && (
                  <p style={s.errorText}>{errors.timeLimit.message}</p>
                )}
              </div>
              <div style={{ ...s.formGroup, flex: 1 }}>
                <label style={s.label}>Memory Limit (KB)</label>
                <input
                  type="number"
                  min="1024"
                  {...register("memoryLimit")}
                  style={s.input}
                />
                {errors.memoryLimit && (
                  <p style={s.errorText}>{errors.memoryLimit.message}</p>
                )}
              </div>
            </div>

            <div style={s.row}>
              <div style={{ ...s.formGroup, flex: 1 }}>
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
                  <div style={{ ...s.formGroup, flex: 2 }}>
                    <label style={s.label}>Tags</label>
                    <select
                      multiple
                      value={field.value || []}
                      onChange={(e) =>
                        field.onChange(
                          Array.from(e.target.selectedOptions, (o) => o.value),
                        )
                      }
                      style={{ ...s.select, height: "160px" }}
                    >
                      {tagOptions.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                    {field.value?.length > 0 && (
                      <div style={s.tagWrap}>
                        {field.value.map((tag) => (
                          <span key={tag} style={s.tagPill}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {errors.tags && (
                      <p style={s.errorText}>{errors.tags.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Test Cases */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>Test Cases</h2>
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
            <h2 style={s.cardTitle}>Code Templates</h2>
            <div style={s.codeWrap}>
              {languageOptions.map((lang, index) => (
                <div key={lang.value}>
                  <span style={s.langBadge}>{lang.label}</span>
                  <div style={{ marginTop: "14px" }}>
                    <div style={s.formGroup}>
                      <label style={s.label}>Starter Code</label>
                      <textarea
                        {...register(`startCode.${index}.initialCode`)}
                        rows={7}
                        style={{ ...s.textarea, fontFamily: "monospace" }}
                      />
                    </div>
                    <div style={s.formGroup}>
                      <label style={s.label}>Reference Solution</label>
                      <textarea
                        {...register(`referenceSolution.${index}.completeCode`)}
                        rows={7}
                        style={{ ...s.textarea, fontFamily: "monospace" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rate limit banner — shown above submit so admin sees it clearly */}
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
                Too many requests. Please wait {cooldown}s before submitting
                again.
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isDisabled}
            style={{ ...s.submitBtn, opacity: isDisabled ? 0.7 : 1 }}
          >
            {isSubmitting
              ? "Creating Problem..."
              : cooldown > 0
                ? `Wait ${cooldown}s`
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
        <h3 style={s.sectionTitle}>{title}</h3>
        <button
          type="button"
          style={s.addBtn}
          onClick={() =>
            append(
              visible
                ? { input: "", output: "", explanation: "" }
                : { input: "", output: "" },
            )
          }
        >
          + Add Case
        </button>
      </div>
      <div style={s.column}>
        {fields.map((field, index) => (
          <div key={field.id} style={s.caseCard}>
            <div style={s.caseTop}>
              <span style={s.caseLabel}>Case {index + 1}</span>
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
    </div>
  );
}

export default AdminPanel;
