# 🧪 Testing the AI Matching System

## Quick Test Flow

### Step 1: Update Your Profile with Subjects/Interests

First, you need to add subjects and interests to user profiles in the database.

**Option A: Using MongoDB Compass/Shell**
```javascript
// Connect to your MongoDB
db.users.updateOne(
  { email: "your-email@example.com" },
  { 
    $set: { 
      subjects: ["JavaScript", "React", "Node.js", "MongoDB"],
      interests: ["Web Development", "AI", "Coding", "Teaching"],
      level: "Intermediate",
      bio: "Passionate developer learning React and building cool projects"
    }
  }
)

// Add test users with different profiles
db.users.insertMany([
  {
    email: "test1@example.com",
    password: "$2a$10$hashedpassword", // Use bcrypt hash
    name: "Alice Developer",
    subjects: ["JavaScript", "React", "TypeScript"],
    interests: ["Web Development", "UI/UX", "Coding"],
    level: "Advanced",
    bio: "Love building modern web applications with React",
    isVerified: true,
    isEmailVerified: true
  },
  {
    email: "test2@example.com",
    password: "$2a$10$hashedpassword",
    name: "Bob Coder",
    subjects: ["Python", "Django", "Flask"],
    interests: ["Backend", "API Design", "Databases"],
    level: "Intermediate",
    bio: "Backend developer passionate about Python and APIs",
    isVerified: true,
    isEmailVerified: true
  },
  {
    email: "test3@example.com",
    password: "$2a$10$hashedpassword",
    name: "Carol Designer",
    subjects: ["JavaScript", "Vue.js", "CSS"],
    interests: ["Web Development", "Design", "Frontend"],
    level: "Intermediate",
    bio: "Frontend developer with a passion for beautiful UIs",
    isVerified: true,
    isEmailVerified: true
  }
])
```

**Option B: Create an API endpoint to update profile**

I'll create a quick update endpoint:

```javascript
// Use the existing /api/profile/update endpoint
// Or create a new one for testing
```

### Step 2: Test the API Directly

Open your browser console or use Postman:

```javascript
// Get your JWT token from localStorage
const token = localStorage.getItem('token');

// Test the potentials endpoint
fetch('http://localhost:3011/api/match/potentials', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(r => r.json())
.then(data => {
  console.log('🤖 AI Matching Results:', data);
  console.table(data.potentials.map(p => ({
    name: p.name,
    score: p.compatibilityScore + '%',
    reason: p.matchReason
  })));
});
```

### Step 3: Test in the UI

1. **Login** to your account at `http://localhost:3011`
2. Navigate to **Match** page (`http://localhost:3011/match`)
3. You should see:
   - Profile cards sorted by AI compatibility
   - **Compatibility score badge** (e.g., "85%") on each card
   - **AI Match reason** showing common subjects/interests
   - **Subject tags** (purple) and **Interest tags** (pink)

### Step 4: Verify AI Scoring

Check the console logs to see compatibility calculations:

```javascript
// Add this temporarily to MatchingService.js for debugging
static calculateCompatibility(user1, user2) {
  console.log('🔍 Calculating compatibility for:', user2.name);
  
  let score = 0;
  // ... existing code ...
  
  console.log({
    subjectScore,
    interestScore,
    bioScore,
    levelScore,
    totalScore: score
  });
  
  return Math.round(score);
}
```

## Test Scenarios

### Scenario 1: High Compatibility Match
```javascript
User A:
- Subjects: ["JavaScript", "React", "Node.js"]
- Interests: ["Web Dev", "Coding", "Teaching"]
- Level: "Intermediate"
- Bio: "Love coding and building web apps"

User B (Should match ~80%+):
- Subjects: ["JavaScript", "React", "TypeScript"]
- Interests: ["Web Dev", "Coding", "Frontend"]
- Level: "Intermediate"
- Bio: "Passionate about web development and React"

Expected:
- High subject overlap (3/4 = 75%)
- High interest overlap (2/3 = 66%)
- Similar bio keywords (web, coding, react)
- Same level (100%)
- Total: ~75-85%
```

### Scenario 2: Medium Compatibility
```javascript
User A:
- Subjects: ["JavaScript", "React", "Node.js"]
- Interests: ["Web Dev", "Coding"]
- Level: "Intermediate"

User C (Should match ~50-60%):
- Subjects: ["Python", "Django"]
- Interests: ["Backend", "Coding"]
- Level: "Advanced"

Expected:
- Low subject overlap (0/5 = 0%)
- Some interest overlap (1/3 = 33%)
- Different level (75%)
- Total: ~40-50%
```

