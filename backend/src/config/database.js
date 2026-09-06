import mongoose from "mongoose";

// Cache the connection across serverless invocations (Vercel reuses
// the same container between requests when possible).
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing");

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => {
      console.log("MongoDB connected");
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}