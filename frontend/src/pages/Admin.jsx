import { Plus, Edit, Trash2, Video, ArrowRight } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import AdminCardSkeleton from "../components/skeletons/AdminCardSkeleton";

function Admin() {
  const navigate = useNavigate();
  const adminOptions = [
    {
      id: "create",
      title: "Create Problem",
      description: "Add new coding problems, test cases and starter templates to the platform.",
      icon: Plus,
      accent: "#22c55e",
      accentBg: "rgba(34,197,94,0.08)",
      accentBorder: "rgba(34,197,94,0.2)",
      route: "/admin/create",
    },
    {
      id: "update",
      title: "Update Problem",
      description: "Edit existing problems, modify solutions and manage problem details.",
      icon: Edit,
      accent: "#eab308",
      accentBg: "rgba(234,179,8,0.08)",
      accentBorder: "rgba(234,179,8,0.2)",
      route: "/admin/update-list",
    },
    {
      id: "delete",
      title: "Delete Problem",
      description: "Remove outdated or invalid coding problems from the platform.",
      icon: Trash2,
      accent: "#ef4444",
      accentBg: "rgba(239,68,68,0.08)",
      accentBorder: "rgba(239,68,68,0.2)",
      route: "/admin/delete",
    },
    {
      id: "video",
      title: "Video Problem",
      description: "Upload and manage editorial videos for coding problems.",
      icon: Video,
      accent: "#a5b4fc",
      accentBg: "rgba(99,102,241,0.08)",
      accentBorder: "rgba(99,102,241,0.2)",
      route: "/admin/video",
    },
  ];

  // if (loading) return <TableSkeleton rows={5} />;

  return (
    <div style={s.page}>
      {/* Navbar */}
      <nav style={s.navbar}>
        <div style={s.navLeft}>
          <button onClick={() => navigate("/")} style={s.backBtn}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <NavLink to="/" style={{ textDecoration: "none" }}>
            <span style={s.logo}>CodeArena</span>
          </NavLink>
        </div>
        <span style={s.adminBox}>Admin Dashboard</span>
      </nav>

      <div style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <h1 style={s.heading}>Admin Dashboard</h1>
          <p style={s.subheading}>
            Manage coding problems, editorial videos and platform content from one central dashboard.
          </p>
        </div>

        {/* Cards */}
        <div style={s.grid}>
          {adminOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.id} style={s.card}>
                {/* Icon */}
                <div style={{
                  ...s.iconBox,
                  background: option.accentBg,
                  border: `1px solid ${option.accentBorder}`,
                }}>
                  <Icon size={28} color={option.accent} />
                </div>

                {/* Text */}
                <h2 style={s.cardTitle}>{option.title}</h2>
                <p style={s.cardDesc}>{option.description}</p>

                {/* Button */}
                <NavLink to={option.route} style={{
                  ...s.cardBtn,
                  background: option.accentBg,
                  border: `1px solid ${option.accentBorder}`,
                  color: option.accent,
                }}>
                  {option.title}
                  <ArrowRight size={15} />
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#080c14",
    fontFamily: "'Sora', sans-serif",
    color: "#c9d1d9",
  },
  navbar: {
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
  },
  logo: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#a5b4fc",
  },
  navLeft: { display: "flex", alignItems: "center", gap: "20px" },
  backBtn: { display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "1px solid #1e2738", borderRadius: "8px", color: "#9ca3af", fontSize: "13px", fontWeight: 600, padding: "6px 14px", cursor: "pointer", fontFamily: "'Sora', sans-serif" },
  adminBox: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: 500,
    border: "1px solid #1e2738",
    borderRadius: "8px",
    padding: "6px 14px",
    background: "#0c1018",
  },
  main: {
    padding: "60px 40px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "56px",
  },
  heading: {
    fontSize: "36px",
    fontWeight: 700,
    color: "#f9fafb",
    marginBottom: "14px",
  },
  subheading: {
    fontSize: "15px",
    color: "#6b7280",
    maxWidth: "520px",
    margin: "0 auto",
    lineHeight: 1.7,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#0c1018",
    border: "1px solid #1e2738",
    borderRadius: "20px",
    padding: "36px 32px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    transition: "border-color 0.2s ease, transform 0.2s ease",
  },
  iconBox: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#f9fafb",
    margin: 0,
  },
  cardDesc: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.7,
    margin: 0,
    flex: 1,
  },
  cardBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 700,
    textDecoration: "none",
    cursor: "pointer",
    alignSelf: "flex-start",
    marginTop: "8px",
    fontFamily: "'Sora', sans-serif",
  },
};

export default Admin;