# WebSocket Real-time Comment System - Cardano2vn
---
## Documentation Navigation

<div align="center">
  <a href="#overview" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/Overview-Main_README-blue?style=for-the-badge" alt="Overview" />
  </a>
  <a href="scripts/WEBSOCKET_README.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/WebSocket-Real--time_System-orange?style=for-the-badge" alt="WebSocket Guide" />
  </a>
  <a href="tools/MARKDOWN_GUIDE_EN.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/Markdown_Guide-English_Guide-green?style=for-the-badge" alt="Markdown Guide" />
  </a>
  <a href="BULLY_ALGORITHM_IMPLEMENTATION.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/Bully_Algorithm-Distributed_System-red?style=for-the-badge" alt="Bully Algorithm" />
  </a>
  <a href="tools/README.md" style="text-decoration: none;">
    <img src="https://img.shields.io/badge/Docs_Tools-Automation-purple?style=for-the-badge" alt="Docs Tools" />
  </a>
</div>

---
## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ - Scripts       │    │ - Node.js        │    │ - Express       │
│                 │    │                  │    │                 │
│ - API Routes    │    │ - WebSocket      │    │ - Comments      │
│ - Static Files  │    │ - Real-time      │    │ - Replies       │
│ - React App     │    │ - Broadcasting   │    │ - Notifications │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Deployment Flow

```
Client (Browser)
    ↓ WebSocket connection
Render Proxy (Port 443/80)
    ↓ Forward to Node.js
Node.js Process (Port 10000)
    ↓ WebSocket server
scripts/websocket-server.js
```

## Server Structure

```javascript
class CommentWebSocketServer {
  constructor(port = 3001) {
    this.wss = new WebSocketServer({ port }); // WebSocket server
    this.clients = new Map();                 // Manage clients
    this.postRooms = new Map();               // Manage rooms by postId
    this.userRooms = new Map();               // Manage user-specific rooms
    this.tempIdMapping = new Map();           // Map temp ID → real ID
    this.pendingReplies = new Map();          // Queue replies waiting for parent
  }
}
```

## Real-time Processing Flow

### 1. Comment Flow
```
User Types Comment → Client Sends → Server Receives → Broadcast Temp → Save DB → Broadcast Real
     ↓              ↓              ↓              ↓              ↓              ↓
   UI Update    WebSocket     Parse Message   All Clients   Database     Replace Temp
```

### 2. Reply Flow
```
User Replies → Check Parent → If Temp → Queue Reply → Parent Saved → Process Queue
     ↓            ↓            ↓           ↓            ↓              ↓
   Send Reply   Parent ID   Temp ID?   Add to Queue   Real ID       Broadcast
```

### 3. Notification Flow
```
Comment/Reply → Server Detects → Create Notification → Save DB → Broadcast to User
     ↓              ↓              ↓              ↓              ↓
   User Action   @mention/Reply   Notification   Database     Real-time Update
```

### 4. Optimistic Updates
```
Temp Comment (immediate) → Database Save → Real Comment (update)
     ↓                        ↓                ↓
   UI Shows Instantly    Background Process   Replace Temp
```

## Implementation Details

### 1. Client Sends Comment
```javascript
// 1. Client sends message
ws.send(JSON.stringify({
  type: 'comment',
  postId: 'post-123',
  userId: 'user-456', 
  content: 'Hello world'
}));
```

### 2. Server Immediate Processing
```javascript
// 2. Server processes immediately
const tempCommentId = `temp_${Date.now()}_${Math.random()}`;
// Broadcast temp comment to all clients
this.broadcastToPostRoom(postId, {
  type: 'new_comment',
  comment: { id: tempCommentId, isTemp: true, ... }
});
```

### 3. Background Database Save
```javascript
// 3. Save to database (background)
prisma.comment.create({...}).then(savedComment => {
  // Map temp ID → real ID
  this.tempIdMapping.set(tempCommentId, savedComment.id);
  
  // Broadcast real comment to replace temp
  this.broadcastToPostRoom(postId, {
    type: 'comment_updated',
    comment: { id: savedComment.id, isTemp: false, ... }
  });
});
```

