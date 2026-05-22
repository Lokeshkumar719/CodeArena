import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/problemSubmmision/${problemId}`);
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch submission history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [problemId]);

  const getStatusStyle = (status) => {
    const base = { borderRadius: "999px", fontSize: "11px", fontWeight: 600, padding: "3px 10px", textTransform: "capitalize" };
    switch (status) {
      case "accepted": return { ...base, background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" };
      case "wrong":    return { ...base, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" };
      case "error":    return { ...base, background: "rgba(234,179,8,0.1)", color: "#eab308", border: "1px solid rgba(234,179,8,0.2)" };
      case "pending":  return { ...base, background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" };
      default:         return { ...base, background: "rgba(107,114,128,0.1)", color: "#9ca3af", border: "1px solid rgba(107,114,128,0.2)" };
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  if (loading) return <div style={{ minHeight: "200px", background: "#080c14" }} />;

  if (error) return (
    <div style={{ padding: "20px", fontFamily: "'Sora', sans-serif" }}>
      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "16px 20px", color: "#f87171", fontSize: "14px" }}>{error}</div>
    </div>
  );

  return (
    <div style={s.wrap}>
      <h2 style={s.heading}>Submission History</h2>

      {submissions.length === 0 ? (
        <div style={s.emptyBox}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#a5b4fc">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>No submissions found for this problem</span>
        </div>
      ) : (
        <>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {["#", "Language", "Status", "Runtime", "Memory", "Test Cases", "Submitted", "Action"].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, index) => (
                  <tr key={sub._id} style={s.tr}>
                    <td style={s.td}>{index + 1}</td>
                    <td style={{ ...s.td, fontFamily: "monospace", color: "#e2e8f0", fontWeight: 600 }}>{sub.language}</td>
                    <td style={s.td}><span style={getStatusStyle(sub.status)}>{sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}</span></td>
                    <td style={{ ...s.td, fontFamily: "monospace" }}>{sub.runtime}s</td>
                    <td style={{ ...s.td, fontFamily: "monospace" }}>{formatMemory(sub.memory)}</td>
                    <td style={{ ...s.td, fontFamily: "monospace" }}>{sub.testCasesPassed}/{sub.testCasesTotal}</td>
                    <td style={s.td}>{formatDate(sub.createdAt)}</td>
                    <td style={s.td}>
                      <button style={s.codeBtn} onClick={() => setSelectedSubmission(sub)}>View Code</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: "12px", fontSize: "12px", color: "#4b5563" }}>Showing {submissions.length} submission{submissions.length !== 1 ? "s" : ""}</p>
        </>
      )}

      {/* Modal */}
      {selectedSubmission && (
        <div style={s.modalOverlay} onClick={() => setSelectedSubmission(null)}>
          <div style={s.modalBox} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={s.modalHeader}>
              <div>
                <h3 style={s.modalTitle}>Submission Details</h3>
                <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>{selectedSubmission.language}</p>
              </div>
              <button style={s.closeBtn} onClick={() => setSelectedSubmission(null)}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
              <span style={getStatusStyle(selectedSubmission.status)}>{selectedSubmission.status}</span>
              <span style={s.badgeOutline}>Runtime: {selectedSubmission.runtime}s</span>
              <span style={s.badgeOutline}>Memory: {formatMemory(selectedSubmission.memory)}</span>
              <span style={s.badgeOutline}>Passed: {selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}</span>
            </div>

            {/* Error message */}
            {selectedSubmission.errorMessage && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", color: "#f87171", fontSize: "13px" }}>
                {selectedSubmission.errorMessage}
              </div>
            )}

            {/* Code block */}
            <pre style={s.codeBlock}><code>{selectedSubmission.code}</code></pre>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <button style={s.closeActionBtn} onClick={() => setSelectedSubmission(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  wrap: { fontFamily: "'Sora', sans-serif", color: "#c9d1d9", padding: "8px 0" },
  heading: { fontSize: "20px", fontWeight: 700, color: "#f9fafb", marginBottom: "20px" },
  emptyBox: { display: "flex", alignItems: "center", gap: "10px", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "12px", padding: "16px 20px" },
  tableWrap: { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "16px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em", background: "#0a0e18", borderBottom: "1px solid #1e2738" },
  tr: { borderBottom: "1px solid #1e2738" },
  td: { padding: "14px 16px", fontSize: "13px", color: "#9ca3af", verticalAlign: "middle" },
  codeBtn: { background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "8px", color: "#a5b4fc", fontSize: "12px", fontWeight: 600, padding: "6px 14px", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  // Modal
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
  modalBox: { background: "#0c1018", border: "1px solid #1e2738", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "860px", maxHeight: "85vh", overflowY: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" },
  modalTitle: { fontSize: "18px", fontWeight: 700, color: "#f9fafb", margin: 0 },
  closeBtn: { background: "transparent", border: "1px solid #1e2738", borderRadius: "8px", color: "#6b7280", padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center" },
  badgeOutline: { borderRadius: "999px", fontSize: "11px", fontWeight: 600, padding: "3px 10px", background: "transparent", border: "1px solid #1e2738", color: "#6b7280" },
  codeBlock: { background: "#080c14", border: "1px solid #1e2738", borderRadius: "12px", padding: "20px", color: "#c9d1d9", fontSize: "13px", fontFamily: "monospace", overflowX: "auto", lineHeight: 1.6, margin: 0 },
  closeActionBtn: { background: "#0a0e18", border: "1px solid #1e2738", borderRadius: "8px", color: "#9ca3af", fontSize: "13px", fontWeight: 600, padding: "8px 20px", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
};

export default SubmissionHistory;