/**
 * AI/NLP-based Matching Service
 * Calculates compatibility scores between users based on:
 * - Subjects overlap
 * - Interests similarity
 * - Bio text analysis (NLP)
 * - Skill level compatibility
 */

class MatchingService {
  /**
   * Calculate compatibility score between two users
   * @param {Object} user1 - Current user profile
   * @param {Object} user2 - Target user profile
   * @returns {number} - Compatibility score (0-100)
   */
  static calculateCompatibility(user1, user2) {
    let score = 0;
    let weights = {
      subjects: 40,      // 40% weight
      interests: 30,     // 30% weight
      bio: 20,          // 20% weight (NLP)
      level: 10         // 10% weight
    };

    // 1. Subject Overlap Score (40%)
    const subjectScore = this.calculateArrayOverlap(
      user1.subjects || [],
      user2.subjects || []
    );
    score += subjectScore * (weights.subjects / 100);

    // 2. Interest Similarity Score (30%)
    const interestScore = this.calculateArrayOverlap(
      user1.interests || [],
      user2.interests || []
    );
    score += interestScore * (weights.interests / 100);

    // 3. Bio NLP Analysis (20%)
    const bioScore = this.analyzeBioSimilarity(
      user1.bio || '',
      user2.bio || ''
    );
    score += bioScore * (weights.bio / 100);

    // 4. Level Compatibility (10%)
    const levelScore = this.calculateLevelCompatibility(
      user1.level || 'Beginner',
      user2.level || 'Beginner'
    );
    score += levelScore * (weights.level / 100);

    return Math.round(score);
  }

  /**
   * Calculate overlap percentage between two arrays
   */
  static calculateArrayOverlap(arr1, arr2) {
    if (arr1.length === 0 && arr2.length === 0) return 50; // Neutral score
    if (arr1.length === 0 || arr2.length === 0) return 0;

    const set1 = new Set(arr1.map(item => item.toLowerCase()));
    const set2 = new Set(arr2.map(item => item.toLowerCase()));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    // Jaccard similarity
    const similarity = (intersection.size / union.size) * 100;
    
    return Math.round(similarity);
  }

  /**
   * Simple NLP: Analyze bio text similarity
   * Uses word frequency and common keywords
   */
  static analyzeBioSimilarity(bio1, bio2) {
    if (!bio1 || !bio2) return 30; // Neutral score if missing

    // Tokenize: remove punctuation, lowercase, split
    const tokenize = (text) => {
      return text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3); // Filter short words
    };

    const tokens1 = tokenize(bio1);
    const tokens2 = tokenize(bio2);

    if (tokens1.length === 0 || tokens2.length === 0) return 30;

    // Calculate word frequency
    const getWordFreq = (tokens) => {
      const freq = {};
      tokens.forEach(token => {
        freq[token] = (freq[token] || 0) + 1;
      });
      return freq;
    };

    const freq1 = getWordFreq(tokens1);
    const freq2 = getWordFreq(tokens2);

    // Calculate cosine similarity (simplified)
    const commonWords = new Set([...tokens1].filter(w => tokens2.includes(w)));
    
    if (commonWords.size === 0) return 20; // Low similarity

    // Score based on common word ratio
    const avgLength = (tokens1.length + tokens2.length) / 2;
    const similarity = (commonWords.size / avgLength) * 100;

    // Bonus for education-related keywords
    const educationKeywords = [
      'learn', 'study', 'develop', 'skill', 'course', 'knowledge',
      'passion', 'experience', 'practice', 'mentor', 'teach', 'code',
      'programming', 'design', 'business', 'data', 'science'
    ];

    let bonusScore = 0;
    educationKeywords.forEach(keyword => {
      if (freq1[keyword] && freq2[keyword]) {
        bonusScore += 5;
      }
    });

