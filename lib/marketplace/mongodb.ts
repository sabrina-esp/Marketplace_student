import connectDB from '@/lib/db/mongodb'

// Reuse the existing MongoDB connection from the main app
async function connectMarketplaceDB() {
  console.log("[Marketplace] Using main app's MongoDB connection")
  return await connectDB()
}

export default connectMarketplaceDB
