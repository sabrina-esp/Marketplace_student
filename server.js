const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3011

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
    path: '/socket.io'
  })

  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id)

    // Join a specific chat room
    socket.on('join_room', ({ roomId, userId, userName }) => {
      socket.join(roomId)
      console.log(`👤 ${userName} (${userId}) joined room: ${roomId}`)
      
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

      const messageData = {
        id: Date.now().toString(),
        message,
        senderId,
        senderName,
        receiverId,
        serviceId,
        timestamp: new Date(),
        roomId
      }

      // Broadcast to all in room including sender
      io.to(roomId).emit('receive_message', messageData)

      // Save to database
      try {
        const mongoose = require('mongoose')
        const { MarketplaceChat } = require('./lib/marketplace/models/Chat.js')
        
        // Connect to MongoDB if not connected
        if (mongoose.connection.readyState !== 1) {
          const MONGODB_URI = process.env.MONGODB_URI
          if (!MONGODB_URI) {
            throw new Error('MONGODB_URI not defined')
          }
          
          await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
          })
          console.log('🔌 MongoDB connected for chat')
        }

        await MarketplaceChat.create({
          serviceId,
          senderId,
          senderName,
          receiverId,
          message,
          roomId,
          timestamp: new Date(),
          isRead: false
        })
        console.log('💾 Message saved to database')
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

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id)
    })
  })

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`🚀 Server running on http://${hostname}:${port}`)
      console.log(`🔌 Socket.IO server ready`)
    })
})
