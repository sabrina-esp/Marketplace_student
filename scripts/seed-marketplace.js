// Marketplace Seed Script
// Run this to populate your marketplace with sample services
// Usage: node scripts/seed-marketplace.js

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace-db';

const serviceSchema = new mongoose.Schema(
  {
    userId: String,
    userEmail: String,
    title: String,
    description: String,
    category: String,
    pricePerHour: Number,
    experience: String,
    rating: Number,
    reviews: Number,
    image: String,
    tags: [String],
    availability: String,
  },
  { timestamps: true }
);

const MarketplaceService = mongoose.models.MarketplaceService || mongoose.model('MarketplaceService', serviceSchema);

const sampleServices = [
  {
    userId: 'sample-user-1',
    userEmail: 'john@example.com',
    title: 'Full Stack Web Development',
    description: 'I can build modern web applications using React, Node.js, and MongoDB. Experienced in creating responsive, scalable applications.',
    category: 'Web Development',
    pricePerHour: 45,
    experience: 'Advanced',
    rating: 4.8,
    reviews: 12,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    tags: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    availability: 'Available',
  },
  {
    userId: 'sample-user-2',
    userEmail: 'sarah@example.com',
    title: 'UI/UX Design Services',
    description: 'Professional UI/UX design for web and mobile applications. I create beautiful, user-friendly interfaces using Figma and Adobe XD.',
    category: 'UI/UX Design',
    pricePerHour: 40,
    experience: 'Intermediate',
    rating: 4.9,
    reviews: 18,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    tags: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    availability: 'Available',
  },
  {
    userId: 'sample-user-3',
    userEmail: 'mike@example.com',
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile app development using React Native and Flutter. Build apps for iOS and Android.',
    category: 'Mobile Development',
    pricePerHour: 50,
    experience: 'Expert',
    rating: 4.7,
    reviews: 9,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
    tags: ['React Native', 'Flutter', 'iOS', 'Android'],
    availability: 'Busy',
  },
  {
    userId: 'sample-user-4',
    userEmail: 'emma@example.com',
    title: 'Content Writing & Copywriting',
    description: 'Professional content writing for blogs, websites, and marketing materials. SEO-optimized content that engages readers.',
    category: 'Content Writing',
    pricePerHour: 25,
    experience: 'Intermediate',
    rating: 4.6,
    reviews: 15,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
    tags: ['SEO', 'Blog Writing', 'Copywriting', 'Technical Writing'],
    availability: 'Available',
  },
  {
    userId: 'sample-user-5',
    userEmail: 'alex@example.com',
    title: 'Data Analysis & Visualization',
    description: 'Transform your data into actionable insights. Expert in Python, R, Tableau, and Power BI for data analysis and visualization.',
    category: 'Data Analysis',
    pricePerHour: 55,
    experience: 'Advanced',
    rating: 4.9,
    reviews: 7,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    tags: ['Python', 'R', 'Tableau', 'Power BI', 'SQL'],
    availability: 'Available',
  },
  {
    userId: 'sample-user-6',
    userEmail: 'lisa@example.com',
    title: 'Video Editing & Production',
    description: 'Professional video editing for YouTube, social media, and promotional content. Skilled in Adobe Premiere Pro and After Effects.',
    category: 'Video Editing',
    pricePerHour: 35,
    experience: 'Intermediate',
    rating: 4.5,
    reviews: 11,
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400',
    tags: ['Premiere Pro', 'After Effects', 'Color Grading', 'Motion Graphics'],
    availability: 'Available',
  },
  {
    userId: 'sample-user-7',
    userEmail: 'david@example.com',
    title: 'Graphic Design & Branding',
    description: 'Creative graphic design services including logos, branding, social media graphics, and print materials.',
    category: 'Graphic Design',
    pricePerHour: 30,
    experience: 'Advanced',
    rating: 4.8,
    reviews: 20,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
    tags: ['Illustrator', 'Photoshop', 'Logo Design', 'Branding'],
    availability: 'Available',
  },
  {
    userId: 'sample-user-8',
    userEmail: 'olivia@example.com',
    title: 'Math & Science Tutoring',
    description: 'Online tutoring for high school and college level mathematics and science subjects. Patient and experienced tutor.',
    category: 'Tutoring',
    pricePerHour: 20,
    experience: 'Intermediate',
    rating: 4.9,
    reviews: 25,
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
    tags: ['Calculus', 'Physics', 'Chemistry', 'Biology'],
    availability: 'Available',
  },
  {
    userId: 'sample-user-9',
    userEmail: 'chris@example.com',
    title: 'Social Media Management',
    description: 'Manage and grow your social media presence. Content creation, scheduling, and engagement strategies for all major platforms.',
    category: 'Social Media',
    pricePerHour: 28,
    experience: 'Intermediate',
    rating: 4.7,
    reviews: 13,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
    tags: ['Instagram', 'Facebook', 'Twitter', 'Content Strategy'],
    availability: 'Busy',
  },
  {
    userId: 'sample-user-10',
    userEmail: 'sophia@example.com',
    title: 'Programming Tutoring - Python & JavaScript',
    description: 'Learn to code with personalized tutoring sessions. Beginner to advanced lessons in Python and JavaScript.',
    category: 'Tutoring',
    pricePerHour: 35,
    experience: 'Advanced',
    rating: 5.0,
    reviews: 16,
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
    tags: ['Python', 'JavaScript', 'Programming', 'Web Development'],
    availability: 'Available',
  },
];

async function seedMarketplace() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing services...');
    await MarketplaceService.deleteMany({});
    console.log('✅ Cleared existing services');

    console.log('🌱 Seeding marketplace with sample services...');
    const inserted = await MarketplaceService.insertMany(sampleServices);
    console.log(`✅ Successfully inserted ${inserted.length} services`);

    console.log('\n📊 Seed Summary:');
    const categories = {};
    inserted.forEach((service) => {
      categories[service.category] = (categories[service.category] || 0) + 1;
    });

    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} service(s)`);
    });

    console.log('\n✨ Marketplace seeded successfully!');
    console.log('🌐 Visit http://localhost:3011/marketplace to see the services\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding marketplace:', error);
    process.exit(1);
  }
}

seedMarketplace();
