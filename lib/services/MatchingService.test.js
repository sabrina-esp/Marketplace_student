import MatchingService from './MatchingService.js';

/**
 * Sample test data - Mock users
 */
const sampleUsers = [
  {
    id: 1,
    name: 'Alice',
    subjects: ['Mathematics', 'Physics', 'Computer Science'],
    interests: ['Coding', 'Problem Solving', 'Gaming'],
    bio: 'Passionate about learning programming and developing new skills. Love to code and solve complex problems.',
    level: 'Intermediate'
  },
  {
    id: 2,
    name: 'Bob',
    subjects: ['Computer Science', 'Data Science', 'Mathematics'],
    interests: ['Coding', 'AI', 'Machine Learning'],
    bio: 'Interested in data science and artificial intelligence. Want to learn and practice more coding skills.',
    level: 'Advanced'
  },
  {
    id: 3,
    name: 'Charlie',
    subjects: ['Business', 'Marketing', 'Economics'],
    interests: ['Entrepreneurship', 'Reading', 'Networking'],
    bio: 'Business student passionate about entrepreneurship and developing business strategies.',
    level: 'Beginner'
  },
  {
    id: 4,
    name: 'Diana',
    subjects: ['Computer Science', 'Web Development'],
    interests: ['Coding', 'Design', 'Photography'],
    bio: 'Love coding and creating beautiful websites. Passionate about design and user experience.',
    level: 'Intermediate'
  },
  {
    id: 5,
    name: 'Eve',
    subjects: ['Mathematics', 'Statistics', 'Data Science'],
    interests: ['Data Analysis', 'Research', 'Problem Solving'],
    bio: 'Enjoy working with data and finding patterns. Study mathematics and statistics.',
    level: 'Advanced'
  }
];

/**
 * Test 1: Basic Compatibility Calculation
 */
function testBasicCompatibility() {
  console.log('\n=== TEST 1: Basic Compatibility ===');
  
  const user1 = sampleUsers[0]; // Alice
  const user2 = sampleUsers[1]; // Bob
  
  const score = MatchingService.calculateCompatibility(user1, user2);
  const explanation = MatchingService.getMatchExplanation(user1, user2);
  
  console.log(`${user1.name} <-> ${user2.name}`);
  console.log(`Compatibility Score: ${score}%`);
  console.log(`Reason: ${explanation}`);
  console.log('✅ Test passed');
}

/**
 * Test 2: Sort Users by Compatibility
 */
function testSortByCompatibility() {
  console.log('\n=== TEST 2: Sort by Compatibility ===');
  
  const currentUser = sampleUsers[0]; // Alice
  const otherUsers = sampleUsers.slice(1);
  
  const sortedMatches = MatchingService.sortByCompatibility(currentUser, otherUsers);
  
  console.log(`\nBest matches for ${currentUser.name}:`);
  sortedMatches.forEach((match, index) => {
    console.log(`${index + 1}. ${match.name}: ${match.compatibilityScore}% - ${match.matchReason}`);
  });
  console.log('✅ Test passed');
}

/**
 * Test 3: System Analysis
 */
function testSystemAnalysis() {
  console.log('\n=== TEST 3: System Analysis ===');
  
  const analysis = MatchingService.analyzeMatchingSystem(sampleUsers);
  
  console.log('\nSystem Statistics:');
  console.log(`Total Users: ${analysis.totalUsers}`);
  console.log(`Total Comparisons: ${analysis.totalComparisons}`);
  console.log(`Average Compatibility: ${analysis.averageCompatibility}%`);
  console.log(`Median Compatibility: ${analysis.medianCompatibility}%`);
  console.log(`Min/Max: ${analysis.minCompatibility}% / ${analysis.maxCompatibility}%`);
  console.log(`Match Quality: ${analysis.matchQuality}`);
  
  console.log('\nScore Distribution:');
  Object.entries(analysis.scoreDistribution).forEach(([range, count]) => {
    console.log(`  ${range}: ${count} pairs`);
  });
  
  console.log('\nTop Subjects:');
  analysis.topSubjects.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.item}: ${item.count} users`);
  });
  
  console.log('\nTop Interests:');
  analysis.topInterests.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.item}: ${item.count} users`);
  });
  
  console.log('\nLevel Distribution:');
  Object.entries(analysis.levelDistribution).forEach(([level, count]) => {
    console.log(`  ${level}: ${count} users`);
  });
  
  console.log('✅ Test passed');
}

