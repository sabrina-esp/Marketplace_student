/**
 * Test Script: Add sample users with subjects/interests for AI matching
 * Run this with: node scripts/add-test-users.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextdb';

// Sample test users with varied profiles
const testUsers = [
  {
    email: 'alice.react@test.com',
    password: 'Test123!',
    name: 'Alice React',
    subjects: ['JavaScript', 'React', 'TypeScript', 'Node.js'],
    interests: ['Web Development', 'UI/UX', 'Frontend', 'Coding'],
    level: 'Advanced',
    bio: 'Passionate React developer. Love building modern web applications with clean code and beautiful UIs.',
    isVerified: true,
    isEmailVerified: true
  },
  {
    email: 'bob.python@test.com',
    password: 'Test123!',
    name: 'Bob Python',
    subjects: ['Python', 'Django', 'Flask', 'PostgreSQL'],
    interests: ['Backend', 'API Design', 'Databases', 'DevOps'],
    level: 'Intermediate',
    bio: 'Backend developer specializing in Python. Building robust APIs and scalable systems.',
    isVerified: true,
    isEmailVerified: true
  },
  {
    email: 'carol.vue@test.com',
    password: 'Test123!',
    name: 'Carol Vue',
    subjects: ['JavaScript', 'Vue.js', 'CSS', 'Tailwind'],
    interests: ['Web Development', 'Design', 'Frontend', 'Animation'],
    level: 'Intermediate',
    bio: 'Frontend developer passionate about Vue.js and creating beautiful user experiences.',
    isVerified: true,
    isEmailVerified: true
  },
  {
    email: 'david.fullstack@test.com',
    password: 'Test123!',
    name: 'David Fullstack',
    subjects: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    interests: ['Web Development', 'Full Stack', 'Coding', 'Teaching'],
    level: 'Expert',
    bio: 'Full-stack developer and mentor. Love teaching others and building complete applications from scratch.',
    isVerified: true,
    isEmailVerified: true
  },
  {
    email: 'emma.mobile@test.com',
    password: 'Test123!',
    name: 'Emma Mobile',
    subjects: ['React Native', 'Swift', 'Kotlin', 'Flutter'],
    interests: ['Mobile Development', 'iOS', 'Android', 'App Design'],
    level: 'Advanced',
    bio: 'Mobile app developer. Creating native and cross-platform applications with great UX.',
    isVerified: true,
    isEmailVerified: true
  },
  {
    email: 'frank.data@test.com',
    password: 'Test123!',
    name: 'Frank Data',
    subjects: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow'],
    interests: ['AI', 'Data Analysis', 'ML Models', 'Research'],
    level: 'Expert',
    bio: 'Data scientist working with machine learning and AI. Passionate about solving real-world problems with data.',
    isVerified: true,
    isEmailVerified: true
  },
  {
    email: 'grace.designer@test.com',
    password: 'Test123!',
    name: 'Grace Designer',
    subjects: ['Figma', 'UI/UX', 'CSS', 'Design Systems'],
    interests: ['Design', 'User Experience', 'Prototyping', 'Branding'],
    level: 'Intermediate',
    bio: 'UI/UX designer focused on creating intuitive and beautiful digital experiences.',
    isVerified: true,
    isEmailVerified: true
  },
  {
    email: 'henry.devops@test.com',
    password: 'Test123!',
    name: 'Henry DevOps',
    subjects: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    interests: ['DevOps', 'Cloud', 'Infrastructure', 'Automation'],
    level: 'Advanced',
    bio: 'DevOps engineer. Building and maintaining scalable cloud infrastructure with automation.',
    isVerified: true,
    isEmailVerified: true
  },
  {
    email: 'iris.beginner@test.com',
    password: 'Test123!',
    name: 'Iris Beginner',
    subjects: ['HTML', 'CSS', 'JavaScript'],
    interests: ['Web Development', 'Learning', 'Coding', 'Design'],
    level: 'Beginner',
    bio: 'Just started my coding journey! Excited to learn web development and build my first projects.',
    isVerified: true,
    isEmailVerified: true
  },
  {
    email: 'jack.game@test.com',
    password: 'Test123!',
    name: 'Jack Game',
    subjects: ['Unity', 'C#', 'Unreal Engine', 'Blender'],
    interests: ['Game Development', '3D Modeling', 'Animation', 'Gaming'],
    level: 'Intermediate',
    bio: 'Game developer creating immersive experiences. Love both 2D and 3D game development.',
    isVerified: true,
    isEmailVerified: true
  }
];

async function addTestUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Define User schema
    const UserSchema = new mongoose.Schema({
      email: String,
      password: String,
      name: String,
      subjects: [String],
      interests: [String],
      level: String,
      bio: String,
      isVerified: Boolean,
      isEmailVerified: Boolean,
      emailVerifiedAt: Date
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    console.log('👥 Adding test users...\n');

    for (const userData of testUsers) {
      // Check if user exists
      const exists = await User.findOne({ email: userData.email });
      
      if (exists) {
        console.log(`⏭️  Skipping ${userData.name} (already exists)`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      await User.create({
        ...userData,
        password: hashedPassword,
        emailVerifiedAt: new Date()
      });

      console.log(`✅ Created ${userData.name}`);
      console.log(`   📧 Email: ${userData.email}`);
      console.log(`   📚 Subjects: ${userData.subjects.slice(0, 3).join(', ')}...`);
      console.log(`   💡 Interests: ${userData.interests.slice(0, 3).join(', ')}...`);
      console.log(`   🎯 Level: ${userData.level}\n`);
    }

    console.log('🎉 Test users added successfully!');
    console.log('\n📝 Login with any of these accounts:');
    console.log('   Email: alice.react@test.com');
    console.log('   Password: Test123!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the script
addTestUsers();
