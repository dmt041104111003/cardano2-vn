"use client";

import Link from "next/link";

export default function CTASection() {
  return (
    <section
      id="cta"
      className="relative flex min-h-screen items-center overflow-hidden border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gradient-to-br dark:from-blue-900 dark:via-blue-800 dark:to-indigo-900"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 dark:via-white/5 to-transparent"></div>
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-8 flex items-center gap-4">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-600 dark:from-white to-transparent"></div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">Ready to enable trust for distributed work?</h2>
            </div>
            <p className="mb-10 text-xl leading-relaxed text-gray-600 dark:text-blue-100">
              Join projects and contributors building the future of decentralized collaboration.
            </p>
            <div className="mb-10 flex flex-col gap-6 sm:flex-row">
              <Link href="https://app.andamio.io/course/86affc4de251b0fb7636c376383bcebf6ca7ca426528f9b7a5adc298">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success text-xl bg-blue-600 dark:bg-white px-8 py-4 font-semibold text-white dark:text-blue-900 shadow-xl hover:bg-blue-700 dark:hover:bg-gray-100">
                  Start with Cardano2VN
                </button>
              </Link>
              <Link href="https://docs.andamio.io/docs/">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-100 dark:bg-gray-800 text-xl border-gray-300 dark:border-white/70 px-8 py-4 font-semibold text-gray-900 dark:text-white shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                  View Documentation
                </button>
              </Link>
            </div>
            <div className="grid gap-6 text-gray-600 dark:text-blue-200 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-sm border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/10 p-6 backdrop-blur-sm">
                <span className="text-3xl">👤</span>
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">Curious Users</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">Start with Andamio 101</div>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-sm border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/10 p-6 backdrop-blur-sm">
                <span className="text-3xl">👩‍💻</span>
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">Developers</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">Explore Documentation</div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-100/50 dark:from-white/10 via-transparent to-gray-50/30 dark:to-white/5"></div>
            <div className="relative p-8">
              <div className="grid h-80 grid-cols-3 gap-4">
                <div className="rounded-sm border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/10 backdrop-blur-sm ">
                  <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                </div>
                <div className="rounded-sm border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/10 backdrop-blur-sm mt-8">
                  <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                </div>
                <div className="rounded-sm border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/10 backdrop-blur-sm -mt-4">
                  <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                </div>
                <div className="rounded-sm border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/10 backdrop-blur-sm ">
                  <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                </div>
                <div className="rounded-sm border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/10 backdrop-blur-sm mt-8">
                  <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                </div>
                <div className="rounded-sm border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/10 backdrop-blur-sm -mt-4">
                  <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                </div>
                <div className="rounded-sm border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/10 backdrop-blur-sm ">
                  <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                </div>
                <div className="rounded-sm border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/10 backdrop-blur-sm mt-8">
                  <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                </div>
                <div className="rounded-sm border border-gray-200 dark:border-white/20 bg-gray-50 dark:bg-white/10 backdrop-blur-sm -mt-4">
                  <div className="h-full w-full rounded-sm bg-gradient-to-br from-blue-400/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 