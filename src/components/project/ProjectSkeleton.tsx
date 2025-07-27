export default function ProjectSkeleton() {
  return (
    <div className="w-full">
      <div className="group w-full rounded-sm border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/50 shadow-xl backdrop-blur-sm">
        <div className="flex w-full">
          <div className="flex-grow border-l-4 bg-gray-50 dark:bg-gray-900/60 border-green-500 rounded-l-lg">
            <div className="p-5">
              <div className="mb-3">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse w-16"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                </div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-24"></div>
              </div>
            </div>
          </div>
          <div className="flex w-32 flex-col justify-center bg-green-100 dark:bg-green-900/30 rounded-r-lg p-4">
            <div className="flex flex-col items-end space-y-2">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-12"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-8"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-16 mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 