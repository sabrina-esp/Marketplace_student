import MatchingService from './MatchingService.js';

/**
 * Example: How to use MatchingService in your application
 */

// Example 1: Find matches for a user
function findMatchesForUser(currentUser, allUsers) {
  console.log('\n📊 Finding matches for:', currentUser.name);
  
  // Filter out current user
  const otherUsers = allUsers.filter(u => u.id !== currentUser.id);
  
  // Sort by compatibility
  const matches = MatchingService.sortByCompatibility(currentUser, otherUsers);
  
  // Get top 3 matches
  const topMatches = matches.slice(0, 3);
  
  console.log('\n🎯 Top 3 Matches:');
  topMatches.forEach((match, index) => {
    console.log(`\n${index + 1}. ${match.name}`);
    console.log(`   Score: ${match.compatibilityScore}%`);
    console.log(`   Reason: ${match.matchReason}`);
  });
  
  return topMatches;
}

// Example 2: Generate system dashboard
function generateSystemDashboard(users) {
  console.log('\n📈 SYSTEM DASHBOARD');
  console.log('═'.repeat(50));
  
  const analysis = MatchingService.analyzeMatchingSystem(users);
  const issues = MatchingService.identifyMatchingIssues(users);
  const recommendations = MatchingService.getSystemRecommendations(users);
  
  console.log('\n📊 Overview:');
  console.log(`   Users: ${analysis.totalUsers}`);
  console.log(`   Avg Compatibility: ${analysis.averageCompatibility}%`);
  console.log(`   Quality: ${analysis.matchQuality}`);
  
  console.log('\n⚠️  Issues:');
  issues.forEach(issue => {
    const icon = issue.severity === 'high' ? '🔴' : 
                 issue.severity === 'medium' ? '🟡' : '🟢';
    console.log(`   ${icon} ${issue.message}`);
  });
  
  console.log('\n💡 Recommendations:');
  recommendations.forEach((rec, i) => {
    console.log(`   ${i + 1}. ${rec}`);
  });
  
  return { analysis, issues, recommendations };
}

// Example 3: User profile insights
function getUserProfileInsights(user, allUsers) {
  console.log(`\n👤 Profile Insights for: ${user.name}`);
  console.log('═'.repeat(50));
  
  const stats = MatchingService.getUserMatchingStats(user, allUsers);
  
  if (stats.error) {
    console.log('⚠️  Not enough users for analysis');
    return null;
  }
  
  console.log('\n📈 Your Matching Statistics:');
  console.log(`   Potential Matches: ${stats.totalPotentialMatches}`);
  console.log(`   Average Score: ${stats.averageCompatibility}%`);
  console.log(`   Best Match: ${stats.bestMatch.user.name} (${stats.bestMatch.score}%)`);
  
  console.log('\n📊 Match Quality Breakdown:');
  console.log(`   🟢 Excellent (70%+): ${stats.matchDistribution.high} users`);
  console.log(`   🟡 Good (40-69%): ${stats.matchDistribution.medium} users`);
  console.log(`   🔴 Low (<40%): ${stats.matchDistribution.low} users`);
  
  // Recommendations for user
  if (stats.matchPercentage.high < 20) {
    console.log('\n💡 Tips to improve your matches:');
    console.log('   - Add more subjects to your profile');
    console.log('   - Update your interests');
    console.log('   - Write a more detailed bio');
  }
  
  return stats;
}

// Example 4: Real-time compatibility check
function checkCompatibilityBetweenUsers(user1, user2) {
  console.log(`\n🔍 Checking compatibility:`);
  console.log(`   ${user1.name} ↔ ${user2.name}`);
  console.log('═'.repeat(50));
  
  const score = MatchingService.calculateCompatibility(user1, user2);
  const explanation = MatchingService.getMatchExplanation(user1, user2);
  
  const level = score >= 70 ? '🟢 Excellent' :
                score >= 50 ? '🟡 Good' :
                score >= 30 ? '🟠 Fair' : '🔴 Low';
  
  console.log(`\n   Score: ${score}%`);
  console.log(`   Level: ${level}`);
  console.log(`   Reason: ${explanation}`);
  
  return { score, explanation, level };
}

// Example 5: Monitor system health
function monitorSystemHealth(users) {
  console.log('\n🏥 SYSTEM HEALTH CHECK');
  console.log('═'.repeat(50));
  
  const analysis = MatchingService.analyzeMatchingSystem(users);
  const issues = MatchingService.identifyMatchingIssues(users);
  
  // Health score calculation
  let healthScore = 100;
  
  issues.forEach(issue => {
    if (issue.severity === 'high') healthScore -= 30;
    if (issue.severity === 'medium') healthScore -= 15;
  });
  
  if (analysis.averageCompatibility < 40) healthScore -= 20;
  
  healthScore = Math.max(0, healthScore);
  
  const status = healthScore >= 80 ? '🟢 Healthy' :
                 healthScore >= 50 ? '🟡 Warning' :
                 '🔴 Critical';
  
  console.log(`\n   Overall Health: ${healthScore}/100`);
  console.log(`   Status: ${status}`);
  console.log(`   Users: ${analysis.totalUsers}`);
  console.log(`   Avg Compatibility: ${analysis.averageCompatibility}%`);
  
  return { healthScore, status, analysis, issues };
}

export {
  findMatchesForUser,
  generateSystemDashboard,
  getUserProfileInsights,
  checkCompatibilityBetweenUsers,
  monitorSystemHealth
};
