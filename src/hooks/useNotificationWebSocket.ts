import { useEffect, useState, useCallback } from 'react';

interface Notification {
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

interface UseNotificationWebSocketProps {
  userId?: string;
  onNewNotification?: (notification: Notification) => void;
  onNotificationDeleted?: (notificationId: string) => void;
  onNotificationsList?: (notifications: Notification[]) => void;
  onError?: (error: string) => void;
}

export function useNotificationWebSocket({
  userId,
  onNewNotification,
  onNotificationDeleted,
  onNotificationsList,
  onError,
}: UseNotificationWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [wsRef, setWsRef] = useState<WebSocket | null>(null);
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);      
      switch (message.type) {
        case 'new_notification':
          onNewNotification?.(message.notification);
          break;
        case 'notification_deleted':
          onNotificationDeleted?.(message.notificationId);
          break;
        case 'notifications_list':
          onNotificationsList?.(message.notifications);
          break;
        case 'notification_error':
          onError?.(message.message);
          break;
        case 'connected':
          break;
        default:
      }
    } catch (error) {
    }
  }, [onNewNotification, onNotificationDeleted, onNotificationsList, onError]);

  const connect = useCallback(() => {
    if (!userId) return;

    try {
      const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:4001';
      const ws = new WebSocket(`${wsUrl}?postId=notifications&userId=${userId}`);
      
      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
      };

      ws.onmessage = handleMessage;

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };

      ws.onerror = (error) => {
        setIsConnecting(false);
        onError?.('WebSocket connection failed');
      };

      setWsRef(ws);
      setIsConnecting(true);
    } catch (error) {
      onError?.('Failed to create WebSocket connection');
    }
  }, [userId, handleMessage, onError]);

  const disconnect = useCallback(() => {
    if (wsRef) {
      wsRef.close();
      setWsRef(null);
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, [wsRef]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef && wsRef.readyState === WebSocket.OPEN) {
      wsRef.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, [wsRef]);

  useEffect(() => {
    if (userId && !isConnected && !isConnecting) {
      const timeout = setTimeout(connect, 1000);
      return () => clearTimeout(timeout);
    }
  }, [userId, isConnected, isConnecting, connect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  useEffect(() => {
    if (userId) {
      disconnect();
      connect();
    }
  }, [userId]);

  return {
    isConnected,
    isConnecting,
    sendMessage,
    connect,
    disconnect,
  };
}
