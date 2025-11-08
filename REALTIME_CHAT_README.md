# Real-Time Chat Implementation with WebSocket

## Overview

The marketplace now features **real-time messaging** using Socket.IO WebSocket technology. Users can instantly chat with service owners by clicking the "Contact Owner - Live Chat" button.

## Features

✅ **Instant Messaging** - Real-time communication with no page refresh  
✅ **Typing Indicators** - See when the other person is typing  
✅ **Chat History** - Messages are saved to MongoDB  
✅ **Unique Chat Rooms** - Each conversation is isolated by service and participants  
✅ **Auto-Reconnection** - WebSocket reconnects automatically if connection drops  
✅ **Read Receipts** - Messages marked as read when viewed  

## How It Works

### 1. WebSocket Server (server.js)

The custom Next.js server initializes Socket.IO:

```javascript
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  path: '/socket.io'
})

io.on('connection', (socket) => {
  // Handle join_room, send_message, typing, leave_room events
})
```

**Key Events:**
- `join_room` - User joins a chat room
- `send_message` - User sends a message
- `receive_message` - Broadcast message to room
- `typing` - Show typing indicator
- `user_joined` / `user_left` - Notifications

### 2. Chat Database Model (lib/marketplace/models/Chat.ts)

```typescript
{
  serviceId: String,      // Which service this chat is about
  senderId: String,       // User who sent the message
  senderName: String,     // Display name
  receiverId: String,     // User who receives the message
  message: String,        // The actual message
  roomId: String,         // Unique room ID (serviceId_userId1_userId2)
  timestamp: Date,        // When message was sent
  isRead: Boolean         // Has receiver seen it?
}
```

### 3. Room ID Generation

Each conversation has a unique room ID:

```typescript
const getRoomId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort()
  return `${serviceId}_${sortedIds[0]}_${sortedIds[1]}`
}
```

**Example:** Service `abc123` between users `user1` and `user2`  
**Room ID:** `abc123_user1_user2`

This ensures:
- Same room regardless of who initiates chat
- Isolated conversations per service
- Easy to query chat history

### 4. Real-Time Chat Component (app/marketplace/components/ChatWindow.tsx)

**Lifecycle:**

1. **Mount** - Connect to Socket.IO server
2. **Join Room** - Emit `join_room` with roomId, userId, userName
3. **Load History** - Fetch previous messages from API
4. **Send Message** - Emit `send_message` → Server broadcasts to room
5. **Receive Message** - Listen for `receive_message` event
6. **Typing** - Emit `typing` event → Others see indicator
7. **Unmount** - Emit `leave_room` and disconnect

**Key Code:**

```typescript
// Connect to Socket.IO
const socketInstance = io({
  path: '/socket.io',
  transports: ['websocket', 'polling']
})

// Send message
socket.emit('send_message', {
  roomId,
  message,
  senderId,
  senderName,
  receiverId,
  serviceId
})

// Receive messages
socket.on('receive_message', (message) => {
  setMessages(prev => [...prev, message])
})
```

### 5. Integration in Marketplace Page

**Trigger Chat:**

```typescript
// In service detail modal
<button onClick={() => {
  setChatService(selectedService)
  setSelectedService(null)
}}>
  Contact Owner - Live Chat
</button>

// Render chat window
{chatService && chatService.userId && (
  <ChatWindow
    serviceId={chatService._id}
    serviceTitle={chatService.title}
    ownerId={chatService.userId}
    ownerName={chatService.userName}
    onClose={() => setChatService(null)}
  />
)}
```

## API Endpoints

### GET /api/marketplace/chat/history

**Purpose:** Load previous messages in a chat room

**Query Params:**
- `roomId` - The unique room identifier

**Authentication:** Required (reads from cookie)

**Returns:** Array of message objects

**Example:**
```javascript
GET /api/marketplace/chat/history?roomId=serviceId_user1_user2

Response:
[
  {
    "_id": "...",
    "message": "Hello!",
    "senderId": "user1",
    "senderName": "John Doe",
    "timestamp": "2025-11-08T10:00:00Z",
    ...
  }
]
```

## Database Schema

```javascript
MarketplaceChat Collection:
{
  serviceId: "abc123",
  senderId: "user1",
  senderName: "John Doe",
  receiverId: "user2",
  message: "Hello! I'm interested in your service",
  roomId: "abc123_user1_user2",
  timestamp: ISODate("2025-11-08T10:00:00Z"),
  isRead: false,
  createdAt: ISODate("2025-11-08T10:00:00Z"),
  updatedAt: ISODate("2025-11-08T10:00:00Z")
}
```

**Indexes:**
- `roomId + timestamp` - Fast message retrieval
- `receiverId + isRead` - Unread message counts
- Individual indexes on `serviceId`, `senderId`, `receiverId`, `roomId`

