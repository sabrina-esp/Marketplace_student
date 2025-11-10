'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { io, Socket } from 'socket.io-client'
import { X, Send, Loader2 } from 'lucide-react'

interface Message {
  id: string
  message: string
  senderId: string
  senderName: string
  receiverId: string
  serviceId: string
  timestamp: Date
  roomId: string
}

interface ChatWindowProps {
  serviceId: string
  serviceTitle: string
  ownerId: string
  ownerName: string
  onClose: () => void
}

function ChatWindow({
  serviceId,
  serviceTitle,
  ownerId,
  ownerName,
  onClose
}: ChatWindowProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Generate room ID: serviceId_userId1_userId2 (sorted to be consistent)
  const getRoomId = (userId1: string, userId2: string) => {
    const sortedIds = [userId1, userId2].sort()
    return `${serviceId}_${sortedIds[0]}_${sortedIds[1]}`
  }

  useEffect(() => {
    let socketInstance: Socket | null = null
    let mounted = true

    // Fetch current user from token (in cookies)
    const initializeChat = async () => {
      try {
        // Get user info from token cookie
        const response = await fetch('/api/auth/is')
        
        if (!response.ok) {
          alert('Please login to chat')
          onClose()
          return
        }

        const user = await response.json()
        if (!mounted) return

        setCurrentUser(user)

        // Initialize Socket.IO connection with better config
        const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : '')
        const SOCKET_PATH = process.env.NEXT_PUBLIC_SOCKET_PATH || '/socket.io'
        socketInstance = io(SOCKET_URL, {
          path: SOCKET_PATH,
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          autoConnect: true,
          forceNew: true
        })

        socketInstance.on('connect', () => {
          console.log('✅ Connected to Socket.IO server')
          
          const roomId = getRoomId(user.id, ownerId)
          
          // Join the chat room (with acknowledgement)
          console.log('➡️ Emitting join_room for', { roomId, userId: user.id, userName: user.name })
          socketInstance?.emit('join_room', {
            roomId,
            userId: user.id,
            userName: user.name
          }, (ack: any) => {
            console.log('⬅️ join_room ack from server:', ack)
            if (ack && ack.success) {
              console.log(`✅ Successfully joined room on server: ${roomId}`)
            } else {
              console.warn(`⚠️ Server did not confirm room join for ${roomId}`, ack)
            }
          })

          // Load chat history
          console.log('Loading chat history for', roomId)
          loadChatHistory(roomId)
        })

        socketInstance.on('receive_message', (message: Message) => {
          console.log('📩 Received message:', message)
          if (!mounted) return
          
          // Prevent duplicate messages by checking if message already exists
          setMessages((prev) => {
            const exists = prev.some(m => 
              m.id === message.id || 
              (m.message === message.message && 
               m.senderId === message.senderId && 
               Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000)
            )
            if (exists) {
              console.log('⚠️ Duplicate message prevented')
              return prev
            }
            const next = [...prev, message]
            console.log(`Messages count: ${next.length}`)
            return next
          })
          setTypingUser(null)
        })

        socketInstance.on('user_typing', ({ userName, isTyping }: any) => {
          if (!mounted) return
          if (isTyping) {
            setTypingUser(userName)
          } else {
            setTypingUser(null)
          }
        })

        socketInstance.on('user_joined', ({ userName, message }: any) => {
          console.log('👋 user_joined event:', { userName, message })
        })

        socketInstance.on('disconnect', () => {
          console.log('❌ Disconnected from Socket.IO server')
        })

        if (mounted) {
          setSocket(socketInstance)
        }
      } catch (error) {
        console.error('Error initializing chat:', error)
        if (mounted) {
          alert('Failed to connect to chat. Please try again.')
          onClose()
        }
      }
    }

    initializeChat()

    return () => {
      mounted = false
      if (socketInstance && currentUser) {
        const roomId = getRoomId(currentUser.id, ownerId)
        console.log('➡️ Emitting leave_room for', { roomId, userName: currentUser.name })
        socketInstance.emit('leave_room', { roomId, userName: currentUser.name }, (ack: any) => {
          console.log('⬅️ leave_room ack from server:', ack)
        })
        socketInstance.disconnect()
        console.log('Socket disconnected and cleanup performed for', roomId)
      }
    }
  }, [])

  const loadChatHistory = async (roomId: string) => {
    try {
      const response = await fetch(`/api/marketplace/chat/history?roomId=${roomId}`)
      if (response.ok) {
        const history = await response.json()
        setMessages(history)
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !socket || !currentUser) return

    const roomId = getRoomId(currentUser.id, ownerId)

    socket.emit('send_message', {
      roomId,
      message: newMessage.trim(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId: ownerId,
      serviceId
    })

    setNewMessage('')
    
    // Stop typing indicator
    socket.emit('typing', { roomId, userName: currentUser.name, isTyping: false })
  }

  const handleTyping = () => {
    if (!socket || !currentUser) return

    const roomId = getRoomId(currentUser.id, ownerId)

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Send typing indicator
    socket.emit('typing', { roomId, userName: currentUser.name, isTyping: true })

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { roomId, userName: currentUser.name, isTyping: false })
    }, 2000)
  }

  if (!currentUser) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[700px] flex flex-col overflow-hidden transform transition-all animate-slideUp">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-orange-400  p-6 flex justify-between items-center relative overflow-hidden">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10">
            <h3 className="font-bold text-xl mb-1">{serviceTitle}</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-sm opacity-90">Chat with {ownerName}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="relative z-10 hover:bg-white/20 rounded-full p-2.5 transition-all hover:rotate-90 duration-300 hover:scale-110 group"
            aria-label="Close chat"
          >
            <X className="w-6 h-6  group-hover:" />
          </button>
        </div>

        {/* Messages Area with Improved Design */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
              <p className="text-gray-500 text-sm">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="bg-gray-100 rounded-full p-6 mb-4">
                <Send className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-sm">Start the conversation by sending a message!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isOwnMessage = msg.senderId === currentUser.id
              const prevMsg = index > 0 ? messages[index - 1] : null
              const showAvatar = !prevMsg || prevMsg.senderId !== msg.senderId
              
              return (
                <div
                  key={msg.id || `${msg.senderId}-${msg.timestamp}`}
                  className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  {/* Avatar for received messages */}
                  {!isOwnMessage && (
                    <div className={`flex-shrink-0 mb-1 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center  font-semibold text-sm">
                        {msg.senderName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    {/* Sender name for received messages */}
                    {!isOwnMessage && showAvatar && (
                      <span className="text-xs font-semibold text-purple-600 mb-1 ml-2">
                        {msg.senderName}
                      </span>
                    )}
                    
                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md ${
                        isOwnMessage
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600  rounded-br-md'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.message}
                      </p>
                    </div>
                    
                    {/* Timestamp */}
                    <span
                      className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-purple-400 mr-2' : 'text-gray-400 ml-2'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {/* Avatar for sent messages */}
                  {isOwnMessage && (
                    <div className={`flex-shrink-0 mb-1 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center  font-semibold text-sm">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
          
          {/* Typing Indicator with Animation */}
          {typingUser && (
            <div className="flex items-end gap-2 animate-fadeIn">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center  font-semibold text-sm">
                {typingUser.charAt(0).toUpperCase()}
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-5 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area with Modern Design */}
        <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-200">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewMessage(e.target.value)
                  handleTyping()
                }}
                placeholder="Type your message..."
                className="w-full px-5 py-3.5 pr-12 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                disabled={!socket}
              />
              {/* Character counter for long messages */}
              {newMessage.length > 50 && (
                <span className="absolute right-4 bottom-3.5 text-xs text-gray-400">
                  {newMessage.length}
                </span>
              )}
            </div>
            
            <button
              type="submit"
              disabled={!newMessage.trim() || !socket}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400  px-6 py-3.5 rounded-2xl transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed group"
            >
              <Send className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          
          {/* Connection Status */}
          {!socket && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Disconnected - Reconnecting...
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default memo(ChatWindow)
