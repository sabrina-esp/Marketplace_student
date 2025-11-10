/**
 * Browser Console Test Script
 * Copy and paste this into your browser console at http://localhost:3011/match
 */

async function testAIMatchingSystem() {
  console.clear();
  console.log('🤖 AI MATCHING SYSTEM TEST\n');
  console.log('═══════════════════════════════════════\n');

  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('❌ Not logged in! Please login first.');
    return;
  }

  try {
    // Test 1: Get AI-sorted potentials
    console.log('📡 Fetching AI-sorted matches...\n');
    
    const response = await fetch('/api/match/potentials', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!data.success) {
      console.error('❌ API Error:', data.message);
      return;
    }

    console.log('✅ Success! Received', data.potentials.length, 'potential matches\n');
    console.log(data.message, '\n');

    // Display results in table
    console.log('📊 AI MATCHING RESULTS:\n');
    console.table(
      data.potentials.map((p, index) => ({
        '#': index + 1,
        'Name': p.name,
        '🤖 AI Score': p.compatibilityScore + '%',
        'Level': p.level || 'N/A',
        'Subjects': p.subjects?.length || 0,
        'Interests': p.interests?.length || 0,
        'Match Reason': p.matchReason || 'N/A'
      }))
    );

    // Calculate statistics
    const scores = data.potentials.map(p => p.compatibilityScore);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    console.log('\n📈 STATISTICS:\n');
    console.log('   Average Compatibility: ' + avgScore + '%');
    console.log('   Highest Match: ' + maxScore + '%');
    console.log('   Lowest Match: ' + minScore + '%');
    console.log('   Total Profiles: ' + data.potentials.length);

    // Show top 3 matches details
    console.log('\n🏆 TOP 3 BEST MATCHES:\n');
    data.potentials.slice(0, 3).forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - ${p.compatibilityScore}%`);
      console.log(`   📚 Subjects: ${p.subjects?.slice(0, 4).join(', ') || 'None'}`);
      console.log(`   💡 Interests: ${p.interests?.slice(0, 4).join(', ') || 'None'}`);
      console.log(`   🤖 Why: ${p.matchReason}`);
      console.log('');
    });

    // Show compatibility distribution
    const ranges = {
      'Excellent (80-100%)': scores.filter(s => s >= 80).length,
      'Good (60-79%)': scores.filter(s => s >= 60 && s < 80).length,
      'Medium (40-59%)': scores.filter(s => s >= 40 && s < 60).length,
      'Low (0-39%)': scores.filter(s => s < 40).length
    };

    console.log('📊 COMPATIBILITY DISTRIBUTION:\n');
    Object.entries(ranges).forEach(([range, count]) => {
      const bar = '█'.repeat(count);
      console.log(`   ${range.padEnd(20)} ${bar} (${count})`);
    });

    console.log('\n═══════════════════════════════════════');
    console.log('✅ Test completed successfully!');
    console.log('\n💡 TIP: Refresh the /match page to see these results in the UI\n');

    return data.potentials;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

// Run the test
console.log('🚀 Starting AI Matching System Test...\n');
testAIMatchingSystem();
