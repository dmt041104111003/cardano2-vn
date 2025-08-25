
const { WebSocketServer } = require('ws');
const CommentHandler = require('./handlers/comment-handler');
const ReplyHandler = require('./handlers/reply-handler');
const NotificationHandler = require('./handlers/notification-handler');
const RoomManager = require('./utils/room-manager');

class CommentWebSocketServer {
  constructor(port = 4001) {
    const http = require('http');
    this.httpServer = http.createServer((req, res) => {
      this.handleHttpRequest(req, res);
    });

    this.wss = new WebSocketServer({ server: this.httpServer });
    
    this.clients = new Map();
    this.postRooms = new Map();
    this.userRooms = new Map();
    this.tempIdMapping = new Map();
    this.pendingReplies = new Map();
    this.onlineUsers = new Map(); 
    this.anonymousUsers = new Map(); 
    
    this.commentHandler = new CommentHandler(this);
    this.replyHandler = new ReplyHandler(this);
    this.notificationHandler = new NotificationHandler(this);
    this.roomManager = new RoomManager(this);
    
    this.setupWebSocketServer();
    this.startServer(port);
    
    // Cleanup offline users every 5 minutes
    setInterval(() => {
      this.cleanupOfflineUsers();
    }, 5 * 60 * 1000);
  }