### Scenario 3: Low Compatibility
```javascript
User A:
- Subjects: ["JavaScript", "React"]
- Interests: ["Web Dev", "Frontend"]
- Level: "Beginner"

User D (Should match <30%):
- Subjects: ["Java", "Spring", "Android"]
- Interests: ["Mobile", "Backend", "Enterprise"]
- Level: "Expert"

Expected:
- No subject overlap (0%)
- No interest overlap (0%)
- Large level difference (25%)
- Total: ~20-30%
```

## Visual Test Checklist

When you open `/match`, verify:

- [ ] Cards are sorted with highest compatibility first
- [ ] Each card shows compatibility percentage badge
- [ ] AI match reason appears (e.g., "Sujets communs: React, JS")
- [ ] Subject tags are displayed (purple)
- [ ] Interest tags are displayed (pink)
- [ ] Level badge shows correctly
- [ ] Swipe functionality still works
- [ ] Match modal appears on mutual likes

## Database Verification

Check MongoDB to confirm data is saved:

```javascript
// Check if Like is created on swipe
db.likes.find({ from: ObjectId("your-user-id") })

// Check if Match is created on mutual like
db.matches.find({ users: { $in: [ObjectId("your-user-id")] } })

// Verify user has subjects/interests
db.users.findOne({ _id: ObjectId("your-user-id") })
```

## Console Tests

Add these logs to debug:

```javascript
// In potentials route.js
console.log('Current User Profile:', {
  bio: currentUser.bio,
  subjects: currentUser.subjects,
  interests: currentUser.interests,
  level: currentUser.level
});

console.log('Sorted Potentials:', sortedPotentials.map(p => ({
  name: p.name,
  score: p.compatibilityScore,
  reason: p.matchReason
})));
```

## API Test Script

Run this in browser console:

```javascript
async function testAIMatching() {
  const token = localStorage.getItem('token');
  
  console.log('🧪 Testing AI Matching System...\n');
  
  // 1. Get potentials
  const res = await fetch('/api/match/potentials', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await res.json();
  
  if (!data.success) {
    console.error('❌ Error:', data.message);
    return;
  }
  
  console.log('✅ Success! Got', data.potentials.length, 'matches\n');
  
  // Display results
  console.table(data.potentials.map(p => ({
    Name: p.name,
    'AI Score': p.compatibilityScore + '%',
    'Match Reason': p.matchReason,
    Level: p.level,
    Subjects: p.subjects?.join(', ') || 'None'
  })));
  
  // Calculate average score
  const avgScore = Math.round(
    data.potentials.reduce((sum, p) => sum + p.compatibilityScore, 0) / 
    data.potentials.length
  );
  
  console.log('\n📊 Statistics:');
  console.log('Average Compatibility:', avgScore + '%');
  console.log('Highest Match:', Math.max(...data.potentials.map(p => p.compatibilityScore)) + '%');
  console.log('Lowest Match:', Math.min(...data.potentials.map(p => p.compatibilityScore)) + '%');
}

testAIMatching();
```

## Expected Output

When everything works, you should see:

```
🧪 Testing AI Matching System...

✅ Success! Got 10 matches

┌─────────┬──────────────────┬──────────┬────────────────────────────┬──────────────┬─────────────────────┐
│ (index) │       Name       │ AI Score │       Match Reason         │    Level     │      Subjects       │
├─────────┼──────────────────┼──────────┼────────────────────────────┼──────────────┼─────────────────────┤
│    0    │ 'Alice Developer'│  '85%'   │ 'Sujets communs: JS, React'│'Intermediate'│'JavaScript, React'  │
│    1    │ 'Carol Designer' │  '72%'   │ 'Intérêts communs: Web Dev'│'Intermediate'│'JavaScript, Vue.js' │
│    2    │ 'Bob Coder'      │  '45%'   │ 'Même niveau: Intermediate'│'Intermediate'│'Python, Django'     │
└─────────┴──────────────────┴──────────┴────────────────────────────┴──────────────┴─────────────────────┘

📊 Statistics:
Average Compatibility: 67%
Highest Match: 85%
Lowest Match: 45%
```

## Troubleshooting

### Issue: All scores are 0% or very low
- **Fix**: Make sure users have subjects/interests in database
- Check: `db.users.findOne({ email: "your@email.com" })`

### Issue: No potentials returned
- **Fix**: Create more test users in database
- **Fix**: Make sure they're verified: `isEmailVerified: true`

### Issue: Compatibility score not showing on UI
- **Fix**: Check browser console for errors
- **Fix**: Verify API returns `compatibilityScore` field

### Issue: MatchingService import error
- **Fix**: Check file path is correct
- **Fix**: Restart dev server: `npm run dev`

## Production Testing

Before deploying:

1. [ ] Test with 50+ users
2. [ ] Verify performance (should be <100ms per calculation)
3. [ ] Test edge cases (empty subjects, no bio, etc.)
4. [ ] Verify swipe → match flow works
5. [ ] Check mobile responsiveness
6. [ ] Test with real user data

---

**Ready to test? Start with Step 1!** 🚀
