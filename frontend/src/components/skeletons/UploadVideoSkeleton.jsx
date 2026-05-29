// UploadVideoSkeleton.jsx
export default function UploadVideoSkeleton() {
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

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "60px" }}>

        {/* Heading */}
        <div style={{ ...shimmer, height: "36px", width: "220px", borderRadius: "10px", marginBottom: "12px" }} />
        <div style={{ ...shimmer, height: "16px", width: "260px", borderRadius: "6px", marginBottom: "40px" }} />

        {/* Card */}
        <div style={{ background: "#0c1018", border: "1px solid #1e2738", borderRadius: "16px", padding: "36px", width: "100%", maxWidth: "520px" }}>

          {/* Label */}
          <div style={{ ...shimmer, height: "14px", width: "140px", borderRadius: "6px", marginBottom: "16px" }} />

          {/* File input box */}
          <div style={{ ...shimmer, height: "52px", borderRadius: "10px", marginBottom: "24px" }} />

          {/* Button — right aligned */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ ...shimmer, height: "42px", width: "140px", borderRadius: "10px" }} />
          </div>

        </div>
      </div>
    </div>
  );
}