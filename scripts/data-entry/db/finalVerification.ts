// scripts/data-entry/db/finalVerification.ts

import readline from "node:readline/promises";
import {
  stdin as input,
  stdout as output,
} from "node:process";

/*
 * ============================================================
 * VEERBHARAT FINAL VERIFICATION
 * ============================================================
 *
 * This is the LAST verification stage before MongoDB writing.
 *
 * It receives the results of:
 *
 *   1. dateVerification.ts
 *   2. sourceVerification.ts
 *   3. kingdomVerification.ts
 *   4. relatedContent.ts
 *   5. imageVerification.ts
 *
 * It does NOT:
 *
 *   - perform research
 *   - connect to MongoDB
 *   - modify MongoDB
 *   - generate IDs
 *
 * It only reviews the already verified information and asks
 * the operator for final approval.
 *
 * ============================================================
 */

export type FinalVerificationInput = {
  entityType:
    | "event"
    | "hero"
    | "historicalPersonality";

  entityName: string;

  dateVerification: {
    verified: boolean;

    eventDate: string | null;

    birthDate: string | null;
    birthDateAccuracy: string;

    deathDate: string | null;
    deathDateAccuracy: string;

    onThisDay: boolean;
  };

  sourceVerification: {
    verified: boolean;

    useExistingSource: boolean;
    existingSourceId: string | null;

    createNewSource: boolean;
    sourceTitle: string | null;
  };

  kingdomVerification: {
    verified: boolean;

    useExistingKingdom: boolean;
    existingKingdomId: string | null;

    createNewKingdom: boolean;
    newKingdomName: string | null;
  };

  relatedContent: {
    verified: boolean;

    selectedBookIds: string[];
    selectedQuoteIds: string[];
  };

  imageVerification: {
    verified: boolean;

    selectedExistingImageIds: string[];

    newImages: Array<{
      cloudinaryUrl: string;
      altText: string | null;
      caption: string | null;
    }>;
  };
};

export type FinalVerificationResult = {
  entityType: FinalVerificationInput["entityType"];

  entityName: string;

  allPreviousStepsVerified: boolean;

  dateVerified: boolean;
  sourceVerified: boolean;
  kingdomVerified: boolean;
  relatedContentVerified: boolean;
  imageVerified: boolean;

  readyForDatabaseWrite: boolean;

  verified: boolean;

  verificationNote: string;
};

export type FinalVerificationAsk = (
  question: string
) => Promise<string>;

/* ============================================================
 * DISPLAY HELPERS
 * ============================================================
 */

function printSeparator(): void {
  console.log("");
  console.log("========================================");
}

function yes(value: string): boolean {
  const normalized =
    value.trim().toLowerCase();

  return (
    normalized === "y" ||
    normalized === "yes"
  );
}

/* ============================================================
 * PRINT FINAL REVIEW
 * ============================================================
 */

