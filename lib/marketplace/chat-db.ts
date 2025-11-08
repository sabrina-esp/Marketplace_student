import connectMarketplaceDB from './mongodb'
import { MarketplaceChat } from './models/Chat'

export async function saveMessage(data: {
  serviceId: string
  senderId: string
  senderName: string
  receiverId: string
  message: string
  roomId: string
}) {
  try {
    await connectMarketplaceDB()
    
    const chatMessage = new MarketplaceChat({
      serviceId: data.serviceId,
      senderId: data.senderId,
      senderName: data.senderName,
      receiverId: data.receiverId,
      message: data.message,
      roomId: data.roomId,
      timestamp: new Date(),
      isRead: false
    })

    await chatMessage.save()
    return chatMessage
  } catch (error) {
    console.error('Error saving message:', error)
    throw error
  }
}

export async function getChatHistory(roomId: string) {
  try {
    await connectMarketplaceDB()
    
    const messages = await MarketplaceChat.find({ roomId })
      .sort({ timestamp: 1 })
      .limit(100) // Last 100 messages
    
    return messages
  } catch (error) {
    console.error('Error fetching chat history:', error)
    throw error
  }
}

export async function markMessagesAsRead(roomId: string, userId: string) {
  try {
    await connectMarketplaceDB()
    
    await MarketplaceChat.updateMany(
      { 
        roomId,
        receiverId: userId,
        isRead: false
      },
      { 
        isRead: true 
      }
    )
  } catch (error) {
    console.error('Error marking messages as read:', error)
    throw error
  }
}
