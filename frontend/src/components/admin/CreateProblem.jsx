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

import BasicInformationSection from "./forms/BasicInformationSection";
import VisibleTestCasesSection from "./forms/VisibleTestCasesSection";
import HiddenTestCasesSection from "./forms/HiddenTestCasesSection";
import TestCaseBlock from "./forms/TestCaseBlock";
import CodeTemplatesSection from "./forms/CodeTemplatesSection";

import { s } from '../../styles/admin/createProblemStyles';

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

function CreateProblem() {
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
          <BasicInformationSection
            register={register}
            errors={errors}
            control={control}
            tagOptions={tagOptions}
          />

          {/* Test Cases */}
          <VisibleTestCasesSection
            appendVisible={appendVisible}
            visibleFields={visibleFields}
            register={register}
            removeVisible={removeVisible}
            TestCaseBlock={TestCaseBlock}
          />

          <HiddenTestCasesSection
            appendHidden={appendHidden}
            hiddenFields={hiddenFields}
            register={register}
            removeHidden={removeHidden}
            TestCaseBlock={TestCaseBlock}
          />

          {/* Code Templates */}
          <CodeTemplatesSection
            languageOptions={languageOptions}
            register={register}
          />

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

export default CreateProblem;