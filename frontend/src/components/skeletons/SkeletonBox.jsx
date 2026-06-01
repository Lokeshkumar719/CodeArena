// Reusable single shimmer block
// Use for any rectangle placeholder
export default function SkeletonBox({ className = '' }) {
  return <div className={`skeleton-shimmer rounded-xl ${className}`} />;
}
