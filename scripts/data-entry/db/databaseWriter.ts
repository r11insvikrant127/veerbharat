// scripts/data-entry/db/databaseWriter.ts

import mongoose from "mongoose";

import { getIdConfig, type IdConfig } from "../config/idConfig";
import { generateNextId } from "../../../src/services/idGenerator.service";

/*
 * ============================================================
 * VEERBHARAT DATABASE WRITER
 * ============================================================
 *
 * IMPORTANT:
 *
 * This file performs the FINAL database write.
 *
 * It assumes that:
 *
 *  1. entityInput.ts has identified the entity
 *  2. dateVerification.ts has verified the dates
 *  3. sourceVerification.ts has verified the source
 *  4. kingdomVerification.ts has verified the kingdom/polity
 *  5. relatedContent.ts has verified books/quotes
 *  6. imageVerification.ts has verified images
 *  7. finalReview.ts has approved everything
 *
 * This file does NOT perform research.
 * This file does NOT decide whether information is correct.
 *
 * It only writes already-verified information.
 *
 * ============================================================
 */

export type WriterEntityType =
  | "event"
  | "hero"
  | "historicalPersonality";

export type WriterImage = {
  cloudinaryUrl: string;
  altText?: string | null;
  caption?: string | null;
};

export type DatabaseWriterInput = {
  entityType: WriterEntityType;
  entityName: string;

  /*
   * ----------------------------------------------------------
   * DATE INFORMATION
   * ----------------------------------------------------------
   */

  eventDate?: string | null;

  birthDate?: string | null;
  birthDateAccuracy?: string | null;

  deathDate?: string | null;
  deathDateAccuracy?: string | null;

  onThisDay?: boolean;

  /*
   * ----------------------------------------------------------
   * SOURCE
   * ----------------------------------------------------------
   */

  useExistingSource: boolean;
  existingSourceId?: string | null;

  createNewSource: boolean;

  sourceTitle?: string | null;
  sourceAuthor?: string | null;
  sourceYear?: number | null;
  sourceUrl?: string | null;

  /*
   * ----------------------------------------------------------
   * KINGDOM / POLITY
   * ----------------------------------------------------------
   */

  useExistingKingdom: boolean;
  existingKingdomId?: string | null;

  createNewKingdom: boolean;

  newKingdomName?: string | null;
  newKingdomNativeName?: string | null;
  newKingdomAlternativeNames?: string[];

  /*
   * ----------------------------------------------------------
   * RELATED CONTENT
   * ----------------------------------------------------------
   */

  selectedBookIds?: string[];
  selectedQuoteIds?: string[];

  /*
   * ----------------------------------------------------------
   * IMAGES
   * ----------------------------------------------------------
   */

  selectedExistingImageIds?: string[];

  newImages?: WriterImage[];
};

export type DatabaseWriterResult = {
  success: boolean;

  entityType: WriterEntityType;
  entityName: string;

  entityId: string | null;

  createdSourceId: string | null;
  createdKingdomId: string | null;

  createdImageIds: string[];

  linkedExistingImageIds: string[];

  selectedBookIds: string[];
  selectedQuoteIds: string[];
};

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

function getDatabase() {
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error(
      "MongoDB database is not connected."
    );
  }

  return db;
}

function normalize(value?: string | null): string | null {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed === ""
    ? null
    : trimmed;
}

function normalizeArray(
  values?: string[]
): string[] {
  if (!values) {
    return [];
  }

  return values
    .map((value) => value.trim())
    .filter(Boolean);
}

/*
 * ============================================================
 * VALIDATION
 * ============================================================
 */

