import { useEffect, useState, useCallback, useRef } from "react";
import axiosClient from "../utils/axiosClient";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router";
import { getErrorMessage } from "../utils/errorHandler";
import TableSkeleton from "../components/skeletons/TableSkeleton";

const tagOptions = [
  "array", "string", "stack", "queue", "hashing", "sorting", "binarySearch",
  "twoPointers", "slidingWindow", "recursion", "backtracking", "greedy",
  "heap", "trie", "graph", "dfs", "bfs", "dp", "bitManipulation", "math",
  "prefixSum", "matrix", "unionFind", "segmentTree", "topologicalSort", "shortestPath",
];

const PAGE_LIMIT = 5;

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const AdminDelete = () => {
  const navigate = useNavigate();

  const [problems,   setProblems]   = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1, totalPages: 1, totalProblems: 0,
    hasNextPage: false, hasPrevPage: false,
  });
  const [loading,    setLoading]    = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ difficulty: "", tags: [] });
  const [tagsOpen, setTagsOpen] = useState(false);

  const tagDropdownRef = useRef(null);

  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(e.target)) {
        setTagsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const buildQueryString = useCallback((page, search, f) => {
    const params = new URLSearchParams();
    params.set("page",  page);
    params.set("limit", PAGE_LIMIT);
    if (search.trim())     params.set("q",         search.trim());
    if (f.difficulty)      params.set("difficulty", f.difficulty);
    if (f.tags.length > 0) params.set("tags",       f.tags.join(","));
    return params.toString();
  }, []);

  const fetchProblems = useCallback(async (page, search, f) => {  
    try {
      setLoading(true);
      /// For testing purpose add here an await delay of 5s to see the skeleton loader in action
      // await new Promise(resolve => setTimeout(resolve, 5000));
      
      const qs = buildQueryString(page, search, f);
      const { data } = await axiosClient.get(`/problem/getProblems?${qs}`);
      if (!data.success) {
        toast.error(data.errors?.[0] || "Failed to fetch problems");
        return;
      }
      setProblems(data.problems);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(getErrorMessage(err));
      if (import.meta.env.DEV) console.error(err);
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);

  useEffect(() => {
    fetchProblems(currentPage, debouncedSearch, filters);
  }, [currentPage, debouncedSearch, filters]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setCurrentPage(1);
  }, [debouncedSearch, filters]);

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleTag = (tag) =>
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));

  const clearAllFilters = () => {
    setSearchInput("");
    setFilters({ difficulty: "", tags: [] });
    setCurrentPage(1);
    setTagsOpen(false);
  };

  const hasActiveFilters =
    searchInput.trim() || filters.difficulty || filters.tags.length > 0;

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
      setDeletingId(id);
      await axiosClient.delete(`/problem/delete/${id}`);
      toast.success("Problem deleted successfully");
      const isLastItemOnPage = problems.length === 1 && currentPage > 1;
      if (isLastItemOnPage) {
        setCurrentPage((p) => p - 1);
      } else {
        fetchProblems(currentPage, debouncedSearch, filters);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
      if (import.meta.env.DEV) console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const { currentPage: pg, totalPages, totalProblems, hasNextPage, hasPrevPage } = pagination;

  if (loading) return <TableSkeleton rows={5} />;

  return (
    <div style={s.page}>

      <nav style={s.navbar}>
        <div style={s.navLeft}>
          <button onClick={() => navigate(-1)} style={s.backBtn}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <span style={s.logo}>CodeArena</span>
          </NavLink>
        </div>
        <NavLink to="/admin" style={{ textDecoration: "none" }}>
          <span style={s.adminBox}>Admin Dashboard</span>
        </NavLink>
      </nav>

      <div style={s.main}>

        <div style={s.header}>
          <h1 style={s.heading}>Delete Problems</h1>
          <p style={s.subheading}>Remove outdated or invalid coding problems from the platform</p>
        </div>

        <div style={s.searchWrapper}>
          <svg style={s.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            style={s.searchInput}
            type="text"
            placeholder="Search by problem number or title…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button style={s.searchClear} onClick={() => setSearchInput("")}>✕</button>
          )}
        </div>

        <div style={s.filterRow}>
          <select
            value={filters.difficulty}
            onChange={(e) => updateFilter("difficulty", e.target.value)}
            style={s.select}
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <div style={s.tagDropdownWrapper} ref={tagDropdownRef}>
            <button
              type="button"
              style={{ ...s.select, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              onClick={() => setTagsOpen((prev) => !prev)}
            >
              <span>
                {filters.tags.length === 0
                  ? "All Tags"
                  : `${filters.tags.length} tag${filters.tags.length > 1 ? "s" : ""} selected`}
              </span>
              <svg
                style={{ marginLeft: "auto", flexShrink: 0 }}
                width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="#6b7280" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
              >
                {tagsOpen
                  ? <path d="M18 15l-6-6-6 6" />
                  : <path d="M6 9l6 6 6-6" />
                }
              </svg>
            </button>

            {tagsOpen && (
              <div style={s.tagDropdownPanel}>
                <div style={s.tagGrid}>
                  {tagOptions.map((tag) => {
                    const active = filters.tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        style={{ ...s.tagPill, ...(active ? s.tagPillActive : {}) }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                {filters.tags.length > 0 && (
                  <button
                    style={s.clearTagsBtn}
                    onClick={() => updateFilter("tags", [])}
                    type="button"
                  >
                    Clear tags
                  </button>
                )}
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <button style={s.clearAllBtn} onClick={clearAllFilters} type="button">
              ✕ Clear all
            </button>
          )}
        </div>

        {filters.tags.length > 0 && (
          <div style={s.activeTagsRow}>
            {filters.tags.map((tag) => (
              <span key={tag} style={s.activeTagPill}>
                {tag}
                <button style={s.removeTagBtn} onClick={() => toggleTag(tag)}>✕</button>
              </span>
            ))}
          </div>
        )}

        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {["#", "Title", "Difficulty", "Tags", "Action"].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {problems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#4b5563" }}>
                    No problems found
                  </td>
                </tr>
              ) : (
                problems.map((problem, index) => (
                  <tr key={problem._id} style={s.tr}>
                    <td style={s.td}>{problem.problemNo ?? (pg - 1) * PAGE_LIMIT + index + 1}</td>
                    <td style={{ ...s.td, color: "#e2e8f0", fontWeight: 600 }}>{problem.title}</td>
                    <td style={s.td}>
                      <span style={getDifficultyStyle(problem.difficulty)}>{problem.difficulty}</span>
                    </td>
                    <td style={s.td}>
                      <div style={s.tagRow}>
                        {problem.tags.map((tag, i) => (
                          <span key={i} style={s.tag}>{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td style={s.td}>
                      <button
                        onClick={() => handleDelete(problem._id)}
                        disabled={deletingId === problem._id}
                        style={{
                          ...s.deleteBtn,
                          opacity: deletingId === problem._id ? 0.6 : 1,
                          cursor: deletingId === problem._id ? "not-allowed" : "pointer",
                        }}
                      >
                        {deletingId === problem._id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {problems.length > 0 && (
          <>
            <div style={s.paginationInfo}>
              Showing {(pg - 1) * PAGE_LIMIT + 1}–{Math.min(pg * PAGE_LIMIT, totalProblems)} of {totalProblems} problems
            </div>
            <div style={s.pagination}>
              <button
                disabled={!hasPrevPage}
                onClick={() => setCurrentPage((p) => p - 1)}
                style={{ ...s.pageBtn, opacity: hasPrevPage ? 1 : 0.4 }}
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - pg) <= 2)
                .reduce((acc, n, i, arr) => {
                  if (i > 0 && n - arr[i - 1] > 1) acc.push("...");
                  acc.push(n);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === "..." ? (
                    <span key={`ellipsis-${i}`} style={{ color: "#4b5563", padding: "0 4px" }}>…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      style={{ ...s.pageBtn, ...(pg === item ? s.pageBtnActive : {}) }}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                disabled={!hasNextPage}
                onClick={() => setCurrentPage((p) => p + 1)}
                style={{ ...s.pageBtn, opacity: hasNextPage ? 1 : 0.4 }}
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const s = {
  page:       { minHeight: "100vh", background: "#080c14", fontFamily: "'Sora', sans-serif", color: "#c9d1d9" },
  navbar:     { height: "64px", background: "#080c14", borderBottom: "1px solid #1e2738", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", position: "sticky", top: 0, zIndex: 100 },
  navLeft:    { display: "flex", alignItems: "center", gap: "20px" },
  backBtn:    { display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "1px solid #1e2738", borderRadius: "8px", color: "#9ca3af", fontSize: "13px", fontWeight: 600, padding: "6px 14px", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  logo:       { fontSize: "20px", fontWeight: 700, color: "#a5b4fc" },
  adminBox:   { fontSize: "13px", color: "#6b7280", fontWeight: 500, border: "1px solid #1e2738", borderRadius: "8px", padding: "6px 14px", background: "#0c1018" },
  main:       { padding: "48px 40px", maxWidth: "1200px", margin: "0 auto" },
  header:     { marginBottom: "36px" },
  heading:    { fontSize: "28px", fontWeight: 700, color: "#f9fafb", marginBottom: "8px" },
  subheading: { fontSize: "14px", color: "#6b7280" },
  searchWrapper: { position: "relative", display: "flex", alignItems: "center", marginBottom: "20px" },
  searchIcon:    { position: "absolute", left: "16px", width: "16px", height: "16px", color: "#4b5563", pointerEvents: "none" },
  searchInput:   { width: "100%", background: "#0c1018", border: "1px solid #1e2738", borderRadius: "12px", color: "#e2e8f0", fontSize: "14px", fontWeight: 500, padding: "12px 44px", outline: "none", fontFamily: "'Sora', sans-serif", boxSizing: "border-box" },
  searchClear:   { position: "absolute", right: "16px", background: "transparent", border: "none", color: "#4b5563", cursor: "pointer", fontSize: "14px" },
  filterRow:          { display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap", alignItems: "flex-start" },
  select:             { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "10px", color: "#9ca3af", fontSize: "14px", fontWeight: 500, padding: "10px 18px", outline: "none", minWidth: "160px", fontFamily: "'Sora', sans-serif" },
  tagDropdownWrapper: { position: "relative" },
  tagDropdownPanel:   { position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#0c1018", border: "1px solid #1e2738", borderRadius: "14px", padding: "16px", zIndex: 150, width: "360px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" },
  tagGrid:            { display: "flex", flexWrap: "wrap", gap: "8px" },
  tagPill:            { background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "999px", color: "#6b7280", fontSize: "12px", fontWeight: 600, padding: "5px 12px", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  tagPillActive:      { background: "rgba(99,102,241,0.25)", border: "1px solid rgba(99,102,241,0.5)", color: "#a5b4fc" },
  clearTagsBtn:       { marginTop: "12px", background: "transparent", border: "none", color: "#6366f1", fontSize: "13px", cursor: "pointer" },
  clearAllBtn:        { background: "transparent", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", color: "#ef4444", fontSize: "13px", fontWeight: 600, padding: "10px 16px", cursor: "pointer" },
  activeTagsRow:  { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" },
  activeTagPill:  { display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "999px", color: "#a5b4fc", fontSize: "12px", fontWeight: 600, padding: "4px 10px 4px 12px" },
  removeTagBtn:   { background: "transparent", border: "none", color: "#6366f1", cursor: "pointer", fontSize: "11px" },
  tableWrap:  { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "16px", overflow: "hidden" },
  table:      { width: "100%", borderCollapse: "collapse" },
  th:         { padding: "14px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em", background: "#0a0e18", borderBottom: "1px solid #1e2738" },
  tr:         { borderBottom: "1px solid #1e2738" },
  td:         { padding: "16px 20px", fontSize: "14px", color: "#9ca3af", verticalAlign: "middle" },
  tagRow:     { display: "flex", flexWrap: "wrap", gap: "6px" },
  tag:        { background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "999px", color: "#a5b4fc", fontSize: "11px", fontWeight: 600, padding: "3px 9px" },
  deleteBtn:  { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", color: "#f87171", fontSize: "13px", fontWeight: 600, padding: "7px 16px", fontFamily: "'Sora', sans-serif" },
  paginationInfo: { textAlign: "center", fontSize: "13px", color: "#4b5563", marginTop: "32px", marginBottom: "20px" },
  pagination:     { display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", paddingBottom: "40px", flexWrap: "wrap" },
  pageBtn:        { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "8px", color: "#9ca3af", fontSize: "13px", fontWeight: 600, padding: "8px 14px", cursor: "pointer", fontFamily: "'Sora', sans-serif", minWidth: "40px" },
  pageBtnActive:  { background: "#4f46e5", border: "1px solid #6366f1", color: "#fff" },
};

const getDifficultyStyle = (difficulty) => {
  const base = { borderRadius: "999px", fontSize: "11px", fontWeight: 600, padding: "3px 10px", textTransform: "capitalize" };
  switch (difficulty?.toLowerCase()) {
    case "easy":   return { ...base, background: "rgba(34,197,94,0.1)",  color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)"  };
    case "medium": return { ...base, background: "rgba(234,179,8,0.1)",  color: "#eab308", border: "1px solid rgba(234,179,8,0.2)"  };
    case "hard":   return { ...base, background: "rgba(239,68,68,0.1)",  color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)"  };
    default:       return { ...base, background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" };
  }
};

export default AdminDelete;