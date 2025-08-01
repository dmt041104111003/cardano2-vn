// Import interfaces from members.ts to maintain consistency
import { Tab, Member } from '~/constants/members';

// Re-export for backward compatibility
export type { Tab, Member };

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