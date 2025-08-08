class RoomManager {
  constructor(server) {
    this.server = server;
  }

  joinPostRoom(clientId, postId) {
    if (!this.server.postRooms.has(postId)) {
      this.server.postRooms.set(postId, new Set());
      console.log(`Created new room for postId: ${postId}`);
    }
    this.server.postRooms.get(postId).add(clientId);
    
    const client = this.server.clients.get(clientId);
    if (client) {
      client.postId = postId;
    }
    
    console.log(`Client ${clientId} joined post room ${postId}`);
    console.log(`Room ${postId} now has ${this.server.postRooms.get(postId).size} clients`);
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
    const room = this.server.postRooms.get(postId);
    if (!room) {
      console.log(`No room found for postId: ${postId}`);
      return;
    }

    console.log(`Broadcasting to ${room.size} clients in room ${postId}, excluding: ${excludeClientId}`);
    
    room.forEach(clientId => {
      if (clientId === excludeClientId) {
        console.log(`Skipping sender client: ${clientId}`);
        return;
      }
      
      const client = this.server.clients.get(clientId);
      if (client && client.ws.readyState === 1) { 
        console.log(`Sending message to client: ${clientId}`);
        this.server.sendMessage(client.ws, message);
      } else {
        console.log(`Client ${clientId} not ready or not found`);
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
