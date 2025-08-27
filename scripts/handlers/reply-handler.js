const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ReplyHandler {
  constructor(server) {
    this.server = server;
  }

  async handleNewReply(clientId, message) {
    try {
      if (!message.content || !message.postId || !message.userId || !message.parentCommentId) {
        this.server.sendError(this.server.clients.get(clientId).ws, 'Missing required fields for reply');
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

      let realParentCommentId = message.parentCommentId;
      if (message.parentCommentId.startsWith('temp_')) {
        const realId = this.server.tempIdMapping.get(message.parentCommentId);
        if (realId) {
          realParentCommentId = realId;
        } else {
          if (!this.server.pendingReplies.has(message.parentCommentId)) {
            this.server.pendingReplies.set(message.parentCommentId, []);
          }
          this.server.pendingReplies.get(message.parentCommentId).push({
            clientId,
            message,
            timestamp: Date.now()
          });
          
          this.server.sendMessage(this.server.clients.get(clientId).ws, {
            type: 'reply_queued',
            message: 'Reply will be processed when parent comment is ready',
            timestamp: new Date().toISOString(),
          });
          return;
        }
      }

      let parentComment = await prisma.comment.findUnique({
        where: { id: realParentCommentId },
        include: {
          user: true,
        },
      });

      if (!parentComment && message.parentCommentId.startsWith('temp_')) {
        parentComment = {
          id: message.parentCommentId,
          userId: message.userId, 
          user: user,
        };
      }

      const tempReplyId = `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const replyData = {
        id: tempReplyId,
        content: message.content,
        userId: message.userId,
        postId: message.postId,
        parentCommentId: message.parentCommentId,
        createdAt: new Date().toISOString(),
        user: user ? {
          wallet: user.wallet,
          image: user.image,
          name: user.name,
          id: user.id,
          displayName: user.name || user.id || 'Anonymous',
        } : null,
        parentComment: parentComment ? {
          id: parentComment.id,
          userId: parentComment.userId,
          user: parentComment.user ? {
            wallet: parentComment.user.wallet,
            image: parentComment.user.image,
            name: parentComment.user.name,
            id: parentComment.user.id,
            displayName: parentComment.user.name || parentComment.user.id || 'Anonymous',
          } : null,
        } : null,
        isTemp: true,
      };

      this.server.broadcastToPostRoom(message.postId, {
        type: 'new_reply',
        reply: replyData,
        timestamp: new Date().toISOString(),
      }); 

      prisma.comment.create({
        data: {
          postId: message.postId,
          userId: message.userId,
          content: message.content,
          parentCommentId: realParentCommentId,
          isApproved: true,
        },
        include: {
          user: true,
          parent: {
            include: {
              user: true,
            },
          },
        },
      }).then(async (savedReply) => {
        try {          
          if (savedReply.parent && savedReply.parent.userId && savedReply.parent.userId !== message.userId) {
            const post = await prisma.post.findUnique({
              where: { id: message.postId },
              select: { slug: true, title: true },
            });
            
            await this.createNotification({
              userId: savedReply.parent.userId,
              type: 'reply',
              title: post?.title || 'New reply',
              message: `${user?.name || 'Someone'} replied to your comment`,
              data: {
                postId: message.postId,
                postSlug: post?.slug,
                commentId: savedReply.id,
                repliedBy: message.userId,
              },
            });
          }
        } catch (error) {
        }

        const realReplyData = {
          id: savedReply.id,
          content: savedReply.content,
          userId: savedReply.userId,
          postId: savedReply.postId,
          parentCommentId: savedReply.parentCommentId,
          createdAt: savedReply.createdAt.toISOString(),
          user: savedReply.user ? {
            wallet: savedReply.user.wallet,
            image: savedReply.user.image,
            name: savedReply.user.name,
            id: savedReply.user.id,
            displayName: savedReply.user.name || savedReply.user.id || 'Anonymous',
          } : null,
          parentComment: savedReply.parent ? {
            id: savedReply.parent.id,
            userId: savedReply.parent.userId,
            user: savedReply.parent.user ? {
              wallet: savedReply.parent.user.wallet,
              image: savedReply.parent.user.image,
              name: savedReply.parent.user.name,
              id: savedReply.parent.user.id,
              displayName: savedReply.parent.user.name || savedReply.parent.user.id || 'Anonymous',
            } : null,
          } : null,
          isTemp: false,
        };

        this.server.tempIdMapping.set(tempReplyId, savedReply.id);
        
        this.server.broadcastToPostRoom(message.postId, {
          type: 'reply_updated',
          reply: realReplyData,
          tempId: tempReplyId,
          timestamp: new Date().toISOString(),
        });
        
        this.server.processPendingReplies(savedReply.id);
      }).catch((error) => {
        this.server.sendMessage(this.server.clients.get(clientId).ws, {
          type: 'reply_error',
          message: 'Failed to save reply',
          tempId: tempReplyId,
          timestamp: new Date().toISOString(),
        });
      });

    } catch (error) {
      this.server.sendError(this.server.clients.get(clientId).ws, 'Failed to process reply');
    }
  }

  async createNotification(notificationData) {
    try {
      
      const notification = await prisma.notification.create({
        data: {
          userId: notificationData.userId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          data: notificationData.data || {},
          isRead: false,
        },
      });
      
      
      this.server.broadcastToUser(notificationData.userId, {
        type: 'new_notification',
        notification: {
          id: notification.id,
          userId: notification.userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          isRead: notification.isRead,
          createdAt: notification.createdAt.toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
    }
  }

  processPendingReplies(parentKey) {
    let tempKey = null;
    let realParentId = parentKey;

    if (typeof parentKey === 'string' && parentKey.startsWith('temp_')) {
      tempKey = parentKey;
      const mapped = this.server.tempIdMapping.get(parentKey);
      if (mapped) realParentId = mapped;
    } else {
      for (const [tempId, realId] of this.server.tempIdMapping.entries()) {
        if (realId === parentKey) {
          tempKey = tempId;
          break;
        }
      }
    }

    const pendingByTemp = tempKey ? this.server.pendingReplies.get(tempKey) : undefined;
    const pendingByReal = this.server.pendingReplies.get(realParentId);

    const pendingReplies = [
      ...(Array.isArray(pendingByTemp) ? pendingByTemp : []),
      ...(Array.isArray(pendingByReal) ? pendingByReal : []),
    ];

    if (pendingReplies.length > 0) {

      pendingReplies.forEach(async (pendingReply) => {
        try {
          pendingReply.message.parentCommentId = realParentId;
          await this.handleNewReply(pendingReply.clientId, pendingReply.message);
        } catch (error) {
        }
      });

      if (tempKey) this.server.pendingReplies.delete(tempKey);
      this.server.pendingReplies.delete(realParentId);
    }
  }
}

module.exports = ReplyHandler;