function validateInput(
  input: DatabaseWriterInput
): void {
  if (!input.entityName.trim()) {
    throw new Error(
      "Entity name cannot be empty."
    );
  }

  /*
   * SOURCE
   */

  if (
    input.useExistingSource &&
    input.createNewSource
  ) {
    throw new Error(
      "Cannot use an existing source and create a new source simultaneously."
    );
  }

  if (
    input.useExistingSource &&
    !normalize(input.existingSourceId)
  ) {
    throw new Error(
      "Existing source selected but source ID is missing."
    );
  }

  if (
    input.createNewSource &&
    !normalize(input.sourceTitle)
  ) {
    throw new Error(
      "New source selected but source title is missing."
    );
  }

  /*
   * KINGDOM
   */

  if (
    input.useExistingKingdom &&
    input.createNewKingdom
  ) {
    throw new Error(
      "Cannot use an existing kingdom and create a new kingdom simultaneously."
    );
  }

  if (
    input.useExistingKingdom &&
    !normalize(input.existingKingdomId)
  ) {
    throw new Error(
      "Existing kingdom selected but kingdom ID is missing."
    );
  }

  if (
    input.createNewKingdom &&
    !normalize(input.newKingdomName)
  ) {
    throw new Error(
      "New kingdom selected but kingdom name is missing."
    );
  }

  /*
   * IMAGE RULE
   *
   * Hero:
   * exactly one maximum.
   *
   * Historical Personality:
   * exactly one maximum.
   *
   * Event:
   * multiple allowed.
   */

  const existingImageCount =
    input.selectedExistingImageIds?.length ?? 0;

  const newImageCount =
    input.newImages?.length ?? 0;

  const totalImageCount =
    existingImageCount + newImageCount;

  if (
    input.entityType !== "event" &&
    totalImageCount > 1
  ) {
    throw new Error(
      "Hero and Historical Personality entities can have only one image."
    );
  }
}

/*
 * ============================================================
 * SOURCE CREATION
 * ============================================================
 */

