export default function TableRowSkeleton() {
  const shimmer = {
    background: "linear-gradient(90deg, #1e2738 25%, #2a3448 50%, #1e2738 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: "6px",
  };

  return (
    <tr style={{ borderBottom: "1px solid #1e2738" }}>
      <td style={{ padding: "16px 20px", width: "40px" }}>
        <div style={{ ...shimmer, height: "14px", width: "24px" }} />
      </td>
      <td style={{ padding: "16px 20px" }}>
        <div style={{ ...shimmer, height: "14px", width: "160px" }} />
      </td>
      <td style={{ padding: "16px 20px", width: "100px" }}>
        <div style={{ ...shimmer, height: "22px", width: "64px", borderRadius: "999px" }} />
      </td>
      <td style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ ...shimmer, height: "22px", width: "60px", borderRadius: "999px" }} />
          <div style={{ ...shimmer, height: "22px", width: "76px", borderRadius: "999px" }} />
        </div>
      </td>
      <td style={{ padding: "16px 20px", width: "120px" }}>
        <div style={{ ...shimmer, height: "34px", width: "80px", borderRadius: "8px" }} />
      </td>
    </tr>
  );
}