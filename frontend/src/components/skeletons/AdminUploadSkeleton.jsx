// AdminFormSkeleton.jsx
export default function AdminFormSkeleton() {
  const shimmer = {
    background: "linear-gradient(90deg, #1e2738 25%, #2a3448 50%, #1e2738 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: "6px",
  };

  const card = (children) => (
    <div style={{ background: "#0c1018", border: "1px solid #1e2738", borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
      {children}
    </div>
  );

  const field = (width = "100%", height = "42px") => (
    <div style={{ ...shimmer, height, width, borderRadius: "10px", marginBottom: "16px" }} />
  );

  const label = () => (
    <div style={{ ...shimmer, height: "12px", width: "80px", borderRadius: "4px", marginBottom: "8px" }} />
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080c14", fontFamily: "'Sora', sans-serif" }}>

      {/* Navbar */}
      <nav style={{ height: "64px", background: "#080c14", borderBottom: "1px solid #1e2738", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ ...shimmer, height: "32px", width: "70px", borderRadius: "8px" }} />
          <div style={{ ...shimmer, height: "28px", width: "100px", borderRadius: "8px" }} />
        </div>
        <div style={{ ...shimmer, height: "32px", width: "130px", borderRadius: "8px" }} />
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px" }}>

        {/* Heading */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ ...shimmer, height: "32px", width: "220px", borderRadius: "10px", marginBottom: "8px" }} />
          <div style={{ ...shimmer, height: "14px", width: "280px", borderRadius: "6px" }} />
        </div>

        {/* Basic Information Card */}
        {card(
          <>
            <div style={{ ...shimmer, height: "20px", width: "160px", borderRadius: "6px", marginBottom: "20px" }} />
            {label()}{field("100%", "42px")}
            {label()}{field("100%", "90px")}
            {label()}{field("100%", "70px")}
            {label()}{field("100%", "70px")}
            {label()}{field("100%", "70px")}
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ flex: 1 }}>{label()}{field("100%", "42px")}</div>
              <div style={{ flex: 1 }}>{label()}{field("100%", "42px")}</div>
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ flex: 1 }}>{label()}{field("100%", "42px")}</div>
              <div style={{ flex: 2 }}>{label()}{field("100%", "160px")}</div>
            </div>
          </>
        )}

        {/* Visible Test Cases Card */}
        {card(
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ ...shimmer, height: "20px", width: "180px", borderRadius: "6px" }} />
              <div style={{ ...shimmer, height: "34px", width: "100px", borderRadius: "8px" }} />
            </div>
            <div style={{ background: "#080c14", border: "1px solid #1e2738", borderRadius: "12px", padding: "16px" }}>
              {label()}{field("100%", "70px")}
              {label()}{field("100%", "50px")}
              {label()}{field("100%", "50px")}
            </div>
          </>
        )}

        {/* Hidden Test Cases Card */}
        {card(
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ ...shimmer, height: "20px", width: "180px", borderRadius: "6px" }} />
              <div style={{ ...shimmer, height: "34px", width: "100px", borderRadius: "8px" }} />
            </div>
            <div style={{ background: "#080c14", border: "1px solid #1e2738", borderRadius: "12px", padding: "16px" }}>
              {label()}{field("100%", "70px")}
              {label()}{field("100%", "50px")}
            </div>
          </>
        )}

        {/* Code Templates Card */}
        {card(
          <>
            <div style={{ ...shimmer, height: "20px", width: "140px", borderRadius: "6px", marginBottom: "20px" }} />
            {["C++", "Java", "JavaScript"].map((_, i) => (
              <div key={i} style={{ marginBottom: "28px" }}>
                <div style={{ ...shimmer, height: "28px", width: "80px", borderRadius: "8px", marginBottom: "14px" }} />
                {field("100%", "120px")}
                {field("100%", "120px")}
              </div>
            ))}
          </>
        )}

        {/* Submit Button */}
        <div style={{ ...shimmer, height: "50px", borderRadius: "10px" }} />

      </div>
    </div>
  );
}