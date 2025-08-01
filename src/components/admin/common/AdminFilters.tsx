'use client';

import { Search } from 'lucide-react';
import { AdminFiltersProps } from '~/constants/admin';

export function AdminFilters({
  searchTerm,
  filterType,
  searchPlaceholder,
  filterOptions,
  onSearchChange,
  onFilterChange,
}: AdminFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="sm:w-48">
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => onFilterChange(e.target.value)}
                title="Filter items"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 