// scripts/data-entry/research/relationshipFinder.ts

import dotenv from "dotenv";
import mongoose from "mongoose";

import {
  ask,
} from "../utils/prompt";

import type {
  EntityType,
} from "../db/entityInput";

dotenv.config({
  path: ".env.local",
});

export type RelationshipCandidate = {
  collection: string;
  id: string;
  name: string;
  reason: string;
};

export type RelationshipResearchResult = {
  entityType: EntityType;
  entityName: string;

  kingdoms: RelationshipCandidate[];
  sources: RelationshipCandidate[];
  books: RelationshipCandidate[];
  quotes: RelationshipCandidate[];
  places: RelationshipCandidate[];
  battles: RelationshipCandidate[];
  heroes: RelationshipCandidate[];
  historicalPersonalities: RelationshipCandidate[];
  historicalPeriods: RelationshipCandidate[];
  images: RelationshipCandidate[];

  researchComplete: boolean;
};

type MongoDocument = {
  _id?: mongoose.Types.ObjectId | string;

  kingdomId?: string;
  sourceId?: string;
  bookId?: string;
  quoteId?: string;
  placeId?: string;
  battleId?: string;
  heroId?: string;
  historicalPersonalityId?: string;
  historicalPeriodId?: string;
  imageId?: string;

  name?: string;
  title?: string;
  text?: string;
  description?: string;
  altText?: string;

  [key: string]: unknown;
};

async function getDatabase() {
  const {
    connectDB,
  } = await import(
    "../../../src/lib/mongoose"
  );

  await connectDB();

  const db = mongoose.connection.db;

  if (!db) {
    throw new Error(
      "MongoDB database is not connected."
    );
  }

  return db;
}

function escapeRegex(
  value: string
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

function makeRegex(
  value: string
): RegExp {
  return new RegExp(
    escapeRegex(value.trim()),
    "i"
  );
}

function getString(
  value: unknown
): string | null {
  return typeof value === "string" &&
    value.trim().length > 0
    ? value.trim()
    : null;
}

function getId(
  document: MongoDocument,
  idFields: string[]
): string | null {
  for (const field of idFields) {
    const value =
      document[field];

    const stringValue =
      getString(value);

    if (stringValue) {
      return stringValue;
    }
  }

  if (document._id) {
    return String(
      document._id
    );
  }

  return null;
}

function getDisplayName(
  document: MongoDocument
): string {
  const candidates = [
    document.name,
    document.title,
    document.text,
    document.description,
  ];

  for (const candidate of candidates) {
    const value =
      getString(candidate);

    if (value) {
      return value;
    }
  }

  return String(
    document._id ?? "UNKNOWN"
  );
}

function buildCandidate(
  collection: string,
  document: MongoDocument,
  idFields: string[],
  reason: string
): RelationshipCandidate | null {
  const id =
    getId(
      document,
      idFields
    );

  if (!id) {
    return null;
  }

  return {
    collection,
    id,
    name: getDisplayName(document),
    reason,
  };
}

/**
 * Search one collection using the entity name.
 *
 * This is intentionally conservative:
 * only obvious text fields are searched.
 */
async function searchCollection(
  db: NonNullable<
    typeof mongoose.connection.db
  >,
  collectionName: string,
  entityName: string,
  idFields: string[],
  textFields: string[],
  limit: number = 10
): Promise<RelationshipCandidate[]> {
  const regex =
    makeRegex(entityName);

  const orConditions =
    textFields.map(
      (field) => ({
        [field]: regex,
      })
    );

  const documents =
    await db
      .collection<MongoDocument>(
        collectionName
      )
      .find({
        $or: orConditions,
      })
      .limit(limit)
      .toArray();

  const candidates: RelationshipCandidate[] =
    [];

  for (const document of documents) {
    const candidate =
      buildCandidate(
        collectionName,
        document,
        idFields,
        `Name/text match for "${entityName}".`
      );

    if (candidate) {
      candidates.push(candidate);
    }
  }

  return candidates;
}

/**
 * Search images conservatively.
 *
 * Image matching is intentionally stricter than
 * generic text matching so unrelated portraits do
 * not get proposed merely because they are both
 * portraits.
 */
async function searchImages(
  db: NonNullable<
    typeof mongoose.connection.db
  >,
  entityName: string
): Promise<RelationshipCandidate[]> {
  const regex =
    makeRegex(entityName);

  const documents =
    await db
      .collection<MongoDocument>(
        "images"
      )
      .find({
        $or: [
          {
            title: regex,
          },
          {
            altText: regex,
          },
          {
            description: regex,
          },
        ],
      })
      .limit(10)
      .toArray();

  const candidates: RelationshipCandidate[] =
    [];

  for (const document of documents) {
    const candidate =
      buildCandidate(
        "images",
        document,
        ["imageId"],
        `Image metadata explicitly matches "${entityName}".`
      );

    if (candidate) {
      candidates.push(candidate);
    }
  }

  return candidates;
}

function printCandidates(
  title: string,
  candidates: RelationshipCandidate[]
): void {
  console.log("");
  console.log(
    "----------------------------------------"
  );
  console.log(title);
  console.log(
    "----------------------------------------"
  );

  if (candidates.length === 0) {
    console.log("NONE FOUND.");
    return;
  }

  candidates.forEach(
    (candidate, index) => {
      console.log("");
      console.log(
        `OPTION ${index + 1}`
      );
      console.log(
        `  ID     : ${candidate.id}`
      );
      console.log(
        `  NAME   : ${candidate.name}`
      );
      console.log(
        `  SOURCE : ${candidate.collection}`
      );
      console.log(
        `  REASON : ${candidate.reason}`
      );
    }
  );
}

function printSummary(
  result: RelationshipResearchResult
): void {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "RELATIONSHIP RESEARCH RESULT"
  );
  console.log(
    "========================================"
  );

  console.log(
    `ENTITY TYPE : ${result.entityType}`
  );

  console.log(
    `ENTITY NAME : ${result.entityName}`
  );

  printCandidates(
    "KINGDOM / POLITY",
    result.kingdoms
  );

  printCandidates(
    "SOURCES",
    result.sources
  );

  printCandidates(
    "BOOKS",
    result.books
  );

  printCandidates(
    "QUOTES",
    result.quotes
  );

  printCandidates(
    "PLACES",
    result.places
  );

  printCandidates(
    "BATTLES",
    result.battles
  );

  printCandidates(
    "HEROES",
    result.heroes
  );

  printCandidates(
    "HISTORICAL PERSONALITIES",
    result.historicalPersonalities
  );

  printCandidates(
    "HISTORICAL PERIODS",
    result.historicalPeriods
  );

  printCandidates(
    "IMAGES",
    result.images
  );

  console.log("");
  console.log(
    `RESEARCH COMPLETE : ${
      result.researchComplete
        ? "YES"
        : "NO"
    }`
  );
}

