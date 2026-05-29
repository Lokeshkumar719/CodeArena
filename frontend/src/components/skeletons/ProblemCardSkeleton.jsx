import SkeletonText from "./SkeletonText";
import SkeletonBox from "./SkeletonBox";

// Matches the card in Problems list page
export default function ProblemCardSkeleton() {
  return (
    <div
      style={{
        background: "#0c1018",
        border: "1px solid #1e2738",
        borderRadius: "16px",
        padding: "20px 24px",
        marginBottom: "12px",
      }}
    >
      {/* #1  Title line */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        <SkeletonText width="w-8" className="h-3" />
        <SkeletonText width="w-48" className="h-4" />
      </div>
      {/* Tag pills row */}
      <div style={{ display: "flex", gap: "8px" }}>
        <SkeletonBox className="h-6 w-16" />
        <SkeletonBox className="h-6 w-20" />
        <SkeletonBox className="h-6 w-14" />
      </div>
    </div>
  );
}