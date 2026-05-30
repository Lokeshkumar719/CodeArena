import { Plus, Edit, Trash2, Video, ArrowRight } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import AdminCardSkeleton from "../components/skeletons/AdminCardSkeleton";

import { s } from '../styles/pages/adminPageStyles';

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



export default Admin;