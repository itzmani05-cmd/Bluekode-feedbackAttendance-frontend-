export const SkeletonLine = ({ className = 'h-4 w-full' }) => (
  <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
);

export const SkeletonCard = () => (
  <div className="card space-y-3 p-5">
    <SkeletonLine className="h-4 w-1/3" />
    <SkeletonLine className="h-8 w-1/2" />
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="card overflow-hidden p-5">
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((__, c) => (
            <SkeletonLine key={c} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);