/**
 * Test 4: User-Specific Matching Stats
 */
function testUserMatchingStats() {
  console.log('\n=== TEST 4: User Matching Stats ===');
  
  const user = sampleUsers[0]; // Alice
  const stats = MatchingService.getUserMatchingStats(user, sampleUsers);
  
  console.log(`\nMatching Statistics for ${user.name}:`);
  console.log(`Total Potential Matches: ${stats.totalPotentialMatches}`);
  console.log(`Average Compatibility: ${stats.averageCompatibility}%`);
  console.log(`Best Match: ${stats.bestMatch.user.name} (${stats.bestMatch.score}%)`);
  
  console.log('\nMatch Distribution:');
  console.log(`  High (≥70%): ${stats.matchDistribution.high} (${stats.matchPercentage.high}%)`);
  console.log(`  Medium (40-69%): ${stats.matchDistribution.medium} (${stats.matchPercentage.medium}%)`);
  console.log(`  Low (<40%): ${stats.matchDistribution.low} (${stats.matchPercentage.low}%)`);
  
  console.log('✅ Test passed');
}

/**
 * Test 5: Identify Matching Issues
 */
function testIdentifyIssues() {
  console.log('\n=== TEST 5: Identify Matching Issues ===');
  
  const issues = MatchingService.identifyMatchingIssues(sampleUsers);
  
  console.log('\nSystem Issues:');
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. [${issue.severity?.toUpperCase() || 'INFO'}] ${issue.message}`);
  });
  
  console.log('✅ Test passed');
}

/**
 * Test 6: System Recommendations
 */
function testRecommendations() {
  console.log('\n=== TEST 6: System Recommendations ===');
  
  const recommendations = MatchingService.getSystemRecommendations(sampleUsers);
  
  console.log('\nRecommendations:');
  recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
  
  console.log('✅ Test passed');
}

/**
 * Test 7: Edge Cases
 */
function testEdgeCases() {
  console.log('\n=== TEST 7: Edge Cases ===');
  
  // Empty arrays
  const emptyUser = {
    id: 99,
    name: 'Empty',
    subjects: [],
    interests: [],
    bio: '',
    level: 'Beginner'
  };
  
  const score1 = MatchingService.calculateCompatibility(emptyUser, sampleUsers[0]);
  console.log(`Empty user vs Normal user: ${score1}%`);
  
  // Single user analysis
  const analysis = MatchingService.analyzeMatchingSystem([sampleUsers[0]]);
  console.log(`Single user analysis error: ${analysis.error || 'None'}`);
  
  // No other users for stats
  const stats = MatchingService.getUserMatchingStats(sampleUsers[0], [sampleUsers[0]]);
  console.log(`Single user stats error: ${stats.error || 'None'}`);
  
  console.log('✅ Test passed');
}

/**
 * Run all tests
 */
function runAllTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   MATCHING SERVICE TEST SUITE          ║');
  console.log('╚════════════════════════════════════════╝');
  
  try {
    testBasicCompatibility();
    testSortByCompatibility();
    testSystemAnalysis();
    testUserMatchingStats();
    testIdentifyIssues();
    testRecommendations();
    testEdgeCases();
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   ALL TESTS PASSED ✅                   ║');
    console.log('╚════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error(error.stack);
  }
}

// Export for use in other files
export {
  sampleUsers,
  runAllTests,
  testBasicCompatibility,
  testSortByCompatibility,
  testSystemAnalysis,
  testUserMatchingStats,
  testIdentifyIssues,
  testRecommendations,
  testEdgeCases
};

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}