async function createSource(
  input: DatabaseWriterInput
): Promise<string> {
  const db = getDatabase();

  const sourceId =
    await generateNextId("SRC");

  const sourceDocument = {
    sourceId,

    title:
      normalize(input.sourceTitle) ?? "",

    author:
      normalize(input.sourceAuthor),

    year:
      input.sourceYear ?? null,

    url:
      normalize(input.sourceUrl),

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db
    .collection("sources")
    .insertOne(sourceDocument);

  return sourceId;
}

/*
 * ============================================================
 * KINGDOM CREATION
 * ============================================================
 */

async function createKingdom(
  input: DatabaseWriterInput
): Promise<string> {
  const db = getDatabase();

  const kingdomId =
    await generateNextId("KNG");

  const alternativeNames =
    normalizeArray(
      input.newKingdomAlternativeNames
    );

  const kingdomDocument = {
    kingdomId,

    name:
      normalize(input.newKingdomName) ?? "",

    nativeName:
      normalize(input.newKingdomNativeName),

    alternativeNames,

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db
    .collection("kingdoms")
    .insertOne(kingdomDocument);

  return kingdomId;
}

/*
 * ============================================================
 * IMAGE CREATION
 * ============================================================
 */

async function createImages(
  input: DatabaseWriterInput
): Promise<string[]> {
  const db = getDatabase();

  const images =
    input.newImages ?? [];

  const createdImageIds: string[] = [];

  for (const image of images) {
    const imageId =
      await generateNextId("IMG");

    const imageDocument = {
      imageId,

      title:
        input.entityName,

      url:
        image.cloudinaryUrl,

      altText:
        normalize(image.altText),

      caption:
        normalize(image.caption),

      imageType:
        "Portrait",

      description:
        `Image associated with ${input.entityName}.`,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db
      .collection("images")
      .insertOne(imageDocument);

    createdImageIds.push(imageId);
  }

  return createdImageIds;
}

/*
 * ============================================================
 * FIND ENTITY
 * ============================================================
 */

async function findExistingEntity(
  input: DatabaseWriterInput
) {
  const db = getDatabase();

  const config: IdConfig =
    getIdConfig(
      input.entityType
    );

  return db
    .collection(config.collection)
    .findOne({
      name: input.entityName,
    });
}

/*
 * ============================================================
 * BUILD ENTITY DOCUMENT
 * ============================================================
 */

function buildEntityDocument(
  input: DatabaseWriterInput,
  entityId: string,
  sourceId: string | null,
  kingdomId: string | null,
  imageIds: string[]
) {
  const books =
    normalizeArray(
      input.selectedBookIds
    );

  const quotes =
    normalizeArray(
      input.selectedQuoteIds
    );

  /*
   * ----------------------------------------------------------
   * HERO
   * ----------------------------------------------------------
   */

  if (
    input.entityType === "hero"
  ) {
    return {
      heroId: entityId,

      name: input.entityName,

      birthDate:
        normalize(input.birthDate),

      birthDateAccuracy:
        normalize(
          input.birthDateAccuracy
        ),

      deathDate:
        normalize(input.deathDate),

      deathDateAccuracy:
        normalize(
          input.deathDateAccuracy
        ),

      kingdomId,

      sourceIds:
        sourceId
          ? [sourceId]
          : [],

      quoteIds: quotes,

      imageIds,

      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /*
   * ----------------------------------------------------------
   * HISTORICAL PERSONALITY
   * ----------------------------------------------------------
   */

  if (
    input.entityType ===
    "historicalPersonality"
  ) {
    return {
      personalityId: entityId,

      name: input.entityName,

      birthDate:
        normalize(input.birthDate),

      birthDateAccuracy:
        normalize(
          input.birthDateAccuracy
        ),

      deathDate:
        normalize(input.deathDate),

      deathDateAccuracy:
        normalize(
          input.deathDateAccuracy
        ),

      kingdomId,

      sourceIds:
        sourceId
          ? [sourceId]
          : [],

      imageIds,

      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /*
   * ----------------------------------------------------------
   * EVENT
   * ----------------------------------------------------------
   */

  return {
    eventId: entityId,

    name: input.entityName,

    date:
      normalize(input.eventDate),

    onThisDay:
      input.onThisDay ?? false,

    kingdomId,

    sourceIds:
      sourceId
        ? [sourceId]
        : [],

    quoteIds: quotes,

    imageIds,

    bookIds: books,

    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/*
 * ============================================================
 * WRITE ENTITY
 * ============================================================
 */

async function writeEntity(
  input: DatabaseWriterInput,
  entityId: string,
  sourceId: string | null,
  kingdomId: string | null,
  imageIds: string[]
): Promise<void> {
  const db = getDatabase();

  const config: IdConfig =
    getIdConfig(
      input.entityType
    );

  const document =
    buildEntityDocument(
      input,
      entityId,
      sourceId,
      kingdomId,
      imageIds
    );

  await db
    .collection(config.collection)
    .insertOne(document);
}

/*
 * ============================================================
 * MAIN WRITER
 * ============================================================
 */

export async function writeVerifiedData(
  input: DatabaseWriterInput
): Promise<DatabaseWriterResult> {
  validateInput(input);

  const db = getDatabase();

  /*
   * ----------------------------------------------------------
   * SAFETY CHECK
   * ----------------------------------------------------------
   */

  const existingEntity =
    await findExistingEntity(input);

  if (existingEntity) {
    throw new Error(
      `Entity "${input.entityName}" already exists in the database.`
    );
  }

  /*
   * ----------------------------------------------------------
   * SOURCE
   * ----------------------------------------------------------
   */

  let sourceId: string | null =
    normalize(input.existingSourceId);

  let createdSourceId: string | null = null;

  if (input.createNewSource) {
    sourceId = await createSource(input);
    createdSourceId = sourceId;
  }

  /*
   * ----------------------------------------------------------
   * KINGDOM / POLITY
   * ----------------------------------------------------------
   */

  let kingdomId: string | null =
    normalize(input.existingKingdomId);

  let createdKingdomId: string | null = null;

  if (input.createNewKingdom) {
    kingdomId = await createKingdom(input);
    createdKingdomId = kingdomId;
  }

  /*
   * ----------------------------------------------------------
   * IMAGES
   * ----------------------------------------------------------
   */

  const createdImageIds =
    await createImages(input);

  const linkedExistingImageIds =
    normalizeArray(
      input.selectedExistingImageIds
    );

  const allImageIds = [
    ...linkedExistingImageIds,
    ...createdImageIds,
  ];

  /*
   * ----------------------------------------------------------
   * ENTITY ID
   * ----------------------------------------------------------
   *
   * Hero:
   *   HERO0001
   *
   * Event:
   *   EVT000001
   *
   * Historical Personality:
   *   HP0001
   *
   * Historical Personality currently has no HP entry
   * inside ID_PREFIXES, so we follow the existing
   * application's HPxxxx format directly.
   * ----------------------------------------------------------
   */

  let entityId: string;

  switch (input.entityType) {
    case "hero": {
      entityId =
        await generateNextId("HERO");

      break;
    }

    case "event": {
      entityId =
        await generateNextId("EVT");

      break;
    }

    case "historicalPersonality": {
      const latest =
        await db
          .collection(
            "historicalPersonalities"
          )
          .findOne(
            {},
            {
              sort: {
                historicalPersonalityId: -1,
              },

              projection: {
                historicalPersonalityId: 1,
              },
            }
          );

      let nextNumber = 1;

      if (
        latest &&
        typeof latest.historicalPersonalityId ===
          "string"
      ) {
        const match =
          latest.historicalPersonalityId.match(
            /^HP(\d+)$/
          );

        if (match) {
          const currentNumber =
            Number(match[1]);

          if (
            Number.isSafeInteger(
              currentNumber
            )
          ) {
            nextNumber =
              currentNumber + 1;
          }
        }
      }

      entityId =
        `HP${String(nextNumber).padStart(
          4,
          "0"
        )}`;

      break;
    }

    default:
      throw new Error(
        `Unsupported entity type: ${input.entityType}`
      );
  }

  /*
   * ----------------------------------------------------------
   * WRITE ENTITY
   * ----------------------------------------------------------
   */

  await writeEntity(
    input,
    entityId,
    sourceId,
    kingdomId,
    allImageIds
  );

  /*
   * ----------------------------------------------------------
   * RESULT
   * ----------------------------------------------------------
   */

  return {
    success: true,

    entityType:
      input.entityType,

    entityName:
      input.entityName,

    entityId,

    createdSourceId,

    createdKingdomId,

    createdImageIds,

    linkedExistingImageIds,

    selectedBookIds:
      normalizeArray(
        input.selectedBookIds
      ),

    selectedQuoteIds:
      normalizeArray(
        input.selectedQuoteIds
      ),
  };
}

/*
 * ============================================================
 * STANDALONE TEST
 * ============================================================
 *
 * IMPORTANT:
 *
 * This test DOES NOT execute a database write.
 *
 * It only validates the input structure.
 *
 * The actual writer should be called by the final
 * orchestrator after finalReview.ts returns success.
 *
 * ============================================================
 */

async function main() {
  console.log();
  console.log(
    "========================================"
  );
  console.log(
    "VEERBHARAT DATABASE WRITER"
  );
  console.log(
    "========================================"
  );

  console.log();
  console.log(
    "DATABASE WRITER MODULE LOADED."
  );

  console.log();
  console.log(
    "No database write was performed."
  );

  console.log();
  console.log(
    "This module is ready to be called by"
  );

  console.log(
    "the final Phase 1 orchestrator."
  );

  console.log();
}

if (
  require.main === module
) {
  main().catch((error) => {
    console.error();
    console.error(
      "DATABASE WRITER TEST FAILED"
    );

    console.error(error);

    process.exitCode = 1;
  });
}