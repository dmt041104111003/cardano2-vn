export default function VideoSectionSkeleton() {
  return (
    <section id="videos" className="relative flex min-h-screen items-center border-t border-gray-200 dark:border-white/10">
      <div className="mx-auto w-5/6 max-w-screen-2xl px-4 py-12 lg:px-8 lg:py-20">
        <div className="relative">
          <div className="mb-8 lg:mb-16">
            <div className="mb-4 lg:mb-6 flex items-center gap-2 lg:gap-4">
              <div className="h-1 w-8 lg:w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <div className="h-8 lg:h-12 w-64 lg:w-96 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="h-6 lg:h-8 w-96 lg:w-[500px] bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            <div className="w-full lg:w-[60%]">
              <div className="relative w-full aspect-video rounded-lg lg:rounded-xl overflow-hidden mb-4 lg:mb-6 shadow-lg lg:shadow-2xl bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
              <div className="h-6 lg:h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-4 lg:h-6 w-1/3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            <div className="w-full lg:w-[40%] max-h-fit p-4 lg:p-6 border border-gray-200 dark:border-gray-600 rounded-lg lg:rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg lg:shadow-xl">
              <div className="mb-4 lg:mb-6">
                <div className="h-6 lg:h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>

              <div className="space-y-3 lg:space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="flex gap-3 lg:gap-4 p-3 lg:p-4 rounded-lg lg:rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                    <div className="relative w-24 h-16 lg:w-32 lg:h-20 shrink-0 rounded-lg overflow-hidden bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                    <div className="flex flex-col justify-between overflow-hidden flex-1">
                      <div className="h-4 lg:h-5 w-full bg-gray-300 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
                      <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 