### 4. Notification Processing
```javascript
// 1. Server detects @mention or reply
if (content.includes('@')) {
  const mentionedUsers = extractMentions(content);
  mentionedUsers.forEach(userId => {
    this.createNotification({
      type: 'mention',
      userId: userId,
      title: 'You were mentioned',
      message: `${author} mentioned you in a comment`,
      data: { postId, commentId: savedComment.id }
    });
  });
}

// 2. Create and broadcast notification
async createNotification(notificationData) {
  const notification = await prisma.notification.create({
    data: notificationData
  });
  
  // Broadcast to specific user
  this.broadcastToUserRoom(notificationData.userId, {
    type: 'new_notification',
    notification: notification
  });
}
```

### 5. Nested Reply Handling
```javascript
// 1. Client sends reply with parentCommentId (could be temp ID)
ws.send(JSON.stringify({
  type: 'reply',
  parentCommentId: 'temp_123456_abc', // Temp ID of parent
  content: 'Reply to comment'
}));

// 2. Server checks parent ID
if (message.parentCommentId.startsWith('temp_')) {
  const realId = this.tempIdMapping.get(message.parentCommentId);
  if (realId) {
    // Parent has real ID → process immediately
    realParentCommentId = realId;
  } else {
    // Parent doesn't have real ID → queue reply
    this.pendingReplies.get(message.parentCommentId).push({
      clientId, message, timestamp: Date.now()
    });
    return; // Wait for parent to be saved
  }
}

// 3. Create temp reply and broadcast immediately
const tempReplyId = `temp_${Date.now()}_${Math.random()}`;
this.broadcastToPostRoom(postId, {
  type: 'new_reply',
  reply: { id: tempReplyId, isTemp: true, ... }
});

// 4. Save to database with real parent ID
prisma.comment.create({
  data: {
    parentCommentId: realParentCommentId, // Real ID from mapping
    content: message.content
  }
});
```

### 6. Process Pending Replies
```javascript
// When parent comment is saved
this.processPendingReplies(savedComment.id);

processPendingReplies(realParentId) {
  const pendingReplies = this.pendingReplies.get(realParentId);
  if (pendingReplies) {
    // Process all waiting replies
    pendingReplies.forEach(pendingReply => {
      pendingReply.message.parentCommentId = realParentId;
      this.handleNewReply(pendingReply.clientId, pendingReply.message);
    });
  }
}
```

## Key Features

### Optimistic Updates
- Server broadcasts immediately with temp data
- Client displays immediately without waiting for database
- Background save to database
- Update real data when save completes

### Real-time Notifications
- @mention detection and notification creation
- Reply notification to parent comment author
- User-specific WebSocket rooms for notifications
- Auto-delete read notifications from database

### Temp ID Mapping
```javascript
// When comment is saved
this.tempIdMapping.set('temp_123456_abc', 'real-uuid-123');

// When reply uses temp parent ID
const realId = this.tempIdMapping.get('temp_123456_abc');
// → 'real-uuid-123'
```

### Pending Replies Queue
```javascript
// Queue replies waiting for parent
this.pendingReplies.set('temp_parent_id', [
  { clientId: 'client1', message: {...} },
  { clientId: 'client2', message: {...} }
]);

// When parent ready → process all
```

### User Notification Rooms
```javascript
// Join user to their notification room
this.joinUserRoom(userId, clientId);

// Broadcast notification to specific user
this.broadcastToUserRoom(userId, {
  type: 'new_notification',
  notification: notificationData
});
```

## Benefits

- **Immediate Real-time**: No database waiting
- **Nested Reply Handling**: Parent-child relationship
- **Real-time Notifications**: @mention and reply alerts
- **Safe Fallback**: Queue when parent not ready
- **Optimistic UI**: User sees results immediately
- **Data Consistency**: Ensures foreign key constraints
- **User-specific Channels**: Targeted notification delivery
