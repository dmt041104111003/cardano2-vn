export default function BlogDetailSkeleton() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900 animate-pulse">
      <div className="pt-20">
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-4 w-24 bg-gray-700 rounded" />
            <div className="h-4 w-16 bg-gray-700 rounded" />
          </div>
        </div>
        <article className="mx-auto max-w-4xl px-6 pb-20 lg:px-8">
          <header className="mb-12">
            <div className="mb-6 flex items-center gap-4">
              <div className="h-4 w-32 bg-gray-700 rounded" />
              <div className="h-4 w-20 bg-gray-700 rounded" />
            </div>
            <div className="mb-8 h-12 w-2/3 bg-gray-700 rounded" />
            <div className="flex flex-wrap gap-2 mt-4 mb-8">
              <div className="h-6 w-20 bg-blue-600/20 rounded-full" />
              <div className="h-6 w-16 bg-blue-600/20 rounded-full" />
            </div>
          </header>
          <div className="relative h-64 w-full overflow-hidden rounded-lg sm:h-80 lg:h-96 mb-8">
            <div className="w-full h-full bg-gray-700 rounded" />
          </div>
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-700 rounded" />
              <div className="h-4 w-5/6 bg-gray-700 rounded" />
              <div className="h-4 w-2/3 bg-gray-700 rounded" />
              <div className="h-4 w-1/2 bg-gray-700 rounded" />
              <div className="h-4 w-3/4 bg-gray-700 rounded" />
              <div className="h-4 w-1/3 bg-gray-700 rounded" />
            </div>
          </div>
        </article>
      </div>
    </main>
  );
} 