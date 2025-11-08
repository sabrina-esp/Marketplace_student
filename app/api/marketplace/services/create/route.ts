import { NextRequest, NextResponse } from "next/server"
import connectMarketplaceDB from "@/lib/marketplace/mongodb"
import { MarketplaceService } from "@/lib/marketplace/models/Service"
import { requireAuth } from "@/lib/middleware/auth"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { user, error } = requireAuth(request)
    
    if (error) {
      return error // Return 401 or 403 error response
    }

    // Connect to database
    await connectMarketplaceDB()
    
    // Get service data from request body
    const data = await request.json()

    // Extract user info from verified token
    const userId = user.userId
    const userEmail = user.email
    const userName = user.name

    console.log('✅ Creating service for user:', { userId, userEmail, userName })

    // Create service with authenticated user as owner
    const service = await MarketplaceService.create({
      ...data,
      userId,
      userEmail,
      userName, // Store user name for display purposes
    })

    console.log('✅ Service created successfully:', service._id)

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("❌ Error creating service:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to create service",
        message: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    )
  }
}
