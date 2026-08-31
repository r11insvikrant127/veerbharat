// scripts/data-entry/db/duplicateFinder.ts

import mongoose from "mongoose";

import type {
  EntityType,
} from "../db/entityInput";

export type DuplicateCandidate = {
  collection: string;
  id: string;
  name: string;
  score: number;
  matchedFields: string[];
};

export type DuplicateSearchResult = {
  entityType: EntityType;
  entityName: string;
  candidates: DuplicateCandidate[];
  duplicateFound: boolean;
};

/*
 * Map the application entity type to the
 * corresponding MongoDB collection and ID field.
 */
function getEntityConfig(
  entityType: EntityType
): {
  collection: string;
  idField: string;
} {
  if (entityType === "event") {
    return {
      collection: "events",
      idField: "eventId",
    };
  }

  if (entityType === "hero") {
    return {
      collection: "heroes",
      idField: "heroId",
    };
  }

  if (
    entityType ===
    "historicalPersonality"
  ) {
    return {
      collection:
        "historicalPersonalities",
      idField:
        "historicalPersonalityId",
    };
  }

  throw new Error(
    `Unsupported entity type: ${entityType}`
  );
}

type MongoDocument = {
  _id?: mongoose.Types.ObjectId | string;

  [key: string]: unknown;
};

