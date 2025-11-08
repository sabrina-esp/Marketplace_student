import { NextRequest, NextResponse } from "next/server"
import connectMarketplaceDB from "@/lib/marketplace/mongodb"
import { MarketplaceService } from "@/lib/marketplace/models/Service"

export async function GET(request: NextRequest) {
  try {
    await connectMarketplaceDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const userId = searchParams.get("userId")

    const query: any = {}

    // Filter by user if provided (for viewing own services)
    if (userId) {
      query.userId = userId
    }

    if (category && category !== "All") {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ]
    }

    if (minPrice || maxPrice) {
      query.pricePerHour = {}
      if (minPrice) query.pricePerHour.$gte = Number(minPrice)
      if (maxPrice) query.pricePerHour.$lte = Number(maxPrice)
    }

    const services = await MarketplaceService.find(query).sort({ createdAt: -1 })

    return NextResponse.json(services)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}
