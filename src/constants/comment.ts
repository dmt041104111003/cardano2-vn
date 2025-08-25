// Comment Components Interfaces
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user?: {
    wallet?: string;
    image?: string;
    name?: string;
    id?: string;
    displayName?: string;
  } | null;
  parentCommentId?: string | null;
  replies?: Comment[];
  parentUserId?: string;
  parentAuthor?: string;
  author?: string;
  time?: string;
  avatar?: string;
  isPostAuthor?: boolean;
  postId?: string;
  isTemp?: boolean;
}

export interface CommentInputProps {
  onSubmit: (comment: string, user?: { id: string; address: string; image: string | null; isBanned?: boolean; bannedUntil?: string } | null) => void;
  user?: { id: string; address: string; image: string | null; isBanned?: boolean; bannedUntil?: string } | null;
}

export interface CommentItemProps {
  comment: Comment;
  onSubmitReply: (parentId: string, replyText: string, userInfo: { id?: string; address?: string; image?: string }) => void;
  onDeleteComment?: (commentId: string) => void;
  onUpdateComment?: (commentId: string, content: string) => void;
  user: { id?: string; address?: string; image?: string } | null;
  activeReplyId: string | null;
  setActiveReplyId: (id: string | null) => void;
  depth?: number;
  hoveredId?: string | null;
  setHoveredId?: (id: string | null) => void;
}

export interface CommentReplyProps {
  reply: Comment;
  onReply: (commentId: string, displayName?: string) => void;
  replyingTo: string | null;
  onSubmitReply: (e: React.FormEvent, commentId: string, user: { id?: string; address?: string; image?: string }) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  user: { id?: string; address?: string; image?: string } | null;
}

export interface CommentSectionProps {
  comments: Comment[];
  onSubmitComment: (comment: string) => void;
  showAllComments?: boolean;
  postId?: string; 
  targetCommentId?: string | null;
}

export interface CommentSkeletonListProps {
  count?: number;
}

export const MAX_COMMENT_LENGTH = 200; 