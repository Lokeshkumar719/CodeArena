import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import toast from "react-hot-toast";

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

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  useEffect(() => {
    fetchProblems();

    if (user) {
      fetchSolvedProblems();
    }
  }, [currentPage, user]);

  const fetchProblems = async () => {
    try {
      const { data } = await axiosClient.get(
        `/problem/getAllProblems?page=${currentPage}&limit=${PAGE_LIMIT}`
      );

      setProblems(data.data.problems);
      setTotalPages(data.data.totalPages);
      setTotalProblems(data.data.totalProblems);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch problems");
    }
  };

  const fetchSolvedProblems = async () => {
    try {
      const { data } = await axiosClient.get(
        "/problem/problemSolvedByUser"
      );

      setSolvedProblems(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(resultAction)) {
      toast.success("Logged out successfully");
      setSolvedProblems([]);
      setDropdownOpen(false);
      return;
    }

    toast.error(resultAction.payload || "Logout failed");
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isProblemSolved = (problemId) =>
    solvedProblems.some((problem) => problem._id === problemId);

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" ||
      problem.difficulty.toLowerCase() === filters.difficulty;

    const tagMatch =
      filters.tag === "all" ||
      problem.tags.some(
        (tag) => tag.toLowerCase() === filters.tag.toLowerCase()
      );

    const solved = isProblemSolved(problem._id);

    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" && solved) ||
      (filters.status === "unsolved" && !solved);

    return difficultyMatch && tagMatch && statusMatch;
  });

  const filterConfigs = [
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
        ...tagOptions.map((tag) => ({
          value: tag,
          label: tag,
        })),
      ],
    },
  ];

  return (
    <div style={s.page}>
      <nav style={s.navbar}>
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <span style={s.logo}>CodeArena</span>
        </NavLink>

        <div style={{ position: "relative" }}>
          <button
            style={s.userBtn}
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            {user?.firstName} ▾
          </button>

          {dropdownOpen && (
            <div style={s.dropdown}>
              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  style={s.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  Admin
                </NavLink>
              )}

              <NavLink
                to="/change-password"
                style={s.dropdownItem}
                onClick={() => setDropdownOpen(false)}
              >
                🔒 Change Password
              </NavLink>

              <button
                onClick={handleLogout}
                style={{
                  ...s.dropdownItem,
                  background: "transparent",
                  border: "none",
                  width: "100%",
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      <div style={s.main}>
        <div style={s.filterRow}>
          {filterConfigs.map(({ key, value, options }) => (
            <select
              key={key}
              value={value}
              onChange={(e) => updateFilter(key, e.target.value)}
              style={s.select}
            >
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  style={{ background: "#0c1018" }}
                >
                  {option.label}
                </option>
              ))}
            </select>
          ))}
        </div>

        <div style={s.problemList}>
          {filteredProblems.map((problem) => {
            const solved = isProblemSolved(problem._id);

            return (
              <div key={problem._id} style={s.problemCard}>
                <div style={s.problemCardTop}>
                  <NavLink
                    to={`/problem/${problem._id}`}
                    style={s.problemTitle}
                  >
                    {problem.title}
                  </NavLink>

                  {solved && (
                    <span style={s.solvedBadge}>
                      ✔ Solved
                    </span>
                  )}
                </div>

                <div style={s.badgeRow}>
                  <span style={getDifficultyStyle(problem.difficulty)}>
                    {problem.difficulty}
                  </span>

                  {problem.tags.map((tag) => (
                    <span key={tag} style={s.tagBadge}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={s.paginationInfo}>
          Showing {(currentPage - 1) * PAGE_LIMIT + 1}–
          {Math.min(currentPage * PAGE_LIMIT, totalProblems)} of{" "}
          {totalProblems} problems
        </div>

        <div style={s.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            style={{
              ...s.pageBtn,
              opacity: currentPage === 1 ? 0.4 : 1,
            }}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                ...s.pageBtn,
                ...(currentPage === i + 1
                  ? s.pageBtnActive
                  : {}),
              }}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            style={{
              ...s.pageBtn,
              opacity:
                currentPage === totalPages ? 0.4 : 1,
            }}
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

  logo: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#a5b4fc",
    letterSpacing: "0.01em",
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
    minWidth: "200px",
    zIndex: 200,
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  },

  dropdownItem: {
    display: "block",
    width: "100%",
    padding: "12px 18px",
    fontSize: "14px",
    color: "#9ca3af",
    textDecoration: "none",
    textAlign: "left",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
  },

  main: {
    padding: "32px 40px",
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
    outline: "none",
    minWidth: "180px",
    fontFamily: "'Sora', sans-serif",
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
    background: "rgba(34,197,94,0.1)",
    border: "1px solid rgba(34,197,94,0.25)",
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
    background: "rgba(99,102,241,0.1)",
    border: "1px solid rgba(99,102,241,0.2)",
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
    flexWrap: "wrap",
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
    color: "#fff",
  },
};

export default Homepage;