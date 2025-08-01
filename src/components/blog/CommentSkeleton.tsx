export default function CommentSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0"></div>
        
        <div className="flex-1 min-w-0">
          <div className="bg-gray-100 dark:bg-gray-800/30 rounded-2xl px-3 py-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-8"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReplySkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0"></div>
        
        <div className="flex-1 min-w-0">
          <div className="bg-gray-100/50 dark:bg-gray-800/20 rounded-xl px-3 py-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-14"></div>
            </div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-6"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-10"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { CommentSkeletonListProps } from '~/constants/comment';

export function CommentSkeletonList({ count = 3 }: CommentSkeletonListProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <CommentSkeleton key={index} />
      ))}
    </div>
  );
} 