  handleHttpRequest(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.url === '/health' || req.url === '/api/health') {
      try {
        const healthData = {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          websocket: {
            clients: this.clients.size,
            postRooms: this.postRooms.size,
            userRooms: this.userRooms.size
          },
          onlineUsers: {
            authenticated: this.onlineUsers.size,
            anonymous: this.anonymousUsers.size,
            total: this.onlineUsers.size + this.anonymousUsers.size
          },
          environment: process.env.NODE_ENV || 'development',
          externalUrl: process.env.RENDER_EXTERNAL_URL || 'localhost'
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(healthData, null, 2));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'error', 
          message: 'Health check failed',
          timestamp: new Date().toISOString()
        }));
      }
    } else if (req.url === '/api/online-users') {
      try {
        const onlineData = {
          authenticated: Array.from(this.onlineUsers.entries()).map(([userId, data]) => ({
            userId,
            lastSeen: data.lastSeen,
            userAgent: data.userAgent,
            ip: data.ip
          })),
          anonymous: Array.from(this.anonymousUsers.entries()).map(([sessionId, data]) => ({
            sessionId,
            lastSeen: data.lastSeen,
            userAgent: data.userAgent,
            ip: data.ip
          })),
          stats: {
            total: this.onlineUsers.size + this.anonymousUsers.size,
            authenticated: this.onlineUsers.size,
            anonymous: this.anonymousUsers.size
          }
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(onlineData, null, 2));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'error', 
          message: 'Failed to get online users',
          timestamp: new Date().toISOString()
        }));
      }
    } else if (req.url === '/ping') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('pong');
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'not_found', 
        message: 'Endpoint not found',
        available: ['/health', '/api/health', '/api/online-users', '/ping']
      }));
    }
  }

  startServer(port) {
    this.httpServer.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Health check URLs:`);
      console.log(`   - http://localhost:${port}/health`);
      console.log(`   - http://localhost:${port}/api/health`);
      console.log(`   - http://localhost:${port}/api/online-users`);
      console.log(`   - http://localhost:${port}/ping`);
      
      if (process.env.RENDER_EXTERNAL_URL) {
        console.log(`Production URLs:`);
        console.log(`   - ${process.env.RENDER_EXTERNAL_URL}/health`);
        console.log(`   - ${process.env.RENDER_EXTERNAL_URL}/api/health`);
        console.log(`   - ${process.env.RENDER_EXTERNAL_URL}/api/online-users`);
        console.log(`   - ${process.env.RENDER_EXTERNAL_URL}/ping`);
      }
    });

    this.httpServer.on('error', (error) => {
      console.error('Server error:', error);
    });
  }

  setupWebSocketServer() {
    this.wss.on('connection', (ws, request) => {      
      const url = new URL(request.url || '', `http://${request.headers.host}`);
      const postId = url.searchParams.get('postId');
      const userId = url.searchParams.get('userId');
      const sessionId = url.searchParams.get('sessionId') || this.generateSessionId();
      
      if (!postId) {
        ws.close(1008, 'Missing postId parameter');
        return;
      }
      
      const clientId = this.roomManager.generateClientId();
      const userAgent = request.headers['user-agent'] || 'Unknown';
      const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || 'Unknown';
      
      this.clients.set(clientId, { ws, postId, userId, sessionId });
      if (userId) {
        this.onlineUsers.set(userId, {
          lastSeen: new Date(),
          userAgent,
          ip,
          clientId
        });
      } else {
        this.anonymousUsers.set(sessionId, {
          lastSeen: new Date(),
          userAgent,
          ip,
          clientId
        });
      }

      this.roomManager.joinPostRoom(clientId, postId);
      
      if (userId) {
        this.joinUserRoom(clientId, userId);
      }

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(clientId, message);
          
          if (userId) {
            const userData = this.onlineUsers.get(userId);
            if (userData) {
              userData.lastSeen = new Date();
            }
          } else {
            const sessionData = this.anonymousUsers.get(sessionId);
            if (sessionData) {
              sessionData.lastSeen = new Date();
            }
          }
        } catch (error) {
          this.sendError(ws, 'Invalid message format');
        }
      });

      ws.on('close', () => {
        this.handleClientDisconnect(clientId);
      });

      ws.on('error', (error) => {
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
        if (userId) {
          const userData = this.onlineUsers.get(userId);
          if (userData) {
            userData.lastSeen = new Date();
          }
        } else {
          const sessionData = this.anonymousUsers.get(sessionId);
          if (sessionData) {
            sessionData.lastSeen = new Date();
          }
        }
      });
    });
  }

  generateSessionId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  cleanupOfflineUsers() {
    const now = new Date();
    const timeout = 5 * 60 * 1000; 

    for (const [userId, data] of this.onlineUsers.entries()) {
      if (now - data.lastSeen > timeout) {
        this.onlineUsers.delete(userId);
      }
    }

    
    for (const [sessionId, data] of this.anonymousUsers.entries()) {
      if (now - data.lastSeen > timeout) {
        this.anonymousUsers.delete(sessionId);
      }
    }
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
  }

  leaveUserRoom(clientId, userId) {
    const userRoom = this.userRooms.get(userId);
    if (userRoom) {
      userRoom.delete(clientId);
      if (userRoom.size === 0) {
        this.userRooms.delete(userId);
      }
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
      if (client.userId) {
        this.onlineUsers.delete(client.userId);
      } else if (client.sessionId) {
        this.anonymousUsers.delete(client.sessionId);
      }

      if (client.postId) {
        this.roomManager.leavePostRoom(clientId, client.postId);
      }
      if (client.userId) {
        this.leaveUserRoom(clientId, client.userId);
      }
    }
    this.clients.delete(clientId);
  }

  broadcastToPostRoom(postId, message, excludeClientId) {
    this.roomManager.broadcastToPostRoom(postId, message, excludeClientId);
  }

  processPendingReplies(realParentId) {
    this.replyHandler.processPendingReplies(realParentId);
  }

  getStats() {
    return {
      ...this.roomManager.getStats(),
      onlineUsers: {
        authenticated: this.onlineUsers.size,
        anonymous: this.anonymousUsers.size,
        total: this.onlineUsers.size + this.anonymousUsers.size
      }
    };
  }
}

try {
  const port = process.env.WEBSOCKET_PORT;
  const wsServer = new CommentWebSocketServer(port);
  
  process.on('SIGINT', () => {
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    process.exit(0);
  });
  
} catch (error) {
  process.exit(1);
}