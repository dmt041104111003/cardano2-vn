export interface User {
  id: string;
  name: string;
  address: string;
  email?: string;
  provider?: string;
  role: 'USER' | 'ADMIN';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  avatar?: string;
}

export interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onRoleChange: (userId: string, role: 'USER' | 'ADMIN') => void;
  currentUserAddress?: string | null;
}

export function shortenAddress(address: string, chars = 6) {
  if (!address) return '';
  if (address.length <= chars * 2 + 3) return address;
  return address.slice(0, chars) + '...' + address.slice(-chars);
}

export function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export const ITEMS_PER_PAGE = 6;

export function isWithin24Hours(dateString: string): boolean {
  const userDate = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - userDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 24;
}

// Session Components Interfaces
export interface SessionData {
  id: string;
  accessTime: string;
  lastAccess: string;
}

// Wallet Avatar Components Interfaces
export interface WalletAvatarProps {
  address: string | null;
  size?: number;
  className?: string;
}

// User Hook Interfaces
export interface UserHook {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
  isAdmin: boolean;
  address: string;
  email?: string;
  provider?: string;
} 