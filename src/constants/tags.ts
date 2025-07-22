export interface Tag {
  id: string;
  name: string;
  postCount: number;
  createdAt: string;
  isEditing?: boolean;
  _count?: { posts?: number };
}

export const ITEMS_PER_PAGE = 6;

export function isWithin24Hours(dateString: string): boolean {
  const tagDate = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - tagDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 24;
} 