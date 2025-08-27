// Technology interfaces
export interface Technology {
  id: string;
  title: string;
  name: string;
  description: string;
  href: string;
  image: string;
  githubRepo?: string;
  publishStatus: 'DRAFT' | 'PUBLISHED';
  featureCardIds?: string[]; // Array of feature card IDs
  createdAt?: string;
  updatedAt?: string;
}

// TechnologyDetailsModal interfaces
export interface TechnologyDetailsModalProps {
  technology: Technology | null;
  isOpen: boolean;
  onClose: () => void;
}

// TechnologyEditor interfaces
export interface TechnologyEditorProps {
  technology?: Technology;
  onSave: (data: { 
    title: string; 
    name: string; 
    description: string; 
    href: string; 
    image: string; 
    githubRepo?: string; 
    publishStatus: 'DRAFT' | 'PUBLISHED';
    featureCardIds?: string[];
  }) => void;
  onCancel: () => void;
}

// TechnologyTable interfaces
export interface TechnologyTableProps {
  technologies: Technology[];
  onEdit: (technology: Technology) => void;
  onDelete: (technology: Technology) => void;
  onViewDetails: (technology: Technology) => void;
}

// Technology Page Client Interface
export interface TechnologyPageClientProps {
  isEmbedded?: boolean;
  searchTerm?: string;
} 