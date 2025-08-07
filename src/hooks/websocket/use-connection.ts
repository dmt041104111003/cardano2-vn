import { useCallback, useRef } from 'react';

interface UseConnectionProps {
  postId: string;
  userId?: string;
  onError?: (error: string) => void;
  onMessage: (message: any) => void;
}

export function useConnection({ postId, userId, onError, onMessage }: UseConnectionProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }
    
    try {
      const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL 
        ? `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}?postId=${postId}&userId=${userId || ''}`
        : `ws://localhost:4001?postId=${postId}&userId=${userId || ''}`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected to:', wsUrl);
        reconnectAttempts.current = 0;
        
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
          } else {
            clearInterval(pingInterval);
          }
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          console.log('WebSocket message received:', event.data);
          const message = JSON.parse(event.data);
          console.log('Parsed message:', message);
          onMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`);
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.('WebSocket connection error');
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      onError?.('Failed to create WebSocket connection');
    }
  }, [postId, userId, onError, onMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnecting');
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      onError?.('Not connected to WebSocket server');
      return false;
    }

    wsRef.current.send(JSON.stringify(message));
    return true;
  }, [onError]);

  return {
    connect,
    disconnect,
    sendMessage,
    wsRef,
  };
}
