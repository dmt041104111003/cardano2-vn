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
          console.log(`Mapped temp parent ID ${message.parentCommentId} to real ID ${realId}`);
        } else {
          console.log(`Temp parent ID ${message.parentCommentId} not found in mapping, will queue reply for later`);
          // Queue this reply for later processing
          if (!this.server.pendingReplies.has(message.parentCommentId)) {
            this.server.pendingReplies.set(message.parentCommentId, []);
          }
          this.server.pendingReplies.get(message.parentCommentId).push({
            clientId,
            message,
            timestamp: Date.now()
          });
          
          // Send message to client that reply is queued
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
        console.log('Parent comment is temp, will use temp data for immediate broadcast');
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
        } : null,
        parentComment: parentComment ? {
          id: parentComment.id,
          userId: parentComment.userId,
          user: parentComment.user ? {
            wallet: parentComment.user.wallet,
            image: parentComment.user.image,
            name: parentComment.user.name,
          } : null,
        } : null,
        isTemp: true,
      };

      console.log(`Broadcasting new reply immediately to post room ${message.postId}`);
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
              select: { slug: true },
            });
            
            await this.createNotification({
              userId: savedReply.parent.userId,
              type: 'reply',
              title: 'New reply',
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
          console.error('Error creating reply notification:', error);
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
          } : null,
          parentComment: savedReply.parent ? {
            id: savedReply.parent.id,
            userId: savedReply.parent.userId,
            user: savedReply.parent.user ? {
              wallet: savedReply.parent.user.wallet,
              image: savedReply.parent.user.image,
              name: savedReply.parent.user.name,
            } : null,
          } : null,
          isTemp: false,
        };

        // Store temp ID mapping for future replies to this reply
        this.server.tempIdMapping.set(tempReplyId, savedReply.id);
        
        this.server.broadcastToPostRoom(message.postId, {
          type: 'reply_updated',
          reply: realReplyData,
          tempId: tempReplyId,
          timestamp: new Date().toISOString(),
        });
        
        // Check if there are any pending replies waiting for this reply
        this.server.processPendingReplies(savedReply.id);
      }).catch((error) => {
        console.error('Error saving reply to database:', error);
        this.server.sendMessage(this.server.clients.get(clientId).ws, {
          type: 'reply_error',
          message: 'Failed to save reply',
          tempId: tempReplyId,
          timestamp: new Date().toISOString(),
        });
      });

    } catch (error) {
      console.error('Error handling new reply:', error);
      this.server.sendError(this.server.clients.get(clientId).ws, 'Failed to process reply');
    }
  }

  async createNotification(notificationData) {
    try {
      console.log('Creating notification:', notificationData);
      
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
      console.error('Error creating notification:', error);
    }
  }

  processPendingReplies(realParentId) {
    const pendingReplies = this.server.pendingReplies.get(realParentId);
    if (pendingReplies && pendingReplies.length > 0) {
      console.log(`Processing ${pendingReplies.length} pending replies for parent ${realParentId}`);
      
      pendingReplies.forEach(async (pendingReply) => {
        try {
          pendingReply.message.parentCommentId = realParentId;
          
          await this.handleNewReply(pendingReply.clientId, pendingReply.message);
        } catch (error) {
          console.error('Error processing pending reply:', error);
        }
      });
      
      this.server.pendingReplies.delete(realParentId);
    }
  }
}

module.exports = ReplyHandler;