function printReview(
  input: FinalVerificationInput
): void {
  printSeparator();
  console.log("FINAL DATA REVIEW");
  printSeparator();

  console.log(
    `ENTITY TYPE : ${input.entityType}`
  );

  console.log(
    `ENTITY NAME : ${input.entityName}`
  );

  /*
   * ----------------------------------------------------------
   * DATE INFORMATION
   * ----------------------------------------------------------
   */

  printSeparator();
  console.log("DATE INFORMATION");

  console.log(
    `  Event Date          : ${
      input.dateVerification.eventDate ??
      "NONE"
    }`
  );

  console.log(
    `  Birth Date          : ${
      input.dateVerification.birthDate ??
      "NONE"
    }`
  );

  console.log(
    `  Birth Date Accuracy : ${
      input.dateVerification.birthDateAccuracy ||
      "Unknown"
    }`
  );

  console.log(
    `  Death Date          : ${
      input.dateVerification.deathDate ??
      "NONE"
    }`
  );

  console.log(
    `  Death Date Accuracy : ${
      input.dateVerification.deathDateAccuracy ||
      "Unknown"
    }`
  );

  console.log(
    `  On This Day         : ${
      input.dateVerification.onThisDay
        ? "YES"
        : "NO"
    }`
  );

  console.log(
    `  Verified            : ${
      input.dateVerification.verified
        ? "YES"
        : "NO"
    }`
  );

  /*
   * ----------------------------------------------------------
   * SOURCE
   * ----------------------------------------------------------
   */

  printSeparator();
  console.log("SOURCE");

  if (
    input.sourceVerification
      .useExistingSource
  ) {
    console.log(
      `  Existing Source ID : ${
        input.sourceVerification
          .existingSourceId ??
        "NONE"
      }`
    );
  } else if (
    input.sourceVerification
      .createNewSource
  ) {
    console.log(
      `  New Source Title   : ${
        input.sourceVerification
          .sourceTitle ??
        "NONE"
      }`
    );
  } else {
    console.log(
      "  Source             : NONE"
    );
  }

  console.log(
    `  Verified           : ${
      input.sourceVerification.verified
        ? "YES"
        : "NO"
    }`
  );

  /*
   * ----------------------------------------------------------
   * KINGDOM / POLITY
   * ----------------------------------------------------------
   */

  printSeparator();
  console.log("KINGDOM / POLITY");

  if (
    input.kingdomVerification
      .useExistingKingdom
  ) {
    console.log(
      `  Existing Kingdom ID : ${
        input.kingdomVerification
          .existingKingdomId ??
        "NONE"
      }`
    );
  } else if (
    input.kingdomVerification
      .createNewKingdom
  ) {
    console.log(
      `  New Kingdom Name    : ${
        input.kingdomVerification
          .newKingdomName ??
        "NONE"
      }`
    );
  } else {
    console.log(
      "  Kingdom / Polity    : NONE"
    );
  }

  console.log(
    `  Verified            : ${
      input.kingdomVerification.verified
        ? "YES"
        : "NO"
    }`
  );

  /*
   * ----------------------------------------------------------
   * RELATED CONTENT
   * ----------------------------------------------------------
   */

  printSeparator();
  console.log("RELATED CONTENT");

  console.log(
    `  Books  : ${
      input.relatedContent
        .selectedBookIds.length > 0
        ? input.relatedContent
            .selectedBookIds
            .join(", ")
        : "NONE"
    }`
  );

  console.log(
    `  Quotes : ${
      input.relatedContent
        .selectedQuoteIds.length > 0
        ? input.relatedContent
            .selectedQuoteIds
            .join(", ")
        : "NONE"
    }`
  );

  console.log(
    `  Verified : ${
      input.relatedContent.verified
        ? "YES"
        : "NO"
    }`
  );

  /*
   * ----------------------------------------------------------
   * IMAGES
   * ----------------------------------------------------------
   */

  printSeparator();
  console.log("IMAGES");

  console.log(
    `  Existing Images : ${
      input.imageVerification
        .selectedExistingImageIds
        .length > 0
        ? input.imageVerification
            .selectedExistingImageIds
            .join(", ")
        : "NONE"
    }`
  );

  console.log(
    `  New Images      : ${
      input.imageVerification
        .newImages.length
    }`
  );

  console.log(
    `  Verified        : ${
      input.imageVerification.verified
        ? "YES"
        : "NO"
    }`
  );
}

/* ============================================================
 * FINAL VERIFICATION
 * ============================================================
 */

