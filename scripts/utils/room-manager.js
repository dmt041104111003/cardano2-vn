class RoomManager {
  constructor(server) {
    this.server = server;
  }

  joinPostRoom(clientId, postId) {
    if (!this.server.postRooms.has(postId)) {
      this.server.postRooms.set(postId, new Set());
    }
    this.server.postRooms.get(postId).add(clientId);
    
    const client = this.server.clients.get(clientId);
    if (client) {
      client.postId = postId;
    }
    
  }

  leavePostRoom(clientId, postId) {
    const room = this.server.postRooms.get(postId);
    if (room) {
      room.delete(clientId);
      if (room.size === 0) {
        this.server.postRooms.delete(postId);
      }
    }
  }

  broadcastToPostRoom(postId, message, excludeClientId) {
    let room = this.server.postRooms.get(postId);
    if (!room) {
      this.server.postRooms.set(postId, new Set());
      room = this.server.postRooms.get(postId);
    }

    
    room.forEach(clientId => {
      if (clientId === excludeClientId) {
        return;
      }
      
      const client = this.server.clients.get(clientId);
      if (client && client.ws.readyState === 1) { 
        this.server.sendMessage(client.ws, message);
      } else {
      }
    });
  }

  generateClientId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  getStats() {
    return {
      totalClients: this.server.clients.size,
      activeRooms: this.server.postRooms.size,
      pendingReplies: this.server.pendingReplies.size,
      rooms: Array.from(this.server.postRooms.entries()).map(([postId, clients]) => ({
        postId,
        clientCount: clients.size,
      })),
    };
  }
}

module.exports = RoomManager;
