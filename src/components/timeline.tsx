export default function Timeline() {
  return (
    <div className="relative animate-[slideInLeft_1s_ease-out_0.2s_both]">
      <div className="flex flex-col items-center justify-between lg:flex-row">
        <div className="w-full pr-0 lg:w-5/12 lg:pr-8">
          <div className="group relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/30 to-blue-600/30 opacity-50 blur-xl transition duration-500 group-hover:opacity-75"></div>
            <div className="relative rounded-2xl border border-gray-200 dark:border-white/20 bg-white dark:bg-gray-800/60 p-6 shadow-2xl backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-gradient-to-br from-blue-500 to-blue-600 text-2xl font-bold text-white shadow-xl shadow-blue-500/25">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-target h-8 w-8"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Purpose</h3>
                  <div className="h-0.5 w-16 bg-blue-500"></div>
                </div>
              </div>
              <p className="mb-3 text-base font-semibold text-blue-600 dark:text-blue-400">Do we trust that our work matters?</p>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                Infrastructure for projects to define their mission, manage treasuries, and create
                <strong className="text-gray-900 dark:text-white"> transparent governance structures</strong> that ensure meaningful work.
              </p>
            </div>
          </div>
        </div>
        <div className="relative z-10 hidden lg:block">
          <div className="h-8 w-8 rounded-full border-4 border-white dark:border-gray-950 bg-blue-500 shadow-lg shadow-blue-500/50"></div>
          <div className="absolute -inset-2 animate-pulse rounded-full bg-blue-500/20"></div>
        </div>
        <div className="hidden w-5/12 pl-8 lg:block">
          <div className="text-right opacity-40">
            <div className="text-6xl font-bold text-blue-500/30">01</div>
            <div className="mt-2 text-blue-300/50">Foundation</div>
          </div>
        </div>
      </div>
    </div>
  );
}
