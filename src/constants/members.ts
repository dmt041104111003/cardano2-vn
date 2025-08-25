// Member interfaces
export interface Member {
  id?: string;
  name: string;
  role: string;
  description: string;
  image: string;
  email?: string;
  color?: string;
  skills?: string[];
  publishStatus?: 'DRAFT' | 'PUBLISHED';
  order: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  tabId?: string;
  tab?: Tab;
}

// Tab interfaces
export interface Tab {
  id: string;
  name: string;
  description?: string;
  color?: string;
  order: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  members?: Member[];
}

// MemberDetailsModal interfaces
export interface MemberDetailsModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

// MemberEditor interfaces
export interface MemberEditorProps {
  member?: Member;
  onSave: (data: Member) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// MediaInput interfaces
export interface MediaInputProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  accept?: string;
}

// MembersTable interfaces
export interface MembersTableProps {
  members: Member[];
  onView: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
}

// Member Modal Interface
export interface MemberType {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  email?: string;
  color?: string;
  skills?: string[];
  publishStatus?: 'DRAFT' | 'PUBLISHED';
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MemberModalProps {
  member: MemberType | null;
  isOpen: boolean;
  onClose: () => void;
} 