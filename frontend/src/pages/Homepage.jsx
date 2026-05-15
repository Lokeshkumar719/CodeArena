import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";

const tagOptions = [
  "array",
  "string",
  "linkedList",
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
  "tree",
  "binaryTree",
  "bst",
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
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblems");
        setProblems(data);
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
    if (user) {
      fetchSolvedProblems();
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
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
              className="btn btn-ghost btn-sm rounded-lg"
            >
              {user?.firstName}
            </div>
            <div
              tabIndex={0}
              className="dropdown-content z-[1] mt-2 w-36 bg-base-100 rounded-xl shadow-lg border border-base-300 overflow-hidden"
            >
              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  className="block px-4 py-3 hover:bg-base-200 transition"
                >
                  Admin
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-base-200 transition"
              >
                Logout
              </button>
            </div>
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
