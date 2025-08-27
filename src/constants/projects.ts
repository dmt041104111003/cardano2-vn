// Project interfaces
export interface Project {
  id: string;
  title: string;
  description: string;
  href?: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  publishStatus: 'DRAFT' | 'PUBLISHED';
  year: number;
  quarterly: string;
  fund?: string;
  createdAt: string;
  updatedAt: string;
}

// ProjectDetailsModal interfaces
export interface ProjectDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

// ProjectEditor interfaces
export interface ProjectEditorProps {
  project?: Project | null;
  onSave: (project: Partial<Project>) => void;
  onCancel: () => void;
}

// ProjectTable interfaces
export interface ProjectTableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onViewDetails: (project: Project) => void;
}

// Project Card and Modal Interfaces
export interface ProjectCardProps {
  project: Project;
}

export interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
} 