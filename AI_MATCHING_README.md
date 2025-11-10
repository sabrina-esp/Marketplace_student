# 🤖 AI/NLP Matching System

## Overview
The matching system uses **AI and Natural Language Processing (NLP)** to analyze user profiles and calculate compatibility scores between users.

## How It Works

### 1. **Data Collection**
Users provide:
- **Subjects** (e.g., "JavaScript", "React", "Node.js") - up to 10
- **Interests** (e.g., "Web Development", "AI", "Design") - up to 15
- **Bio** - Free text description
- **Level** - Beginner, Intermediate, Advanced, Expert

### 2. **AI Compatibility Algorithm**

The system calculates a **0-100% compatibility score** based on 4 factors:

#### A. Subject Overlap (40% weight)
- Uses **Jaccard Similarity** to compare subject arrays
- Formula: `intersection / union * 100`
- Example: User A [JS, Python, AI] + User B [Python, AI, ML] = 50% match

#### B. Interest Similarity (30% weight)
- Same Jaccard algorithm for interests
- Rewards common interests and passions

#### C. Bio NLP Analysis (20% weight)
- **Tokenization**: Splits text into words, removes punctuation
- **Stop Words**: Filters out short words (<4 chars)
- **Word Frequency**: Calculates term frequency
- **Cosine Similarity**: Measures text similarity
- **Keyword Bonus**: Detects education keywords (learn, code, develop, etc.)
- Awards +5 points per common education keyword

#### D. Level Compatibility (10% weight)
- Matches similar skill levels
- Score: 100 (same), 75 (±1 level), 50 (±2), 25 (±3)

### 3. **NLP Techniques Used**

```javascript
// Text Tokenization
"I love coding!" → ["love", "coding"]

// Word Frequency
["learn", "code", "learn"] → { learn: 2, code: 1 }

// Jaccard Similarity
Set1 = {A, B, C}
Set2 = {B, C, D}
Intersection = {B, C} = 2
Union = {A, B, C, D} = 4
Similarity = 2/4 = 50%
```

### 4. **Smart Sorting**
- Fetches 50 potential profiles
- Calculates compatibility for each
- Sorts by score (highest first)
- Returns top 20 best matches

## Example Calculation

```
User A:
- Subjects: [JavaScript, React, Node.js]
- Interests: [Web Dev, UI/UX, Coding]
- Bio: "Passionate developer learning React"
- Level: Intermediate

User B:
- Subjects: [JavaScript, Vue, Node.js]
- Interests: [Web Dev, Design, Coding]
- Bio: "Love building web apps and learning"
- Level: Intermediate

Calculation:
1. Subjects: 2/4 common = 50% × 40% = 20 points
2. Interests: 2/3 common = 66% × 30% = 20 points
3. Bio NLP: Common words (learn, web, coding) = 60% × 20% = 12 points
4. Level: Same level = 100% × 10% = 10 points

Total: 62% Compatibility ✨
```

## Match Explanation

The system generates human-readable explanations:
- "Sujets communs: JavaScript, Node.js"
- "Intérêts communs: Web Dev, Coding"
- "Même niveau: Intermediate"

## UI Features

### Profile Card Shows:
- ✨ **AI Compatibility Badge** (e.g., "85%")
- 🤖 **Match Reason** (why you match)
- 📚 **Subject Tags** (purple badges)
- 💡 **Interest Tags** (pink badges)
- 🎯 **Skill Level** (badge)

## Future AI Enhancements

### Possible Improvements:
1. **TensorFlow.js** - Neural network for deeper analysis
2. **Sentiment Analysis** - Analyze bio tone/mood
3. **Learning Style** - Visual vs. Practical learners
4. **Collaborative Filtering** - "Users like you also matched with..."
5. **Time-based** - When both users are active
6. **Location** - Proximity matching
7. **Goals Alignment** - Career goals similarity

### Advanced NLP:
- **TF-IDF** (Term Frequency-Inverse Document Frequency)
- **Word2Vec** - Semantic word similarity
- **BERT** - Context-aware text understanding
- **Topic Modeling** - Extract hidden topics from bios

## API Usage

### Get AI-Sorted Matches
```javascript
GET /api/match/potentials
Authorization: Bearer <token>

Response:
{
  "success": true,
  "potentials": [
    {
      "id": "...",
      "name": "John",
      "compatibilityScore": 85,
      "matchReason": "Sujets communs: React, Node.js",
      "subjects": ["React", "Node.js"],
      "interests": ["Coding", "Web Dev"],
      "level": "Intermediate"
    }
  ],
  "message": "🤖 Profils triés par IA"
}
```

## Technologies

- **Algorithm**: Jaccard Similarity, Cosine Similarity
- **NLP**: Tokenization, Word Frequency, Keyword Detection
- **Language**: JavaScript (Node.js)
- **No External AI**: Pure algorithmic approach (lightweight, fast, privacy-focused)

## Benefits

✅ **Fast** - No API calls, runs server-side  
✅ **Privacy** - Data stays in your database  
✅ **Accurate** - Multi-factor scoring  
✅ **Explainable** - Shows why users match  
✅ **Scalable** - Can handle thousands of users  

## Testing the System

1. Add subjects and interests to your profile
2. View Match page - see AI compatibility scores
3. Higher scores = better matches
4. Swipe right on compatible profiles!

---

**Built with ❤️ using AI/NLP algorithms**
