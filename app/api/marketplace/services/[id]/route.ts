import { NextRequest, NextResponse } from "next/server"
import connectMarketplaceDB from "@/lib/marketplace/mongodb"
import { MarketplaceService } from "@/lib/marketplace/models/Service"
import { requireAuth } from "@/lib/middleware/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectMarketplaceDB()
    const service = await MarketplaceService.findById(params.id)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error fetching service:", error)
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const { user, error } = requireAuth(request)
    
    if (error) {
      return error
    }

    await connectMarketplaceDB()
    
    // Get the service to check ownership
    const existingService = await MarketplaceService.findById(params.id)
    
    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Check if user owns this service
    if (existingService.userId !== user.userId) {
      return NextResponse.json(
        { 
          success: false, 
          message: "You can only edit your own services" 
        }, 
        { status: 403 }
      )
    }

    const data = await request.json()
    const service = await MarketplaceService.findByIdAndUpdate(params.id, data, { new: true })

    return NextResponse.json(service)
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const { user, error } = requireAuth(request)
    
    if (error) {
      return error
    }

    await connectMarketplaceDB()
    
    // Get the service to check ownership
    const existingService = await MarketplaceService.findById(params.id)
    
    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Check if user owns this service
    if (existingService.userId !== user.userId) {
      return NextResponse.json(
        { 
          success: false, 
          message: "You can only delete your own services" 
        }, 
        { status: 403 }
      )
    }

    await MarketplaceService.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Service deleted successfully" })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 })
  }
}
