import { useEffect, useState, useCallback, useRef } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import toast from "react-hot-toast";
import ProblemListSkeleton from "../components/skeletons/ProblemListSkeleton";

import useDebounce from "../hooks/useDebounce";
import CustomSelect from "../components/home/CustomSelect";
import Chevron from "../components/home/Chevron";
import ProblemCard from "../components/home/ProblemCard";
import UserDropdown from '../components/home/UserDropdown';
import Pagination from '../components/home/Pagination';

import { s } from "../styles/pages/homepageStyles";

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

const PAGE_LIMIT = 5;

const getDifficultyStyle = (difficulty) => {
  const base = {
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 12px",
  };
  const styles = {
    easy: {
      background: "rgba(34,197,94,0.1)",
      color: "#22c55e",
      border: "1px solid rgba(34,197,94,0.2)",
    },
    medium: {
      background: "rgba(234,179,8,0.1)",
      color: "#eab308",
      border: "1px solid rgba(234,179,8,0.2)",
    },
    hard: {
      background: "rgba(239,68,68,0.1)",
      color: "#ef4444",
      border: "1px solid rgba(239,68,68,0.2)",
    },
  };
  return {
    ...base,
    ...(styles[difficulty?.toLowerCase()] || {
      background: "rgba(99,102,241,0.1)",
      color: "#a5b4fc",
      border: "1px solid rgba(99,102,241,0.2)",
    }),
  };
};

// ── Generic single-select dropdown (replaces <select>) ────────────────────
// Renders identically on Windows, macOS, Linux — no OS chrome involved.

const difficultyOptions = [
  { value: "", label: "All Difficulties" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const statusOptions = [
  { value: "", label: "All Problems" },
  { value: "solved", label: "Solved" },
  { value: "unsolved", label: "Unsolved" },
];

// ─────────────────────────────────────────────────────────────────────────────

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProblems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);

  // ── Which panel is open — only one at a time ──────────────────────────────
  // "difficulty" | "status" | "tags" | "user" | null
  const [openPanel, setOpenPanel] = useState(null);

  const toggle = (panel) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  // ── Refs for outside-click ────────────────────────────────────────────────
  const difficultyRef = useRef(null);
  const statusRef = useRef(null);
  const tagDropdownRef = useRef(null);
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
  const [filters, setFilters] = useState({
    difficulty: "",
    tags: [],
    status: "",
  });

  const debouncedSearch = useDebounce(searchInput, 400);

  const buildQueryString = useCallback((page, search, f) => {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", PAGE_LIMIT);
    if (search.trim()) params.set("q", search.trim());
    if (f.difficulty) params.set("difficulty", f.difficulty);
    if (f.tags.length > 0) params.set("tags", f.tags.join(","));
    if (f.status) params.set("status", f.status);
    return params.toString();
  }, []);

  const fetchProblems = useCallback(
    async (page, search, f) => {
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
        toast.error(
          error.response?.data?.errors?.[0] || "Failed to fetch problems",
        );
      } finally {
        setLoading(false);
      }
    },
    [buildQueryString],
  );

  useEffect(() => {
    fetchProblems(currentPage, debouncedSearch, filters);
  }, [currentPage, debouncedSearch, filters]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
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
    searchInput.trim() ||
    filters.difficulty ||
    filters.tags.length > 0 ||
    filters.status;

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());
    if (logoutUser.fulfilled.match(resultAction)) {
      toast.success("Logged out successfully", { duration: 500 });
      setOpenPanel(null);
      return;
    }
    toast.error(resultAction.payload || "Logout failed");
  };

  const {
    currentPage: pg,
    totalPages,
    totalProblems,
    hasNextPage,
    hasPrevPage,
  } = pagination;

  return (
    <div style={s.page}>
      {/* ── Navbar ── */}
      <nav style={s.navbar}>
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <span style={s.logo}>CodeArena</span>
        </NavLink>

<UserDropdown
  user={user}
  openPanel={openPanel}
  toggle={toggle}
  setOpenPanel={setOpenPanel}
  handleLogout={handleLogout}
  userDropdownRef={userDropdownRef}
/>
      </nav>

      <div style={s.main}>
        {/* ── Search bar ── */}
        <div style={s.searchWrapper}>
          <svg
            style={s.searchIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
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
            <button style={s.searchClear} onClick={() => setSearchInput("")}>
              ✕
            </button>
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
              <span
                style={{
                  color: filters.tags.length > 0 ? "#e2e8f0" : "#9ca3af",
                }}
              >
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
                        style={{
                          ...s.tagPill,
                          ...(active ? s.tagPillActive : {}),
                        }}
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

          {hasActiveFilters && (
            <button
              style={s.clearAllBtn}
              onClick={clearAllFilters}
              type="button"
            >
              ✕ Clear all
            </button>
          )}
        </div>

        {/* ── Selected tag pills ── */}
        {filters.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            {filters.tags.map((tag) => (
              <span key={tag} style={s.activeTagPill}>
                {tag}
                <button
                  style={s.removeTagBtn}
                  onClick={() => toggleTag(tag)}
                  type="button"
                >
                  ✕
                </button>
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
              <button style={s.inlineClear} onClick={clearAllFilters}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div style={s.problemList}>
            {problems.map((problem) => (
              <ProblemCard
                key={problem._id}
                problem={problem}
                getDifficultyStyle={getDifficultyStyle}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        <Pagination
  loading={loading}
  problems={problems}
  pg={pg}
  totalPages={totalPages}
  totalProblems={totalProblems}
  hasNextPage={hasNextPage}
  hasPrevPage={hasPrevPage}
  setCurrentPage={setCurrentPage}
  pageLimit={PAGE_LIMIT}
/>
      </div>
    </div>
  );
}

export default Homepage;
