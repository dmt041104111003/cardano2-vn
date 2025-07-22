export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  // Thêm các trường reaction cụ thể
  LIKE: number;
  HEART: number;
  HAHA: number;
  SAD: number;
  ANGRY: number;
  comments: number;
  shares: number;
  media: Array<{ type: 'image' | 'youtube' | 'video'; url: string; id: string }>;
}

export const ITEMS_PER_PAGE = 6;

export function isWithin24Hours(dateString: string): boolean {
  const postDate = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 24;
} 