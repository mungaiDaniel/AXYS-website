import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'aib-axys';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URL environment variable');
}

// Prevent MongoDB connection during build phase
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Skip connection during build
  if (isBuildPhase) {
    console.log('⚠️ Skipping MongoDB connection during build phase');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: DB_NAME, // Explicitly set database name
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log(`✅ MongoDB connected successfully to database: ${DB_NAME}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e.message);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
