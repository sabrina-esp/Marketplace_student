import { NextRequest, NextResponse } from "next/server"
import connectMarketplaceDB from "@/lib/marketplace/mongodb"
import { MarketplaceChat } from "@/lib/marketplace/models/Chat"
import { requireAuth } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request) as any
    
    if (authResult.error || !authResult.user) {
      return authResult.error || NextResponse.json(
        { error: 'Authentication required', requiresAuth: true },
        { status: 401 }
      )
    }

    const user = authResult.user
    await connectMarketplaceDB()

    // Get all messages where user is either sender or receiver
    const allMessages = await MarketplaceChat.find({
      $or: [
        { senderId: user.userId },
        { receiverId: user.userId }
      ]
    })
      .sort({ timestamp: -1 })
      .limit(500) // Limit to last 500 messages for performance

    // Group by roomId to get unique conversations
    const conversationMap = new Map()
    
    allMessages.forEach(msg => {
      if (!conversationMap.has(msg.roomId)) {
        // Determine if this message is unread (only count as unread if user is receiver)
        const isUnread = msg.receiverId === user.userId && !msg.isRead
        
        conversationMap.set(msg.roomId, {
          roomId: msg.roomId,
          serviceId: msg.serviceId,
          lastMessage: msg.message,
          senderName: msg.senderName,
          senderId: msg.senderId,
          receiverName: msg.receiverName,
          receiverId: msg.receiverId,
          timestamp: msg.timestamp,
          unreadCount: isUnread ? 1 : 0
        })
      } else {
        // Update unread count if this is an unread message for the user
        const conv = conversationMap.get(msg.roomId)
        if (msg.receiverId === user.userId && !msg.isRead) {
          conv.unreadCount++
        }
      }
    })

    // Convert to array and sort by timestamp (most recent first)
    const conversations = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Calculate total unread count
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

    return NextResponse.json({
      totalUnread,
      conversations
    })
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    )
  }
}
