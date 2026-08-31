import mongoose from "mongoose";
import type {
  Collection,
  Document,
  Filter,
  Sort,
  UpdateFilter,
  UpdateOptions,
} from "mongodb";

/**
 * Get the currently connected MongoDB database.
 */
function getDatabase() {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB database is not connected.");
  }

  return db;
}

/**
 * Get a typed MongoDB collection.
 *
 * The generic type is important because MongoDB otherwise
 * assumes `_id` is an ObjectId.
 */
export function collection<T extends Document = Document>(
  collectionName: string
): Collection<T> {
  return getDatabase().collection<T>(collectionName);
}

/**
 * Find one document.
 */
export async function findOne<T extends Document = Document>(
  collectionName: string,
  filter: Filter<T>,
  projection?: Document
): Promise<T | null> {
  const result = await collection<T>(collectionName).findOne(
    filter,
    projection
      ? { projection }
      : undefined
  );

  return result as T | null;
}

/**
 * Find multiple documents.
 */
export async function findMany<T extends Document = Document>(
  collectionName: string,
  filter: Filter<T> = {},
  options: {
    limit?: number;
    projection?: Document;
    sort?: Sort;
  } = {}
): Promise<T[]> {
  const cursor = collection<T>(
    collectionName
  ).find(
    filter,
    {
      projection: options.projection,
    }
  );

  if (options.sort) {
    cursor.sort(options.sort);
  }

  if (
    options.limit !== undefined &&
    options.limit > 0
  ) {
    cursor.limit(options.limit);
  }

  const documents = await cursor.toArray();

  return documents as T[];
}

/**
 * Insert one document.
 */
export async function insertOne<T extends Document>(
  collectionName: string,
  document: T
) {
  return collection<T>(
    collectionName
  ).insertOne(
    document as Parameters<
      Collection<T>["insertOne"]
    >[0]
  );
}

/**
 * Insert multiple documents.
 */
export async function insertMany<T extends Document>(
  collectionName: string,
  documents: T[]
) {
  if (documents.length === 0) {
    return {
      acknowledged: true,
      insertedCount: 0,
    };
  }

  return collection<T>(
    collectionName
    ).insertMany(
    documents as unknown as Parameters<
        Collection<T>["insertMany"]
    >[0]
    );
}

/**
 * Update one document.
 */
export async function updateOne<T extends Document>(
  collectionName: string,
  filter: Filter<T>,
  update: UpdateFilter<T>,
  options: UpdateOptions = {}
) {
  return collection<T>(
    collectionName
  ).updateOne(
    filter,
    update,
    options
  );
}

/**
 * Delete one document.
 */
export async function deleteOne<T extends Document>(
  collectionName: string,
  filter: Filter<T>
) {
  return collection<T>(
    collectionName
  ).deleteOne(filter);
}

/**
 * Count matching documents.
 */
export async function countDocuments<
  T extends Document
>(
  collectionName: string,
  filter: Filter<T> = {}
): Promise<number> {
  return collection<T>(
    collectionName
  ).countDocuments(filter);
}

/**
 * Check whether a document exists.
 */
export async function exists<T extends Document>(
  collectionName: string,
  filter: Filter<T>
): Promise<boolean> {
  const result = await collection<T>(
    collectionName
  ).findOne(
    filter,
    {
      projection: {
        _id: 1,
      },
    }
  );

  return result !== null;
}