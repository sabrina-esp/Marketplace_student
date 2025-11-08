import { NextRequest, NextResponse } from "next/server"
import { getChatHistory, markMessagesAsRead } from "@/lib/marketplace/chat-db"
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
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      )
    }

    // Get chat history
    const messages = await getChatHistory(roomId)

    // Mark messages as read
    await markMessagesAsRead(roomId, user.userId)

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching chat history:", error)
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    )
  }
}
