import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'

let io: SocketIOServer | null = null

export function initializeSocket(httpServer: HTTPServer) {
  if (io) {
    return io
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    path: '/api/socket/io'
  })

  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id)

    // Join a specific chat room (serviceId_userId)
    socket.on('join_room', ({ roomId, userId, userName }) => {
      socket.join(roomId)
      console.log(`👤 ${userName} (${userId}) joined room: ${roomId}`)
      
      // Notify others in the room
      socket.to(roomId).emit('user_joined', {
        userId,
        userName,
        message: `${userName} joined the chat`
      })
    })

    // Handle sending messages
    socket.on('send_message', async (data) => {
      const { roomId, message, senderId, senderName, receiverId, serviceId } = data
      
      console.log(`💬 Message in room ${roomId}:`, message)

      // Broadcast message to everyone in the room
      io?.to(roomId).emit('receive_message', {
        id: Date.now().toString(),
        message,
        senderId,
        senderName,
        receiverId,
        serviceId,
        timestamp: new Date(),
        roomId
      })

      // Save message to database
      try {
        const { saveMessage } = await import('./chat-db')
        await saveMessage({
          serviceId,
          senderId,
          senderName,
          receiverId,
          message,
          roomId
        })
      } catch (error) {
        console.error('❌ Error saving message:', error)
      }
    })

    // Handle typing indicator
    socket.on('typing', ({ roomId, userName, isTyping }) => {
      socket.to(roomId).emit('user_typing', { userName, isTyping })
    })

    // Leave room
    socket.on('leave_room', ({ roomId, userName }) => {
      socket.leave(roomId)
      console.log(`👋 ${userName} left room: ${roomId}`)
      
      socket.to(roomId).emit('user_left', {
        userName,
        message: `${userName} left the chat`
      })
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id)
    })
  })

  console.log('🚀 Socket.IO server initialized')
  return io
}

export function getSocketServer() {
  return io
}
