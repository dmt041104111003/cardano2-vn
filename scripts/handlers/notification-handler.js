const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class NotificationHandler {
  constructor(server) {
    this.server = server;
  }

  async handleNewNotification(clientId, message) {
    try {
      const client = this.server.clients.get(clientId);
      if (!client) {
        console.error('Client not found:', clientId);
        return;
      }

      if (!message.userId || !message.type || !message.title || !message.message) {
        this.server.sendError(client.ws, 'Missing required fields for notification');
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: message.userId },
        select: {
          wallet: true,
          image: true,
          name: true,
        },
      });

      const tempNotificationId = `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const notificationData = {
        id: tempNotificationId,
        userId: message.userId,
        type: message.type,
        title: message.title,
        message: message.message,
        data: message.data || {},
        createdAt: new Date().toISOString(),
        user: user ? {
          wallet: user.wallet,
          image: user.image,
          name: user.name,
        } : null,
        isTemp: true,
      };

      this.server.broadcastToUser(message.userId, {
        type: 'new_notification',
        notification: notificationData,
        timestamp: new Date().toISOString(),
      }); 

      prisma.notification.create({
        data: {
          userId: message.userId,
          type: message.type,
          title: message.title,
          message: message.message,
          data: message.data || {},
          isRead: false,
        },
        include: {
          user: true,
        },
      }).then((savedNotification) => {
        const realNotificationData = {
          id: savedNotification.id,
          userId: savedNotification.userId,
          type: savedNotification.type,
          title: savedNotification.title,
          message: savedNotification.message,
          data: savedNotification.data,
          isRead: savedNotification.isRead,
          createdAt: savedNotification.createdAt.toISOString(),
          user: savedNotification.user ? {
            wallet: savedNotification.user.wallet,
            image: savedNotification.user.image,
            name: savedNotification.user.name,
          } : null,
          isTemp: false,
        };

        this.server.tempIdMapping.set(tempNotificationId, savedNotification.id);
        
        this.server.broadcastToUser(message.userId, {
          type: 'notification_updated',
          notification: realNotificationData,
          tempId: tempNotificationId,
          timestamp: new Date().toISOString(),
        });
      }).catch((error) => {
        console.error('Error saving notification to database:', error);
        const client = this.server.clients.get(clientId);
        if (client) {
          this.server.sendMessage(client.ws, {
            type: 'notification_error',
            message: 'Failed to save notification',
            tempId: tempNotificationId,
            timestamp: new Date().toISOString(),
          });
        }
      });

    } catch (error) {
      console.error('Error handling new notification:', error);
      const client = this.server.clients.get(clientId);
      if (client) {
        this.server.sendError(client.ws, 'Failed to process notification');
      }
    }
  }

  async handleMarkAsRead(clientId, message) {
    try {
      const client = this.server.clients.get(clientId);
      if (!client) {
        console.error('Client not found:', clientId);
        return;
      }

      if (!message.notificationId || !message.userId) {
        this.server.sendError(client.ws, 'Missing notification ID or user ID');
        return;
      }

      await prisma.notification.delete({
        where: { id: message.notificationId },
      });

      this.server.broadcastToUser(message.userId, {
        type: 'notification_deleted',
        notificationId: message.notificationId,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Error handling notification mark as read:', error);
      const client = this.server.clients.get(clientId);
      if (client) {
        this.server.sendError(client.ws, 'Failed to mark notification as read');
      }
    }
  }

  async handleGetNotifications(clientId, message) {
    try {
      const client = this.server.clients.get(clientId);
      if (!client) {
        console.error('Client not found:', clientId);
        return;
      }

      if (!message.userId) {
        this.server.sendError(client.ws, 'Missing user ID');
        return;
      }

      const notifications = await prisma.notification.findMany({
        where: { userId: message.userId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
        },
      });

      const notificationData = notifications.map(notification => ({
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        isRead: notification.isRead,
        createdAt: notification.createdAt.toISOString(),
        user: notification.user ? {
          wallet: notification.user.wallet,
          image: notification.user.image,
          name: notification.user.name,
        } : null,
      }));

      this.server.sendMessage(client.ws, {
        type: 'notifications_list',
        notifications: notificationData,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Error handling get notifications:', error);
      const client = this.server.clients.get(clientId);
      if (client) {
        this.server.sendError(client.ws, 'Failed to get notifications');
      }
    }
  }
}

module.exports = NotificationHandler;
