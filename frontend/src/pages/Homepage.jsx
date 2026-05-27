import { useEffect, useState, useCallback, useRef } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import toast from "react-hot-toast";

const tagOptions = [
  "array", "string", "stack", "queue", "hashing", "sorting", "binarySearch",
  "twoPointers", "slidingWindow", "recursion", "backtracking", "greedy",
  "heap", "trie", "graph", "dfs", "bfs", "dp", "bitManipulation", "math",
  "prefixSum", "matrix", "unionFind", "segmentTree", "topologicalSort", "shortestPath",
];

const PAGE_LIMIT = 5;

const getDifficultyStyle = (difficulty) => {
  const base = { borderRadius: "999px", fontSize: "12px", fontWeight: 600, padding: "4px 12px" };
  const styles = {
    easy:   { background: "rgba(34,197,94,0.1)",  color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" },
    medium: { background: "rgba(234,179,8,0.1)",  color: "#eab308", border: "1px solid rgba(234,179,8,0.2)" },
    hard:   { background: "rgba(239,68,68,0.1)",  color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" },
  };
  return { ...base, ...(styles[difficulty?.toLowerCase()] || { background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }) };
};

// Debounce hook — prevents a search API call on every single keystroke
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // ── Data state ───────────────────────────────────────────────────────────
  const [problems,      setProblems]      = useState([]);
  const [pagination,    setPagination]    = useState({ currentPage: 1, totalPages: 1, totalProblems: 0, hasNextPage: false, hasPrevPage: false });
  const [loading,       setLoading]       = useState(false);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);

  // ── Filter + search state ────────────────────────────────────────────────
  const [searchInput,   setSearchInput]   = useState("");          // raw input — drives the text field
  const [currentPage,   setCurrentPage]   = useState(1);
  const [filters, setFilters] = useState({
    difficulty: "",   // "" means not applied
    tags:       [],   // multi-select array
    status:     "",   // "" | "solved" | "unsolved"
  });

  // Only fire search API call 400ms after user stops typing
  const debouncedSearch = useDebounce(searchInput, 400);

  // ── Build query string from current state ────────────────────────────────
  const buildQueryString = useCallback((page, search, f) => {
    const params = new URLSearchParams();

    params.set("page",  page);
    params.set("limit", PAGE_LIMIT);

    if (search.trim())       params.set("q",          search.trim());
    if (f.difficulty)        params.set("difficulty",  f.difficulty);
    if (f.tags.length > 0)   params.set("tags",        f.tags.join(","));
    if (f.status)            params.set("status",      f.status);

    return params.toString();
  }, []);

  // ── Fetch problems from unified /problems endpoint ───────────────────────
  const fetchProblems = useCallback(async (page, search, f) => {
    setLoading(true);
    try {
      const qs = buildQueryString(page, search, f);
      const { data } = await axiosClient.get(`/problem/getProblems?${qs}`);

      if (!data.success) {
        // Validation errors from backend (invalid problemNo, search too long)
        toast.error(data.errors?.[0] || "Invalid query");
        return;
      }

      setProblems(data.problems);
      setPagination(data.pagination);
    } catch (error) {
      const msg = error.response?.data?.errors?.[0] || "Failed to fetch problems";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);

  // ── Re-fetch whenever page, debounced search, or filters change ──────────
  useEffect(() => {
    fetchProblems(currentPage, debouncedSearch, filters);
  }, [currentPage, debouncedSearch, filters]);

  // ── Reset to page 1 whenever search or filters change ───────────────────
  // Separate from the fetch effect so page change doesn't double-reset
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setCurrentPage(1);
  }, [debouncedSearch, filters]);

  // ── Filter helpers ───────────────────────────────────────────────────────
  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const toggleTag = (tag) =>
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)   // deselect
        : [...prev.tags, tag],                  // select
    }));

  const clearAllFilters = () => {
    setSearchInput("");
    setFilters({ difficulty: "", tags: [], status: "" });
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchInput.trim() || filters.difficulty || filters.tags.length > 0 || filters.status;

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(resultAction)) {
      toast.success("Logged out successfully");
      setDropdownOpen(false);
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

        <div style={{ position: "relative" }}>
          <button style={s.userBtn} onClick={() => setDropdownOpen((p) => !p)}>
            {user?.firstName} ▾
          </button>
          {dropdownOpen && (
            <div style={s.dropdown}>
              {user?.role?.toLowerCase() === "admin" && (
                <NavLink to="/admin" style={s.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  ⚙️ Admin
                </NavLink>
              )}
              <NavLink to="/change-password" style={s.dropdownItem} onClick={() => setDropdownOpen(false)}>
                🔒 Change Password
              </NavLink>
              <button onClick={handleLogout} style={{ ...s.dropdownItem, background: "transparent", border: "none", width: "100%", textAlign: "left" }}>
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

          {/* Difficulty */}
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

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            style={s.select}
          >
            <option value="">All Problems</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>

          {/* Tags — multi-select pill UI */}
          <div style={s.tagDropdownWrapper}>
            <button
              style={{ ...s.select, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              onClick={() => updateFilter("_tagsOpen", !filters._tagsOpen)}
              type="button"
            >
              <span>
                {filters.tags.length === 0
                  ? "All Tags"
                  : `${filters.tags.length} tag${filters.tags.length > 1 ? "s" : ""} selected`}
              </span>
              <span style={{ marginLeft: "auto", fontSize: "10px" }}>▾</span>
            </button>

            {filters._tagsOpen && (
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

          {/* Clear all filters — only shown when something is active */}
          {hasActiveFilters && (
            <button style={s.clearAllBtn} onClick={clearAllFilters} type="button">
              ✕ Clear all
            </button>
          )}
        </div>

        {/* ── Selected tag pills (visible summary) ── */}
        {filters.tags.length > 0 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
            {filters.tags.map((tag) => (
              <span key={tag} style={s.activeTagPill}>
                {tag}
                <button
                  style={s.removeTagBtn}
                  onClick={() => toggleTag(tag)}
                  type="button"
                >✕</button>
              </span>
            ))}
          </div>
        )}

        {/* ── Problem list ── */}
        {loading ? (
          <div style={s.emptyState}>Loading problems…</div>
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
                    {/* problemNo shown if present */}
                    {problem.problemNo && (
                      <span style={s.problemNo}>#{problem.problemNo}</span>
                    )}
                    <NavLink to={`/problem/${problem._id}`} style={s.problemTitle}>
                      {problem.title}
                    </NavLink>
                  </div>
                  {/* Solved badge — driven by backend status, not local lookup */}
                  {problem.isSolved && (
                    <span style={s.solvedBadge}>✔ Solved</span>
                  )}
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

              {/* Smart windowed page numbers — avoids 200 buttons on large sets */}
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
}

const s = {
  page:    { minHeight: "100vh", background: "#080c14", color: "#c9d1d9", fontFamily: "'Sora', sans-serif" },
  navbar:  { height: "64px", background: "#080c14", borderBottom: "1px solid #1e2738", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", position: "sticky", top: 0, zIndex: 100 },
  logo:    { fontSize: "22px", fontWeight: 700, color: "#a5b4fc", letterSpacing: "0.01em" },
  userBtn: { background: "transparent", border: "1px solid #1e2738", borderRadius: "8px", color: "#9ca3af", fontSize: "14px", fontWeight: 600, padding: "8px 18px", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  dropdown:     { position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#0c1018", border: "1px solid #1e2738", borderRadius: "12px", overflow: "hidden", minWidth: "200px", zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" },
  dropdownItem: { display: "block", width: "100%", padding: "12px 18px", fontSize: "14px", color: "#9ca3af", textDecoration: "none", textAlign: "left", cursor: "pointer", fontFamily: "'Sora', sans-serif" },

  main: { padding: "32px 40px" },

  // Search
  searchWrapper: { position: "relative", display: "flex", alignItems: "center", marginBottom: "20px" },
  searchIcon:    { position: "absolute", left: "16px", width: "16px", height: "16px", color: "#4b5563", pointerEvents: "none", flexShrink: 0 },
  searchInput:   { width: "100%", background: "#0c1018", border: "1px solid #1e2738", borderRadius: "12px", color: "#e2e8f0", fontSize: "14px", fontWeight: 500, padding: "12px 44px", outline: "none", fontFamily: "'Sora', sans-serif", boxSizing: "border-box", transition: "border-color 0.2s" },
  searchClear:   { position: "absolute", right: "16px", background: "transparent", border: "none", color: "#4b5563", cursor: "pointer", fontSize: "14px", padding: "4px", lineHeight: 1 },

  // Filters
  filterRow: { display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap", alignItems: "flex-start" },
  select:    { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "10px", color: "#9ca3af", fontSize: "14px", fontWeight: 500, padding: "10px 18px", cursor: "pointer", outline: "none", minWidth: "160px", fontFamily: "'Sora', sans-serif" },

  // Tag dropdown
  tagDropdownWrapper: { position: "relative" },
  tagDropdownPanel:   { position: "absolute", top: "calc(100% + 8px)", left: 0, background: "#0c1018", border: "1px solid #1e2738", borderRadius: "14px", padding: "16px", zIndex: 150, width: "360px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" },
  tagGrid:            { display: "flex", flexWrap: "wrap", gap: "8px" },
  tagPill:            { background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "999px", color: "#6b7280", fontSize: "12px", fontWeight: 600, padding: "5px 12px", cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.15s" },
  tagPillActive:      { background: "rgba(99,102,241,0.25)", border: "1px solid rgba(99,102,241,0.5)", color: "#a5b4fc" },
  clearTagsBtn:       { marginTop: "12px", background: "transparent", border: "none", color: "#6366f1", fontSize: "13px", cursor: "pointer", fontFamily: "'Sora', sans-serif", padding: 0 },

  clearAllBtn: { background: "transparent", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", color: "#ef4444", fontSize: "13px", fontWeight: 600, padding: "10px 16px", cursor: "pointer", fontFamily: "'Sora', sans-serif", alignSelf: "flex-start" },

  // Active tag pills row
  activeTagPill: { display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "999px", color: "#a5b4fc", fontSize: "12px", fontWeight: 600, padding: "4px 10px 4px 12px" },
  removeTagBtn:  { background: "transparent", border: "none", color: "#6366f1", cursor: "pointer", fontSize: "11px", padding: 0, lineHeight: 1, fontFamily: "'Sora', sans-serif" },

  // Problem list
  problemList:    { display: "flex", flexDirection: "column", gap: "12px" },
  problemCard:    { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "16px", padding: "22px 28px" },
  problemCardTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" },
  problemNo:      { fontSize: "13px", fontWeight: 600, color: "#4b5563", minWidth: "32px" },
  problemTitle:   { fontSize: "17px", fontWeight: 600, color: "#e2e8f0", textDecoration: "none" },
  solvedBadge:    { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "999px", color: "#22c55e", fontSize: "12px", fontWeight: 700, padding: "4px 14px", flexShrink: 0 },
  badgeRow:       { display: "flex", gap: "8px", flexWrap: "wrap" },
  tagBadge:       { background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "999px", color: "#a5b4fc", fontSize: "12px", fontWeight: 600, padding: "4px 12px" },

  emptyState: { textAlign: "center", color: "#4b5563", fontSize: "15px", padding: "60px 0" },
  inlineClear: { background: "transparent", border: "none", color: "#6366f1", cursor: "pointer", fontSize: "15px", textDecoration: "underline", fontFamily: "'Sora', sans-serif" },

  paginationInfo: { textAlign: "center", fontSize: "13px", color: "#4b5563", marginTop: "32px", marginBottom: "20px" },
  pagination:     { display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", paddingBottom: "40px", flexWrap: "wrap" },
  pageBtn:        { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "8px", color: "#9ca3af", fontSize: "14px", fontWeight: 600, padding: "8px 18px", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  pageBtnActive:  { background: "#4f46e5", border: "1px solid #6366f1", color: "#fff" },
};

export default Homepage;