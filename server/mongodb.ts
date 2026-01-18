import mongoose from 'mongoose';

// Prefer env-provided connection string; fall back to local Mongo for dev.
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/healthchain';

let isConnected = false;

export async function connectToMongoDB(): Promise<boolean> {
  // Skip connection if already connected
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return true;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB successfully');
    return true;
  } catch (error: any) {
    isConnected = false;
    console.warn('⚠️  MongoDB connection failed:', error.message);
    console.warn('⚠️  App will continue running without database. Some features may be limited.');
    console.warn('💡 To enable database features, start MongoDB or set MONGODB_URI environment variable.');
    return false;
  }
}

export function isMongoDBConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

export async function disconnectFromMongoDB() {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      isConnected = false;
      console.log('✅ Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
  }
}
