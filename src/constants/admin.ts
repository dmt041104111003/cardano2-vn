// AdminFilters interfaces
export interface AdminFiltersProps {
  searchTerm: string;
  filterType: string;
  searchPlaceholder: string;
  filterOptions: { value: string; label: string }[];
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

// AdminHeader interfaces
export interface AdminHeaderProps {
  title: string;
  description: string;
  buttonText: string;
  onAddClick?: () => void;
}

// AdminStats interfaces
export interface StatItem {
  label: string;
  value: number;
  color?: 'default' | 'green' | 'blue' | 'red';
}

export interface AdminStatsProps {
  stats: StatItem[];
}

// AdminTableSkeleton interfaces
export interface AdminTableSkeletonProps {
  columns: number;
  rows?: number;
}

// Modal interfaces
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
} 