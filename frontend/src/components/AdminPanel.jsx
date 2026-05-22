import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";
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
  {
    value: "cpp",
    label: "C++",
  },
  {
    value: "java",
    label: "Java",
  },
  {
    value: "javascript",
    label: "JavaScript",
  },
];

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  inputFormat: z.string().min(1, "Input format is required"),
  outputFormat: z.string().min(1, "Output format is required"),
  constraints: z.string().min(1, "Constraints are required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
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
    .length(3, "All three languages required"),

  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["cpp", "java", "javascript"]),
        completeCode: z.string().min(1, "Complete code is required"),
      }),
    )
    .length(3, "All three languages required"),
});

function AdminPanel() {
  const navigate = useNavigate();
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
      startCode: [
        {
          language: "cpp",
          initialCode: "",
        },
        {
          language: "java",
          initialCode: "",
        },
        {
          language: "javascript",
          initialCode: "",
        },
      ],
      referenceSolution: [
        {
          language: "cpp",
          completeCode: "",
        },
        {
          language: "java",
          completeCode: "",
        },
        {
          language: "javascript",
          completeCode: "",
        },
      ],
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({
    control,
    name: "visibleTestCases",
  });

  useEffect(() => {
    const savedForm = localStorage.getItem("createProblemDraft");

    if (savedForm) {
      reset(JSON.parse(savedForm));
    }
  }, [reset]);

  const watchedData = watch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (watchedData.title || watchedData.description) {
        localStorage.setItem("createProblemDraft", JSON.stringify(watchedData));
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [watchedData]);

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({
    control,
    name: "hiddenTestCases",
  });

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>
      <form
        onSubmit={handleSubmit(onSubmit, () => {
          toast.error("Please fix validation errors");
        })}
        className="space-y-6"
      >
        {/* Basic Information */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            {/* Title */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                {...register("title")}
                className={`input input-bordered ${errors.title && "input-error"}`}
              />
              {errors.title && (
                <span className="text-error">{errors.title.message}</span>
              )}
            </div>
            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                {...register("description")}
                className={`textarea textarea-bordered h-32 ${errors.description && "textarea-error"}`}
              />
              {errors.description && (
                <span className="text-error">{errors.description.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Input Format</span>
              </label>

              <textarea
                {...register("inputFormat")}
                className={`textarea textarea-bordered h-24 ${
                  errors.inputFormat && "textarea-error"
                }`}
              />

              {errors.inputFormat && (
                <span className="text-error">{errors.inputFormat.message}</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Output Format</span>
              </label>

              <textarea
                {...register("outputFormat")}
                className={`textarea textarea-bordered h-24 ${
                  errors.outputFormat && "textarea-error"
                }`}
              />

              {errors.outputFormat && (
                <span className="text-error">
                  {errors.outputFormat.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Constraints</span>
              </label>

              <textarea
                {...register("constraints")}
                className={`textarea textarea-bordered h-24 ${
                  errors.constraints && "textarea-error"
                }`}
              />

              {errors.constraints && (
                <span className="text-error">{errors.constraints.message}</span>
              )}
            </div>
            <div className="flex gap-4">
              {/* Difficulty */}
              <div className="form-control w-1/2">
                <label className="label">
                  <span className="label-text">Difficulty</span>
                </label>
                <select
                  {...register("difficulty")}
                  className={`select select-bordered ${errors.difficulty && "select-error"}`}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              {/* Tags */}
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <div className="form-control w-1/2">
                    <label className="label">
                      <span className="label-text">Tags</span>
                    </label>
                    <select
                      multiple
                      value={field.value || []}
                      onChange={(e) => {
                        const values = Array.from(
                          e.target.selectedOptions,
                          (option) => option.value,
                        );
                        field.onChange(values);
                      }}
                      className={`select select-bordered h-64 ${errors.tags && "select-error"}`}
                    >
                      {tagOptions.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm opacity-70 mt-1">
                      Hold Cmd (Mac) or Ctrl (Windows) to select multiple tags
                    </span>
                    {errors.tags && (
                      <span className="text-error">{errors.tags.message}</span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
          {/* Visible Test Cases */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Visible Test Cases</h3>
              <button
                type="button"
                onClick={() =>
                  appendVisible({
                    input: "",
                    output: "",
                    explanation: "",
                  })
                }
                className="btn btn-sm btn-primary"
              >
                Add Visible Case
              </button>
            </div>
            {visibleFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVisible(index)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </div>

                <textarea
                  {...register(`visibleTestCases.${index}.input`)}
                  placeholder="Input"
                  className="textarea textarea-bordered w-full font-mono whitespace-pre"
                  rows={4}
                />

                <textarea
                  {...register(`visibleTestCases.${index}.output`)}
                  placeholder="Output"
                  className="textarea textarea-bordered w-full font-mono whitespace-pre"
                  rows={3}
                />

                <textarea
                  {...register(`visibleTestCases.${index}.explanation`)}
                  placeholder="Explanation"
                  className="textarea textarea-bordered w-full"
                  rows={3}
                />
              </div>
            ))}
          </div>

          {errors.visibleTestCases?.message && (
            <span className="text-error">
              {errors.visibleTestCases.message}
            </span>
          )}

          {/* Hidden Test Cases */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Hidden Test Cases</h3>
              <button
                type="button"
                onClick={() =>
                  appendHidden({
                    input: "",
                    output: "",
                  })
                }
                className="btn btn-sm btn-primary"
              >
                Add Hidden Case
              </button>
            </div>
            {hiddenFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-3">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeHidden(index)}
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </div>

                <textarea
                  {...register(`hiddenTestCases.${index}.input`)}
                  placeholder="Input"
                  className={`textarea textarea-bordered w-full font-mono whitespace-pre ${
                    errors.hiddenTestCases?.[index]?.input
                      ? "textarea-error"
                      : ""
                  }`}
                  rows={4}
                />

                {errors.hiddenTestCases?.[index]?.input && (
                  <span className="text-error text-sm">
                    {errors.hiddenTestCases[index].input.message}
                  </span>
                )}

                <textarea
                  {...register(`hiddenTestCases.${index}.output`)}
                  placeholder="Output"
                  className={`textarea textarea-bordered w-full font-mono whitespace-pre ${
                    errors.hiddenTestCases?.[index]?.output
                      ? "textarea-error"
                      : ""
                  }`}
                  rows={3}
                />

                {errors.hiddenTestCases?.[index]?.output && (
                  <span className="text-error text-sm">
                    {errors.hiddenTestCases[index].output.message}
                  </span>
                )}
              </div>
            ))}
          </div>
          {errors.hiddenTestCases?.message && (
            <span className="text-error">{errors.hiddenTestCases.message}</span>
          )}
        </div>

        {/* Code Templates */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Code Templates</h2>
          <div className="space-y-6">
            {languageOptions.map((language, index) => (
              <div key={language.value} className="space-y-2">
                <h3 className="font-medium">{language.label}</h3>
                {/* Initial Code */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Initial Code</span>
                  </label>
                  <pre className="bg-base-300 p-4 rounded-lg">
                    <textarea
                      {...register(`startCode.${index}.initialCode`)}
                      className="w-full bg-transparent font-mono"
                      rows={6}
                    />
                  </pre>
                </div>
                {/* Reference Solution */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Reference Solution</span>
                  </label>
                  <pre className="bg-base-300 p-4 rounded-lg">
                    <textarea
                      {...register(`referenceSolution.${index}.completeCode`)}
                      className="w-full bg-transparent font-mono"
                      rows={6}
                    />
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn btn-primary w-full ${
            isSubmitting ? "btn-disabled" : ""
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Creating Problem...
            </>
          ) : (
            "Create Problem"
          )}
        </button>
      </form>
    </div>
  );
}

export default AdminPanel;
