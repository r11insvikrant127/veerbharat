// scripts/data-entry/db/finalReview.ts

import readline from "readline";

/*
 * ============================================================
 * FINAL REVIEW
 * ============================================================
 *
 * This module performs the LAST human review before the
 * database writer is allowed to run.
 *
 * It does NOT:
 *
 *   - research
 *   - create IDs
 *   - modify MongoDB
 *   - create source/kingdom/image records
 *
 * It only validates and displays the information that the
 * previous workflow stages have assembled.
 *
 * ============================================================
 */

export type FinalReviewData = {
  entityType:
    | "event"
    | "hero"
    | "historicalPersonality";

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

  eventDateAccuracy?: string | null;

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

  newImages?: {
    cloudinaryUrl: string;

    altText?: string | null;

    caption?: string | null;
  }[];
};

const rl =
  readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

function ask(
  question: string
): Promise<string> {
  return new Promise(
    (resolve) => {
      rl.question(
        question,
        (answer) => {
          resolve(
            answer.trim()
          );
        }
      );
    }
  );
}

/*
 * ============================================================
 * DISPLAY HELPERS
 * ============================================================
 */

function display(
  value: unknown
): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "NONE";
  }

  if (
    Array.isArray(value)
  ) {
    return value.length > 0
      ? value.join(", ")
      : "NONE";
  }

  return String(value);
}

function entityTypeLabel(
  entityType:
    FinalReviewData["entityType"]
): string {
  switch (
    entityType
  ) {
    case "event":
      return "EVENT";

    case "hero":
      return "HERO";

    case "historicalPersonality":
      return "HISTORICAL PERSONALITY";

    default:
      return entityType;
  }
}

function printSection(
  title: string
): void {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(title);
  console.log(
    "========================================"
  );
}

/*
 * ============================================================
 * DATE REVIEW
 * ============================================================
 */

function printDateReview(
  data: FinalReviewData
): void {
  printSection(
    "DATE / ON-THIS-DAY"
  );

  if (
    data.entityType ===
    "event"
  ) {
    console.log(
      `EVENT DATE       : ${display(
        data.eventDate
      )}`
    );

    console.log(
      `DATE ACCURACY    : ${display(
        data.eventDateAccuracy
      )}`
    );

    console.log(
      `ON-THIS-DAY      : ${
        data.onThisDay
          ? "YES"
          : "NO"
      }`
    );

    return;
  }

  console.log(
    `BIRTH DATE       : ${display(
      data.birthDate
    )}`
  );

  console.log(
    `BIRTH ACCURACY   : ${display(
      data.birthDateAccuracy
    )}`
  );

  console.log(
    `DEATH DATE       : ${display(
      data.deathDate
    )}`
  );

  console.log(
    `DEATH ACCURACY   : ${display(
      data.deathDateAccuracy
    )}`
  );
}

/*
 * ============================================================
 * SOURCE REVIEW
 * ============================================================
 */

function printSourceReview(
  data: FinalReviewData
): void {
  printSection(
    "SOURCE"
  );

  if (
    data.useExistingSource
  ) {
    console.log(
      "SOURCE ACTION : LINK EXISTING SOURCE"
    );

    console.log(
      `SOURCE ID     : ${display(
        data.existingSourceId
      )}`
    );

    return;
  }

  if (
    data.createNewSource
  ) {
    console.log(
      "SOURCE ACTION : CREATE NEW SOURCE"
    );

    console.log(
      `TITLE         : ${display(
        data.sourceTitle
      )}`
    );

    console.log(
      `AUTHOR        : ${display(
        data.sourceAuthor
      )}`
    );

    console.log(
      `YEAR          : ${display(
        data.sourceYear
      )}`
    );

    console.log(
      `URL           : ${display(
        data.sourceUrl
      )}`
    );

    return;
  }

  console.log(
    "SOURCE ACTION : NO SOURCE LINKED"
  );
}

/*
 * ============================================================
 * KINGDOM REVIEW
 * ============================================================
 */

function printKingdomReview(
  data: FinalReviewData
): void {
  printSection(
    "KINGDOM / POLITY"
  );

  if (
    data.useExistingKingdom
  ) {
    console.log(
      "KINGDOM ACTION : LINK EXISTING KINGDOM"
    );

    console.log(
      `KINGDOM ID     : ${display(
        data.existingKingdomId
      )}`
    );

    return;
  }

  if (
    data.createNewKingdom
  ) {
    console.log(
      "KINGDOM ACTION : CREATE NEW KINGDOM"
    );

    console.log(
      `NAME           : ${display(
        data.newKingdomName
      )}`
    );

    console.log(
      `NATIVE NAME    : ${display(
        data.newKingdomNativeName
      )}`
    );

    console.log(
      `ALTERNATIVE    : ${display(
        data.newKingdomAlternativeNames
      )}`
    );

    return;
  }

  console.log(
    "KINGDOM ACTION : NO KINGDOM / POLITY LINKED"
  );
}

