import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI non défini dans .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Vérifier si vraiment connecté
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Réinitialiser si la connexion est morte
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    };

    console.log('🔄 Connexion à MongoDB...');

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connecté !');
        console.log('📊 État de connexion:', mongoose.connection.readyState);
        console.log('📂 Base de données:', mongoose.connection.name);
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ Erreur de connexion MongoDB:', error.message);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('❌ Impossible de connecter à MongoDB');
    throw error;
  }

  return cached.conn;
}

// Gérer les événements
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connecté à MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erreur Mongoose:', err);
  cached.conn = null;
  cached.promise = null;
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose déconnecté');
  cached.conn = null;
  cached.promise = null;
});

export { connectDB };
export default connectDB;