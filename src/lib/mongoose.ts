// src/lib/mongoose.ts

import mongoose from "mongoose";

// Ensure the environment variable exists
if (!process.env.MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

const MONGODB_URI = process.env.MONGODB_URI;

const MONGOOSE_OPTIONS = {
  dbName: "veerbharat",

  // MongoDB connection pool
  maxPoolSize: 10,
  minPoolSize: 2,

  // Connection / socket timeouts
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,

  // Close idle sockets after 30 seconds
  maxIdleTimeMS: 30000,

  // Fail immediately when disconnected instead of buffering queries
  bufferCommands: false,
} as const;

declare global {
  // Persist connection state across Next.js hot reloads
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
  // Reuse existing connected Mongoose instance
  if (cached.conn?.connection.readyState === 1) {
    return cached.conn;
  }

  // If a connection is already being established,
  // wait for that same promise instead of creating another one.
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (error) {
      cached.promise = null;
      cached.conn = null;
      throw error;
    }
  }

  // Create exactly one pooled connection
  cached.promise = mongoose.connect(
    MONGODB_URI,
    MONGOOSE_OPTIONS
  );

  try {
    cached.conn = await cached.promise;

    console.log(
      "MongoDB connected:",
      mongoose.connection.name,
      "@",
      mongoose.connection.host
    );

    console.log(
      "MongoDB pool:",
      `min=${MONGOOSE_OPTIONS.minPoolSize}`,
      `max=${MONGOOSE_OPTIONS.maxPoolSize}`
    );

    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}