/*
 * ============================================================
 * RELATED CONTENT
 * ============================================================
 */

function printRelatedContentReview(
  data: FinalReviewData
): void {
  printSection(
    "RELATED CONTENT"
  );

  console.log(
    `BOOK IDS        : ${display(
      data.selectedBookIds
    )}`
  );

  console.log(
    `QUOTE IDS       : ${display(
      data.selectedQuoteIds
    )}`
  );
}

/*
 * ============================================================
 * IMAGE REVIEW
 * ============================================================
 */

function printImageReview(
  data: FinalReviewData
): void {
  printSection(
    "IMAGES"
  );

  const existingImages =
    data.selectedExistingImageIds ??
    [];

  const newImages =
    data.newImages ??
    [];

  console.log(
    `EXISTING IMAGE IDS : ${display(
      existingImages
    )}`
  );

  console.log(
    `NEW IMAGES         : ${
      newImages.length
    }`
  );

  newImages.forEach(
    (
      image,
      index
    ) => {
      console.log("");
      console.log(
        `IMAGE ${index + 1}`
      );

      console.log(
        `  Cloudinary URL : ${image.cloudinaryUrl}`
      );

      console.log(
        `  Alt Text       : ${display(
          image.altText
        )}`
      );

      console.log(
        `  Caption        : ${display(
          image.caption
        )}`
      );
    }
  );

  const totalImages =
    existingImages.length +
    newImages.length;

  console.log("");

  console.log(
    `TOTAL IMAGES : ${totalImages}`
  );
}

/*
 * ============================================================
 * COMPLETE REVIEW
 * ============================================================
 */

function printReview(
  data: FinalReviewData
): void {
  printSection(
    "ENTITY"
  );

  console.log(
    `ENTITY TYPE : ${entityTypeLabel(
      data.entityType
    )}`
  );

  console.log(
    `ENTITY NAME : ${display(
      data.entityName
    )}`
  );

  printDateReview(
    data
  );

  printSourceReview(
    data
  );

  printKingdomReview(
    data
  );

  printRelatedContentReview(
    data
  );

  printImageReview(
    data
  );
}

/*
 * ============================================================
 * IMAGE VALIDATION
 * ============================================================
 */

function validateImageRule(
  data: FinalReviewData
): string | null {
  const existingCount =
    data.selectedExistingImageIds
      ?.length ?? 0;

  const newCount =
    data.newImages?.length ?? 0;

  const totalCount =
    existingCount +
    newCount;

  /*
   * Current project rule:
   *
   * Hero:
   *   maximum 1 image
   *
   * Historical Personality:
   *   maximum 1 image
   *
   * Event:
   *   multiple images allowed.
   */

  if (
    data.entityType !==
      "event" &&
    totalCount > 1
  ) {
    return (
      "Hero and Historical Personality entities " +
      "can have only ONE image."
    );
  }

  return null;
}

/*
 * ============================================================
 * SOURCE VALIDATION
 * ============================================================
 */

function validateSourceRule(
  data: FinalReviewData
): string | null {
  if (
    data.useExistingSource &&
    data.createNewSource
  ) {
    return (
      "An entity cannot simultaneously " +
      "link an existing source and create a new source."
    );
  }

  if (
    data.useExistingSource &&
    !data.existingSourceId
  ) {
    return (
      "Existing source was selected but no source ID exists."
    );
  }

  if (
    data.createNewSource &&
    !data.sourceTitle
  ) {
    return (
      "New source creation was selected but " +
      "source title is missing."
    );
  }

  return null;
}

/*
 * ============================================================
 * KINGDOM VALIDATION
 * ============================================================
 */

function validateKingdomRule(
  data: FinalReviewData
): string | null {
  if (
    data.useExistingKingdom &&
    data.createNewKingdom
  ) {
    return (
      "An entity cannot simultaneously " +
      "link an existing kingdom and create a new kingdom."
    );
  }

  if (
    data.useExistingKingdom &&
    !data.existingKingdomId
  ) {
    return (
      "Existing kingdom was selected but " +
      "kingdom ID is missing."
    );
  }

  if (
    data.createNewKingdom &&
    !data.newKingdomName
  ) {
    return (
      "New kingdom creation was selected but " +
      "kingdom name is missing."
    );
  }

  return null;
}

/*
 * ============================================================
 * DATE VALIDATION
 * ============================================================
 */

