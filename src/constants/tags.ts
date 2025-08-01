export interface Tag {
  id: string;
  name: string;
  postCount: number;
  createdAt: string;
  isEditing?: boolean;
  _count?: { posts?: number };
}

export interface TagTableProps {
  tags: Tag[];
  editingTag: Tag | null;
  onEdit: (tag: Tag) => void;
  onSave: (tagId: string, newName: string) => void;
  onDelete: (tagId: string) => void;
  onCancel: () => void;
}

export function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export const ITEMS_PER_PAGE = 6;

export function isWithin24Hours(dateString: string): boolean {
  const tagDate = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - tagDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 24;
} 