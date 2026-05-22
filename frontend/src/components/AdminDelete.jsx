import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/errorHandler";

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchProblems(currentPage);
  }, [currentPage]);

  const fetchProblems = async (page = 1) => {
    try {
      setLoading(true);

      const { data } = await axiosClient.get(
        `/problem/getAllProblems?page=${page}&limit=5`,
      );

      setProblems(data.data.problems);
      setCurrentPage(data.data.currentPage);
      setTotalPages(data.data.totalPages);
    } catch (err) {
      toast.error(getErrorMessage(err));

      if (import.meta.env.DEV) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this problem?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      await axiosClient.delete(`/problem/delete/${id}`);

      setProblems((prev) => prev.filter((problem) => problem._id !== id));

      toast.success("Problem deleted successfully");
    } catch (err) {
      toast.error(getErrorMessage(err));

      if (import.meta.env.DEV) {
        console.error(err);
      }
    } finally {
      setDeletingId(null);
    }
  };

  const getDifficultyBadge = (difficulty) => {
    if (difficulty === "easy") {
      return "badge-success";
    }

    if (difficulty === "medium") {
      return "badge-warning";
    }

    return "badge-error";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Delete Problems</h1>

          <p className="text-base-content/70">
            Manage and remove coding problems from the platform
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>

                <th>Title</th>

                <th>Difficulty</th>

                <th>Tags</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {problems.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-base-content/70"
                  >
                    No problems found
                  </td>
                </tr>
              ) : (
                problems.map((problem, index) => (
                  <tr key={problem._id} className="hover">
                    {/* Index */}
                    <th className="font-semibold">
                      {(currentPage - 1) * 5 + index + 1}
                    </th>

                    {/* Title */}
                    <td className="font-medium">{problem.title}</td>

                    {/* Difficulty */}
                    <td>
                      <span
                        className={`badge ${getDifficultyBadge(problem.difficulty)} badge-md capitalize`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>

                    {/* Tags */}
                    <td>
                      <div className="flex flex-wrap gap-2 max-w-sm">
                        {problem.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-base-300 text-sm font-medium text-base-content border border-base-100 shadow-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td>
                      <button
                        onClick={() => handleDelete(problem._id)}
                        disabled={deletingId === problem._id}
                        className="btn btn-sm btn-error"
                      >
                        {deletingId === problem._id ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 py-6">
          <button
            className="btn btn-outline btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-outline btn-sm"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDelete;
