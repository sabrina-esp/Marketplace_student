# Testing Guide - Matching Service

## Quick Start

### Run All Tests
```bash
node lib/services/MatchingService.test.js
```

### Run in Browser Console
```javascript
import { runAllTests } from './lib/services/MatchingService.test.js';
runAllTests();
```

## Test Coverage

### 1. Basic Compatibility Testing
- Tests pairwise user matching
- Validates scoring algorithm
- Checks explanation generation

### 2. Sorting & Ranking
- Tests compatibility-based sorting
- Validates ranking logic
- Checks multiple user comparisons

### 3. System Analysis
- Overall system statistics
- Score distribution analysis
- Subject/Interest trending
- Level distribution metrics

### 4. User-Specific Stats
- Individual user matching stats
- Best match identification
- Match quality distribution

### 5. Issue Detection
- Low compatibility detection
- Level imbalance identification
- Diversity checks

### 6. Recommendations
- System improvement suggestions
- Automated insights

### 7. Edge Cases
- Empty profiles
- Single user scenarios
- Missing data handling

## Example Usage in Your App

```javascript
import MatchingService from './lib/services/MatchingService.js';

// Get all users from your database
const users = await getUsersFromDatabase();

// Find matches for current user
const currentUser = getCurrentUser();
const otherUsers = users.filter(u => u.id !== currentUser.id);
const matches = MatchingService.sortByCompatibility(currentUser, otherUsers);

// Display top 5 matches
const topMatches = matches.slice(0, 5);

// Get system analytics (admin dashboard)
const systemAnalysis = MatchingService.analyzeMatchingSystem(users);
const issues = MatchingService.identifyMatchingIssues(users);
const recommendations = MatchingService.getSystemRecommendations(users);

// Get user-specific insights
const userStats = MatchingService.getUserMatchingStats(currentUser, users);
```

## Expected Output

```
╔════════════════════════════════════════╗
║   MATCHING SERVICE TEST SUITE          ║
╚════════════════════════════════════════╝

=== TEST 1: Basic Compatibility ===
Alice <-> Bob
Compatibility Score: 68%
Reason: Sujets communs: computer science, mathematics • Intérêts communs: coding
✅ Test passed

...
```

## Integration with Your App

1. **User Profile Page**: Show compatibility with other users
2. **Match Feed**: Display sorted matches with scores
3. **Admin Dashboard**: Show system analysis and health
4. **User Insights**: Show personal matching statistics

## API Endpoints Examples

```javascript
// GET /api/matches/:userId
app.get('/api/matches/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId);
  const allUsers = await User.find();
  const matches = MatchingService.sortByCompatibility(user, allUsers);
  res.json(matches.slice(0, 20));
});

// GET /api/admin/system-analysis
app.get('/api/admin/system-analysis', async (req, res) => {
  const users = await User.find();
  const analysis = MatchingService.analyzeMatchingSystem(users);
  res.json(analysis);
});

// GET /api/user/:userId/stats
app.get('/api/user/:userId/stats', async (req, res) => {
  const user = await User.findById(req.params.userId);
  const allUsers = await User.find();
  const stats = MatchingService.getUserMatchingStats(user, allUsers);
  res.json(stats);
});
```
