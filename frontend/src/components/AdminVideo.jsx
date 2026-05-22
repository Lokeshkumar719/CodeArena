import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosClient from "../utils/axiosClient";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/errorHandler";

const AdminVideo = () => {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

      setProblems(data.data.problems || []);
      setCurrentPage(data.data.currentPage || 1);
      setTotalPages(data.data.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch problems");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (problemId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this video?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(problemId);

      const response = await axiosClient.delete(`/video/delete/${problemId}`);

      toast.success(response.data.message);

      fetchProblems(currentPage);
    } catch (error) {
      toast.error(getErrorMessage(error));
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

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error shadow-lg">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Upload Solution Videos</h1>

          <p className="text-base-content/70">
            Upload and manage problem solution videos
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
              {problems?.map((problem, index) => (
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
                      {problem.tags?.map((tag, index) => (
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/upload/${problem._id}`)}
                        className="btn btn-sm btn-primary"
                      >
                        Upload Video
                      </button>

                      <button
                        onClick={() => handleDeleteVideo(problem._id)}
                        disabled={deletingId === problem._id}
                        className="btn btn-sm btn-error"
                      >
                        {deletingId === problem._id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          "Delete Video"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          className="btn btn-outline btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span className="font-semibold">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn btn-outline btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminVideo;
