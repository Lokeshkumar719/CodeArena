export default function TableSkeleton({ rows = 5 }) {
    return (
        <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'Sora', sans-serif" }}>

            {/* Navbar */}
            <nav style={{
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
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div className="skeleton-shimmer" style={{ height: "32px", width: "70px", borderRadius: "8px" }} />
                    <div className="skeleton-shimmer" style={{ height: "28px", width: "100px", borderRadius: "8px" }} />
                </div>
                <div className="skeleton-shimmer" style={{ height: "32px", width: "130px", borderRadius: "8px" }} />
            </nav>

            <div style={{ padding: "48px 40px", maxWidth: "1200px", margin: "0 auto" }}>

                {/* Heading */}
                <div style={{ marginBottom: "52px" }}>
                    <div className="skeleton-shimmer" style={{ height: "32px", width: "220px", borderRadius: "10px", marginBottom: "8px" }} />
                    <div className="skeleton-shimmer" style={{ height: "16px", width: "340px", borderRadius: "8px" }} />
                </div>

                {/* Search */}
                <div className="skeleton-shimmer" style={{ height: "46px", width: "100%", borderRadius: "12px", marginBottom: "20px" }} />

                {/* Filters */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                    <div className="skeleton-shimmer" style={{ height: "42px", width: "160px", borderRadius: "10px" }} />
                    <div className="skeleton-shimmer" style={{ height: "42px", width: "160px", borderRadius: "10px" }} />
                </div>

                {/* Table */}
                <div style={{ background: "#0c1018", border: "1px solid #1e2738", borderRadius: "16px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto" }}>
                        <colgroup>
                            <col style={{ width: "36px" }} />
                            <col style={{ width: "263px" }} />
                            <col style={{ width: "154px" }} />
                            <col style={{ width: "320px" }} />
                            <col style={{ width: "154px" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                {["#", "Title", "Difficulty", "Tags", "Action"].map((col) => (
                                    <th key={col} style={{
                                        padding: "14px 20px",
                                        textAlign: "left",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        color: "#4b5563",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.06em",
                                        background: "#0a0e18",
                                        borderBottom: "1px solid #1e2738",
                                    }}>
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {Array.from({ length: rows }).map((_, i) => (
                                <tr key={i} style={{ borderBottom: i < rows - 1 ? "1px solid #1e2738" : "none" }}>

                                    {/* # */}
                                    <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                                        <div className="skeleton-shimmer" style={{ height: "14px", width: "24px", borderRadius: "6px" }} />
                                    </td>

                                    {/* Title */}
                                    <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                                        <div className="skeleton-shimmer" style={{ height: "14px", width: "160px", borderRadius: "6px" }} />
                                    </td>

                                    {/* Difficulty */}
                                    <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                                        <div className="skeleton-shimmer" style={{ height: "24px", width: "64px", borderRadius: "999px" }} />
                                    </td>

                                    {/* Tags */}
                                    <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                                        <div style={{ display: "flex", gap: "6px" }}>
                                            <div className="skeleton-shimmer" style={{ height: "22px", width: "60px", borderRadius: "999px" }} />
                                            <div className="skeleton-shimmer" style={{ height: "22px", width: "72px", borderRadius: "999px" }} />
                                        </div>
                                    </td>

                                    {/* Action */}
                                    <td style={{ padding: "16px 20px", verticalAlign: "middle" }}>
                                        <div className="skeleton-shimmer" style={{ height: "34px", width: "80px", borderRadius: "8px" }} />
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