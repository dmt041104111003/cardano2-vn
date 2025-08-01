export interface Post {
  id: string;
  title: string;
  slug?: string;
  content: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  views: number;

  LIKE: number;
  HEART: number;
  HAHA: number;
  SAD: number;
  ANGRY: number;
  WOW?: number; 
  comments: number;
  shares: number;
  media: Array<{ type: 'image' | 'youtube' | 'video'; url: string; id: string }>;
  githubRepo?: string;
  comments_rel?: Array<{ id: string; userId: string }>;
  reactions?: Array<{ type: string; userId: string }>;  
}

export interface PostTableProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  onStatusChange?: (postId: string, newStatus: 'published' | 'draft' | 'archived') => void;
}

export interface PostStatsProps {
  posts: Post[];
  year?: number;
}

export const REACTION_TYPES = ['LIKE', 'HEART', 'HAHA', 'SAD', 'ANGRY', 'WOW'] as const;

export interface PostEditorClientProps {
  onSave: (post: Post) => void;
  post?: Post;
  onCancel?: () => void;
}

export interface PostEditorProps {
  onSave: (post: Post) => void;
  post?: Post;
  onCancel?: () => void;
}

export const ITEMS_PER_PAGE = 6;

export function isWithin24Hours(dateString: string): boolean {
  const postDate = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
  return diffInHours <= 24;
}

// Blog Components Interfaces
export interface BlogPost {
  id: string;
  title: string;
  status: string;
  author?: string;
  slug?: string;
  createdAt: string;
  media?: BlogMedia[];
  tags?: BlogTag[];
}

export interface BlogMedia {
  id: string;
  url: string;
  type: string;
}

export interface BlogTag {
  id: string;
  name: string;
}



export interface BlogPostDetail {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
  authorId?: string;
  authorWallet?: string;
  tags: BlogTag[];
  media: { type: string; url: string; id?: string }[];
  comments: { id: string; text: string; author: string; createdAt: string }[];
  comments_rel?: unknown[];
  shares: number;
  reactions: { type: string }[];
  githubRepo?: string;
  updatedAt?: string;
}

export interface BlogFiltersProps {
  search: string;
  setSearch: (v: string) => void;
  selectedTags: string[];
  setSelectedTags: (v: string[]) => void;
  allTags: BlogTag[];
}

// Reaction Components Interfaces
export interface ReactionCountProps {
  reactions: { [type: string]: number };
}

export const REACTION_ICONS: Record<string, string> = {
  LIKE: "👍",
  like: "👍",
  HEART: "❤️",
  heart: "❤️",
  HAHA: "😂",
  haha: "😂",
  WOW: "😮",
  wow: "😮",
  SAD: "😢",
  sad: "😢",
  ANGRY: "��",
  angry: "😠"
}; 