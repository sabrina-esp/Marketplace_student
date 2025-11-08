# Cookie-Based Authentication Implementation

## Overview

The marketplace uses **cookie-based JWT authentication** to protect service creation, editing, and deletion operations. Authentication tokens are stored in HttpOnly cookies and automatically sent with all requests.

## Why Cookie-Based Authentication?

✅ **More Secure**: HttpOnly cookies prevent XSS attacks  
✅ **Automatic**: Browser sends cookies automatically - no manual header management  
✅ **CSRF Protection**: SameSite=Strict prevents cross-site request forgery  
✅ **Simpler Code**: Frontend doesn't need to manage Authorization headers  

## How It Works

### 1. Token Storage (Existing Auth System)

Your signin route (`/api/auth/signin`) already sets an HttpOnly cookie:

```javascript
// Cookie configuration in signin route
Set-Cookie: token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

**Token Contains:**
- `userId` - Unique user identifier
- `email` - User's email address
- `name` - User's display name
- `isVerified` - Email verification status
- `iat` - Issued at timestamp
- `exp` - Expiration timestamp (7 days)

### 2. Authentication Middleware

**Location:** `lib/middleware/auth.js`

```javascript
import jwt from 'jsonwebtoken'

export async function requireAuth(request) {
  try {
    // Get token from cookie (primary method)
    const cookieToken = request.cookies.get('token')?.value
    
    // Fallback to Authorization header (for API clients)
    const authHeader = request.headers.get('authorization')
    const headerToken = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null
    
    const token = cookieToken || headerToken
    
    if (!token) {
      return { user: null, error: 'No authentication token provided' }
    }
    
    // Verify JWT signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    return { user: decoded, error: null }
  } catch (error) {
    return { user: null, error: 'Invalid or expired token' }
  }
}
```

**Key Features:**
- Reads token from `request.cookies` automatically
- Falls back to Authorization header for API clients
- Verifies JWT signature using JWT_SECRET
- Returns user data or error

### 3. Protected API Routes

#### Create Service - `app/api/marketplace/services/create/route.ts`

```typescript
import { requireAuth } from '@/lib/middleware/auth'
import { MarketplaceService } from '@/lib/marketplace/models/Service'

export async function POST(request: Request) {
  // Verify authentication (reads from cookie automatically)
  const { user, error } = await requireAuth(request)
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Authentication required', requiresAuth: true },
      { status: 401 }
    )
  }
  
  const body = await request.json()
  
  // Create service with authenticated user info
  const service = new MarketplaceService({
    title: body.title,
    description: body.description,
    price: body.price,
    category: body.category,
    userId: user.userId,      // From JWT token
    userEmail: user.email,    // From JWT token
    userName: user.name       // From JWT token
  })
  
  await service.save()
  return NextResponse.json(service, { status: 201 })
}
```

#### Update Service - `app/api/marketplace/services/[id]/route.ts`

```typescript
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Verify authentication
  const { user, error } = await requireAuth(request)
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Authentication required', requiresAuth: true },
      { status: 401 }
    )
  }
  
  const service = await MarketplaceService.findById(params.id)
  
  if (!service) {
    return NextResponse.json(
      { error: 'Service not found' },
      { status: 404 }
    )
  }
  
  // Check ownership - only service owner can edit
  if (service.userId !== user.userId) {
    return NextResponse.json(
      { error: 'You can only edit your own services' },
      { status: 403 }
    )
  }
  
  // Update service...
  const body = await request.json()
  Object.assign(service, body)
  await service.save()
  
  return NextResponse.json(service)
}
```

#### Delete Service - `app/api/marketplace/services/[id]/route.ts`

```typescript
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Verify authentication
  const { user, error } = await requireAuth(request)
  
  if (error || !user) {
    return NextResponse.json(
      { error: 'Authentication required', requiresAuth: true },
      { status: 401 }
    )
  }
  
  const service = await MarketplaceService.findById(params.id)
  
  if (!service) {
    return NextResponse.json(
      { error: 'Service not found' },
      { status: 404 }
    )
  }
  
  // Check ownership - only service owner can delete
  if (service.userId !== user.userId) {
    return NextResponse.json(
      { error: 'You can only delete your own services' },
      { status: 403 }
    )
  }
  
  await MarketplaceService.findByIdAndDelete(params.id)
  
  return NextResponse.json({ message: 'Service deleted successfully' })
}
```

### 4. Frontend Implementation

#### Authentication Guard - `app/marketplace/manage/page.tsx`

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ManageServicesPage() {
  const router = useRouter()
  
  useEffect(() => {
    checkAuth()
  }, [])
  
  const checkAuth = () => {
    // Check if user is logged in (for UI display purposes)
    const userData = localStorage.getItem('user')
    
    if (!userData) {
      alert('Please login to manage your services')
      router.push('/')
      return
    }
    
    // User is authenticated, fetch services
    fetchServices()
  }
  
  // ... rest of component
}
```

