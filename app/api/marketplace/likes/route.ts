import { NextRequest, NextResponse } from "next/server"
import connectMarketplaceDB from "@/lib/marketplace/mongodb"
import { MarketplaceLike } from "@/lib/marketplace/models/Like"
import { MarketplaceService } from "@/lib/marketplace/models/Service"

export async function GET(request: NextRequest) {
  try {
    await connectMarketplaceDB()

    const { searchParams } = new URL(request.url)
    const getSaved = searchParams.get("getSaved")
    const userId = searchParams.get("userId") || "temp-user-id" // TODO: Get from session

    if (getSaved === "true") {
      const likes = await MarketplaceLike.find({ userId }).populate("serviceId")
      const services = likes.map((like: any) => like.serviceId).filter(Boolean)
      return NextResponse.json(services)
    }

    return NextResponse.json([])
  } catch (error) {
    console.error("Error fetching likes:", error)
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectMarketplaceDB()
    const { serviceId, removeSave, userId: bodyUserId } = await request.json()
    
    const userId = bodyUserId || "temp-user-id" // TODO: Get from session

    if (removeSave) {
      await MarketplaceLike.deleteOne({ userId, serviceId })
      return NextResponse.json({ message: "Like removed" })
    }

    const existingLike = await MarketplaceLike.findOne({ userId, serviceId })
    if (existingLike) {
      return NextResponse.json({ message: "Already liked" })
    }

    const like = await MarketplaceLike.create({ userId, serviceId })
    return NextResponse.json(like, { status: 201 })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
