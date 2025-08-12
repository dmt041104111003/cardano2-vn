import { useCallback } from 'react';
import { Comment } from '~/constants/comment';

interface WebSocketMessage {
  type: string;
  comment?: any;
  reply?: any;
  commentId?: string;
  message?: string;
  timestamp: string;
}

interface UseMessageHandlerProps {
  onNewComment?: (comment: Comment) => void;
  onNewReply?: (reply: Comment) => void;
  onCommentDeleted?: (commentId: string) => void;
  onCommentUpdated?: (comment: Comment) => void;
  onError?: (error: string) => void;
}

export function useMessageHandler({
  onNewComment,
  onNewReply,
  onCommentDeleted,
  onCommentUpdated,
  onError,
}: UseMessageHandlerProps) {
  const handleMessage = useCallback((message: WebSocketMessage) => {
    console.log('Handling message type:', message.type);
    
    switch (message.type) {
      case 'connected':
        console.log('Connected to WebSocket server:', message.message);
        break;
      case 'pong':
        console.log('Received pong from server');
        break;
        
      case 'new_comment':
        console.log('Received new_comment message:', message.comment);
        if (onNewComment && message.comment) {
          const comment: Comment = {
            id: message.comment.id,
            content: message.comment.content,
            userId: message.comment.userId,
            createdAt: message.comment.createdAt,
            user: message.comment.user,
            postId: message.comment.postId,
            parentCommentId: message.comment.parentCommentId,
            author: message.comment.user?.wallet || '',
            avatar: message.comment.user?.image || '',
            replies: [],
            isTemp: message.comment.isTemp || false,
          };
          console.log('Calling onNewComment with:', comment);
          onNewComment(comment);
        } else {
          console.log('onNewComment not provided or message.comment missing');
        }
        break;
        
      case 'new_reply':
        console.log('Received new_reply message:', message.reply);
        if (onNewReply && message.reply) {
          const reply: Comment = {
            id: message.reply.id,
            content: message.reply.content,
            userId: message.reply.userId,
            createdAt: message.reply.createdAt,
            user: message.reply.user,
            postId: message.reply.postId,
            parentCommentId: message.reply.parentCommentId,
            author: message.reply.user?.wallet || '',
            avatar: message.reply.user?.image || '',
            replies: [],
            isTemp: message.reply.isTemp || false,
            parentUserId: message.reply.parentComment?.userId,
            parentAuthor: message.reply.parentComment?.user?.name || message.reply.parentComment?.user?.wallet || 'Unknown',
          };
          console.log('Calling onNewReply with:', reply);
          onNewReply(reply);
        }
        break;
        
      case 'reply_updated':
        console.log('Received reply_updated message:', message.reply);
        if (onCommentUpdated && message.reply) {
          const reply: Comment = {
            id: message.reply.id,
            content: message.reply.content,
            userId: message.reply.userId,
            createdAt: message.reply.createdAt,
            user: message.reply.user,
            postId: message.reply.postId,
            parentCommentId: message.reply.parentCommentId,
            author: message.reply.user?.wallet || '',
            avatar: message.reply.user?.image || '',
            replies: [],
            isTemp: message.reply.isTemp || false,
          };
          console.log('Calling onCommentUpdated for reply with:', reply);
          onCommentUpdated(reply);
        }
        break;
        
             case 'comment_deleted':
         if (onCommentDeleted && message.commentId) {
           onCommentDeleted(message.commentId);
         }
         break;
         
       case 'comment_deleted_sent':
         if (onCommentDeleted && message.commentId) {
           onCommentDeleted(message.commentId);
         }
         break;
        
      case 'comment_updated':
        if (onCommentUpdated && message.comment) {
          const comment: Comment = {
            id: message.comment.id,
            content: message.comment.content,
            userId: message.comment.userId,
            createdAt: message.comment.createdAt,
            user: message.comment.user,
            postId: message.comment.postId,
            parentCommentId: message.comment.parentCommentId,
            author: message.comment.user?.wallet || '',
            avatar: message.comment.user?.image || '',
            replies: [],
            isTemp: message.comment.isTemp || false,
          };
          console.log('Calling onCommentUpdated with:', comment);
          onCommentUpdated(comment);
        }
        break;
        
      case 'comment_updated_sent':
        console.log('Received comment_updated_sent message:', message.comment);
        if (onCommentUpdated && message.comment) {
          const comment: Comment = {
            id: message.comment.id,
            content: message.comment.content,
            userId: message.comment.userId,
            createdAt: message.comment.createdAt,
            user: message.comment.user,
            postId: message.comment.postId,
            parentCommentId: message.comment.parentCommentId,
            author: message.comment.user?.wallet || '',
            avatar: message.comment.user?.image || '',
            replies: [],
            isTemp: message.comment.isTemp || false,
          };
          console.log('Calling onCommentUpdated with:', comment);
          onCommentUpdated(comment);
        }
        break;
        
      case 'error':
        console.error('WebSocket server error:', message.message);
        onError?.(message.message || 'Unknown error');
        break;
        
      default:
        console.log('Unknown WebSocket message type:', message.type);
    }
  }, [onNewComment, onNewReply, onCommentDeleted, onCommentUpdated, onError]);

  return { handleMessage };
}
