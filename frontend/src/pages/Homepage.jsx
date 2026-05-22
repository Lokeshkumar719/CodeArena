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

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get(
          `/problem/getAllProblems?page=${currentPage}&limit=5`,
        );
        setProblems(data.data.problems);
        setTotalPages(data.data.totalPages);
        setTotalProblems(data.data.totalProblems);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(data.data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) {
      fetchSolvedProblems();
    }
  }, [user, currentPage]);

  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(resultAction)) {
      toast.success("Logged out successfully");
      setSolvedProblems([]);
    } else {
      toast.error(resultAction.payload || "Logout failed");
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" ||
      problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase();
    const tagMatch =
      filters.tag === "all" ||
      problem.tags.some(
        (tag) => tag.toLowerCase() === filters.tag.toLowerCase(),
      );
    const statusMatch =
      filters.status === "all" ||
      (filters.status === "solved" &&
        solvedProblems.some((sp) => sp._id === problem._id)) ||
      (filters.status === "unsolved" &&
        !solvedProblems.some((sp) => sp._id === problem._id));
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <nav className="navbar bg-base-100 shadow-md px-6 h-16">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-2xl font-bold">
            CodeArena
          </NavLink>
        </div>

        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-outline btn-sm rounded-lg flex items-center gap-2"
            >
              {/* Avatar circle with first initial */}
              <div className="w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold">
                {user?.firstName?.[0]?.toUpperCase() ?? "?"}
              </div>
              <span>{user?.firstName ?? "Account"}</span>
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content bg-base-100 rounded-box z-[1] mt-2 w-48 p-1 shadow-lg border border-base-300"
            >
              {user?.role?.toLowerCase() === "admin" && (
                <li>
                  <NavLink
                    to="/admin"
                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-base-200 transition text-sm font-medium"
                  >
                    ⚙️ Admin
                  </NavLink>
                </li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-error/10 hover:text-error transition text-sm font-medium"
                >
                  🚪 Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Status Filter */}
          <select
            className="select select-bordered"
            value={filters.status}
            onChange={(e) =>
              setFilters({
                ...filters,
                status: e.target.value,
              })
            }
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
            <option value="unsolved">Unsolved Problems</option>
          </select>

          {/* Difficulty Filter */}
          <select
            className="select select-bordered"
            value={filters.difficulty}
            onChange={(e) =>
              setFilters({
                ...filters,
                difficulty: e.target.value,
              })
            }
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Tag Filter */}
          <select
            className="select select-bordered"
            value={filters.tag}
            onChange={(e) =>
              setFilters({
                ...filters,
                tag: e.target.value,
              })
            }
          >
            <option value="all">All Tags</option>
            {tagOptions.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Problems */}
        <div className="grid gap-4">
          {filteredProblems.map((problem) => (
            <div
              key={problem._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition"
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h2 className="card-title text-lg">
                    <NavLink
                      to={`/problem/${problem._id}`}
                      className="hover:text-primary transition"
                    >
                      {problem.title}
                    </NavLink>
                  </h2>

                  {solvedProblems.some((sp) => sp._id === problem._id) && (
                    <div className="badge badge-success gap-2 px-3 py-3">
                      ✔ Solved
                    </div>
                  )}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <div
                    className={`badge ${getDifficultyBadgeColor(problem.difficulty)}`}
                  >
                    {problem.difficulty}
                  </div>

                  {problem.tags.map((tag, index) => (
                    <div key={index} className="badge badge-info">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-base-content/70 mt-6">
          Showing {(currentPage - 1) * 5 + 1}-
          {Math.min(currentPage * 5, totalProblems)} of {totalProblems} problems
        </div>

        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="btn btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`btn btn-sm ${
                currentPage === index + 1 ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="btn btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export default Homepage;
