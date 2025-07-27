import { Search, Filter, Tag } from "lucide-react";
import Link from "next/link";

interface NavigationProps {
  searchTerm: string;
  statusFilter: string;
  fundFilter: string;
  projects: any[];
  years: number[];
  selectedYear: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onFundChange: (value: string) => void;
  onYearChange: (year: number) => void;
}

export default function Navigation({
  searchTerm,
  statusFilter,
  fundFilter,
  projects,
  years,
  selectedYear,
  onSearchChange,
  onStatusChange,
  onFundChange,
  onYearChange
}: NavigationProps) {
  return (
    <div className="w-full md:w-80 md:shrink-0 md:pr-8">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-sm bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-sm bg-gray-800/50 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all">All Status</option>
            <option value="PROPOSED">Proposed</option>
            <option value="APPROVED">Approved</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={fundFilter}
            onChange={(e) => onFundChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-sm bg-gray-800/50 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all">All Funds</option>
            {Array.from(new Set(projects.map((p: any) => p.fund).filter(Boolean))).map((fund: any) => (
              <option key={fund} value={fund}>{fund}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <Link href="https://andamio.notion.site/1fb44d820e1d804ebec4f0142d3f267a?pvs=105">
          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:text-success p-1 px-3 w-full rounded-sm bg-blue-600 text-white hover:bg-blue-700">
            Give Feedback
          </button>
        </Link>
      </div>

      <div className="mt-6">
        <div
          role="tablist"
          aria-orientation="vertical"
          className="items-center justify-center rounded-sm text-accent-foreground mb-2 flex w-full flex-row gap-2 overflow-x-auto bg-transparent p-0 md:flex-col md:overflow-visible"
          data-orientation="vertical"
        >
          {years.map((year, key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={selectedYear === year}
              aria-controls={`content-${year}`}
              id={`trigger-${year}`}
              onClick={() => onYearChange(year)}
              className={`inline-flex items-center whitespace-nowrap w-full justify-start rounded-sm border px-4 py-3 text-left text-sm font-medium backdrop-blur-sm transition-all ${
                selectedYear === year ? "bg-blue-600 text-white border-white/20" : "bg-gray-800/50 text-white border-white/20 hover:bg-gray-700/50"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
