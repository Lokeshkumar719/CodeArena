import SkeletonBox from "./SkeletonBox";
import SkeletonText from "./SkeletonText";

// Matches the 4-card grid on Admin Dashboard
export default function AdminDashboardSkeleton() {
  return (
    <div style={{ padding: "80px 40px", maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
      {/* Heading */}
      <SkeletonBox className="h-10 w-64 mx-auto mb-3" />
      <SkeletonBox className="h-4 w-80 mx-auto mb-12" />
      {/* 4 cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "#0c1018",
              border: "1px solid #1e2738",
              borderRadius: "16px",
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              alignItems: "flex-start",
            }}
          >
            {/* Icon */}
            <SkeletonBox className="h-12 w-12 rounded-xl" />
            {/* Title */}
            <SkeletonText width="w-3/4" className="h-5" />
            {/* Description lines */}
            <SkeletonText width="w-full" />
            <SkeletonText width="w-4/5" />
            {/* Button */}
            <SkeletonBox className="h-9 w-36 rounded-lg mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}