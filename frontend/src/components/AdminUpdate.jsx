import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate, useParams, NavLink } from "react-router";
import toast from "react-hot-toast";

const tagOptions = [
  "array","string","stack","queue","hashing","sorting","binarySearch",
  "twoPointers","slidingWindow","recursion","backtracking","greedy","heap",
  "trie","graph","dfs","bfs","dp","bitManipulation","math","prefixSum",
  "matrix","unionFind","segmentTree","topologicalSort","shortestPath",
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
  tags: z.array(z.string().refine((tag) => tagOptions.includes(tag), "Invalid tag")).min(1, "At least one tag is required"),
  visibleTestCases: z.array(z.object({ input: z.string().min(1), output: z.string().min(1), explanation: z.string().min(1) })).min(1),
  hiddenTestCases: z.array(z.object({ input: z.string().min(1), output: z.string().min(1) })).min(1),
  startCode: z.array(z.object({ language: z.enum(["cpp","java","javascript"]), initialCode: z.string().min(1) })).length(3),
  referenceSolution: z.array(z.object({ language: z.enum(["cpp","java","javascript"]), completeCode: z.string().min(1) })).length(3),
});

function AdminUpdate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      difficulty: "easy", tags: [], inputFormat: "", outputFormat: "", constraints: "",
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [{ input: "", output: "" }],
      startCode: [{ language: "cpp", initialCode: "" }, { language: "java", initialCode: "" }, { language: "javascript", initialCode: "" }],
      referenceSolution: [{ language: "cpp", completeCode: "" }, { language: "java", completeCode: "" }, { language: "javascript", completeCode: "" }],
    },
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({ control, name: "visibleTestCases" });
  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({ control, name: "hiddenTestCases", keyName: "fieldId" });

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axiosClient.get(`/problem/admin/problemById/${id}`);
        reset(response.data);
      } catch {
        toast.error("Failed to fetch problem");
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await axiosClient.put(`/problem/update/${id}`, data);
      toast.success("Problem updated successfully!");
      navigate("/admin/update-list");
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ minHeight: "100vh", background: "#080c14" }} />;

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.navbar}>
        <div style={s.navLeft}>
          <button onClick={() => navigate(-1)} style={s.backBtn}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <span style={s.logo}>LeetLab</span>
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

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* ── Basic Information ── */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>Basic Information</h2>

            <div style={s.formGroup}>
              <label style={s.label}>Title</label>
              <input {...register("title")} style={{ ...s.input, ...(errors.title ? s.inputError : {}) }} placeholder="Problem title" />
              {errors.title && <p style={s.errorText}>{errors.title.message}</p>}
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>Description</label>
              <textarea {...register("description")} rows={5} style={{ ...s.textarea, ...(errors.description ? s.inputError : {}) }} placeholder="Problem description..." />
              {errors.description && <p style={s.errorText}>{errors.description.message}</p>}
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>Input Format</label>
              <textarea {...register("inputFormat")} rows={3} style={{ ...s.textarea, ...(errors.inputFormat ? s.inputError : {}) }} placeholder="Describe the input format..." />
              {errors.inputFormat && <p style={s.errorText}>{errors.inputFormat.message}</p>}
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>Output Format</label>
              <textarea {...register("outputFormat")} rows={3} style={{ ...s.textarea, ...(errors.outputFormat ? s.inputError : {}) }} placeholder="Describe the output format..." />
              {errors.outputFormat && <p style={s.errorText}>{errors.outputFormat.message}</p>}
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>Constraints</label>
              <textarea {...register("constraints")} rows={3} style={{ ...s.textarea, ...(errors.constraints ? s.inputError : {}) }} placeholder="e.g. 1 ≤ n ≤ 10^5" />
              {errors.constraints && <p style={s.errorText}>{errors.constraints.message}</p>}
            </div>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {/* Difficulty */}
              <div style={{ ...s.formGroup, flex: 1, minWidth: "160px" }}>
                <label style={s.label}>Difficulty</label>
                <select {...register("difficulty")} style={s.select}>
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
                  <div style={{ ...s.formGroup, flex: 2, minWidth: "240px" }}>
                    <label style={s.label}>Tags <span style={{ color: "#4b5563", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(hold Ctrl/Cmd to multi-select)</span></label>
                    <select
                      multiple
                      value={field.value || []}
                      onChange={(e) => field.onChange(Array.from(e.target.selectedOptions, (o) => o.value))}
                      style={{ ...s.select, height: "160px" }}
                    >
                      {tagOptions.map((tag) => (
                        <option key={tag} value={tag} style={{ padding: "4px 0" }}>{tag}</option>
                      ))}
                    </select>
                    {/* Selected tag pills */}
                    {field.value?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                        {field.value.map((tag) => (
                          <span key={tag} style={s.tagPill}>{tag}</span>
                        ))}
                      </div>
                    )}
                    {errors.tags && <p style={s.errorText}>{errors.tags.message}</p>}
                  </div>
                )}
              />
            </div>
          </div>

          {/* ── Test Cases ── */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>Test Cases</h2>

            {/* Visible */}
            <div style={{ marginBottom: "28px" }}>
              <div style={s.sectionHeader}>
                <h3 style={s.sectionTitle}>Visible Test Cases</h3>
                <button type="button" style={s.addBtn} onClick={() => appendVisible({ input: "", output: "", explanation: "" })}>+ Add Case</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {visibleFields.map((field, index) => (
                  <div key={field.id} style={s.caseCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.05em" }}>Case {index + 1}</span>
                      <button type="button" style={s.removeBtn} onClick={() => removeVisible(index)}>Remove</button>
                    </div>
                    <textarea {...register(`visibleTestCases.${index}.input`)} placeholder="Input" rows={3} style={{ ...s.textarea, fontFamily: "monospace", marginBottom: "8px" }} />
                    <textarea {...register(`visibleTestCases.${index}.output`)} placeholder="Output" rows={2} style={{ ...s.textarea, fontFamily: "monospace", marginBottom: "8px" }} />
                    <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation" rows={2} style={s.textarea} />
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden */}
            <div>
              <div style={s.sectionHeader}>
                <h3 style={s.sectionTitle}>Hidden Test Cases</h3>
                <button type="button" style={s.addBtn} onClick={() => appendHidden({ input: "", output: "" })}>+ Add Case</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {hiddenFields.map((field, index) => (
                  <div key={field.fieldId} style={s.caseCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.05em" }}>Hidden Case {index + 1}</span>
                      <button type="button" style={s.removeBtn} onClick={() => removeHidden(index)}>Remove</button>
                    </div>
                    <textarea {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" rows={3} style={{ ...s.textarea, fontFamily: "monospace", marginBottom: "8px" }} />
                    <textarea {...register(`hiddenTestCases.${index}.output`)} placeholder="Output" rows={2} style={{ ...s.textarea, fontFamily: "monospace" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Code Templates ── */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>Code Templates</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {languageOptions.map((lang, index) => (
                <div key={lang.value}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <span style={s.langBadge}>{lang.label}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={s.formGroup}>
                      <label style={s.label}>Initial Code (Starter Template)</label>
                      <textarea {...register(`startCode.${index}.initialCode`)} rows={7} style={{ ...s.textarea, fontFamily: "monospace" }} placeholder={`// ${lang.label} starter code`} />
                    </div>
                    <div style={s.formGroup}>
                      <label style={s.label}>Reference Solution</label>
                      <textarea {...register(`referenceSolution.${index}.completeCode`)} rows={7} style={{ ...s.textarea, fontFamily: "monospace" }} placeholder={`// ${lang.label} solution`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ ...s.submitBtn, opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
          >
            {isSubmitting ? "Updating Problem..." : "Update Problem"}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#080c14", fontFamily: "'Sora', sans-serif", color: "#c9d1d9" },
  navbar: { height: "64px", background: "#080c14", borderBottom: "1px solid #1e2738", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", position: "sticky", top: 0, zIndex: 100 },
  navLeft: { display: "flex", alignItems: "center", gap: "20px" },
  backBtn: { display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "1px solid #1e2738", borderRadius: "8px", color: "#9ca3af", fontSize: "13px", fontWeight: 600, padding: "6px 14px", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  logo: { fontSize: "20px", fontWeight: 700, color: "#a5b4fc" },
  adminLink: { textDecoration: "none" },
  adminBox: { fontSize: "13px", color: "#6b7280", fontWeight: 500, border: "1px solid #1e2738", borderRadius: "8px", padding: "6px 14px", background: "#0c1018" },
  main: { padding: "48px 40px", maxWidth: "900px", margin: "0 auto" },
  header: { marginBottom: "36px" },
  heading: { fontSize: "28px", fontWeight: 700, color: "#f9fafb", marginBottom: "8px" },
  subheading: { fontSize: "14px", color: "#6b7280" },
  card: { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "16px", padding: "28px" },
  cardTitle: { fontSize: "16px", fontWeight: 700, color: "#f9fafb", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid #1e2738" },
  formGroup: { marginBottom: "16px" },
  label: { display: "block", fontSize: "11px", fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" },
  input: { width: "100%", background: "#080c14", border: "1px solid #1e2738", borderRadius: "10px", color: "#e2e8f0", fontSize: "14px", fontFamily: "'Sora', sans-serif", padding: "10px 14px", outline: "none", boxSizing: "border-box" },
  textarea: { width: "100%", background: "#080c14", border: "1px solid #1e2738", borderRadius: "10px", color: "#e2e8f0", fontSize: "13px", fontFamily: "'Sora', sans-serif", padding: "10px 14px", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 },
  select: { width: "100%", background: "#080c14", border: "1px solid #1e2738", borderRadius: "10px", color: "#e2e8f0", fontSize: "13px", fontFamily: "'Sora', sans-serif", padding: "10px 14px", outline: "none", boxSizing: "border-box" },
  inputError: { borderColor: "rgba(239,68,68,0.4)" },
  errorText: { fontSize: "12px", color: "#f87171", marginTop: "5px" },
  tagPill: { background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "999px", color: "#a5b4fc", fontSize: "11px", fontWeight: 600, padding: "3px 9px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  sectionTitle: { fontSize: "14px", fontWeight: 600, color: "#9ca3af" },
  addBtn: { background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "8px", color: "#a5b4fc", fontSize: "12px", fontWeight: 600, padding: "6px 14px", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  removeBtn: { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "6px", color: "#f87171", fontSize: "11px", fontWeight: 600, padding: "4px 10px", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  caseCard: { background: "#080c14", border: "1px solid #1e2738", borderRadius: "12px", padding: "16px" },
  langBadge: { background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.25)", borderRadius: "8px", color: "#eab308", fontSize: "12px", fontWeight: 600, padding: "4px 12px" },
  submitBtn: { background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)", borderRadius: "10px", color: "#a5b4fc", fontSize: "14px", fontWeight: 700, padding: "14px", fontFamily: "'Sora', sans-serif", width: "100%" },
};

export default AdminUpdate;