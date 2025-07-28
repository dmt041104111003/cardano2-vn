export interface User {
  id: string;
  name: string;
  address: string;
  email?: string;
  provider?: string;
  role: 'USER' | 'ADMIN';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export const ITEMS_PER_PAGE = 6;

export function isWithin24Hours(dateString: string): boolean {
  const userDate = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - userDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 24;
} 