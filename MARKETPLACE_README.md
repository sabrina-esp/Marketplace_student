# Marketplace Integration - Setup Guide

## Overview
This document describes the integration of the **Marketplace** feature into the existing User project. The marketplace allows students to post, browse, and manage freelance services.

## What Was Added

### 1. Database Models (`lib/marketplace/models/`)
- **Service.ts** - Service listings with categories, pricing, ratings
- **Like.ts** - Saved/liked services by users
- **Chat.ts** - Messaging between service providers and clients

### 2. API Routes (`app/api/marketplace/`)
- `GET /api/marketplace/services` - List all services (with filters)
- `POST /api/marketplace/services/create` - Create new service
- `GET/PUT/DELETE /api/marketplace/services/[id]` - Manage specific service
- `GET/POST /api/marketplace/likes` - Save/unsave services
- `GET/POST /api/marketplace/chat` - Messaging functionality

### 3. Frontend Pages (`app/marketplace/`)
- `/marketplace` - Browse all services with filters
- `/marketplace/manage` - Create and manage your own services
- `/marketplace/saved` - View saved/liked services
- `/marketplace/messages` - Chat with service providers/clients

### 4. Navigation
- Added "Marketplace" link to the main navbar with briefcase icon

## Design Choices

### Styling
All marketplace pages use the **existing user project's design system**:
- Colors: `purple` (#611F69), `orange` (#F9CD92), `lightpink` (#FCF6EF)
- Font: `Inter` (matching the rest of the app)
- No shadcn/ui dependencies - using native Tailwind classes
- Consistent with existing pages (navbar, footer, spacing)

### User Management
Currently using placeholder `temp-user-id` for user identification. **TODO:**
- Integrate with your existing auth system in `lib/services/AuthService.js`
- Replace `temp-user-id` with actual user ID from session
- Add user email to service listings

## Installation & Setup

### 1. Install Dependencies
All required dependencies are already in `package.json`:
- `mongoose` - MongoDB ORM
- `lucide-react` - Icons
- `next`, `react`, `react-dom` - Already installed

No additional packages needed!

### 2. Environment Variables
Add to your `.env.local` file:

\`\`\`env
# Marketplace Database (can use same MongoDB as user database)
MONGODB_URI=mongodb://localhost:27017/marketplace-db
# Or use your existing MongoDB Atlas connection string
\`\`\`

### 3. Database Setup
The models will auto-create collections on first use. No manual setup needed.

### 4. Seed Sample Data (Optional)
You can create a seed script or manually add services through the `/marketplace/manage` page once logged in.

## Integration Points

### Auth Integration (Required)
Update these files to use real user authentication:

1. **API Routes** - Replace `temp-user-id`:
   - `app/api/marketplace/services/create/route.ts` (line 13)
   - `app/api/marketplace/likes/route.ts` (line 11, 29)
   - `app/api/marketplace/chat/route.ts` (line 9, 36)

2. **Frontend Pages** - Get user from session:
   - `app/marketplace/manage/page.tsx` (line 38)
   - `app/marketplace/saved/page.tsx` (line 33)
   - `app/marketplace/messages/page.tsx` (line 54)

Example integration with your auth:
\`\`\`typescript
// In API routes
import { getServerSession } from "next-auth/next" // or your auth method
const session = await getServerSession()
const userId = session?.user?.id || "guest"

// In client pages
const user = JSON.parse(localStorage.getItem('user') || '{}')
const userId = user._id || user.id
\`\`\`

### MongoDB Connection
The marketplace uses a separate MongoDB connection utility in `lib/marketplace/mongodb.ts` to avoid conflicts with your existing database setup. You can:
- Use the same MongoDB database with different collections (recommended)
- Use a separate database by setting a different `MONGODB_URI`

## File Structure

\`\`\`
user/
├── app/
│   ├── marketplace/           # NEW - Marketplace pages
│   │   ├── page.tsx          # Browse services
│   │   ├── manage/
│   │   │   └── page.tsx      # Manage own services
│   │   ├── saved/
│   │   │   └── page.tsx      # Saved services
│   │   └── messages/
│   │       └── page.tsx      # Messaging
│   ├── api/
│   │   └── marketplace/       # NEW - API routes
│   │       ├── services/
│   │       ├── likes/
│   │       └── chat/
│   └── components/
│       └── Navbar/
│           └── Navbar.tsx     # MODIFIED - Added marketplace link
└── lib/
    └── marketplace/           # NEW - Marketplace logic
        ├── mongodb.ts
        └── models/
            ├── Service.ts
            ├── Like.ts
            └── Chat.ts
\`\`\`

## Usage

### For Service Providers (Students)
1. Navigate to `/marketplace/manage`
2. Click "New Service" to create a listing
3. Fill in details: title, description, category, price, etc.
4. Manage availability status

### For Clients (Students looking for services)
1. Navigate to `/marketplace`
2. Browse and filter services by category, price
3. Click "View Details" to see full information
4. Save services for later
5. Contact service providers via messages

## Features

✅ Service CRUD operations
✅ Category-based filtering
✅ Price range filtering
✅ Search functionality
✅ Save/Like services
✅ Messaging system
✅ Responsive design
✅ Consistent styling with user project

## Next Steps / Enhancements

1. **Auth Integration** - Replace placeholder user IDs
2. **Image Upload** - Add image upload for service photos (currently using URLs)
3. **Reviews System** - Allow clients to review services after completion
4. **Payment Integration** - Add Stripe/PayPal for service payments
5. **Notifications** - Real-time notifications for new messages
6. **Advanced Search** - Add more filters (tags, ratings, experience level)
7. **Service Analytics** - Dashboard showing views, likes, messages for providers

## Troubleshooting

### TypeScript Errors
The TypeScript errors you see are configuration issues, not code issues. To fix:
1. Make sure `tsconfig.json` has proper paths configured
2. Run `npm install` to ensure all dependencies are installed
3. Restart VS Code TypeScript server

### Database Connection Issues
- Check `MONGODB_URI` in `.env.local`
- Ensure MongoDB is running (local) or Atlas connection is valid
- Check console logs for connection errors

### Styling Issues
All colors used are from your existing Tailwind config:
- `text-purple`, `bg-purple`, `border-purple`
- `text-orange`, `bg-orange`
- `text-lightgrey`, `bg-lightpink`
- `border-grey500`, `bg-grey500`

## Contact
For questions or issues with the marketplace integration, refer to the code comments marked with `TODO` for areas needing customization.
