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

    // Count unread messages where user is the receiver
    const unreadCount = await MarketplaceChat.countDocuments({
      receiverId: user.userId,
      isRead: false
    })

    // Get list of conversations with unread messages
    const unreadMessages = await MarketplaceChat.find({
      receiverId: user.userId,
      isRead: false
    })
      .sort({ timestamp: -1 })
      .limit(50)

    // Group by roomId to get unique conversations
    const conversationMap = new Map()
    unreadMessages.forEach(msg => {
      if (!conversationMap.has(msg.roomId)) {
        conversationMap.set(msg.roomId, {
          roomId: msg.roomId,
          serviceId: msg.serviceId,
          lastMessage: msg.message,
          senderName: msg.senderName,
          senderId: msg.senderId,
          timestamp: msg.timestamp,
          unreadCount: 1
        })
      } else {
        const conv = conversationMap.get(msg.roomId)
        conv.unreadCount++
      }
    })

    const conversations = Array.from(conversationMap.values())

    return NextResponse.json({
      totalUnread: unreadCount,
      conversations
    })
  } catch (error) {
    console.error("Error fetching unread messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch unread messages" },
      { status: 500 }
    )
  }
}