**Note:** We only check `localStorage.user` for UI display. The actual authentication happens server-side using the cookie.

#### API Calls - **NO Authorization Header Needed!**

```typescript
// ✅ Create service - cookie is sent automatically
const response = await fetch("/api/marketplace/services/create", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json"
  },
  body: JSON.stringify(formData),
})

// ✅ Update service - cookie is sent automatically
const response = await fetch(`/api/marketplace/services/${id}`, {
  method: "PUT",
  headers: { 
    "Content-Type": "application/json"
  },
  body: JSON.stringify(formData),
})

// ✅ Delete service - cookie is sent automatically
const response = await fetch(`/api/marketplace/services/${id}`, {
  method: "DELETE"
})
```

**Why no Authorization header?**
- The browser automatically includes cookies with same-origin requests
- The backend reads the token from `request.cookies.get('token')`
- This is simpler and more secure than manual token management

#### Session Expiration Handling

```typescript
const data = await response.json()

if (data.requiresAuth) {
  alert('Your session has expired. Please login again.')
  localStorage.removeItem('user')
  router.push('/')
  return
}
```

## Access Control Matrix

| Action | Public | Authenticated | Owner Only |
|--------|--------|---------------|------------|
| View all services | ✅ | ✅ | ✅ |
| View single service | ✅ | ✅ | ✅ |
| Create service | ❌ | ✅ | - |
| Edit service | ❌ | ❌ | ✅ |
| Delete service | ❌ | ❌ | ✅ |

### Authorization Flow

```
1. User signs in → JWT token stored in HttpOnly cookie
2. User navigates to /marketplace/manage
3. Frontend checks localStorage.user for UI display
4. User creates/edits service
5. Browser automatically sends cookie with fetch()
6. Backend reads token from request.cookies
7. Backend verifies JWT and extracts user info
8. For PUT/DELETE: Backend checks service.userId === user.userId
9. Action allowed/denied based on ownership
```

## Security Features

### 1. HttpOnly Cookies
```javascript
HttpOnly; // JavaScript cannot access the cookie
Secure;   // Only sent over HTTPS in production
SameSite=Strict; // Prevents CSRF attacks
Max-Age=604800; // 7 days expiration
```

**Benefits:**
- Prevents XSS attacks from stealing tokens
- Cannot be accessed by malicious JavaScript
- Automatically handled by browser

### 2. JWT Verification
```javascript
jwt.verify(token, process.env.JWT_SECRET)
```
- Verifies signature using secret key
- Checks expiration timestamp
- Validates token structure

### 3. Ownership Validation
```javascript
if (service.userId !== user.userId) {
  return NextResponse.json(
    { error: 'You can only edit your own services' },
    { status: 403 }
  )
}
```
- Compares service owner with authenticated user
- Prevents unauthorized modifications
- Returns 403 Forbidden for non-owners

### 4. Token Expiration
- Tokens expire after 7 days
- User must re-authenticate after expiration
- Expired tokens rejected by JWT verification

## Environment Variables

```env
JWT_SECRET=your-super-secret-key-here
MONGODB_URI=mongodb+srv://...
```

**Required for:**
- JWT token signing and verification
- MongoDB database connection

## Testing the Implementation

