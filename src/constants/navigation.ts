// Navigation Components Interfaces
export interface NavigationProps {
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