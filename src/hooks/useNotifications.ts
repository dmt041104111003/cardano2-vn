import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from './useUser';
import { useNotificationWebSocket } from './useNotificationWebSocket';
import { useNotificationSound } from './useNotificationSound';
import { Notification } from '~/constants/notifications';

export function useNotifications() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { playNotificationSound } = useNotificationSound();
  const originalTitleRef = useRef<string>('');

  useEffect(() => {
    originalTitleRef.current = document.title;
  }, []);

  const updateBrowserTitle = useCallback((unreadCount: number) => {
    const originalTitle = originalTitleRef.current || 'Cardano2 VN';
    
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) ${originalTitle}`;
    } else {
      document.title = originalTitle;
    }
  }, []);

  const handleNewNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    playNotificationSound();
  }, [playNotificationSound]);

  const handleNotificationDeleted = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const handleNotificationsList = useCallback((notificationsList: Notification[]) => {
    setNotifications(notificationsList);
    setIsLoading(false);
  }, []);

  const handleError = useCallback((error: string) => {
    setIsLoading(false);
  }, []);

  const { isConnected, isConnecting, sendMessage } = useNotificationWebSocket({
    userId: user?.id,
    onNewNotification: handleNewNotification,
    onNotificationDeleted: handleNotificationDeleted,
    onNotificationsList: handleNotificationsList,
    onError: handleError,
  });

  useEffect(() => {
    if (user?.id && isConnected) {
      setIsLoading(true);
      sendMessage({
        type: 'get_notifications',
        userId: user.id,
      });
    }
  }, [user?.id, isConnected, sendMessage]);



  const markAsRead = useCallback(async (notificationId: string) => {
    if (user?.id) {
      sendMessage({
        type: 'mark_notification_read',
        notificationId,
        userId: user.id,
      });
    }
  }, [user?.id, sendMessage]);

  const markAllAsRead = useCallback(async () => {
    if (user?.id) {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }
    }
  }, [user?.id, notifications, markAsRead]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    updateBrowserTitle(unreadCount);
  }, [unreadCount, updateBrowserTitle]);

  return {
    notifications,
    unreadCount,
    isLoading: isLoading || isConnecting,
    isConnected,
    markAsRead,
    markAllAsRead,
  };
}

export function useUnreadNotifications() {
  return useNotifications();
}