function validateDateRule(
  data: FinalReviewData
): string | null {
  if (
    data.entityType ===
    "event"
  ) {
    if (
      data.onThisDay &&
      !data.eventDate
    ) {
      return (
        "An On-This-Day event must have an event date."
      );
    }

    return null;
  }

  if (
    data.birthDate &&
    data.deathDate
  ) {
    const birth =
      new Date(
        data.birthDate
      );

    const death =
      new Date(
        data.deathDate
      );

    if (
      !Number.isNaN(
        birth.getTime()
      ) &&
      !Number.isNaN(
        death.getTime()
      ) &&
      birth > death
    ) {
      return (
        "Birth date cannot be later than death date."
      );
    }
  }

  return null;
}

/*
 * ============================================================
 * MAIN VALIDATION
 * ============================================================
 */

function validate(
  data: FinalReviewData
): string | null {
  if (
    !data.entityName.trim()
  ) {
    return (
      "Entity name is missing."
    );
  }

  const dateError =
    validateDateRule(
      data
    );

  if (dateError) {
    return dateError;
  }

  const imageError =
    validateImageRule(
      data
    );

  if (imageError) {
    return imageError;
  }

  const sourceError =
    validateSourceRule(
      data
    );

  if (sourceError) {
    return sourceError;
  }

  const kingdomError =
    validateKingdomRule(
      data
    );

  if (kingdomError) {
    return kingdomError;
  }

  return null;
}

/*
 * ============================================================
 * FINAL REVIEW
 * ============================================================
 *
 * IMPORTANT:
 *
 * Returning the data means:
 *
 *     discovery
 *        ↓
 *     verification
 *        ↓
 *     FINAL REVIEW
 *        ↓
 *     DATABASE WRITER
 *
 * MongoDB is still untouched here.
 * ============================================================
 */

export async function runFinalReview(
  data: FinalReviewData
): Promise<
  FinalReviewData | null
> {
  const validationError =
    validate(data);

  if (
    validationError
  ) {
    printSection(
      "FINAL REVIEW ERROR"
    );

    console.log(
      validationError
    );

    return null;
  }

  printSection(
    "VEERBHARAT FINAL DATA REVIEW"
  );

  printReview(
    data
  );

  printSection(
    "FINAL CONFIRMATION"
  );

  console.log(
    "Everything above will be used to prepare"
  );

  console.log(
    "the final MongoDB data-entry operation."
  );

  console.log("");

  console.log(
    "IMPORTANT: MongoDB has NOT been modified yet."
  );

  console.log("");

  const answer =
    (
      await ask(
        "Is ALL of this information correct? (y/n) > "
      )
    ).toLowerCase();

  if (
    answer !== "y" &&
    answer !== "yes"
  ) {
    console.log("");

    console.log(
      "FINAL REVIEW REJECTED."
    );

    console.log(
      "Return to the relevant verification step " +
      "and correct the information."
    );

    return null;
  }

  printSection(
    "FINAL REVIEW VERIFIED"
  );

  console.log(
    `ENTITY TYPE : ${entityTypeLabel(
      data.entityType
    )}`
  );

  console.log(
    `ENTITY NAME : ${data.entityName}`
  );

  console.log("");

  console.log(
    "All Phase 1 information has been verified."
  );

  console.log(
    "Ready for the database-entry stage."
  );

  return data;
}

/*
 * ============================================================
 * STANDALONE TEST
 * ============================================================
 *
 * This is only a validation/display test.
 *
 * It does NOT write to MongoDB.
 * ============================================================
 */

async function main(): Promise<void> {
  const sampleData:
    FinalReviewData =
    {
      entityType:
        "hero",

      entityName:
        "Bina Das",

      birthDate:
        "1911-08-24",

      birthDateAccuracy:
        "Exact",

      deathDate:
        "1986-12-26",

      deathDateAccuracy:
        "Exact",

      onThisDay:
        false,

      useExistingSource:
        true,

      existingSourceId:
        "SRC0001",

      createNewSource:
        false,

      useExistingKingdom:
        true,

      existingKingdomId:
        "KNG0003",

      createNewKingdom:
        false,

      selectedBookIds:
        [
          "BOOK0001",
        ],

      selectedQuoteIds:
        [],

      selectedExistingImageIds:
        [
          "IMG0004",
        ],

      newImages:
        [],
    };

  const result =
    await runFinalReview(
      sampleData
    );

  if (!result) {
    process.exitCode =
      1;
  }

  rl.close();
}

/*
 * ============================================================
 * DIRECT EXECUTION
 * ============================================================
 */

if (
  require.main ===
  module
) {
  main().catch(
    (error) => {
      console.error("");

      console.error(
        "FINAL REVIEW FAILED"
      );

      console.error(
        error
      );

      rl.close();

      process.exitCode =
        1;
    }
  );
}