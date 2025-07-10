// import mongoose from "mongoose";

// // Ensure this is defined in .env.* files
// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("❌ Please define the MONGODB_URI environment variable");
// }

// // Use global object to cache connection across hot reloads
// const globalWithMongoose = globalThis;

// globalWithMongoose.mongooseCache ??= {
//   conn: null,
//   promise: null,
// };

// export async function connectDB() {
//   if (globalWithMongoose.mongooseCache.conn) {
//     return globalWithMongoose.mongooseCache.conn;
//   }

//   if (!globalWithMongoose.mongooseCache.promise) {
//     globalWithMongoose.mongooseCache.promise = mongoose.connect(MONGODB_URI, {
//       bufferCommands: false,
//     });
//   }

//   globalWithMongoose.mongooseCache.conn =
//     await globalWithMongoose.mongooseCache.promise;

//   console.log(globalWithMongoose.mongooseCache.conn);

//   return globalWithMongoose.mongooseCache.conn;
// }

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI not defined in environment variables");
}

// Global cache for reuse across reloads (next dev)
let cached = globalThis._mongoose;

if (!cached) {
  cached = globalThis._mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔌 Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "tourney-techs",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected:", mongoose.connection.name);
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
