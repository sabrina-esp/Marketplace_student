import { NextRequest, NextResponse } from "next/server"
import connectMarketplaceDB from "@/lib/marketplace/mongodb"
import { MarketplaceService } from "@/lib/marketplace/models/Service"
import { requireAuth } from "@/lib/middleware/auth"

// GET /api/marketplace/services/my-services
// Returns only the services created by the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Check authentication - read token from cookie
    const authResult = await requireAuth(request) as any
    
    if (authResult.error || !authResult.user) {
      return authResult.error || NextResponse.json(
        { error: 'Authentication required', requiresAuth: true },
        { status: 401 }
      )
    }

    const user = authResult.user

    // Connect to database
    await connectMarketplaceDB()

    // Get only services created by this user
    const services = await MarketplaceService.find({ userId: user.userId })
      .sort({ createdAt: -1 })

    console.log(`✅ Found ${services.length} services for user ${user.userId}`)

    return NextResponse.json(services)
  } catch (error) {
    console.error("❌ Error fetching user services:", error)
    return NextResponse.json(
      { error: "Failed to fetch your services" },
      { status: 500 }
    )
  }
}