export async function runFinalVerification(
  input: FinalVerificationInput,
  ask: FinalVerificationAsk
): Promise<FinalVerificationResult> {
  printReview(input);

  /*
   * Every previous stage must be verified.
   */

  const allPreviousStepsVerified =
    input.dateVerification.verified &&
    input.sourceVerification.verified &&
    input.kingdomVerification.verified &&
    input.relatedContent.verified &&
    input.imageVerification.verified;

  /*
   * ----------------------------------------------------------
   * VERIFICATION STATUS
   * ----------------------------------------------------------
   */

  printSeparator();
  console.log("VERIFICATION STATUS");
  printSeparator();

  console.log(
    `DATE              : ${
      input.dateVerification.verified
        ? "VERIFIED"
        : "NOT VERIFIED"
    }`
  );

  console.log(
    `SOURCE            : ${
      input.sourceVerification.verified
        ? "VERIFIED"
        : "NOT VERIFIED"
    }`
  );

  console.log(
    `KINGDOM / POLITY  : ${
      input.kingdomVerification.verified
        ? "VERIFIED"
        : "NOT VERIFIED"
    }`
  );

  console.log(
    `RELATED CONTENT   : ${
      input.relatedContent.verified
        ? "VERIFIED"
        : "NOT VERIFIED"
    }`
  );

  console.log(
    `IMAGE             : ${
      input.imageVerification.verified
        ? "VERIFIED"
        : "NOT VERIFIED"
    }`
  );

  console.log(
    `ALL PREVIOUS STEPS: ${
      allPreviousStepsVerified
        ? "VERIFIED"
        : "NOT VERIFIED"
    }`
  );

  /*
   * ----------------------------------------------------------
   * BLOCK IF ANY PREVIOUS STEP FAILED
   * ----------------------------------------------------------
   */

  if (!allPreviousStepsVerified) {
    printSeparator();

    console.log(
      "FINAL VERIFICATION BLOCKED"
    );

    console.log(
      "One or more previous verification steps are not verified."
    );

    return {
      entityType: input.entityType,
      entityName: input.entityName,

      allPreviousStepsVerified: false,

      dateVerified:
        input.dateVerification.verified,

      sourceVerified:
        input.sourceVerification.verified,

      kingdomVerified:
        input.kingdomVerification.verified,

      relatedContentVerified:
        input.relatedContent.verified,

      imageVerified:
        input.imageVerification.verified,

      readyForDatabaseWrite: false,

      verified: false,

      verificationNote:
        "Final verification blocked because one or more previous verification steps were not verified.",
    };
  }

  /*
   * ----------------------------------------------------------
   * FINAL OPERATOR CONFIRMATION
   * ----------------------------------------------------------
   */

  const confirmation =
    await ask(
      "\nIs ALL of the above information correct and ready to write to MongoDB? (y/n) > "
    );

  const finalConfirmed =
    yes(confirmation);

  /*
   * ----------------------------------------------------------
   * REJECTED
   * ----------------------------------------------------------
   */

  if (!finalConfirmed) {
    printSeparator();

    console.log(
      "FINAL VERIFICATION REJECTED"
    );

    console.log(
      "Nothing will be written to MongoDB."
    );

    return {
      entityType: input.entityType,
      entityName: input.entityName,

      allPreviousStepsVerified: true,

      dateVerified:
        input.dateVerification.verified,

      sourceVerified:
        input.sourceVerification.verified,

      kingdomVerified:
        input.kingdomVerification.verified,

      relatedContentVerified:
        input.relatedContent.verified,

      imageVerified:
        input.imageVerification.verified,

      readyForDatabaseWrite: false,

      verified: false,

      verificationNote:
        "Final data review rejected by data-entry operator.",
    };
  }

  /*
   * ----------------------------------------------------------
   * APPROVED
   * ----------------------------------------------------------
   */

  printSeparator();

  console.log(
    "FINAL VERIFICATION APPROVED"
  );

  console.log(
    "Data is ready for database writing."
  );

  return {
    entityType: input.entityType,
    entityName: input.entityName,

    allPreviousStepsVerified: true,

    dateVerified:
      input.dateVerification.verified,

    sourceVerified:
      input.sourceVerification.verified,

    kingdomVerified:
      input.kingdomVerification.verified,

    relatedContentVerified:
      input.relatedContent.verified,

    imageVerified:
      input.imageVerification.verified,

    readyForDatabaseWrite: true,

    verified: true,

    verificationNote:
      "All Phase 1 verification steps were reviewed and approved by the data-entry operator.",
  };
}