    return Math.min(100, Math.round(similarity + bonusScore));
  }

  /**
   * Calculate level compatibility
   * Similar levels get higher scores
   */
  static calculateLevelCompatibility(level1, level2) {
    const levels = {
      'Beginner': 1,
      'Intermediate': 2,
      'Advanced': 3,
      'Expert': 4
    };

    const l1 = levels[level1] || 1;
    const l2 = levels[level2] || 1;
    
    const difference = Math.abs(l1 - l2);

    // Score based on difference
    // 0 diff = 100, 1 diff = 75, 2 diff = 50, 3 diff = 25
    const score = Math.max(0, 100 - (difference * 25));
    
    return score;
  }

  /**
   * Get match explanation (why they match)
   */
  static getMatchExplanation(user1, user2) {
    const commonSubjects = this.getCommonItems(
      user1.subjects || [],
      user2.subjects || []
    );
    const commonInterests = this.getCommonItems(
      user1.interests || [],
      user2.interests || []
    );

    const reasons = [];

    if (commonSubjects.length > 0) {
      reasons.push(`Sujets communs: ${commonSubjects.slice(0, 3).join(', ')}`);
    }

    if (commonInterests.length > 0) {
      reasons.push(`Intérêts communs: ${commonInterests.slice(0, 3).join(', ')}`);
    }

    if (user1.level === user2.level) {
      reasons.push(`Même niveau: ${user1.level}`);
    }

    return reasons.length > 0 
      ? reasons.join(' • ') 
      : 'Profils complémentaires';
  }

  /**
   * Get common items between two arrays
   */
  static getCommonItems(arr1, arr2) {
    const set1 = new Set(arr1.map(item => item.toLowerCase()));
    const set2 = new Set(arr2.map(item => item.toLowerCase()));
    return [...set1].filter(x => set2.has(x));
  }

  /**
   * Sort users by compatibility score
   */
  static sortByCompatibility(currentUser, users) {
    return users
      .map(user => ({
        ...user,
        compatibilityScore: this.calculateCompatibility(currentUser, user),
        matchReason: this.getMatchExplanation(currentUser, user)
      }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }

  /**
   * SYSTEM ANALYSIS METHODS
   */

  /**
   * Analyze overall matching statistics for a user pool
   * @param {Array} users - Array of all users
   * @returns {Object} - System analysis statistics
   */
  static analyzeMatchingSystem(users) {
    if (!users || users.length < 2) {
      return {
        totalUsers: users?.length || 0,
        error: 'Insufficient users for analysis'
      };
    }

    const scores = [];
    const subjectFrequency = {};
    const interestFrequency = {};
    const levelDistribution = {};

    // Calculate all pairwise compatibility scores
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const score = this.calculateCompatibility(users[i], users[j]);
        scores.push(score);
      }

      // Track subject frequency
      (users[i].subjects || []).forEach(subject => {
        subjectFrequency[subject] = (subjectFrequency[subject] || 0) + 1;
      });

      // Track interest frequency
      (users[i].interests || []).forEach(interest => {
        interestFrequency[interest] = (interestFrequency[interest] || 0) + 1;
      });

      // Track level distribution
      const level = users[i].level || 'Beginner';
      levelDistribution[level] = (levelDistribution[level] || 0) + 1;
    }

    // Calculate statistics
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const medianScore = this.calculateMedian(scores);

    return {
      totalUsers: users.length,
      totalComparisons: scores.length,
      averageCompatibility: Math.round(avgScore),
      medianCompatibility: Math.round(medianScore),
      minCompatibility: minScore,
      maxCompatibility: maxScore,
      scoreDistribution: this.getScoreDistribution(scores),
      topSubjects: this.getTopItems(subjectFrequency, 10),
      topInterests: this.getTopItems(interestFrequency, 10),
      levelDistribution: levelDistribution,
      matchQuality: this.assessMatchQuality(avgScore)
    };
  }

  /**
   * Get compatibility statistics for a specific user
   * @param {Object} user - Target user
   * @param {Array} allUsers - All users in the system
   * @returns {Object} - User-specific statistics
   */
  static getUserMatchingStats(user, allUsers) {
    const otherUsers = allUsers.filter(u => u.id !== user.id);
    
    if (otherUsers.length === 0) {
      return { error: 'No other users to compare' };
    }

    const matches = otherUsers.map(otherUser => ({
      user: otherUser,
      score: this.calculateCompatibility(user, otherUser)
    }));

    const scores = matches.map(m => m.score);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    const highMatches = matches.filter(m => m.score >= 70).length;
    const mediumMatches = matches.filter(m => m.score >= 40 && m.score < 70).length;
    const lowMatches = matches.filter(m => m.score < 40).length;

    return {
      userId: user.id,
      totalPotentialMatches: otherUsers.length,
      averageCompatibility: Math.round(avgScore),
      bestMatch: matches.sort((a, b) => b.score - a.score)[0],
      matchDistribution: {
        high: highMatches,
        medium: mediumMatches,
        low: lowMatches
      },
      matchPercentage: {
        high: Math.round((highMatches / otherUsers.length) * 100),
        medium: Math.round((mediumMatches / otherUsers.length) * 100),
        low: Math.round((lowMatches / otherUsers.length) * 100)
      }
    };
  }

  /**
   * Calculate median from array of numbers
   */
  static calculateMedian(numbers) {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  /**
   * Get score distribution by ranges
   */
  static getScoreDistribution(scores) {
    const ranges = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0
    };

    scores.forEach(score => {
      if (score <= 20) ranges['0-20']++;
      else if (score <= 40) ranges['21-40']++;
      else if (score <= 60) ranges['41-60']++;
      else if (score <= 80) ranges['61-80']++;
      else ranges['81-100']++;
    });

    return ranges;
  }

  /**
   * Get top N items from frequency object
   */
  static getTopItems(frequencyObj, limit = 10) {
    return Object.entries(frequencyObj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([item, count]) => ({ item, count }));
  }

  /**
   * Assess overall match quality
   */
  static assessMatchQuality(avgScore) {
    if (avgScore >= 70) return 'Excellent';
    if (avgScore >= 50) return 'Good';
    if (avgScore >= 30) return 'Fair';
    return 'Poor';
  }

  /**
   * Identify potential matching issues in the system
   * @param {Array} users - All users
   * @returns {Array} - List of identified issues
   */
  static identifyMatchingIssues(users) {
    const issues = [];
    const analysis = this.analyzeMatchingSystem(users);

    if (analysis.error) {
      return [{ type: 'error', message: analysis.error }];
    }

    // Check if average compatibility is too low
    if (analysis.averageCompatibility < 30) {
      issues.push({
        type: 'low_compatibility',
        severity: 'high',
        message: 'Average compatibility is very low. User profiles may be too diverse.'
      });
    }

    // Check for level imbalance
    const levelCounts = Object.values(analysis.levelDistribution);
    const maxLevel = Math.max(...levelCounts);
    const minLevel = Math.min(...levelCounts);
    if (maxLevel > minLevel * 3) {
      issues.push({
        type: 'level_imbalance',
        severity: 'medium',
        message: 'Significant imbalance in user skill levels.'
      });
    }

    // Check for subject diversity
    if (analysis.topSubjects.length < 3) {
      issues.push({
        type: 'low_diversity',
        severity: 'medium',
        message: 'Limited subject diversity among users.'
      });
    }

    if (issues.length === 0) {
      issues.push({
        type: 'healthy',
        severity: 'info',
        message: 'Matching system is functioning well.'
      });
    }

    return issues;
  }

  /**
   * Generate matching recommendations for system improvement
   * @param {Array} users - All users
   * @returns {Array} - List of recommendations
   */
  static getSystemRecommendations(users) {
    const analysis = this.analyzeMatchingSystem(users);
    const recommendations = [];

    if (analysis.error) {
      recommendations.push('Recruit more users to enable effective matching.');
      return recommendations;
    }

    if (analysis.averageCompatibility < 40) {
      recommendations.push('Consider adjusting matching weights or expanding user profile fields.');
    }

    if (analysis.topSubjects.length > 0) {
      const topSubject = analysis.topSubjects[0];
      if (topSubject.count > users.length * 0.7) {
        recommendations.push(`${topSubject.item} is dominant. Encourage diversity in subject selection.`);
      }
    }

    const levelValues = Object.values(analysis.levelDistribution);
    if (levelValues.some(count => count < 2)) {
      recommendations.push('Some skill levels have very few users. Balance recruitment efforts.');
    }

    if (recommendations.length === 0) {
      recommendations.push('System is well-balanced. Continue monitoring user engagement.');
    }

    return recommendations;
  }
}

export default MatchingService;
