interface UserSkeletonProps {
  count?: number;
}

export default function UserSkeleton({ count = 3 }: UserSkeletonProps) {
  return (
    <div className="space-y-2 p-4 border-t border-gray-700/50">
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className="flex items-center justify-between p-2 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-24"></div>
              <div className="h-3 bg-gray-700 rounded w-32"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-700 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
} 