/**
 * Discover possible existing relationships.
 *
 * IMPORTANT:
 *
 * This function ONLY discovers candidates.
 *
 * It does NOT:
 * - create records
 * - update records
 * - link records
 * - allocate IDs
 * - approve candidates
 * - delete anything
 */
export async function findRelationships(
  entityType: EntityType,
  entityName: string
): Promise<RelationshipResearchResult> {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "VEERBHARAT RELATIONSHIP DISCOVERY"
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

  const [
    kingdoms,
    sources,
    books,
    quotes,
    places,
    battles,
    heroes,
    historicalPersonalities,
    historicalPeriods,
    images,
  ] = await Promise.all([
    searchCollection(
      db,
      "kingdoms",
      entityName,
      ["kingdomId"],
      [
        "name",
        "nativeName",
        "alternativeNames",
        "aliases",
      ]
    ),

    searchCollection(
      db,
      "sources",
      entityName,
      ["sourceId"],
      [
        "title",
        "author",
      ]
    ),

    searchCollection(
      db,
      "books",
      entityName,
      ["bookId"],
      [
        "title",
        "author",
      ]
    ),

    searchCollection(
      db,
      "quotes",
      entityName,
      ["quoteId"],
      [
        "text",
      ]
    ),

    searchCollection(
      db,
      "places",
      entityName,
      ["placeId"],
      [
        "name",
        "nativeName",
        "alternativeNames",
        "aliases",
      ]
    ),

    searchCollection(
      db,
      "battles",
      entityName,
      ["battleId"],
      [
        "name",
        "title",
        "description",
      ]
    ),

    searchCollection(
      db,
      "heroes",
      entityName,
      ["heroId"],
      [
        "name",
        "nativeName",
        "alternativeNames",
        "aliases",
      ]
    ),

    searchCollection(
      db,
      "historicalPersonalities",
      entityName,
      ["historicalPersonalityId"],
      [
        "name",
        "nativeName",
        "alternativeNames",
        "aliases",
      ]
    ),

    searchCollection(
      db,
      "historicalPeriods",
      entityName,
      ["historicalPeriodId"],
      [
        "name",
        "description",
      ]
    ),

    searchImages(
      db,
      entityName
    ),
  ]);

  const result: RelationshipResearchResult = {
    entityType,
    entityName,

    kingdoms,
    sources,
    books,
    quotes,
    places,
    battles,
    heroes,
    historicalPersonalities,
    historicalPeriods,
    images,

    researchComplete: true,
  };

  printSummary(result);

  return result;
}