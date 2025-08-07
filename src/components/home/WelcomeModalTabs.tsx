"use client";

interface WelcomeModalTabsProps {
  isAdmin: boolean;
  activeTab: "welcome" | "edit";
  onTabChange: (tab: "welcome" | "edit") => void;
}

export default function WelcomeModalTabs({ isAdmin, activeTab, onTabChange }: WelcomeModalTabsProps) {
  if (!isAdmin) return null;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
      <nav className="-mb-px flex flex-wrap gap-1 sm:gap-2 md:gap-8 overflow-x-auto pb-2">
        <button
          onClick={() => onTabChange("welcome")}
          className={`py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === "welcome"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="hidden sm:inline">Welcome</span>
            <span className="sm:hidden">Welcome</span>
          </div>
        </button>
        <button
          onClick={() => onTabChange("edit")}
          className={`py-2 px-2 sm:px-3 md:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            activeTab === "edit"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="hidden sm:inline">Edit Content</span>
            <span className="sm:hidden">Edit</span>
          </div>
        </button>
      </nav>
    </div>
  );
}
