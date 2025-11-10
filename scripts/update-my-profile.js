/**
 * Update existing user with subjects/interests for AI matching
 * Run: node scripts/update-my-profile.js your-email@example.com
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextdb';

async function updateUserProfile() {
  try {
    const email = process.argv[2];
    
    if (!email) {
      console.log('❌ Please provide your email:');
      console.log('   node scripts/update-my-profile.js your@email.com\n');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected\n');

    const UserSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      process.exit(1);
    }

    console.log(`👤 Found user: ${user.name || user.email}\n`);
    console.log('🔄 Updating profile with test data...\n');

    // Update with sample data
    await User.updateOne(
      { email },
      {
        $set: {
          subjects: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
          interests: ['Web Development', 'Coding', 'Teaching', 'AI'],
          level: 'Intermediate',
          bio: user.bio || 'Passionate developer learning and building amazing projects with modern technologies.'
        }
      }
    );

    const updated = await User.findOne({ email });

    console.log('✅ Profile updated successfully!\n');
    console.log('📚 Subjects:', updated.subjects.join(', '));
    console.log('💡 Interests:', updated.interests.join(', '));
    console.log('🎯 Level:', updated.level);
    console.log('📝 Bio:', updated.bio.substring(0, 80) + '...\n');

    console.log('🚀 You can now test the AI matching system!');
    console.log('   Visit: http://localhost:3011/match\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

updateUserProfile();
