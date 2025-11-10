# 💖 Match System - Tinder-Style Profile Matching

## Architecture Overview

This implementation follows the full-stack architecture pattern with clear separation between backend models, API routes, and frontend UI.

---

## 🗄️ Backend Structure

### Models (`/lib/models/`)

#### 1. **User.js** (Existing)
- Base user model with profile information
- Fields: `email`, `password`, `name`, `phone`, `bio`, `avatar`, etc.

#### 2. **Like.js** (New)
```javascript
{
  from: ObjectId,      // User who swiped
  to: ObjectId,        // User who was swiped on
  action: String,      // 'like' or 'dislike'
  mutual: Boolean,     // true if both users liked each other
  timestamps: true
}
```

#### 3. **Match.js** (New)
```javascript
{
  users: [ObjectId],   // Array of 2 user IDs (sorted)
  metadata: Object,    // Additional match data
  timestamps: true
}
```

---

## 🔌 API Routes (`/app/api/match/`)

### 1. **GET /api/match/potentials**
**Purpose:** Fetch profiles to swipe on (excluding already swiped users)

**Authentication:** Required (JWT token)

**Response:**
```json
{
  "success": true,
  "potentials": [
    {
      "id": "user123",
      "name": "Marie Dubois",
      "email": "marie@example.com",
      "bio": "Étudiante en marketing",
      "avatar": "url...",
      "createdAt": "2025-01-01"
    }
  ]
}
```

**Logic:**
1. Get all user IDs that current user already swiped (from `Like` collection)
2. Query users excluding:
   - Current user
   - Already swiped users
3. Return up to 20 potential profiles

---

### 2. **POST /api/match/swipe**
**Purpose:** Swipe right (like) or left (dislike) on a profile

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "targetUserId": "user456",
  "action": "like"  // or "dislike"
}
```

**Response:**
```json
{
  "success": true,
  "action": "like",
  "isMatch": true,
  "message": "C'est un match ! 🎉"
}
```

**Logic:**
1. Validate action and target user
2. Check if user already swiped on this profile
3. Create `Like` record
4. If action is "like":
   - Check if target user also liked current user
   - If mutual like found:
     - Update both `Like` records to `mutual: true`
     - Create `Match` record
     - Return `isMatch: true`
5. Return success response

---

### 3. **GET /api/match/list**
**Purpose:** Get all matches for the current user

**Authentication:** Required (JWT token)

**Response:**
```json
{
  "success": true,
  "matches": [
    {
      "matchId": "match789",
      "matchedAt": "2025-11-09",
      "user": {
        "id": "user456",
        "name": "Sophie Martin",
        "email": "sophie@example.com",
        "bio": "Designer créative",
        "avatar": "url...",
        "createdAt": "2025-01-15"
      }
    }
  ],
  "count": 1
}
```

**Logic:**
1. Find all `Match` records where current user is in the `users` array
2. Populate user details
3. Format response to show the other user in each match
4. Sort by creation date (newest first)

---

## 🎨 Frontend UI (`/app/match/page.tsx`)

### Design: Tinder-Style Card Interface

#### Features:

1. **Swipe Cards**
   - Large profile card with image/avatar
   - User name, email, bio displayed
   - Gradient overlay for better text readability

2. **Action Buttons**
   - ❌ **X Button (Red/White)** - Dislike
   - ❤️ **Heart Button (Pink/Red gradient)** - Like
   - Animated hover and click effects

3. **Match Modal**
   - Pops up when mutual like is detected
   - Shows "🎉 C'est un Match!"
   - Displays matched user's info
   - Auto-dismisses after 3 seconds

4. **Two Views:**
   - **Swipe View:** Discover new profiles
   - **Matches View:** See all your matches

5. **Progress Counter**
   - Shows current position (e.g., "5 / 20")

6. **Empty States**
   - No more profiles message
   - No matches yet message

---

## 🔄 Data Flow

### Swiping Flow:
```
User clicks ❤️ → POST /api/match/swipe
                  ↓
            Create Like record
                  ↓
         Check for reverse like
                  ↓
        YES → Create Match record
              Show match modal
              ↓
        NO → Just save like
              ↓
        Move to next profile
