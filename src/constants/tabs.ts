// Tab interfaces
export interface Tab {
  id?: string;
  name: string;
  order: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  members?: Member[];
}

// Member interfaces (for tabs context)
export interface Member {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  email?: string;
  color?: string;
  skills?: string[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// TabDetailsModal interfaces
export interface TabDetailsModalProps {
  tab: Tab | null;
  isOpen: boolean;
  onClose: () => void;
}

// TabEditor interfaces
export interface TabEditorProps {
  tab?: Tab;
  existingTabs?: Tab[];
  onSave: (data: Tab) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// TabsTable interfaces
export interface TabsTableProps {
  tabs: Tab[];
  onEdit: (tab: Tab) => void;
  onDelete: (tabId: string) => void;
  onView: (tab: Tab) => void;
} 