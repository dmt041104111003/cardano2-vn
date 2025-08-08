
const { WebSocketServer } = require('ws');
const CommentHandler = require('./handlers/comment-handler');
const ReplyHandler = require('./handlers/reply-handler');
const NotificationHandler = require('./handlers/notification-handler');
const RoomManager = require('./utils/room-manager');

class CommentWebSocketServer {
  constructor(port = 4001) {
    this.wss = new WebSocketServer({ port });
    this.clients = new Map();
    this.postRooms = new Map();
    this.userRooms = new Map();
    this.tempIdMapping = new Map();
    this.pendingReplies = new Map();
    this.commentHandler = new CommentHandler(this);
    this.replyHandler = new ReplyHandler(this);
    this.notificationHandler = new NotificationHandler(this);
    this.roomManager = new RoomManager(this);
    
    this.setupWebSocketServer();
  }

  setupWebSocketServer() {
    this.wss.on('connection', (ws, request) => {
      console.log('New WebSocket connection');
      
      const url = new URL(request.url || '', `http://${request.headers.host}`);
      const postId = url.searchParams.get('postId');
      const userId = url.searchParams.get('userId');
      
      if (!postId) {
        console.log('Connection rejected: missing postId');
        ws.close(1008, 'Missing postId parameter');
        return;
      }
      
      const clientId = this.roomManager.generateClientId();
      this.clients.set(clientId, { ws, postId, userId });

      this.roomManager.joinPostRoom(clientId, postId);
      
      if (userId) {
        this.joinUserRoom(clientId, userId);
      }

      ws.on('message', (data) => {
        try {
          console.log('WebSocket server received message:', data.toString());
          const message = JSON.parse(data.toString());
          this.handleMessage(clientId, message);
        } catch (error) {
          console.error('Error parsing message:', error);
          this.sendError(ws, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        this.handleClientDisconnect(clientId);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.handleClientDisconnect(clientId);
      });

      this.sendMessage(ws, {
        type: 'connected',
        message: 'Connected to comment WebSocket server',
        clientId
      });

      const pingInterval = setInterval(() => {
        if (ws.readyState === 1) {
          ws.ping();
        } else {
          clearInterval(pingInterval);
        }
      }, 30000);

      ws.on('pong', () => {
      });
    });
  }

  async handleMessage(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'ping':
        this.sendMessage(client.ws, {
          type: 'pong',
          timestamp: new Date().toISOString(),
        });
        break;
      case 'comment':
        await this.commentHandler.handleNewComment(clientId, message);
        break;
      case 'reply':
        await this.replyHandler.handleNewReply(clientId, message);
        break;
      case 'delete':
        await this.commentHandler.handleDeleteComment(clientId, message);
        break;
      case 'update':
        await this.commentHandler.handleUpdateComment(clientId, message);
        break;
      case 'get_notifications':
        await this.notificationHandler.handleGetNotifications(clientId, message);
        break;
      case 'mark_notification_read':
        await this.notificationHandler.handleMarkAsRead(clientId, message);
        break;
      default:
        this.sendError(client.ws, 'Unknown message type');
    }
  }

  joinUserRoom(clientId, userId) {
    if (!this.userRooms.has(userId)) {
      this.userRooms.set(userId, new Set());
    }
    this.userRooms.get(userId).add(clientId);
    console.log(`Client ${clientId} joined user room ${userId}`);
  }

  leaveUserRoom(clientId, userId) {
    const userRoom = this.userRooms.get(userId);
    if (userRoom) {
      userRoom.delete(clientId);
      if (userRoom.size === 0) {
        this.userRooms.delete(userId);
      }
      console.log(`Client ${clientId} left user room ${userId}`);
    }
  }

  broadcastToUser(userId, message) {
    const userRoom = this.userRooms.get(userId);
    if (userRoom) {
      userRoom.forEach(clientId => {
        const client = this.clients.get(clientId);
        if (client && client.ws.readyState === 1) {
          this.sendMessage(client.ws, message);
        }
      });
    }
  }

  sendMessage(ws, message) {
    if (ws.readyState === 1) { 
      ws.send(JSON.stringify(message));
    }
  }

  sendError(ws, error) {
    this.sendMessage(ws, {
      type: 'error',
      message: error,
      timestamp: new Date().toISOString(),
    });
  }

  handleClientDisconnect(clientId) {
    const client = this.clients.get(clientId);
    if (client) {
      if (client.postId) {
        this.roomManager.leavePostRoom(clientId, client.postId);
      }
      if (client.userId) {
        this.leaveUserRoom(clientId, client.userId);
      }
    }
    this.clients.delete(clientId);
    console.log(`Client ${clientId} disconnected`);
  }

  broadcastToPostRoom(postId, message, excludeClientId) {
    this.roomManager.broadcastToPostRoom(postId, message, excludeClientId);
  }

  processPendingReplies(realParentId) {
    this.replyHandler.processPendingReplies(realParentId);
  }

  getStats() {
    return this.roomManager.getStats();
  }
}

console.log('Starting WebSocket server for realtime comments...');

try {
  const port = process.env.WEBSOCKET_PORT;
  const wsServer = new CommentWebSocketServer(port);
  
//   console.log(`WebSocket server started successfully on port ${port}`);
//   console.log('Server stats:', wsServer.getStats());
  
  process.on('SIGINT', () => {
    console.log('\nShutting down WebSocket server...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\nShutting down WebSocket server...');
    process.exit(0);
  });
  
} catch (error) {
  console.error('Failed to start WebSocket server:', error);
  process.exit(1);
}