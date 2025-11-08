import { NextRequest, NextResponse } from "next/server"
import connectMarketplaceDB from "@/lib/marketplace/mongodb"
import { MarketplaceChat } from "@/lib/marketplace/models/Chat"

export async function GET(request: NextRequest) {
  try {
    await connectMarketplaceDB()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "temp-user-id" // TODO: Get from session

    const chats = await MarketplaceChat.find({
      participants: userId,
    })
      .populate("serviceId")
      .sort({ lastMessageTime: -1 })

    return NextResponse.json(chats)
  } catch (error) {
    console.error("Error fetching chats:", error)
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectMarketplaceDB()
    const { serviceId, message, senderId, receiverId } = await request.json()

    const userId = senderId || "temp-user-id" // TODO: Get from session

    let chat = await MarketplaceChat.findOne({
      serviceId,
      participants: { $all: [senderId, receiverId] },
    })

    if (!chat) {
      chat = await MarketplaceChat.create({
        serviceId,
        participants: [senderId, receiverId],
        messages: [],
      })
    }

    chat.messages.push({
      senderId: userId,
      message,
      timestamp: new Date(),
    })

    chat.lastMessage = message
    chat.lastMessageTime = new Date()

    await chat.save()

    return NextResponse.json(chat)
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
