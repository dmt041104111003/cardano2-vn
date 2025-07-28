import { Search, Filter, Tag, FolderOpen } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface NavigationProps {
  searchTerm: string;
  statusFilter: string;
  fundFilter: string;
  typeFilter: string;
  projects: any[];
  years: number[];
  selectedYear: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onFundChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onYearChange: (year: number) => void;
}

export default function Navigation({
  searchTerm,
  statusFilter,
  fundFilter,
  typeFilter,
  projects,
  years,
  selectedYear,
  onSearchChange,
  onStatusChange,
  onFundChange,
  onTypeChange,
  onYearChange
}: NavigationProps) {
  const [catalystFunds, setCatalystFunds] = useState<string[]>([]);

  useEffect(() => {
    console.log("TypeFilter changed to:", typeFilter);
    if (typeFilter === "catalyst") {
      console.log("Fetching funds from API...");
      fetch('/api/projects')
        .then(res => {
          console.log("Response status:", res.status);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log("API response:", data);
          if (data.projects && Array.isArray(data.projects)) {
            const funds = Array.from(new Set(data.projects.map((p: any) => p.fund).filter(Boolean))) as string[];
            console.log("Funds from API:", funds);
            setCatalystFunds(funds);
          } else {
            console.error("Invalid API response format:", data);
            setCatalystFunds([]);
          }
        })
        .catch(error => {
          console.error("Error fetching funds:", error);
          setCatalystFunds([]);
        });
    } else if (typeFilter === "project") {
      console.log("Project tab selected - calling technologies API...");
      fetch('/api/technologies')
        .then(res => {
          console.log("Technologies response status:", res.status);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log("Technologies API response:", data);
          if (data.technologies && Array.isArray(data.technologies)) {
            const funds = Array.from(new Set(data.technologies.map((t: any) => t.name).filter(Boolean))) as string[];
            console.log("Technology names from API:", funds);
            setCatalystFunds(funds);
          } else {
            console.error("Invalid technologies API response format:", data);
            setCatalystFunds([]);
          }
        })
        .catch(error => {
          console.error("Error fetching technologies:", error);
          setCatalystFunds([]);
        });
    } else {
      console.log("Setting catalystFunds to empty array");
      setCatalystFunds([]);
    }
  }, [typeFilter]);
  return (
    <div className="w-full md:w-80 md:shrink-0 md:pr-8">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder={typeFilter === "project" ? "Search projects..." : "Search catalyst..."}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-white/20 rounded-sm bg-white dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {typeFilter !== "project" && (
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-white/20 rounded-sm bg-white dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              title="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="PROPOSED">Proposed</option>
              <option value="APPROVED">Approved</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        )}
        
        {typeFilter !== "project" && (
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <select
              value={fundFilter}
              onChange={(e) => onFundChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-white/20 rounded-sm bg-white dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              title="Filter by fund"
            >
              <option value="all">All Funds</option>
              {typeFilter === "catalyst" ? (
                catalystFunds.map((fund: string) => (
                  <option key={fund} value={fund}>{fund}</option>
                ))
              ) : (
                Array.from(new Set(projects.map((p: any) => p.fund).filter(Boolean))).map((fund: any) => (
                  <option key={fund} value={fund}>{fund}</option>
                ))
              )}
            </select>
          </div>
        )}
        
        <div className="flex space-x-2">
          <button
            onClick={() => onTypeChange("catalyst")}
            className={`flex-1 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
              typeFilter === "catalyst"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700/50"
            }`}
          >
            Catalyst
          </button>
          <button
            onClick={() => onTypeChange("project")}
            className={`flex-1 px-4 py-3 rounded-sm text-sm font-medium transition-colors ${
              typeFilter === "project"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700/50"
            }`}
          >
            Projects
          </button>
        </div>
      </div>

      <div className="mt-6">
        <Link href="https://andamio.notion.site/1fb44d820e1d804ebec4f0142d3f267a?pvs=105">
          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow hover:text-success p-1 px-3 w-full rounded-sm bg-blue-600 text-white hover:bg-blue-700">
            Give Feedback
          </button>
        </Link>
      </div>

      {typeFilter !== "project" && (
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
                aria-selected={selectedYear === year ? "true" : "false"}
                aria-controls={`content-${year}`}
                id={`trigger-${year}`}
                onClick={() => onYearChange(year)}
                className={`inline-flex items-center whitespace-nowrap w-full justify-start rounded-sm border px-4 py-3 text-left text-sm font-medium backdrop-blur-sm transition-all ${
                  selectedYear === year 
                    ? "bg-blue-600 text-white border-blue-600 dark:border-white/20" 
                    : "bg-gray-100 dark:bg-gray-800/50 text-gray-900 dark:text-white border-gray-200 dark:border-white/20 hover:bg-gray-200 dark:hover:bg-gray-700/50"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