### 1. Test Public Access (Should Work)

```bash
# View all services (no auth required)
curl http://localhost:3000/api/marketplace/services
```

### 2. Test Unauthenticated Creation (Should Fail)

```bash
# Try to create without authentication
curl -X POST http://localhost:3000/api/marketplace/services/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Service",
    "description": "Test",
    "price": 100,
    "category": "Development"
  }'

# Expected: 401 Unauthorized
# {"error":"Authentication required","requiresAuth":true}
```

### 3. Test Authenticated Creation (Should Work)

```bash
# Sign in first to get cookie, then:
curl -X POST http://localhost:3000/api/marketplace/services/create \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Service",
    "description": "Test description",
    "price": 100,
    "category": "Development"
  }'

# Expected: 201 Created
# Returns the created service with userId, userEmail, userName
```

### 4. Test Ownership Validation

```bash
# Create service as User A
# Try to edit/delete as User B with different userId

curl -X PUT http://localhost:3000/api/marketplace/services/SERVICE_ID \
  -H "Content-Type: application/json" \
  -H "Cookie: token=USER_B_TOKEN" \
  -d '{"title": "Hacked Title"}'

# Expected: 403 Forbidden
# {"error":"You can only edit your own services"}
```

## Common Issues & Solutions

### ❌ "Authentication required" Error

**Symptoms:**
- Can't create/edit/delete services
- Getting 401 status code

**Causes:**
- User not logged in
- Token expired (>7 days old)
- Cookie not being sent

**Solutions:**
1. Check if user is logged in
2. Sign in again to refresh token
3. Check browser cookies (should see `token` cookie)
4. Verify cookie not being blocked by browser

### ❌ "You can only edit your own services" Error

**Symptoms:**
- Can create services but can't edit them
- Getting 403 status code

**Causes:**
- Trying to edit another user's service
- userId mismatch between token and service

**Solutions:**
- This is expected behavior - users can only edit their own services
- Make sure you're editing a service you created
- Check that the service's userId matches your user account

### ❌ Token Not Being Sent

**Symptoms:**
- Always getting "Authentication required"
- Cookies visible in browser but not working

**Causes:**
- CORS configuration (if using different domains)
- Incorrect cookie SameSite setting

**Solutions:**
```typescript
// If using different domains (e.g., localhost:3000 → localhost:4000)
fetch(url, {
  credentials: 'include' // Include cookies in cross-origin requests
})
```

### ❌ "Invalid or expired token" Error

**Symptoms:**
- Was working before, now suddenly failing
- Getting 401 even though logged in

**Causes:**
- Token expired (>7 days)
- JWT_SECRET changed on server
- Token corrupted

**Solutions:**
1. Sign out and sign in again
2. Clear cookies and re-authenticate
3. Check JWT_SECRET hasn't changed

## Migration from Header-Based Auth

If you previously used `Authorization: Bearer` headers:

### ✅ What to Keep:
- Auth guard checking `localStorage.user` for UI
- Session expiration handling
- User data display from localStorage

### ❌ What to Remove:
- `Authorization: Bearer ${token}` headers from fetch calls
- `authToken` state management in components
- Manual token passing to API functions

### Example Migration:

**Before (Header-Based):**
```typescript
const [authToken, setAuthToken] = useState<string | null>(null)

const fetchData = async (token: string) => {
  const response = await fetch('/api/marketplace/services/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // ❌ Remove
    },
    body: JSON.stringify(data)
  })
}
```

**After (Cookie-Based):**
```typescript
// ❌ Remove authToken state completely

const fetchData = async () => {
  const response = await fetch('/api/marketplace/services/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // ✅ No Authorization header needed!
    },
    body: JSON.stringify(data)
  })
}
```

## Summary

✅ **Backend**: Auth middleware reads JWT from cookies  
✅ **Frontend**: No manual token management needed  
✅ **Security**: HttpOnly cookies prevent XSS attacks  
✅ **Access Control**: Service owner-based authorization  
✅ **User Experience**: Automatic authentication with cookies  

The cookie-based approach is **simpler, more secure, and requires less code** than header-based authentication!
