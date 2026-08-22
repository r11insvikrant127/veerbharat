// src/lib/mongoose.ts

import mongoose from "mongoose";

// Ensure the environment variable exists
if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

// Tell TypeScript this value is definitely a string
const MONGODB_URI = process.env.MONGODB_URI!;

declare global {
  // Prevent multiple connections during development (Next.js hot reload)
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if already connected
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if one doesn't exist
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "veerbharat",
    });
  }

  // Wait for the connection
  cached.conn = await cached.promise;

  return cached.conn;
}
