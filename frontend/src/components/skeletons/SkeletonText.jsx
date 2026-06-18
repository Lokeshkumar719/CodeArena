// Reusable text-line placeholder
// Pass width like "w-1/2", "w-3/4", "w-full"
export default function SkeletonText({ width = 'w-full', className = '' }) {
  return <div className={`skeleton-shimmer h-3 rounded-full ${width} ${className}`} />;
}
