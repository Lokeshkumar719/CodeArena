export default function TableSkeletonvideo({ rows = 5 }) {
  const shimmer = {
    background: "linear-gradient(90deg, #1e2738 25%, #2a3448 50%, #1e2738 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: "6px",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'Sora', sans-serif" }}>

      {/* Navbar */}
      <nav style={{ height: "64px", background: "#080c14", borderBottom: "1px solid #1e2738", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ ...shimmer, height: "32px", width: "70px", borderRadius: "8px" }} />
          <div style={{ ...shimmer, height: "28px", width: "100px", borderRadius: "8px" }} />
        </div>
        <div style={{ ...shimmer, height: "32px", width: "130px", borderRadius: "8px" }} />
      </nav>

      <div style={{ padding: "48px 40px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* Heading */}
        <div style={{ marginBottom: "36px" , marginTop: "16px"}}>
          <div style={{ ...shimmer, height: "32px", width: "280px", borderRadius: "10px", marginBottom: "8px" }} />
          <div style={{ ...shimmer, height: "16px", width: "300px", borderRadius: "8px" }} />
        </div>

        {/* Search */}
        <div style={{ ...shimmer, height: "46px", width: "100%", borderRadius: "12px", marginBottom: "20px" }} />

        {/* Filters */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <div style={{ ...shimmer, height: "42px", width: "160px", borderRadius: "10px" }} />
          <div style={{ ...shimmer, height: "42px", width: "160px", borderRadius: "10px" }} />
        </div>

        {/* Table */}
        <div style={{ background: "#0c1018", border: "1px solid #1e2738", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>

            <colgroup>
              <col style={{ width: "10px" }} />
              <col style={{ width: "407px" }} />
              <col style={{ width: "132px" }} />
              <col style={{ width: "339px" }} />
              <col />
            </colgroup>

            <thead>
              <tr>
                {["#", "Title", "Difficulty", "Tags", "Actions"].map((col) => (
                  <th key={col} style={{ padding: "14px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.06em", background: "#0a0e18", borderBottom: "1px solid #1e2738" }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: rows }).map((_, i) => (
                <tr key={i} style={{ borderBottom: i < rows - 1 ? "1px solid #1e2738" : "none" }}>

                  <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                    <div style={{ ...shimmer, height: "14px", width: "24px" }} />
                  </td>

                  <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                    <div style={{ ...shimmer, height: "14px", width: "160px" }} />
                  </td>

                  <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                    <div style={{ ...shimmer, height: "24px", width: "64px", borderRadius: "999px" }} />
                  </td>

                  <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <div style={{ ...shimmer, height: "22px", width: "60px", borderRadius: "999px" }} />
                      <div style={{ ...shimmer, height: "22px", width: "72px", borderRadius: "999px" }} />
                    </div>
                  </td>

                  {/* Two buttons — Upload + Delete */}
                  <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <div style={{ ...shimmer, height: "34px", width: "120px", borderRadius: "8px" }} />
                      <div style={{ ...shimmer, height: "34px", width: "120px", borderRadius: "8px" }} />
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}