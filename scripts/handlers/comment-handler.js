const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CommentHandler {
  constructor(server) {
    this.server = server;
  }

  async handleNewComment(clientId, message) {
    try {
      if (!message.content || !message.postId || !message.userId) {
        this.server.sendError(this.server.clients.get(clientId).ws, 'Missing required fields');
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

      const tempCommentId = `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const commentData = {
        id: tempCommentId,
        content: message.content,
        userId: message.userId,
        postId: message.postId,
        parentCommentId: null,
        createdAt: new Date().toISOString(),
        user: user ? {
          wallet: user.wallet,
          image: user.image,
          name: user.name,
          id: user.id,
          displayName: user.name || user.id || 'Anonymous',
        } : null,
        isTemp: true,
      };

      this.server.broadcastToPostRoom(message.postId, {
        type: 'new_comment',
        comment: commentData,
        timestamp: new Date().toISOString(),
      }); 

      prisma.comment.create({
        data: {
          postId: message.postId,
          userId: message.userId,
          content: message.content,
          isApproved: true,
        },
        include: {
          user: true,
        },
      }).then(async (savedComment) => {
        try {
          const mentionRegex = /@([a-zA-Z0-9_]+)/g;
          const mentions = message.content.match(mentionRegex);
          
          if (mentions) {
            for (const mention of mentions) {
              const username = mention.slice(1);
              
              const mentionedUser = await prisma.user.findFirst({
                where: {
                  OR: [
                    { wallet: { contains: username, mode: 'insensitive' } },
                    { name: { contains: username, mode: 'insensitive' } },
                  ],
                },
              });
              
              if (mentionedUser && mentionedUser.id !== message.userId) {
                const post = await prisma.post.findUnique({
                  where: { id: message.postId },
                  select: { slug: true },
                });
                
                await this.createNotification({
                  userId: mentionedUser.id,
                  type: 'mention',
                  title: 'You were mentioned',
                  message: `${user?.name || 'Someone'} mentioned you in a comment`,
                  data: {
                    postId: message.postId,
                    postSlug: post?.slug,
                    commentId: savedComment.id,
                    mentionedBy: message.userId,
                  },
                });
              }
            }
          }

          if (message.parentCommentId && savedComment.parent) {
            const parentUserId = savedComment.parent.userId;
            
            if (parentUserId && parentUserId !== message.userId) {
              const post = await prisma.post.findUnique({
                where: { id: message.postId },
                select: { slug: true },
              });
              
              await this.createNotification({
                userId: parentUserId,
                type: 'reply',
                title: 'New reply',
                message: `${user?.name || 'Someone'} replied to your comment`,
                data: {
                  postId: message.postId,
                  postSlug: post?.slug,
                  commentId: savedComment.id,
                  repliedBy: message.userId,
                },
              });
            }
          }
        } catch (error) {
        }

        const realCommentData = {
          id: savedComment.id,
          content: savedComment.content,
          userId: savedComment.userId,
          postId: savedComment.postId,
          parentCommentId: savedComment.parentCommentId,
          createdAt: savedComment.createdAt.toISOString(),
          user: savedComment.user ? {
            wallet: savedComment.user.wallet,
            image: savedComment.user.image,
            name: savedComment.user.name,
            id: savedComment.user.id,
            displayName: savedComment.user.name || savedComment.user.id || 'Anonymous',
          } : null,
          isTemp: false,
        };

        this.server.tempIdMapping.set(tempCommentId, savedComment.id);
        
        this.server.broadcastToPostRoom(message.postId, {
          type: 'comment_updated',
          comment: realCommentData,
          tempId: tempCommentId,
          timestamp: new Date().toISOString(),
        });
        
        this.server.processPendingReplies(savedComment.id);
      }).catch((error) => {
        this.server.sendMessage(this.server.clients.get(clientId).ws, {
          type: 'comment_error',
          message: 'Failed to save comment',
          tempId: tempCommentId,
          timestamp: new Date().toISOString(),
        });
      });

    } catch (error) {
      this.server.sendError(this.server.clients.get(clientId).ws, 'Failed to process comment');
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

  async handleDeleteComment(clientId, message) {
    try {
      if (!message.commentId || !message.postId || !message.userId) {
        this.server.sendError(this.server.clients.get(clientId).ws, 'Missing comment ID, post ID, or user ID');
        return;
      }

      let realCommentId = message.commentId;
      if (message.commentId.startsWith('temp_')) {
        const realId = this.server.tempIdMapping.get(message.commentId);
        if (!realId) {
          this.server.sendError(this.server.clients.get(clientId).ws, 'Temporary comment not found in mapping');
          return;
        }
        realCommentId = realId;
      }

      const comment = await prisma.comment.findUnique({
        where: { id: realCommentId },
        include: { user: true }
      });

      if (!comment) {
        this.server.sendError(this.server.clients.get(clientId).ws, 'Comment not found');
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: message.userId },
        select: { role: true }
      });

      if (!user) {
        this.server.sendError(this.server.clients.get(clientId).ws, 'User not found');
        return;
      }

      const canDelete = user.role === 'ADMIN' || comment.userId === message.userId;
      if (!canDelete) {
        this.server.sendError(this.server.clients.get(clientId).ws, 'Permission denied: only admin or comment owner can delete');
        return;
      }

      await prisma.comment.delete({
        where: { id: realCommentId },
      });

      this.server.broadcastToPostRoom(message.postId, {
        type: 'comment_deleted',
        commentId: message.commentId,
        timestamp: new Date().toISOString(),
      });

      this.server.sendMessage(this.server.clients.get(clientId).ws, {
        type: 'comment_deleted_sent',
        commentId: message.commentId,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      this.server.sendError(this.server.clients.get(clientId).ws, 'Failed to delete comment');
    }
  }

  async handleUpdateComment(clientId, message) {
    try {
      if (!message.commentId || !message.content || !message.postId || !message.userId) {
        this.server.sendError(this.server.clients.get(clientId).ws, 'Missing required fields for update');
        return;
      }

      let realCommentId = message.commentId;
      if (message.commentId.startsWith('temp_')) {
        const realId = this.server.tempIdMapping.get(message.commentId);
        if (!realId) {
          this.server.sendError(this.server.clients.get(clientId).ws, 'Temporary comment not found in mapping');
          return;
        }
        realCommentId = realId;
      }

      const comment = await prisma.comment.findUnique({
        where: { id: realCommentId },
        include: { user: true }
      });

      if (!comment) {
        this.server.sendError(this.server.clients.get(clientId).ws, 'Comment not found');
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: message.userId },
        select: { role: true }
      });

      if (!user) {
        this.server.sendError(this.server.clients.get(clientId).ws, 'User not found');
        return;
      }

      const canEdit = user.role === 'ADMIN' || comment.userId === message.userId;
      if (!canEdit) {
        this.server.sendError(this.server.clients.get(clientId).ws, 'Permission denied: only admin or comment owner can edit');
        return;
      }

      const updatedComment = await prisma.comment.update({
        where: { id: realCommentId },
        data: { content: message.content },
        include: {
          user: true,
        },
      });

      const commentData = {
        id: updatedComment.id,
        content: updatedComment.content,
        userId: updatedComment.userId,
        postId: updatedComment.postId,
        parentCommentId: updatedComment.parentCommentId,
        createdAt: updatedComment.createdAt.toISOString(),
        user: updatedComment.user ? {
          wallet: updatedComment.user.wallet,
          image: updatedComment.user.image,
          name: updatedComment.user.name,
          id: updatedComment.user.id,
          displayName: updatedComment.user.name || updatedComment.user.id || 'Anonymous',
        } : null,
        isTemp: false,
      };

      this.server.broadcastToPostRoom(message.postId, {
        type: 'comment_updated',
        comment: commentData,
        tempId: message.commentId.startsWith('temp_') ? message.commentId : null,
        timestamp: new Date().toISOString(),
      });

      this.server.sendMessage(this.server.clients.get(clientId).ws, {
        type: 'comment_updated_sent',
        comment: commentData,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      this.server.sendError(this.server.clients.get(clientId).ws, 'Failed to update comment');
    }
  }
}

module.exports = CommentHandler;