## User Flow

1. **Browse Marketplace** → User finds interesting service
2. **View Details** → Click service card to see modal
3. **Click "Contact Owner"** → Opens real-time chat window
4. **Join Room** → WebSocket connection established
5. **Chat History Loads** → Previous messages displayed (if any)
6. **Send Message** → Type message → Press Send or Enter
7. **Instant Delivery** → Owner receives message immediately (if online)
8. **Typing Indicators** → See "Owner is typing..." when they respond
9. **Real-Time Replies** → Messages appear instantly without refresh
10. **Close Chat** → Click X to close window
11. **Messages Saved** → All messages stored in MongoDB

## Server Architecture

```
Client Browser
    ↓ HTTP Request
Next.js Server (port 3011)
    ↓ Socket.IO
WebSocket Connection
    ↓ Events (join_room, send_message, etc.)
Socket.IO Server
    ↓ Broadcast to Room
All Clients in Room
    ↓ Save Message
MongoDB (marketplacechats collection)
```

## Features Breakdown

### Instant Messaging
- No page refresh required
- Messages delivered in milliseconds
- Works across multiple browser tabs

### Typing Indicators
- Shows "{Name} is typing..." when user types
- Automatically clears after 2 seconds of inactivity
- Only shown to other participants, not sender

### Chat Persistence
- All messages saved to MongoDB
- Chat history loaded when reopening conversation
- Last 100 messages retrieved (configurable)

### Room Isolation
- Each service conversation is separate
- Different users chatting about same service = different rooms
- Room ID ensures message privacy

### Auto-Reconnection
- Socket.IO automatically reconnects if connection drops
- Uses both WebSocket and polling fallback
- Seamless experience even on poor networks

## Configuration

### package.json
```json
{
  "scripts": {
    "dev": "node server.js",
    "start": "NODE_ENV=production node server.js"
  },
  "dependencies": {
    "socket.io": "^4.x",
    "socket.io-client": "^4.x"
  }
}
```

### server.js
```javascript
const port = process.env.PORT || 3011
const io = new Server(httpServer, {
  cors: { origin: '*' },
  path: '/socket.io'
})
```

## Testing the Chat

### 1. Test Single User Chat
```
1. Open marketplace in browser
2. Click on a service
3. Click "Contact Owner - Live Chat"
4. Send a message
5. Message appears instantly
```

### 2. Test Two Users (Real-Time)
```
1. Open marketplace in Browser A (User A logged in)
2. Open marketplace in Browser B (User B logged in)
3. User A clicks service owned by User B
4. User A opens chat and sends message
5. User B should see message in real-time (if also in chat)
```

### 3. Test Chat History
```
1. Send several messages
2. Close chat window
3. Reopen chat
4. Previous messages should load automatically
```

### 4. Test Typing Indicator
```
1. Open chat in two browsers (two different users)
2. Start typing in one browser
3. Other browser shows "{Name} is typing..."
4. Stop typing - indicator disappears after 2 seconds
```

## Troubleshooting

### "Please login to chat" Error
- **Cause:** User not authenticated
- **Solution:** Make sure user is logged in (localStorage has 'user' data)

### Messages Not Appearing
- **Cause:** Socket.IO connection failed
- **Check:** Browser console for "✅ Connected to Socket.IO server"
- **Solution:** Ensure server is running with `node server.js`

### Chat Window Not Opening
- **Cause:** Service missing `userId` or `userName`
- **Solution:** Ensure services have userId field from creation

### Old .next Errors
- **Cause:** Cached build files
- **Solution:** `Remove-Item -Recurse -Force .next` then restart

## Performance Considerations

- **Message Limit:** Only last 100 messages loaded per room
- **Connection Pooling:** Socket.IO reuses connections efficiently
- **Database Indexes:** Optimized queries with compound indexes
- **Auto-Cleanup:** Consider implementing message TTL (time-to-live)

## Security

✅ **Authentication Required:** Chat history API checks JWT token  
✅ **Room Isolation:** Users can only access their own rooms  
✅ **Message Validation:** Server validates message content  
✅ **XSS Protection:** Messages sanitized before display  

## Future Enhancements

🔜 **File Uploads** - Send images/documents in chat  
🔜 **Emoji Support** - React to messages with emojis  
🔜 **Unread Count** - Show number of unread messages  
🔜 **Online Status** - See if owner is currently online  
🔜 **Message Notifications** - Browser notifications for new messages  
🔜 **Search Messages** - Find specific messages in history  
🔜 **Delete Messages** - Remove sent messages  

## Summary

The real-time chat system uses Socket.IO WebSocket technology to enable instant communication between users. Messages are delivered immediately, saved to MongoDB for history, and support features like typing indicators. The system is scalable, secure, and provides a seamless user experience! 🚀💬