/* ============================================================
 * STANDALONE TEST
 * ============================================================
 *
 * This section exists ONLY so that:
 *
 * npx tsx scripts/data-entry/db/finalVerification.ts
 *
 * actually tests the module.
 *
 * It does NOT connect to MongoDB.
 *
 * It uses sample verified data.
 * ============================================================
 */

async function standaloneTest(): Promise<void> {
  const rl =
    readline.createInterface({
      input,
      output,
    });

  try {
    console.log("");
    console.log("========================================");
    console.log(
      "VEERBHARAT FINAL VERIFICATION TEST"
    );
    console.log("========================================");

    console.log("");
    console.log("Entity type:");
    console.log("  1. Event");
    console.log("  2. Hero");
    console.log(
      "  3. Historical Personality"
    );

    let entityType:
      | "event"
      | "hero"
      | "historicalPersonality";

    while (true) {
      const type =
        (
          await rl.question(
            "TYPE > "
          )
        )
          .trim()
          .toLowerCase();

      if (
        type === "1" ||
        type === "event"
      ) {
        entityType = "event";
        break;
      }

      if (
        type === "2" ||
        type === "hero"
      ) {
        entityType = "hero";
        break;
      }

      if (
        type === "3" ||
        type === "historical personality" ||
        type === "historicalpersonality"
      ) {
        entityType =
          "historicalPersonality";
        break;
      }

      console.log(
        "Please enter 1, 2, or 3."
      );
    }

    const entityName =
      (
        await rl.question(
          "ENTITY NAME > "
        )
      ).trim();

    if (!entityName) {
      console.log(
        "Entity name cannot be empty."
      );

      return;
    }

    /*
     * Sample data is intentionally marked
     * as verified so that the final confirmation
     * stage can be tested.
     */

    const testInput: FinalVerificationInput =
      {
        entityType,
        entityName,

        dateVerification: {
          verified: true,

          eventDate:
            entityType === "event"
              ? "2026-08-31"
              : null,

          birthDate:
            entityType !== "event"
              ? "1900-01-01"
              : null,

          birthDateAccuracy:
            "Exact",

          deathDate:
            entityType !== "event"
              ? "1950-01-01"
              : null,

          deathDateAccuracy:
            "Exact",

          onThisDay:
            entityType === "event",
        },

        sourceVerification: {
          verified: true,

          useExistingSource: true,
          existingSourceId:
            "SRC0001",

          createNewSource: false,
          sourceTitle: null,
        },

        kingdomVerification: {
          verified: true,

          useExistingKingdom: true,
          existingKingdomId:
            "KNG0003",

          createNewKingdom: false,
          newKingdomName: null,
        },

        relatedContent: {
          verified: true,

          selectedBookIds: [],
          selectedQuoteIds: [],
        },

        imageVerification: {
          verified: true,

          selectedExistingImageIds: [],

          newImages: [],
        },
      };

    /*
     * Run final verification.
     */

    const result =
      await runFinalVerification(
        testInput,
        async (question) =>
          rl.question(question)
      );

    /*
     * Print result.
     */

    printSeparator();

    console.log(
      "FINAL VERIFICATION RESULT"
    );

    printSeparator();

    console.log(
      JSON.stringify(
        result,
        null,
        2
      )
    );
  } finally {
    rl.close();
  }
}

/* ============================================================
 * STANDALONE EXECUTION
 * ============================================================
 */

const currentFile =
  process.argv[1] ?? "";

if (
  currentFile.endsWith(
    "finalVerification.ts"
  )
) {
  void standaloneTest();
}