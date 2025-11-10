import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    // Get user from token cookie
    const authResult = await requireAuth(request) as any
    
    if (authResult.error || !authResult.user) {
      return authResult.error || NextResponse.json(
        { error: 'Authentication required', requiresAuth: true },
        { status: 401 }
      )
    }

    const user = authResult.user

    // Return user info
    return NextResponse.json({
      id: user.userId,
      userId: user.userId,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified || user.isEmailVerified
    })
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json(
      { error: "Failed to get user info" },
      { status: 500 }
    )
  }
}
