import { useEffect, useState } from 'react';
import { Comment } from '~/constants/comment';
import { useConnection } from './websocket/use-connection';
import { useMessageHandler } from './websocket/use-message-handler';
import { useActions } from './websocket/use-actions';

interface UseWebSocketProps {
  postId: string;
  userId?: string;
  onNewComment?: (comment: Comment) => void;
  onNewReply?: (reply: Comment) => void;
  onCommentDeleted?: (commentId: string) => void;
  onCommentUpdated?: (comment: Comment) => void;
  onError?: (error: string) => void;
}

export function useWebSocket({
  postId,
  userId,
  onNewComment,
  onNewReply,
  onCommentDeleted,
  onCommentUpdated,
  onError,
}: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Message handler
  const { handleMessage } = useMessageHandler({
    onNewComment,
    onNewReply,
    onCommentDeleted,
    onCommentUpdated,
    onError,
  });

  // Connection management
  const { connect, disconnect, sendMessage, wsRef } = useConnection({
    postId,
    userId,
    onError,
    onMessage: handleMessage,
  });

  const { sendComment, sendReply, deleteComment, updateComment } = useActions({
    postId,
    userId,
    onError,
    sendMessage,
  });

  useEffect(() => {
    const checkConnection = () => {
      const connected = wsRef.current?.readyState === WebSocket.OPEN;
      setIsConnected(connected);
      setIsConnecting(wsRef.current?.readyState === WebSocket.CONNECTING);
    };

    const interval = setInterval(checkConnection, 1000);
    return () => clearInterval(interval);
  }, [wsRef]);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [postId, userId]);

  return {
    isConnected,
    isConnecting,
    sendComment,
    sendReply,
    deleteComment,
    updateComment,
    connect,
    disconnect,
  };
}
