interface SkeletonBlockProps {
  className?: string;
}

/** Shimmering placeholder block matching the surrounding surface. */
export function SkeletonBlock({ className = "" }: SkeletonBlockProps) {
  return <div className={`skeleton-block ${className}`} />;
}