function normalizeText(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getString(
  value: unknown
): string | null {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const trimmed =
    value.trim();

  return trimmed.length > 0
    ? trimmed
    : null;
}

function getId(
  document: MongoDocument,
  idField: string
): string | null {
  const value =
    getString(
      document[idField]
    );

  if (value) {
    return value;
  }

  if (document._id) {
    return String(
      document._id
    );
  }

  return null;
}

function getName(
  document: MongoDocument
): string {
  const fields = [
    "name",
    "title",
  ];

  for (const field of fields) {
    const value =
      getString(
        document[field]
      );

    if (value) {
      return value;
    }
  }

  return "UNKNOWN";
}

/**
 * Extract possible alternate names from
 * common schema fields.
 */
function getAlternativeNames(
  document: MongoDocument
): string[] {
  const result: string[] = [];

  const fields = [
    "aliases",
    "alternativeNames",
    "alternateNames",
    "nativeName",
  ];

  for (const field of fields) {
    const value =
      document[field];

    if (
      typeof value === "string"
    ) {
      if (value.trim()) {
        result.push(
          value.trim()
        );
      }

      continue;
    }

    if (
      Array.isArray(value)
    ) {
      for (const item of value) {
        if (
          typeof item === "string" &&
          item.trim()
        ) {
          result.push(
            item.trim()
          );
        }
      }
    }
  }

  return result;
}

function calculateCandidate(
  document: MongoDocument,
  entityName: string,
  idField: string,
  collection: string
): DuplicateCandidate | null {
  const id =
    getId(
      document,
      idField
    );

  if (!id) {
    return null;
  }

  const storedName =
    getName(document);

  const normalizedInput =
    normalizeText(entityName);

  const normalizedName =
    normalizeText(storedName);

  const matchedFields: string[] =
    [];

  let score = 0;

  /*
   * Exact primary-name match.
   */
  if (
    normalizedName ===
    normalizedInput
  ) {
    score = 100;

    matchedFields.push(
      "name (exact)"
    );
  } else if (
    normalizedName.includes(
      normalizedInput
    ) ||
    normalizedInput.includes(
      normalizedName
    )
  ) {
    score = 70;

    matchedFields.push(
      "name (partial)"
    );
  }

  /*
   * Alternate-name matching.
   */
  const alternatives =
    getAlternativeNames(
      document
    );

  for (
    const alternative
    of alternatives
  ) {
    const normalizedAlternative =
      normalizeText(
        alternative
      );

    if (
      normalizedAlternative ===
      normalizedInput
    ) {
      score = Math.max(
        score,
        95
      );

      matchedFields.push(
        "alternate name (exact)"
      );
    } else if (
      normalizedAlternative.includes(
        normalizedInput
      ) ||
      normalizedInput.includes(
        normalizedAlternative
      )
    ) {
      score = Math.max(
        score,
        65
      );

      matchedFields.push(
        "alternate name (partial)"
      );
    }
  }

  /*
   * Do not return weak candidates.
   *
   * A duplicate finder must be conservative.
   */
  if (score < 65) {
    return null;
  }

  return {
    collection,
    id,
    name: storedName,
    score,
    matchedFields: [
      ...new Set(
        matchedFields
      ),
    ],
  };
}

async function getDatabase() {
  /*
   * dotenv must be loaded before mongoose.ts
   * is imported because mongoose.ts reads
   * MONGODB_URI during module initialization.
   */
  const dotenv =
    await import("dotenv");

  dotenv.config({
    path: ".env.local",
  });

  const {
    connectDB,
  } = await import(
    "../../../src/lib/mongoose"
  );

  await connectDB();

  const db =
    mongoose.connection.db;

  if (!db) {
    throw new Error(
      "MongoDB database is not connected."
    );
  }

  return db;
}

/**
 * Search for possible duplicate records.
 *
 * IMPORTANT:
 *
 * This function:
 * - reads MongoDB only
 * - does not create records
 * - does not update records
 * - does not allocate IDs
 * - does not delete anything
 * - does not decide that a duplicate definitely exists
 *
 * It only returns candidates for human review.
 */
export async function findDuplicates(
  entityType: EntityType,
  entityName: string
): Promise<DuplicateSearchResult> {
  const config =
    getEntityConfig(
      entityType
    );

  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "DUPLICATE DISCOVERY"
  );
  console.log(
    "========================================"
  );

  console.log("");
  console.log(
    `ENTITY TYPE : ${entityType}`
  );

  console.log(
    `ENTITY NAME : ${entityName}`
  );

  console.log("");
  console.log(
    "CONNECTING TO DATABASE"
  );

  const db =
    await getDatabase();

  console.log(
    `CONNECTED DATABASE: ${db.databaseName}`
  );

  console.log(
    `CONNECTED HOST: ${
      mongoose.connection.host ||
      "unknown"
    }`
  );

  const regex =
    new RegExp(
      entityName
        .trim()
        .replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        ),
      "i"
    );

  /*
   * Search the primary name and the common
   * alternate-name fields.
   */
  const documents =
    await db
      .collection<MongoDocument>(
        config.collection
      )
      .find({
        $or: [
          {
            name: regex,
          },
          {
            title: regex,
          },
          {
            aliases: regex,
          },
          {
            alternativeNames:
              regex,
          },
          {
            alternateNames:
              regex,
          },
          {
            nativeName: regex,
          },
        ],
      })
      .limit(20)
      .toArray();

  const candidates: DuplicateCandidate[] =
    [];

  for (
    const document
    of documents
  ) {
    const candidate =
      calculateCandidate(
        document,
        entityName,
        config.idField,
        config.collection
      );

    if (candidate) {
      candidates.push(
        candidate
      );
    }
  }

  /*
   * Highest confidence first.
   */
  candidates.sort(
    (a, b) =>
      b.score - a.score
  );

  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "DUPLICATE SEARCH RESULT"
  );
  console.log(
    "========================================"
  );

  if (
    candidates.length === 0
  ) {
    console.log("");
    console.log(
      "NO POSSIBLE DUPLICATE FOUND."
    );
  } else {
    console.log("");
    console.log(
      `FOUND ${candidates.length} POSSIBLE DUPLICATE(S):`
    );

    candidates.forEach(
      (
        candidate,
        index
      ) => {
        console.log("");
        console.log(
          `DUPLICATE ${index + 1}`
        );

        console.log(
          `  ID      : ${candidate.id}`
        );

        console.log(
          `  NAME    : ${candidate.name}`
        );

        console.log(
          `  SCORE   : ${candidate.score}`
        );

        console.log(
          `  MATCHED : ${candidate.matchedFields.join(
            ", "
          )}`
        );
      }
    );
  }

  return {
    entityType,
    entityName,
    candidates,
    duplicateFound:
      candidates.length > 0,
  };
}