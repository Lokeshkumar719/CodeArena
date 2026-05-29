import { useEffect, useState, useCallback, useRef } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import toast from "react-hot-toast";
import ProblemListSkeleton from "../components/skeletons/ProblemListSkeleton";

const tagOptions = [
  "array", "string", "stack", "queue", "hashing", "sorting",
  "binarySearch", "twoPointers", "slidingWindow", "recursion",
  "backtracking", "greedy", "heap", "trie", "graph", "dfs",
  "bfs", "dp", "bitManipulation", "math", "prefixSum", "matrix",
  "unionFind", "segmentTree", "topologicalSort", "shortestPath",
];

const PAGE_LIMIT = 5;

const getDifficultyStyle = (difficulty) => {
  const base = { borderRadius: "999px", fontSize: "12px", fontWeight: 600, padding: "4px 12px" };
  const styles = {
    easy:   { background: "rgba(34,197,94,0.1)",  color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)"  },
    medium: { background: "rgba(234,179,8,0.1)",  color: "#eab308", border: "1px solid rgba(234,179,8,0.2)"  },
    hard:   { background: "rgba(239,68,68,0.1)",  color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)"  },
  };
  return { ...base, ...(styles[difficulty?.toLowerCase()] || { background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }) };
};

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ── Chevron SVG — shared by all dropdowns ─────────────────────────────────
function Chevron({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        flexShrink: 0,
        transition: "transform 0.2s ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// ── Generic single-select dropdown (replaces <select>) ────────────────────
// Renders identically on Windows, macOS, Linux — no OS chrome involved.
function CustomSelect({ value, onChange, options, placeholder, dropdownRef, isOpen, onToggle }) {
  const selected = options.find((o) => o.value === value);

  return (
    <div style={s.selectWrapper} ref={dropdownRef}>
      <button
        type="button"
        style={s.selectBtn}
        onClick={onToggle}
      >
        <span style={{ color: value ? "#e2e8f0" : "#9ca3af" }}>
          {selected ? selected.label : placeholder}
        </span>
        <Chevron open={isOpen} />
      </button>

      {isOpen && (
        <div style={s.selectDropdown}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              style={{
                ...s.selectOption,
                ...(value === opt.value ? s.selectOptionActive : {}),
              }}
              onClick={() => {
                onChange(opt.value);
                onToggle();
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const difficultyOptions = [
  { value: "", label: "All Difficulties" },
  { value: "easy",   label: "Easy"   },
  { value: "medium", label: "Medium" },
  { value: "hard",   label: "Hard"   },
];

const statusOptions = [
  { value: "",         label: "All Problems" },
  { value: "solved",   label: "Solved"       },
  { value: "unsolved", label: "Unsolved"     },
];

// ─────────────────────────────────────────────────────────────────────────────

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [problems,   setProblems]   = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalProblems: 0, hasNextPage: false, hasPrevPage: false });
  const [loading,    setLoading]    = useState(false);

  // ── Which panel is open — only one at a time ──────────────────────────────
  // "difficulty" | "status" | "tags" | "user" | null
  const [openPanel, setOpenPanel] = useState(null);

  const toggle = (panel) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  // ── Refs for outside-click ────────────────────────────────────────────────
  const difficultyRef = useRef(null);
  const statusRef     = useRef(null);
  const tagDropdownRef  = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const refs = [difficultyRef, statusRef, tagDropdownRef, userDropdownRef];
      if (refs.every((r) => !r.current?.contains(e.target))) {
        setOpenPanel(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ── Filter + search state ─────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ difficulty: "", tags: [], status: "" });

  const debouncedSearch = useDebounce(searchInput, 400);

  const buildQueryString = useCallback((page, search, f) => {
    const params = new URLSearchParams();
    params.set("page",  page);
    params.set("limit", PAGE_LIMIT);
    if (search.trim())     params.set("q",         search.trim());
    if (f.difficulty)      params.set("difficulty", f.difficulty);
    if (f.tags.length > 0) params.set("tags",       f.tags.join(","));
    if (f.status)          params.set("status",     f.status);
    return params.toString();
  }, []);

  const fetchProblems = useCallback(async (page, search, f) => {
    setLoading(true);
    try {
      /// For testing purpose add here an await delay of 5s to see the skeleton loader in action
      // await new Promise(resolve => setTimeout(resolve, 7000));
      const qs = buildQueryString(page, search, f);
      const { data } = await axiosClient.get(`/problem/getProblems?${qs}`);
      if (!data.success) {
        toast.error(data.errors?.[0] || "Invalid query");
        return;
      }
      setProblems(data.problems);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0] || "Failed to fetch problems");
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
    setFilters({ difficulty: "", tags: [], status: "" });
    setCurrentPage(1);
    setOpenPanel(null);
  };

  const hasActiveFilters =
    searchInput.trim() || filters.difficulty || filters.tags.length > 0 || filters.status;

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(resultAction)) {
      toast.success("Logged out successfully", { duration: 500 });
      setOpenPanel(null);
      return;
    }
    toast.error(resultAction.payload || "Logout failed");
  };

  const { currentPage: pg, totalPages, totalProblems, hasNextPage, hasPrevPage } = pagination;

  return (
    <div style={s.page}>
      {/* ── Navbar ── */}
      <nav style={s.navbar}>
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <span style={s.logo}>CodeArena</span>
        </NavLink>

        <div style={{ position: "relative" }} ref={userDropdownRef}>
          <button
            style={s.userBtn}
            onClick={() => toggle("user")}
          >
            {user?.firstName} <Chevron open={openPanel === "user"} />
          </button>
          {openPanel === "user" && (
            <div style={s.dropdown}>
              {user?.role?.toLowerCase() === "admin" && (
                <NavLink to="/admin" style={s.dropdownItem} onClick={() => setOpenPanel(null)}>
                  ⚙️ Admin
                </NavLink>
              )}
              <NavLink to="/change-password" style={s.dropdownItem} onClick={() => setOpenPanel(null)}>
                🔒 Change Password
              </NavLink>
              <button
                onClick={handleLogout}
                style={{ ...s.dropdownItem, background: "transparent", border: "none", width: "100%", textAlign: "left" }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div style={s.main}>
        {/* ── Search bar ── */}
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

        {/* ── Filters row ── */}
        <div style={s.filterRow}>
          {/* Difficulty — custom dropdown */}
          <CustomSelect
            value={filters.difficulty}
            onChange={(v) => updateFilter("difficulty", v)}
            options={difficultyOptions}
            placeholder="All Difficulties"
            dropdownRef={difficultyRef}
            isOpen={openPanel === "difficulty"}
            onToggle={() => toggle("difficulty")}
          />

          {/* Status — custom dropdown */}
          <CustomSelect
            value={filters.status}
            onChange={(v) => updateFilter("status", v)}
            options={statusOptions}
            placeholder="All Problems"
            dropdownRef={statusRef}
            isOpen={openPanel === "status"}
            onToggle={() => toggle("status")}
          />

          {/* Tags — multi-select panel */}
          <div style={s.tagDropdownWrapper} ref={tagDropdownRef}>
            <button
              style={s.selectBtn}
              onClick={() => toggle("tags")}
              type="button"
            >
              <span style={{ color: filters.tags.length > 0 ? "#e2e8f0" : "#9ca3af" }}>
                {filters.tags.length === 0
                  ? "All Tags"
                  : `${filters.tags.length} tag${filters.tags.length > 1 ? "s" : ""} selected`}
              </span>
              <Chevron open={openPanel === "tags"} />
            </button>

            {openPanel === "tags" && (
              <div style={s.tagDropdownPanel}>
                <div style={s.tagGrid}>
                  {tagOptions.map((tag) => {
                    const active = filters.tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        style={{ ...s.tagPill, ...(active ? s.tagPillActive : {}) }}
                        type="button"
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                {filters.tags.length > 0 && (
                  <button style={s.clearTagsBtn} onClick={() => updateFilter("tags", [])} type="button">
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

        {/* ── Selected tag pills ── */}
        {filters.tags.length > 0 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
            {filters.tags.map((tag) => (
              <span key={tag} style={s.activeTagPill}>
                {tag}
                <button style={s.removeTagBtn} onClick={() => toggleTag(tag)} type="button">✕</button>
              </span>
            ))}
          </div>
        )}

        {/* ── Problem list ── */}
        {loading ? (
          <ProblemListSkeleton count={5} />
        ) : problems.length === 0 ? (
          <div style={s.emptyState}>
            No problems found.{" "}
            {hasActiveFilters && (
              <button style={s.inlineClear} onClick={clearAllFilters}>Clear filters</button>
            )}
          </div>
        ) : (
          <div style={s.problemList}>
            {problems.map((problem) => (
              <div key={problem._id} style={s.problemCard}>
                <div style={s.problemCardTop}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {problem.problemNo && <span style={s.problemNo}>#{problem.problemNo}</span>}
                    <NavLink to={`/problem/${problem._id}`} style={s.problemTitle}>
                      {problem.title}
                    </NavLink>
                  </div>
                  {problem.isSolved && <span style={s.solvedBadge}>✔ Solved</span>}
                </div>
                <div style={s.badgeRow}>
                  <span style={getDifficultyStyle(problem.difficulty)}>{problem.difficulty}</span>
                  {problem.tags.map((tag) => (
                    <span key={tag} style={s.tagBadge}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && problems.length > 0 && (
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
                  ),
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
}

const s = {
  page:    { minHeight: "100vh", background: "#080c14", color: "#c9d1d9", fontFamily: "'Sora', sans-serif" },
  navbar:  { height: "64px", background: "#080c14", borderBottom: "1px solid #1e2738", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", position: "sticky", top: 0, zIndex: 100 },
  logo:    { fontSize: "22px", fontWeight: 700, color: "#a5b4fc", letterSpacing: "0.01em" },

  // ── User button in navbar — slightly different from filter buttons ─────
  userBtn: {
    background: "transparent",
    border: "1px solid #1e2738",
    borderRadius: "8px",
    color: "#9ca3af",
    fontSize: "14px",
    fontWeight: 600,
    padding: "8px 14px",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  dropdown:     { position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#0c1018", border: "1px solid #1e2738", borderRadius: "12px", overflow: "hidden", minWidth: "200px", zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" },
  dropdownItem: { display: "block", width: "100%", padding: "12px 18px", fontSize: "14px", color: "#9ca3af", textDecoration: "none", textAlign: "left", cursor: "pointer", fontFamily: "'Sora', sans-serif" },

  main: { padding: "32px 40px" },
  searchWrapper: { position: "relative", display: "flex", alignItems: "center", marginBottom: "20px" },
  searchIcon:    { position: "absolute", left: "16px", width: "16px", height: "16px", color: "#4b5563", pointerEvents: "none", flexShrink: 0 },
  searchInput:   { width: "100%", background: "#0c1018", border: "1px solid #1e2738", borderRadius: "12px", color: "#e2e8f0", fontSize: "14px", fontWeight: 500, padding: "12px 44px", outline: "none", fontFamily: "'Sora', sans-serif", boxSizing: "border-box", transition: "border-color 0.2s" },
  searchClear:   { position: "absolute", right: "16px", background: "transparent", border: "none", color: "#4b5563", cursor: "pointer", fontSize: "14px", padding: "4px", lineHeight: 1 },

  filterRow: { display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap", alignItems: "flex-start" },

  // ── Unified filter button — used by ALL three dropdowns ───────────────
  selectWrapper: { position: "relative" },
  selectBtn: {
    background: "#0c1018",
    border: "1px solid #1e2738",
    borderRadius: "10px",
    color: "#9ca3af",
    fontSize: "14px",
    fontWeight: 500,
    // fixed padding — same on every OS, no OS chrome to fight
    padding: "10px 14px 10px 16px",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    minWidth: "160px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    outline: "none",
    userSelect: "none",
  },

  // ── Dropdown list for single-select ──────────────────────────────────
  selectDropdown: {
    position: "absolute",
    top: "calc(100% + 6px)",
    left: 0,
    minWidth: "100%",
    background: "#0c1018",
    border: "1px solid #1e2738",
    borderRadius: "10px",
    overflow: "hidden",
    zIndex: 150,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  selectOption: {
    display: "block",
    width: "100%",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#9ca3af",
    background: "transparent",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    whiteSpace: "nowrap",
  },
  selectOptionActive: {
    color: "#a5b4fc",
    background: "rgba(99,102,241,0.1)",
  },

  tagDropdownWrapper: { position: "relative" },
  tagDropdownPanel:   { position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#0c1018", border: "1px solid #1e2738", borderRadius: "14px", padding: "16px", zIndex: 150, width: "360px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" },
  tagGrid:            { display: "flex", flexWrap: "wrap", gap: "8px" },
  tagPill:            { background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "999px", color: "#6b7280", fontSize: "12px", fontWeight: 600, padding: "5px 12px", cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.15s" },
  tagPillActive:      { background: "rgba(99,102,241,0.25)", border: "1px solid rgba(99,102,241,0.5)", color: "#a5b4fc" },
  clearTagsBtn:       { marginTop: "12px", background: "transparent", border: "none", color: "#6366f1", fontSize: "13px", cursor: "pointer", fontFamily: "'Sora', sans-serif", padding: 0 },
  clearAllBtn: { background: "transparent", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", color: "#ef4444", fontSize: "13px", fontWeight: 600, padding: "10px 16px", cursor: "pointer", fontFamily: "'Sora', sans-serif", alignSelf: "flex-start" },
  activeTagPill: { display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "999px", color: "#a5b4fc", fontSize: "12px", fontWeight: 600, padding: "4px 10px 4px 12px" },
  removeTagBtn:  { background: "transparent", border: "none", color: "#6366f1", cursor: "pointer", fontSize: "11px", padding: 0, lineHeight: 1, fontFamily: "'Sora', sans-serif" },
  problemList:    { display: "flex", flexDirection: "column", gap: "12px" },
  problemCard:    { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "16px", padding: "22px 28px" },
  problemCardTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" },
  problemNo:      { fontSize: "13px", fontWeight: 600, color: "#4b5563", minWidth: "32px" },
  problemTitle:   { fontSize: "17px", fontWeight: 600, color: "#e2e8f0", textDecoration: "none" },
  solvedBadge:    { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "999px", color: "#22c55e", fontSize: "12px", fontWeight: 700, padding: "4px 14px", flexShrink: 0 },
  badgeRow:       { display: "flex", gap: "8px", flexWrap: "wrap" },
  tagBadge:       { background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "999px", color: "#a5b4fc", fontSize: "12px", fontWeight: 600, padding: "4px 12px" },
  emptyState:  { textAlign: "center", color: "#4b5563", fontSize: "15px", padding: "60px 0" },
  inlineClear: { background: "transparent", border: "none", color: "#6366f1", cursor: "pointer", fontSize: "15px", textDecoration: "underline", fontFamily: "'Sora', sans-serif" },
  paginationInfo: { textAlign: "center", fontSize: "13px", color: "#4b5563", marginTop: "32px", marginBottom: "20px" },
  pagination:     { display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", paddingBottom: "40px", flexWrap: "wrap" },
  pageBtn:        { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "8px", color: "#9ca3af", fontSize: "14px", fontWeight: 600, padding: "8px 18px", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  pageBtnActive:  { background: "#4f46e5", border: "1px solid #6366f1", color: "#fff" },
};

export default Homepage;