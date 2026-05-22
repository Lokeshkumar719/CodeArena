// AdminDelete.jsx
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router";

const AdminDelete = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchProblems(currentPage); }, [currentPage]);

  const fetchProblems = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/problem/getAllProblems?page=${page}&limit=5`);
      setProblems(data.problems);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
      setDeletingId(id);
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems((prev) => prev.filter((p) => p._id !== id));
      toast.success("Problem deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete problem");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div style={{ minHeight: "100vh", background: "#080c14" }} />;

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
            <span style={s.logo}>LeetLab</span>
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
              {problems.map((problem, index) => (
                <tr key={problem._id} style={s.tr}>
                  <td style={s.td}>{(currentPage - 1) * 5 + index + 1}</td>
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
                      style={{ ...s.deleteBtn, opacity: deletingId === problem._id ? 0.6 : 1, cursor: deletingId === problem._id ? "not-allowed" : "pointer" }}
                    >
                      {deletingId === problem._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={s.pagination}>
          <button
            style={{ ...s.pageBtn, opacity: currentPage === 1 ? 0.4 : 1 }}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >← Prev</button>
          <span style={s.pageInfo}>Page {currentPage} of {totalPages}</span>
          <button
            style={{ ...s.pageBtn, opacity: currentPage === totalPages ? 0.4 : 1 }}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >Next →</button>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "#080c14", fontFamily: "'Sora', sans-serif", color: "#c9d1d9" },
  navbar: { height: "64px", background: "#080c14", borderBottom: "1px solid #1e2738", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", position: "sticky", top: 0, zIndex: 100 },
  navLeft: { display: "flex", alignItems: "center", gap: "20px" },
  backBtn: { display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "1px solid #1e2738", borderRadius: "8px", color: "#9ca3af", fontSize: "13px", fontWeight: 600, padding: "6px 14px", cursor: "pointer", fontFamily: "'Sora', sans-serif", transition: "all 0.15s ease" },
  logo: { fontSize: "20px", fontWeight: 700, color: "#a5b4fc" },
  adminBox: { fontSize: "13px", color: "#6b7280", fontWeight: 500, border: "1px solid #1e2738", borderRadius: "8px", padding: "6px 14px", background: "#0c1018" },
  main: { padding: "48px 40px", maxWidth: "1200px", margin: "0 auto" },
  header: { marginBottom: "36px" },
  heading: { fontSize: "28px", fontWeight: 700, color: "#f9fafb", marginBottom: "8px" },
  subheading: { fontSize: "14px", color: "#6b7280" },
  tableWrap: { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "16px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "14px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em", background: "#0a0e18", borderBottom: "1px solid #1e2738" },
  tr: { borderBottom: "1px solid #1e2738" },
  td: { padding: "16px 20px", fontSize: "14px", color: "#9ca3af", verticalAlign: "middle" },
  tagRow: { display: "flex", flexWrap: "wrap", gap: "6px" },
  tag: { background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "999px", color: "#a5b4fc", fontSize: "11px", fontWeight: 600, padding: "3px 9px" },
  deleteBtn: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", color: "#f87171", fontSize: "13px", fontWeight: 600, padding: "7px 16px", fontFamily: "'Sora', sans-serif" },
  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "32px" },
  pageBtn: { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "8px", color: "#9ca3af", fontSize: "13px", fontWeight: 600, padding: "8px 18px", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  pageInfo: { fontSize: "13px", color: "#4b5563", fontWeight: 500 },
};

const getDifficultyStyle = (difficulty) => {
  const base = { borderRadius: "999px", fontSize: "11px", fontWeight: 600, padding: "3px 10px", textTransform: "capitalize" };
  switch (difficulty?.toLowerCase()) {
    case "easy":   return { ...base, background: "rgba(34,197,94,0.1)",  color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" };
    case "medium": return { ...base, background: "rgba(234,179,8,0.1)", color: "#eab308", border: "1px solid rgba(234,179,8,0.2)" };
    case "hard":   return { ...base, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" };
    default:       return { ...base, background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" };
  }
};

export default AdminDelete;