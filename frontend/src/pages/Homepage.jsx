import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";

const tagOptions = [
  "array", "string", "stack", "queue", "hashing", "sorting", "binarySearch",
  "twoPointers", "slidingWindow", "recursion", "backtracking", "greedy",
  "heap", "trie", "graph", "dfs", "bfs", "dp", "bitManipulation", "math",
  "prefixSum", "matrix", "unionFind", "segmentTree", "topologicalSort", "shortestPath",
];

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);
  const [filters, setFilters] = useState({ difficulty: "all", tag: "all", status: "all" });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get(`/problem/getAllProblems?page=${currentPage}&limit=5`);
        setProblems(data.problems);
        setTotalPages(data.totalPages);
        setTotalProblems(data.totalProblems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };
    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };
    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user, currentPage]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
    setDropdownOpen(false);
  };

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch = filters.difficulty === "all" || problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase();
    const tagMatch = filters.tag === "all" || problem.tags.some((tag) => tag.toLowerCase() === filters.tag.toLowerCase());
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" && solvedProblems.some((sp) => sp._id === problem._id)) ||
      (filters.status === "unsolved" && !solvedProblems.some((sp) => sp._id === problem._id));
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.navbar}>
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <span style={s.logoStrong}>CodeArena</span>
        </NavLink>

        <div style={{ position: "relative" }}>
          <button style={s.userBtn} onClick={() => setDropdownOpen(!dropdownOpen)}>
            {user?.firstName} ▾
          </button>
          {dropdownOpen && (
            <div style={s.dropdown}>
              {user?.role === "admin" && (
                <NavLink to="/admin" style={s.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  Admin
                </NavLink>
              )}
              <button onClick={handleLogout} style={s.dropdownItem}>Logout</button>
            </div>
          )}
        </div>
      </nav>

      {/* Main — full width like before */}
      <div style={s.main}>

        {/* Filters */}
        <div style={s.filterRow}>
          {[
            {
              key: "status",
              value: filters.status,
              options: [
                { value: "all", label: "All Problems" },
                { value: "solved", label: "Solved Problems" },
                { value: "unsolved", label: "Unsolved Problems" },
              ],
            },
            {
              key: "difficulty",
              value: filters.difficulty,
              options: [
                { value: "all", label: "All Difficulties" },
                { value: "easy", label: "Easy" },
                { value: "medium", label: "Medium" },
                { value: "hard", label: "Hard" },
              ],
            },
            {
              key: "tag",
              value: filters.tag,
              options: [
                { value: "all", label: "All Tags" },
                ...tagOptions.map((t) => ({ value: t, label: t })),
              ],
            },
          ].map(({ key, value, options }) => (
            <select
              key={key}
              value={value}
              onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
              style={s.select}
            >
              {options.map((o) => (
                <option key={o.value} value={o.value} style={{ background: "#0c1018" }}>
                  {o.label}
                </option>
              ))}
            </select>
          ))}
        </div>

        {/* Problem List */}
        <div style={s.problemList}>
          {filteredProblems.map((problem) => {
            const isSolved = solvedProblems.some((sp) => sp._id === problem._id);
            return (
              <div key={problem._id} style={s.problemCard}>
                <div style={s.problemCardTop}>
                  <NavLink to={`/problem/${problem._id}`} style={s.problemTitle}>
                    {problem.title}
                  </NavLink>
                  {isSolved && <span style={s.solvedBadge}>✔ Solved</span>}
                </div>
                <div style={s.badgeRow}>
                  <span style={getDifficultyStyle(problem.difficulty)}>
                    {problem.difficulty}
                  </span>
                  {problem.tags.map((tag, i) => (
                    <span key={i} style={s.tagBadge}>{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination info */}
        <div style={s.paginationInfo}>
          Showing {(currentPage - 1) * 5 + 1}–{Math.min(currentPage * 5, totalProblems)} of {totalProblems} problems
        </div>

        {/* Pagination */}
        <div style={s.pagination}>
          <button
            style={{ ...s.pageBtn, opacity: currentPage === 1 ? 0.4 : 1 }}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ← Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              style={{ ...s.pageBtn, ...(currentPage === i + 1 ? s.pageBtnActive : {}) }}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            style={{ ...s.pageBtn, opacity: currentPage === totalPages ? 0.4 : 1 }}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next →
          </button>
        </div>
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
  logoStrong: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#a5b4fc",
    letterSpacing: "0.01em",
    fontFamily: "'Sora', sans-serif",
  },
  userBtn: {
    background: "transparent",
    border: "1px solid #1e2738",
    borderRadius: "8px",
    color: "#9ca3af",
    fontSize: "14px",
    fontWeight: 600,
    padding: "8px 18px",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "calc(100% + 8px)",
    background: "#0c1018",
    border: "1px solid #1e2738",
    borderRadius: "12px",
    overflow: "hidden",
    minWidth: "140px",
    zIndex: 200,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },
  dropdownItem: {
    display: "block",
    width: "100%",
    padding: "12px 18px",
    fontSize: "14px",
    color: "#9ca3af",
    background: "transparent",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    textDecoration: "none",
  },
  main: {
    width: "100%",
    padding: "32px 40px",   // full width, same padding as original
  },
  filterRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  select: {
    background: "#0c1018",
    border: "1px solid #1e2738",
    borderRadius: "10px",
    color: "#9ca3af",
    fontSize: "14px",
    fontWeight: 500,
    padding: "10px 18px",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
    outline: "none",
    minWidth: "180px",
  },
  problemList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  problemCard: {
    background: "#0c1018",
    border: "1px solid #1e2738",
    borderRadius: "16px",
    padding: "22px 28px",
    width: "100%",
  },
  problemCardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  problemTitle: {
    fontSize: "17px",
    fontWeight: 600,
    color: "#e2e8f0",
    textDecoration: "none",
  },
  solvedBadge: {
    background: "rgba(34, 197, 94, 0.1)",
    border: "1px solid rgba(34, 197, 94, 0.25)",
    borderRadius: "999px",
    color: "#22c55e",
    fontSize: "12px",
    fontWeight: 700,
    padding: "4px 14px",
  },
  badgeRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  tagBadge: {
    background: "rgba(99, 102, 241, 0.1)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    borderRadius: "999px",
    color: "#a5b4fc",
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 12px",
  },
  paginationInfo: {
    textAlign: "center",
    fontSize: "13px",
    color: "#4b5563",
    marginTop: "32px",
    marginBottom: "20px",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    paddingBottom: "40px",
  },
  pageBtn: {
    background: "#0c1018",
    border: "1px solid #1e2738",
    borderRadius: "8px",
    color: "#9ca3af",
    fontSize: "14px",
    fontWeight: 600,
    padding: "8px 18px",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
  },
  pageBtnActive: {
    background: "#4f46e5",
    border: "1px solid #6366f1",
    color: "white",
  },
};

const getDifficultyStyle = (difficulty) => {
  const base = {
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 12px",
  };
  switch (difficulty.toLowerCase()) {
    case "easy":   return { ...base, background: "rgba(34,197,94,0.1)",  color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" };
    case "medium": return { ...base, background: "rgba(234,179,8,0.1)", color: "#eab308", border: "1px solid rgba(234,179,8,0.2)" };
    case "hard":   return { ...base, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" };
    default:       return { ...base, background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" };
  }
};

export default Homepage;