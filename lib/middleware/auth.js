import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

/**
 * Verify JWT token and extract user information
 * @param {string} token - JWT token from Authorization header
 * @returns {object} Decoded token payload with userId, email, name
 */
export function verifyToken(token) {
  try {
    if (!token) {
      return null
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured')
      return null
    }
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET)
    return decoded
  } catch (error) {
    console.error('❌ Token verification failed:', error.message)
    return null
  }
}

/**
 * Middleware to protect API routes - requires authentication
 * Returns user data or error response
 * @param {NextRequest} request - Next.js request object
 * @returns {object} { user: object, error: NextResponse | null }
 */
export function requireAuth(request) {
  // Get token from cookie (primary method for your app)
  const cookieToken = request.cookies.get('token')?.value
  
  // Fallback to Authorization header (for API clients)
  const authHeader = request.headers.get('authorization')
  
  const token = cookieToken || authHeader

  if (!token) {
    return {
      user: null,
      error: NextResponse.json(
        { 
          success: false, 
          message: 'Authentication required. Please login.',
          requiresAuth: true
        },
        { status: 401 }
      )
    }
  }

  const user = verifyToken(token)

  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or expired token. Please login again.',
          requiresAuth: true
        },
        { status: 401 }
      )
    }
  }

  // Check if email is verified
  if (!user.isVerified && !user.isEmailVerified) {
    return {
      user: null,
      error: NextResponse.json(
        { 
          success: false, 
          message: 'Please verify your email before accessing this resource.',
          requiresVerification: true
        },
        { status: 403 }
      )
    }
  }

  return { user, error: null }
}

/**
 * Extract user ID from request (with auth check)
 * @param {NextRequest} request - Next.js request object
 * @returns {string | null} User ID or null if not authenticated
 */
export function getUserIdFromRequest(request) {
  const cookieToken = request.cookies.get('token')?.value
  const authHeader = request.headers.get('authorization')
  const token = cookieToken || authHeader

  if (!token) return null

  const user = verifyToken(token)
  return user?.userId || null
}
