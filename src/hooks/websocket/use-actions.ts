import { useCallback } from 'react';

interface UseActionsProps {
  postId: string;
  userId?: string;
  onError?: (error: string) => void;
  sendMessage: (message: any) => boolean;
}

export function useActions({ postId, userId, onError, sendMessage }: UseActionsProps) {
  const sendComment = useCallback((content: string) => {
    const message = {
      type: 'comment',
      postId,
      userId,
      content,
      timestamp: new Date().toISOString(),
    };

    return sendMessage(message);
  }, [postId, userId, sendMessage]);

  const sendReply = useCallback((content: string, parentCommentId: string) => {
    const message = {
      type: 'reply',
      postId,
      userId,
      content,
      parentCommentId,
      timestamp: new Date().toISOString(),
    };

    return sendMessage(message);
  }, [postId, userId, sendMessage]);

  const deleteComment = useCallback((commentId: string) => {
    const message = {
      type: 'delete',
      postId,
      userId,
      commentId,
      timestamp: new Date().toISOString(),
    };

    return sendMessage(message);
  }, [postId, userId, sendMessage]);

  const updateComment = useCallback((commentId: string, content: string) => {
    const message = {
      type: 'update',
      postId,
      userId,
      commentId,
      content,
      timestamp: new Date().toISOString(),
    };

    return sendMessage(message);
  }, [postId, userId, sendMessage]);

  return {
    sendComment,
    sendReply,
    deleteComment,
    updateComment,
  };
}
