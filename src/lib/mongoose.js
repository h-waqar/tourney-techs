import mongoose from "mongoose";

// Ensure this is defined in .env.* files
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI environment variable");
}

// Use global object to cache connection across hot reloads
const globalWithMongoose = globalThis;

globalWithMongoose.mongooseCache ??= {
  conn: null,
  promise: null,
};

export async function connectDB() {
  if (globalWithMongoose.mongooseCache.conn) {
    return globalWithMongoose.mongooseCache.conn;
  }

  if (!globalWithMongoose.mongooseCache.promise) {
    globalWithMongoose.mongooseCache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  globalWithMongoose.mongooseCache.conn =
    await globalWithMongoose.mongooseCache.promise;

  return globalWithMongoose.mongooseCache.conn;
}