```

### Loading Flow:
```
Page Load → GET /api/match/potentials
            ↓
       Load profile cards
            +
       GET /api/match/list
            ↓
       Load matches count
```

---

## 🎯 Key Features

### 1. **No Duplicates**
- Users can only swipe once per profile
- Already swiped users are excluded from potentials

### 2. **Mutual Matching**
- Match only created when both users like each other
- `mutual` flag tracks this in `Like` records

### 3. **Sorted Matches**
- `Match.users` array is always sorted
- Prevents duplicate match records

### 4. **Real-time Feedback**
- Loading states during API calls
- Disabled buttons during swipe action
- Animated transitions

### 5. **Responsive Design**
- Mobile-first approach
- Touch-friendly button sizes
- Gradient backgrounds

---

## 🚀 Usage

### Navigate to Match Page:
```
/match
```

### From Dashboard:
Add a link/button to navigate to `/match`

Example:
```tsx
<Link href="/match">
  <button className="...">
    💖 Découvrir des Profils
  </button>
</Link>
```

---

## 🔐 Security

- All routes require JWT authentication
- User can't swipe on themselves
- Validation prevents invalid actions
- MongoDB ObjectId validation

---

## 📊 Database Collections

### Likes Collection Example:
```json
{
  "_id": "...",
  "from": "userId1",
  "to": "userId2",
  "action": "like",
  "mutual": false,
  "createdAt": "2025-11-09T...",
  "updatedAt": "2025-11-09T..."
}
```

### Matches Collection Example:
```json
{
  "_id": "...",
  "users": ["userId1", "userId2"],  // Sorted array
  "metadata": {},
  "createdAt": "2025-11-09T...",
  "updatedAt": "2025-11-09T..."
}
```

---

## 🎨 UI Components Breakdown

### Card Component:
- Profile image with gradient overlay
- Name and email at bottom
- Bio section below image

### Button Components:
- Dislike: White background, red X icon
- Like: Pink-to-red gradient, white heart icon
- Both have hover scale and active scale animations

### Modal Component:
- Centered overlay with backdrop
- Bouncing celebration emoji
- Animated scale-in effect
- Auto-dismiss timer

---

## 🧪 Testing

### Test Scenarios:

1. **Like a user who hasn't liked you back**
   - Should create like record only
   - No match created
   - Move to next profile

2. **Like a user who already liked you**
   - Should create match record
   - Update both likes to mutual
   - Show match modal
   - Add to matches list

3. **Dislike a user**
   - Create dislike record
   - No match check
   - Move to next profile
   - User excluded from future potentials

4. **View matches**
   - Switch to matches view
   - See all mutual matches
   - Click to view profile details

5. **Empty states**
   - No more profiles to swipe
   - No matches yet

---

## 📈 Future Enhancements

1. **Filters**
   - Filter potentials by criteria (age, location, interests)

2. **Undo**
   - Allow users to undo last swipe

3. **Super Like**
   - Special like that notifies the other user

4. **Chat**
   - Add messaging between matched users

5. **Analytics**
   - Track swipe patterns
   - Show match rate statistics

6. **Recommendations**
   - ML-based profile recommendations

---

## 🎉 Summary

This match system provides a complete Tinder-style experience with:
- ✅ Swipeable profile cards with beautiful UI
- ✅ Like/Dislike functionality
- ✅ Mutual match detection
- ✅ Match list view
- ✅ Animated interactions
- ✅ Mobile-responsive design
- ✅ Secure JWT authentication
- ✅ Clean backend architecture

The system is production-ready and can be extended with additional features like chat, filters, and recommendations.
