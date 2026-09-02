// scripts/data-entry/db/databaseWriter.ts

import dotenv from "dotenv";
import mongoose from "mongoose";

import {
  generateNextId,
} from "../../../src/services/idGenerator.service";

import {
  ID_PREFIXES,
} from "../../../src/constants";

dotenv.config({
  path: ".env.local",
});

/*
 * ============================================================
 * TYPES
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

  relatedSection?: string | null;

  imageType?:
    | "Painting"
    | "Portrait"
    | "Photograph"
    | "Statue"
    | "Map"
    | "Coin"
    | "Weapon"
    | "Inscription"
    | "Fort"
    | "Manuscript"
    | "Stamp";

  description?: string | null;
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

  eventDateAccuracy?: string | null;

  birthDate?: string | null;

  birthDateAccuracy?: string | null;

  deathDate?: string | null;

  deathDateAccuracy?: string | null;

  onThisDay?: boolean;

  /*
   * ----------------------------------------------------------
   * ENTITY CONTENT
   * ----------------------------------------------------------
   */

  nativeName?: string | null;

  alternativeNames?: string[];

  title?: string | null;

  gender?: string | null;

  biography?: string | null;

  description?: string | null;

  shortDescription?: string | null;

  eventType?: string | null;

  significance?: string | null;

  details?: string | null;

  /*
   * ----------------------------------------------------------
   * SOURCE
   * ----------------------------------------------------------
   */

  useExistingSource: boolean;

  existingSourceId?: string | null;

  createNewSource: boolean;

  sourceTitle?: string | null;

  sourceType?:
    | "Book"
    | "Research Paper"
    | "Government Record"
    | "ASI"
    | "Museum"
    | "Archive"
    | "Inscription"
    | "Travel Account"
    | "Chronicle"
    | "Manuscript"
    | null;

  sourceAuthor?: string | null;

  sourceLanguage?: string | null;

  sourceYear?: number | string | null;

  sourcePublisher?: string | null;

  sourceDescription?: string | null;

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

  newKingdomDescription?: string | null;

  /*
   * ----------------------------------------------------------
   * RELATIONSHIPS
   *
   * These are PUBLIC IDs such as:
   *
   * KNG0003
   * SRC0001
   * BOOK0001
   * QUOTE0001
   * PLC0001
   * BAT0001
   * HERO0058
   * PER0001
   * IMG0004
   *
   * The writer resolves them to MongoDB ObjectIds.
   * ----------------------------------------------------------
   */

  selectedKingdomIds?: string[];

  selectedSourceIds?: string[];

  selectedBookIds?: string[];

  selectedQuoteIds?: string[];

  selectedPlaceIds?: string[];

  selectedBattleIds?: string[];

  selectedHeroIds?: string[];

  selectedHistoricalPersonalityIds?: string[];

  selectedHistoricalPeriodIds?: string[];

  /*
   * ----------------------------------------------------------
   * IMAGES
   * ----------------------------------------------------------
   */

  selectedExistingImageIds?: string[];

  newImages?: WriterImage[];

  /*
   * ----------------------------------------------------------
   * METADATA
   * ----------------------------------------------------------
   */

  createdBy?: string | null;

  verifiedBy?: string | null;

  status?:
    | "Draft"
    | "Verified"
    | "Published"
    | "Needs Review";
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

  resolvedRelationshipIds: {
    kingdoms: string[];
    sources: string[];
    books: string[];
    quotes: string[];
    places: string[];
    battles: string[];
    heroes: string[];
    historicalPersonalities: string[];
    historicalPeriods: string[];
    images: string[];
  };
};

/*
 * ============================================================
 * DATABASE
 * ============================================================
 */

async function getDatabase() {
  await connectDatabase();

  const db =
    mongoose.connection.db;

  if (!db) {
    throw new Error(
      "MongoDB database is not connected."
    );
  }

  return db;
}

async function connectDatabase(): Promise<void> {
  const {
    connectDB,
  } = await import(
    "../../../src/lib/mongoose"
  );

  await connectDB();
}

/*
 * ============================================================
 * NORMALIZATION
 * ============================================================
 */

