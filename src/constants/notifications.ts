export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: {
    postId?: string;
    postSlug?: string;
    commentId?: string;
    mentionedBy?: string;
    repliedBy?: string;
  };
}

export type NotificationType = 'mention' | 'reply' | 'like' | 'follow';

export const NOTIFICATION_TYPES = {
  MENTION: 'mention',
  REPLY: 'reply',
  LIKE: 'like',
  FOLLOW: 'follow',
} as const;
