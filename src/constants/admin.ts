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

// Event Location interfaces
export interface EventLocation {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventLocationTableProps {
  eventLocations: EventLocation[];
  onEdit: (location: EventLocation) => void;
  onDelete: (id: string) => void;
}

export interface EventLocationEditModalProps {
  eventLocation: EventLocation | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string) => void;
  isSaving: boolean;
}

// Course interfaces
export interface Course {
  id: string;
  name: string;
  image?: string;
  title?: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

export interface CourseEditModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string, image?: string, title?: string, description?: string) => void;
  isSaving: boolean;
}

export interface LandingContentFormData {
  section: string;
  title: string;
  subtitle: string;
  description: string;
  mainText: string;
  subText: string;
  media1Url: string;
  media2Url: string;
  media3Url: string;
  media4Url: string;
}

export interface LandingContentProps {
  content: {
    title: string;
    subtitle: string;
    description: string;
    mainText: string;
    subText: string;
  };
}

export interface LandingMediaProps {
  mediaItems: string[];
} 