function normalize(
  value?: string | null
): string | null {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  const trimmed =
    value.trim();

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

  return Array.from(
    new Set(
      values
        .map(
          (value) =>
            value.trim()
        )
        .filter(Boolean)
    )
  );
}

function toDate(
  value?: string | null
): Date | null {
  const normalized =
    normalize(value);

  if (!normalized) {
    return null;
  }

  const date =
    new Date(normalized);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      `Invalid date: ${normalized}`
    );
  }

  return date;
}

/*
 * ============================================================
 * VALIDATION
 * ============================================================
 */

function validateInput(
  input: DatabaseWriterInput
): void {
  if (
    !input.entityName.trim()
  ) {
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
    !normalize(
      input.existingSourceId
    )
  ) {
    throw new Error(
      "Existing source selected but source ID is missing."
    );
  }

  if (
    input.createNewSource &&
    !normalize(
      input.sourceTitle
    )
  ) {
    throw new Error(
      "New source selected but source title is missing."
    );
  }

  if (
    input.createNewSource &&
    !input.sourceType
  ) {
    throw new Error(
      "New source selected but source type is missing."
    );
  }

  if (
    input.createNewSource &&
    !normalize(
      input.sourceDescription
    )
  ) {
    throw new Error(
      "New source selected but source description is missing."
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
    !normalize(
      input.existingKingdomId
    )
  ) {
    throw new Error(
      "Existing kingdom selected but kingdom ID is missing."
    );
  }

  if (
    input.createNewKingdom &&
    !normalize(
      input.newKingdomName
    )
  ) {
    throw new Error(
      "New kingdom selected but kingdom name is missing."
    );
  }

  if (
    input.createNewKingdom &&
    !normalize(
      input.newKingdomDescription
    )
  ) {
    throw new Error(
      "New kingdom selected but kingdom description is missing."
    );
  }

  /*
   * IMAGE RULE
   */

  const existingImageCount =
    input.selectedExistingImageIds
      ?.length ?? 0;

  const newImageCount =
    input.newImages?.length ?? 0;

  const totalImageCount =
    existingImageCount +
    newImageCount;

  if (
    input.entityType !== "event" &&
    totalImageCount > 1
  ) {
    throw new Error(
      "Hero and Historical Personality entities can have only one image."
    );
  }

  /*
   * HISTORICAL PERSONALITY
   */

  if (
    input.entityType ===
      "historicalPersonality" &&
    !normalize(
      input.biography
    )
  ) {
    /*
     * biography is optional in the current
     * Mongoose interface, so this is intentionally
     * NOT a hard failure.
     */
  }
}

/*
 * ============================================================
 * GENERIC ID RESOLUTION
 * ============================================================
 *
 * Public IDs are strings.
 *
 * Relationship fields in MongoDB are ObjectIds.
 *
 * Example:
 *
 * HERO0058
 *    â†“
 * heroes.heroId
 *    â†“
 * MongoDB _id
 *
 * ============================================================
 */

type CollectionName =
  | "kingdoms"
  | "sources"
  | "books"
  | "quotes"
  | "places"
  | "battles"
  | "heroes"
  | "historicalPersonalities"
  | "historicalPeriods"
  | "images";

type PublicIdField =
  | "kingdomId"
  | "sourceId"
  | "bookId"
  | "quoteId"
  | "placeId"
  | "battleId"
  | "heroId"
  | "historicalPersonalityId"
  | "periodId"
  | "imageId";

async function resolvePublicId(
  collection: CollectionName,
  publicIdField: PublicIdField,
  publicId: string
): Promise<mongoose.Types.ObjectId> {
  const db =
    await getDatabase();

  const normalized =
    normalize(publicId);

  if (!normalized) {
    throw new Error(
      `Cannot resolve empty ID for ${collection}.`
    );
  }

  /*
   * If an ObjectId was accidentally supplied,
   * do not silently accept it.
   *
   * The data-entry system uses public IDs.
   */

  const document =
    await db
      .collection(collection)
      .findOne({
        [publicIdField]:
          normalized,
      });

  if (!document) {
    throw new Error(
      `Relationship ID "${normalized}" was not found in ${collection}.${publicIdField}.`
    );
  }

  if (
    !document._id ||
    !(
      document._id instanceof
      mongoose.Types.ObjectId
    )
  ) {
    throw new Error(
      `Relationship "${normalized}" in ${collection} does not have a valid MongoDB ObjectId.`
    );
  }

  return document._id;
}

async function resolvePublicIds(
  collection: CollectionName,
  publicIdField: PublicIdField,
  publicIds?: string[]
): Promise<mongoose.Types.ObjectId[]> {
  const ids =
    normalizeArray(
      publicIds
    );

  const resolved:
    mongoose.Types.ObjectId[] =
    [];

  for (
    const id of ids
  ) {
    resolved.push(
      await resolvePublicId(
        collection,
        publicIdField,
        id
      )
    );
  }

  return resolved;
}

/*
 * ============================================================
 * SOURCE CREATION
 * ============================================================
 */

async function createSource(
  input: DatabaseWriterInput
): Promise<string> {
  const db =
    await getDatabase();

  const sourceId =
    await generateNextId(
      ID_PREFIXES.SRC
    );

  const sourceDocument = {
    sourceId,

    title:
      normalize(
        input.sourceTitle
      ) ?? "",

    type:
      input.sourceType,

    author:
      normalize(
        input.sourceAuthor
      ),

    language:
      normalize(
        input.sourceLanguage
      ),

    year:
      input.sourceYear !==
      undefined
        ? String(
            input.sourceYear
          )
        : undefined,

    publisher:
      normalize(
        input.sourcePublisher
      ),

    description:
      normalize(
        input.sourceDescription
      ) ?? "",

    url:
      normalize(
        input.sourceUrl
      ),

    tags: [],

    crossReferences: {
      relatedHeroes: [],
      relatedBooks: [],
      relatedBattles: [],
      relatedKingdoms: [],
      relatedPlaces: [],
      relatedImages: [],
    },

    searchFields: {
      keywords: [],
      nativeSpellings: [],
      alternateSpellings: [],
      aliases: [],
    },

    metadata: {
      createdBy:
        normalize(
          input.createdBy
        ) ?? "",

      verifiedBy:
        normalize(
          input.verifiedBy
        ) ?? "",

      version: 1,
    },

    status:
      input.status ??
      "Draft",

    createdAt:
      new Date(),

    updatedAt:
      new Date(),
  };

  await db
    .collection("sources")
    .insertOne(
      sourceDocument
    );

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
  const db =
    await getDatabase();

  const kingdomId =
    await generateNextId(
      ID_PREFIXES.KNG
    );

  const kingdomDocument = {
    kingdomId,

    name:
      normalize(
        input.newKingdomName
      ) ?? "",

    nativeName:
      normalize(
        input.newKingdomNativeName
      ) ?? "",

    alternativeNames:
      normalizeArray(
        input.newKingdomAlternativeNames
      ),

    establishedDate:
      null,

    establishedDateAccuracy:
      "Unknown",

    dissolvedDate:
      null,

    dissolvedDateAccuracy:
      "Unknown",

    capitalId:
      null,

    dynastyId:
      null,

    founderId:
      null,

    lastRulerId:
      null,

    area:
      "",

    flagImageId:
      null,

    emblemImageId:
      null,

    governmentType:
      "",

    currencies: [],

    officialLanguages: [],

    officialReligions: [],

    nationalAnimal:
      "",

    nationalSymbols: [],

    majorCities: [],

    majorForts: [],

    historicalPeriodId:
      null,

    description:
      normalize(
        input.newKingdomDescription
      ) ?? "",

    significance:
      "",

    imageIds: [],

    sourceIds: [],

    tags: [],

    crossReferences: {
      relatedHeroes: [],
      relatedBattles: [],
      relatedPlaces: [],
      relatedBooks: [],
    },

    searchFields: {
      keywords: [],
      nativeSpellings: [],
      alternateSpellings: [],
    },

    metadata: {
      createdBy:
        normalize(
          input.createdBy
        ) ?? "",

      verifiedBy:
        normalize(
          input.verifiedBy
        ) ?? "",

      version: 1,
    },

    status:
      input.status ??
      "Draft",

    createdAt:
      new Date(),

    updatedAt:
      new Date(),
  };

  await db
    .collection("kingdoms")
    .insertOne(
      kingdomDocument
    );

  return kingdomId;
}

/*
 * ============================================================
 * IMAGE CREATION
 * ============================================================
 */

async function createImages(
  input: DatabaseWriterInput,
  sourceObjectId:
    | mongoose.Types.ObjectId
    | null
): Promise<string[]> {
  const db =
    await getDatabase();

  const images =
    input.newImages ??
    [];

  const createdImageIds:
    string[] =
    [];

  for (
    const image of images
  ) {
    const imageId =
      await generateNextId(
        ID_PREFIXES.IMG
      );

    const altText =
      normalize(
        image.altText
      ) ??
      input.entityName;

    const imageDocument = {
      imageId,

      title:
        input.entityName,

      url:
        image.cloudinaryUrl,

      altText,

      imageType:
        image.imageType ??
        "Portrait",

      description:
        normalize(
          image.description
        ) ??
        `Image associated with ${input.entityName}.`,

      relatedSection:
        normalize(
          image.relatedSection
        ),

      sourceId:
        sourceObjectId,

      tags: [],

      crossReferences: {
        relatedHeroes: [],
        relatedPlaces: [],
        relatedBattles: [],
      },

      searchFields: {
        keywords: [],
        nativeSpellings: [],
        alternateSpellings: [],
        aliases: [],
      },

      metadata: {
        createdBy:
          normalize(
            input.createdBy
          ) ?? "",

        verifiedBy:
          normalize(
            input.verifiedBy
          ) ?? "",

        version: 1,
      },

      status:
        input.status ??
        "Draft",

      createdAt:
        new Date(),

      updatedAt:
        new Date(),
    };

    await db
      .collection("images")
      .insertOne(
        imageDocument
      );

    createdImageIds.push(
      imageId
    );
  }

  return createdImageIds;
}

/*
 * ============================================================
 * ENTITY DUPLICATE CHECK
 * ============================================================
 */

async function findExistingEntity(
  input: DatabaseWriterInput
) {
  const db =
    await getDatabase();

  let collection:
    | "events"
    | "heroes"
    | "historicalPersonalities";

  switch (
    input.entityType
  ) {
    case "event":
      collection =
        "events";
      break;

    case "hero":
      collection =
        "heroes";
      break;

    case "historicalPersonality":
      collection =
        "historicalPersonalities";
      break;

    default:
      throw new Error(
        `Unsupported entity type: ${input.entityType}`
      );
  }

  return db
    .collection(collection)
    .findOne({
      name:
        new RegExp(
          `^${escapeRegex(
            input.entityName
          )}$`,
          "i"
        ),
    });
}

function escapeRegex(
  value: string
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

/*
 * ============================================================
 * ENTITY ID
 * ============================================================
 */

async function generateEntityId(
  entityType: WriterEntityType
): Promise<string> {
  switch (
    entityType
  ) {
    case "hero":
      return generateNextId(
        ID_PREFIXES.HERO
      );

    case "event":
      return generateNextId(
        ID_PREFIXES.EVT
      );

    case "historicalPersonality": {
      const db =
        await getDatabase();

      const latest =
        await db
          .collection(
            "historicalPersonalities"
          )
          .findOne(
            {},
            {
              sort: {
                historicalPersonalityId:
                  -1,
              },

              projection: {
                historicalPersonalityId:
                  1,
              },
            }
          );

      let nextNumber =
        1;

      if (
        latest &&
        typeof
          latest.historicalPersonalityId ===
          "string"
      ) {
        const match =
          latest
            .historicalPersonalityId
            .match(
              /^HP(\d+)$/
            );

        if (match) {
          const currentNumber =
            Number(
              match[1]
            );

          if (
            Number.isSafeInteger(
              currentNumber
            )
          ) {
            nextNumber =
              currentNumber +
              1;
          }
        }
      }

      return `HP${String(
        nextNumber
      ).padStart(
        4,
        "0"
      )}`;
    }

    default:
      throw new Error(
        `Unsupported entity type: ${entityType}`
      );
  }
}

/*
 * ============================================================
 * BUILD HERO DOCUMENT
 * ============================================================
 */

function buildHeroDocument(
  input: DatabaseWriterInput,
  entityId: string,
  kingdomObjectId:
    | mongoose.Types.ObjectId
    | null,
  sourceObjectIds:
    mongoose.Types.ObjectId[],
  quoteObjectIds:
    mongoose.Types.ObjectId[],
  bookObjectIds:
    mongoose.Types.ObjectId[],
  imageObjectIds:
    mongoose.Types.ObjectId[],
  historicalPeriodObjectId:
    | mongoose.Types.ObjectId
    | null,
  heroObjectIds:
    mongoose.Types.ObjectId[],
  battleObjectIds:
    mongoose.Types.ObjectId[],
  placeObjectIds:
    mongoose.Types.ObjectId[]
) {
  return {
    heroId:
      entityId,

    name:
      input.entityName,

    nativeName:
      normalize(
        input.nativeName
      ) ?? "",

    alternativeNames:
      normalizeArray(
        input.alternativeNames
      ),

    title:
      normalize(
        input.title
      ) ?? "",

    gender:
      input.gender ??
      "Other",

    birthDate:
      toDate(
        input.birthDate
      ),

    birthDateAccuracy:
      normalize(
        input.birthDateAccuracy
      ) ??
      "Unknown",

    deathDate:
      toDate(
        input.deathDate
      ),

    deathDateAccuracy:
      normalize(
        input.deathDateAccuracy
      ) ??
      "Unknown",

    birthPlaceId:
      placeObjectIds[0] ??
      null,

    deathPlaceId:
      placeObjectIds[1] ??
      null,

    causeOfDeath:
      "",

    nickname:
      "",

    personalityTraits:
      [],

    legacy:
      "",

    historicalNarratives:
      [],

    biography:
      normalize(
        input.biography
      ) ?? "",

    shortDescription:
      normalize(
        input.shortDescription
      ) ?? "",

    knownFor:
      [],

    occupation:
      [],

    roles:
      [],

    languagesKnown:
      [],

    education:
      [],

    religion:
      "",

    coronationDate:
      null,

    predecessorId:
      null,

    successorId:
      null,

    officialSeal:
      "",

    coins:
      [],

    administrativeReforms:
      [],

    economicReforms:
      [],

    fatherId:
      null,

    motherId:
      null,

    brothers:
      [],

    sisters:
      [],

    spouseIds:
      [],

    childrenIds:
      [],

    dynastyId:
      null,

    clan:
      "",

    primaryWeaponIds:
      [],

    preferredWeapons:
      [],

    warAnimalId:
      null,

    armySize:
      null,

    commanderOf:
      [],

    warStrategyIds:
      [],

    militaryTactics:
      [],

    notableFeats:
      [],

    rank:
      "",

    kingdomId:
      kingdomObjectId,

    capitalId:
      null,

    reignPeriod:
      "",

    territoryControlled:
      [],

    territoriesLost:
      [],

    territoriesRecaptured:
      [],

    historicalPeriodId:
      historicalPeriodObjectId,

    relatedHeroes:
      heroObjectIds,

    relatedBattles:
      battleObjectIds,

    relatedPlaces:
      placeObjectIds,

    relatedBooks:
      bookObjectIds,

    relatedSources:
      sourceObjectIds,

    relatedImages:
      imageObjectIds,

    historicalArtifacts:
      [],

    achievements:
      [],

    quoteIds:
      quoteObjectIds,

    imageIds:
      imageObjectIds,

    museumId:
      null,

    exhibitionIds:
      [],

    memorialId:
      null,

    bookIds:
      bookObjectIds,

    sourceIds:
      sourceObjectIds,

    tags:
      [],

    searchFields: {
      keywords: [],
      nativeSpellings: [],
      alternateSpellings: [],
      aliases: [],
    },

    metadata: {
      createdBy:
        normalize(
          input.createdBy
        ) ?? "",

      verifiedBy:
        normalize(
          input.verifiedBy
        ) ?? "",

      version: 1,
    },

    status:
      input.status ??
      "Draft",

    createdAt:
      new Date(),

    updatedAt:
      new Date(),
  };
}

/*
 * ============================================================
 * BUILD HISTORICAL PERSONALITY DOCUMENT
 * ============================================================
 */

function buildHistoricalPersonalityDocument(
  input: DatabaseWriterInput,
  entityId: string,
  imageObjectIds:
    mongoose.Types.ObjectId[]
) {
  /*
   * Current HistoricalPersonality schema only
   * supports the fields below.
   *
   * Do NOT add kingdom/source/book/etc.
   * until the schema itself supports them.
   */

  return {
    historicalPersonalityId:
      entityId,

    name:
      input.entityName,

    nativeName:
      normalize(
        input.nativeName
      ),

    title:
      normalize(
        input.title
      ),

    gender:
      normalize(
        input.gender
      ),

    shortDescription:
      normalize(
        input.shortDescription
      ),

    biography:
      normalize(
        input.biography
      ),

    birthDate:
      toDate(
        input.birthDate
      ),

    deathDate:
      toDate(
        input.deathDate
      ),

    status:
      input.status ??
      "published",

    imageIds:
      imageObjectIds,

    createdAt:
      new Date(),

    updatedAt:
      new Date(),
  };
}

/*
 * ============================================================
 * BUILD EVENT DOCUMENT
 * ============================================================
 */

function buildEventDocument(
  input: DatabaseWriterInput,
  entityId: string,
  locationObjectId:
    | mongoose.Types.ObjectId
    | null,
  heroObjectIds:
    mongoose.Types.ObjectId[],
  historicalPeriodObjectId:
    | mongoose.Types.ObjectId
    | null,
  imageObjectIds:
    mongoose.Types.ObjectId[],
  sourceObjectIds:
    mongoose.Types.ObjectId[],
  battleObjectIds:
    mongoose.Types.ObjectId[],
  placeObjectIds:
    mongoose.Types.ObjectId[],
  bookObjectIds:
    mongoose.Types.ObjectId[]
) {
  return {
    eventId:
      entityId,

    name:
      input.entityName,

    nativeName:
      normalize(
        input.nativeName
      ),

    eventDate:
      toDate(
        input.eventDate
      ),

    eventDateAccuracy:
      normalize(
        input.eventDateAccuracy
      ) ??
      "Unknown",

    locationId:
      locationObjectId,

    heroIds:
      heroObjectIds,

    historicalPeriodId:
      historicalPeriodObjectId,

    type:
      input.eventType ??
      "Other",

    isOnThisDayEligible:
      input.onThisDay ??
      false,

    isPersonalMilestone:
      false,

    linkedEventId:
      null,

    description:
      normalize(
        input.description
      ) ?? "",

    shortDescription:
      normalize(
        input.shortDescription
      ) ?? "",

    details:
      normalize(
        input.details
      ) ?? "",

    significance:
      normalize(
        input.significance
      ),

    imageIds:
      imageObjectIds.map(
        (imageId) => ({
          imageId,

          relatedSection:
            null,
        })
      ),

    sourceIds:
      sourceObjectIds,

    tags:
      [],

    crossReferences: {
      relatedHeroes:
        heroObjectIds,

      relatedPlaces:
        placeObjectIds,

      relatedBattles:
        battleObjectIds,

      relatedBooks:
        bookObjectIds,
    },

    searchFields: {
      keywords: [],
      nativeSpellings: [],
      alternateSpellings: [],
      aliases: [],
    },

    metadata: {
      createdBy:
        normalize(
          input.createdBy
        ) ?? "",

      verifiedBy:
        normalize(
          input.verifiedBy
        ) ?? "",

      version: 1,
    },

    status:
      input.status ??
      "Draft",

    createdAt:
      new Date(),

    updatedAt:
      new Date(),
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
  relationships: {
    kingdomObjectId:
      | mongoose.Types.ObjectId
      | null;

    sourceObjectIds:
      mongoose.Types.ObjectId[];

    bookObjectIds:
      mongoose.Types.ObjectId[];

    quoteObjectIds:
      mongoose.Types.ObjectId[];

    placeObjectIds:
      mongoose.Types.ObjectId[];

    battleObjectIds:
      mongoose.Types.ObjectId[];

    heroObjectIds:
      mongoose.Types.ObjectId[];

    historicalPeriodObjectId:
      | mongoose.Types.ObjectId
      | null;

    imageObjectIds:
      mongoose.Types.ObjectId[];
  }
): Promise<void> {
  const db =
    await getDatabase();

  if (
    input.entityType ===
    "hero"
  ) {
    const document =
      buildHeroDocument(
        input,

        entityId,

        relationships.kingdomObjectId,

        relationships.sourceObjectIds,

        relationships.quoteObjectIds,

        relationships.bookObjectIds,

        relationships.imageObjectIds,

        relationships.historicalPeriodObjectId,

        relationships.heroObjectIds,

        relationships.battleObjectIds,

        relationships.placeObjectIds
      );

    await db
      .collection("heroes")
      .insertOne(
        document
      );

    return;
  }

  if (
    input.entityType ===
    "historicalPersonality"
  ) {
    const document =
      buildHistoricalPersonalityDocument(
        input,

        entityId,

        relationships.imageObjectIds
      );

    await db
      .collection(
        "historicalPersonalities"
      )
      .insertOne(
        document
      );

    return;
  }

  const locationObjectId =
    relationships
      .placeObjectIds[0] ??
    null;

  const document =
    buildEventDocument(
      input,

      entityId,

      locationObjectId,

      relationships.heroObjectIds,

      relationships.historicalPeriodObjectId,

      relationships.imageObjectIds,

      relationships.sourceObjectIds,

      relationships.battleObjectIds,

      relationships.placeObjectIds,

      relationships.bookObjectIds
    );

  await db
    .collection("events")
    .insertOne(
      document
    );
}

/*
 * ============================================================
 * MAIN WRITER
 * ============================================================
 */

export async function writeVerifiedData(
  input: DatabaseWriterInput
): Promise<DatabaseWriterResult> {
  validateInput(
    input
  );

  const db =
    await getDatabase();

  /*
   * ----------------------------------------------------------
   * SAFETY CHECK #1
   * ----------------------------------------------------------
   */

  const existingEntity =
    await findExistingEntity(
      input
    );

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

  let sourcePublicId:
    string | null =
    normalize(
      input.existingSourceId
    );

  let createdSourceId:
    string | null =
    null;

  if (
    input.createNewSource
  ) {
    sourcePublicId =
      await createSource(
        input
      );

    createdSourceId =
      sourcePublicId;
  }

  /*
   * ----------------------------------------------------------
   * RESOLVE SOURCE
   * ----------------------------------------------------------
   */

  const sourcePublicIds =
    normalizeArray([
      ...(input.selectedSourceIds ??
        []),

      ...(sourcePublicId
        ? [sourcePublicId]
        : []),
    ]);

  const sourceObjectIds =
    await resolvePublicIds(
      "sources",
      "sourceId",
      sourcePublicIds
    );

  /*
   * ----------------------------------------------------------
   * KINGDOM
   * ----------------------------------------------------------
   */

  let kingdomPublicId:
    string | null =
    normalize(
      input.existingKingdomId
    );

  let createdKingdomId:
    string | null =
    null;

  if (
    input.createNewKingdom
  ) {
    kingdomPublicId =
      await createKingdom(
        input
      );

    createdKingdomId =
      kingdomPublicId;
  }

  /*
   * ----------------------------------------------------------
   * RESOLVE KINGDOM
   * ----------------------------------------------------------
   */

  const kingdomPublicIds =
    normalizeArray([
      ...(input.selectedKingdomIds ??
        []),

      ...(kingdomPublicId
        ? [kingdomPublicId]
        : []),
    ]);

  const kingdomObjectIds =
    await resolvePublicIds(
      "kingdoms",
      "kingdomId",
      kingdomPublicIds
    );

  const kingdomObjectId =
    kingdomObjectIds[0] ??
    null;

  /*
   * ----------------------------------------------------------
   * OTHER RELATIONSHIPS
   * ----------------------------------------------------------
   */

  const bookObjectIds =
    await resolvePublicIds(
      "books",
      "bookId",
      input.selectedBookIds
    );

  const quoteObjectIds =
    await resolvePublicIds(
      "quotes",
      "quoteId",
      input.selectedQuoteIds
    );

  const placeObjectIds =
    await resolvePublicIds(
      "places",
      "placeId",
      input.selectedPlaceIds
    );

  const battleObjectIds =
    await resolvePublicIds(
      "battles",
      "battleId",
      input.selectedBattleIds
    );

  const heroObjectIds =
    await resolvePublicIds(
      "heroes",
      "heroId",
      input.selectedHeroIds
    );

  const historicalPeriodObjectIds =
    await resolvePublicIds(
      "historicalPeriods",
      "periodId",
      input.selectedHistoricalPeriodIds
    );

  /*
   * Historical Personality relationships are
   * currently NOT written because the current
   * HistoricalPersonality schema has no such fields.
   *
   * We still resolve them if supplied so an invalid
   * public ID cannot silently pass through the workflow.
   */

  const historicalPersonalityObjectIds =
    await resolvePublicIds(
      "historicalPersonalities",
      "historicalPersonalityId",
      input.selectedHistoricalPersonalityIds
    );

  void historicalPersonalityObjectIds;

  const historicalPeriodObjectId =
    historicalPeriodObjectIds[0] ??
    null;

  /*
   * ----------------------------------------------------------
   * IMAGES
   * ----------------------------------------------------------
   */

  const imageSourceObjectId =
    sourceObjectIds[0] ??
    null;

  const createdImageIds =
    await createImages(
      input,
      imageSourceObjectId
    );

  const linkedExistingImageIds =
    normalizeArray(
      input.selectedExistingImageIds
    );

  const existingImageObjectIds =
    await resolvePublicIds(
      "images",
      "imageId",
      linkedExistingImageIds
    );

  const createdImageObjectIds =
    await resolvePublicIds(
      "images",
      "imageId",
      createdImageIds
    );

  const allImageObjectIds = [
    ...existingImageObjectIds,
    ...createdImageObjectIds,
  ];

  /*
   * ----------------------------------------------------------
   * ENTITY ID
   * ----------------------------------------------------------
   */

  const entityId =
    await generateEntityId(
      input.entityType
    );

  /*
   * ----------------------------------------------------------
   * WRITE
   * ----------------------------------------------------------
   */

  await writeEntity(
    input,

    entityId,

    {
      kingdomObjectId,

      sourceObjectIds,

      bookObjectIds,

      quoteObjectIds,

      placeObjectIds,

      battleObjectIds,

      heroObjectIds,

      historicalPeriodObjectId,

      imageObjectIds:
        allImageObjectIds,
    }
  );

  /*
   * ----------------------------------------------------------
   * RESULT
   * ----------------------------------------------------------
   */

  return {
    success:
      true,

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

    resolvedRelationshipIds: {
      kingdoms:
        kingdomObjectIds.map(
          String
        ),

      sources:
        sourceObjectIds.map(
          String
        ),

      books:
        bookObjectIds.map(
          String
        ),

      quotes:
        quoteObjectIds.map(
          String
        ),

      places:
        placeObjectIds.map(
          String
        ),

      battles:
        battleObjectIds.map(
          String
        ),

      heroes:
        heroObjectIds.map(
          String
        ),

      historicalPersonalities:
        historicalPersonalityObjectIds.map(
          String
        ),

      historicalPeriods:
        historicalPeriodObjectIds.map(
          String
        ),

      images:
        allImageObjectIds.map(
          String
        ),
    },
  };
}

/*
 * ============================================================
 * STANDALONE TEST
 * ============================================================
 *
 * IMPORTANT:
 *
 * This does NOT write to MongoDB.
 *
 * It only confirms that this module loads.
 * ============================================================
 */

async function main(): Promise<void> {
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
    "Schema-aware ObjectId relationship resolution is enabled."
  );

  console.log();

  console.log(
    "No database write was performed."
  );

  console.log();
}

if (
  require.main ===
  module
) {
  main().catch(
    (error) => {
      console.error();

      console.error(
        "DATABASE WRITER TEST FAILED"
      );

      console.error(
        error
      );

      process.exitCode =
        1;
    }
  );
}
