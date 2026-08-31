// scripts/data-entry/workflow/createHistoricalPersonality.ts

import {
  ask,
} from "../utils/prompt";

import {
  createEmptyHistoricalPersonalityInput,
  validateHistoricalPersonalityInput,
  setNativeName,
  setTitle,
  setGender,
  setShortDescription,
  setBiography,
  setBirthDate,
  setDeathDate,
  setHistoricalPersonalityStatus,
  setAdditionalInformation,
  type HistoricalPersonalityEntityInput,
} from "../entities/historicalPersonality";

import type {
  EntityInput,
} from "../db/entityInput";

/*
 * ============================================================
 * VEERBHARAT HISTORICAL PERSONALITY DATA ENTRY
 * ============================================================
 *
 * This module collects the fields that belong to the current
 * HistoricalPersonalityEntityInput.
 *
 * It does NOT:
 *
 *   - research historical facts
 *   - decide whether the person is a Hero
 *   - decide whether the person is a Historical Personality
 *   - create MongoDB IDs
 *   - write to MongoDB
 *   - automatically approve images or relationships
 *
 * Research and verification happen in separate stages.
 *
 * ============================================================
 */

function separator(): void {
  console.log("");
  console.log(
    "========================================"
  );
}

async function askOptional(
  question: string
): Promise<string | null> {
  const answer =
    await ask(
      `${question} > `
    );

  const value =
    answer.trim();

  return value.length > 0
    ? value
    : null;
}

async function askRequired(
  question: string
): Promise<string> {
  while (true) {
    const answer =
      await ask(
        `${question} > `
      );

    const value =
      answer.trim();

    if (value.length > 0) {
      return value;
    }

    console.log(
      "This field is required."
    );
  }
}

async function askStatus(): Promise<string> {
  while (true) {
    console.log("");
    console.log(
      "STATUS"
    );

    console.log(
      "  1. published"
    );

    console.log(
      "  2. draft"
    );

    console.log(
      "  3. archived"
    );

    console.log(
      "  4. Custom"
    );

    const answer =
      (
        await ask(
          "STATUS > "
        )
      ).trim();

    switch (answer) {
      case "1":
        return "published";

      case "2":
        return "draft";

      case "3":
        return "archived";

      case "4": {
        const custom =
          await askRequired(
            "Custom Status"
          );

        return custom;
      }

      default:
        /*
         * Also allow direct text input.
         *
         * This does not impose additional historical
         * classification rules.
         */

        if (answer.length > 0) {
          return answer;
        }

        console.log(
          "Please select a status."
        );
    }
  }
}

/*
 * ============================================================
 * CREATE HISTORICAL PERSONALITY
 * ============================================================
 */

export async function createHistoricalPersonality(
  entity: EntityInput
): Promise<HistoricalPersonalityEntityInput> {
  if (
    entity.entityType !==
    "historicalPersonality"
  ) {
    throw new Error(
      "createHistoricalPersonality() requires a historical personality entity."
    );
  }

  let personality =
    createEmptyHistoricalPersonalityInput(
      entity
    );

  separator();

  console.log(
    "VEERBHARAT HISTORICAL PERSONALITY DATA ENTRY"
  );

  separator();

  console.log(
    `ENTITY NAME : ${entity.name}`
  );

  /*
   * ----------------------------------------------------------
   * BASIC INFORMATION
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "BASIC INFORMATION"
  );

  separator();

  personality =
    setNativeName(
      personality,
      await askOptional(
        "Native Name"
      )
    );

  personality =
    setTitle(
      personality,
      await askOptional(
        "Title"
      )
    );

  personality =
    setGender(
      personality,
      await askOptional(
        "Gender"
      )
    );

  /*
   * ----------------------------------------------------------
   * DESCRIPTION
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "DESCRIPTION"
  );

  separator();

  personality =
    setShortDescription(
      personality,
      await askOptional(
        "Short Description"
      )
    );

  personality =
    setBiography(
      personality,
      await askOptional(
        "Biography"
      )
    );

  /*
   * ----------------------------------------------------------
   * DATES
   * ----------------------------------------------------------
   *
   * These values are collected as strings.
   *
   * The separate date verification stage is responsible for
   * verifying the historical dates and On-This-Day status.
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "DATE INFORMATION"
  );

  separator();

  personality =
    setBirthDate(
      personality,
      await askOptional(
        "Birth Date (YYYY-MM-DD)"
      )
    );

  personality =
    setDeathDate(
      personality,
      await askOptional(
        "Death Date (YYYY-MM-DD)"
      )
    );

  /*
   * ----------------------------------------------------------
   * IMAGE
   * ----------------------------------------------------------
   *
   * Current project rule:
   * maximum one image.
   *
   * Image discovery/verification is handled separately.
   *
   * Therefore we do not ask the operator to manufacture an
   * image ID here.
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "IMAGE"
  );

  separator();

  console.log(
    "Image selection will be handled by image verification."
  );

  personality.imageIds =
    [];

  /*
   * ----------------------------------------------------------
   * STATUS
   * ----------------------------------------------------------
   */

  separator();

  personality =
    setHistoricalPersonalityStatus(
      personality,
      await askStatus()
    );

  /*
   * ----------------------------------------------------------
   * ADDITIONAL INFORMATION
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "ADDITIONAL INFORMATION"
  );

  separator();

  personality =
    setAdditionalInformation(
      personality,
      await askOptional(
        "Additional Information"
      )
    );

  /*
   * ----------------------------------------------------------
   * VALIDATION
   * ----------------------------------------------------------
   */

  validateHistoricalPersonalityInput(
    personality
  );

  /*
   * ----------------------------------------------------------
   * REVIEW
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "HISTORICAL PERSONALITY INPUT REVIEW"
  );

  separator();

  console.log(
    `ENTITY NAME        : ${
      personality.entityName
    }`
  );

  console.log(
    `NATIVE NAME        : ${
      personality.nativeName ??
      "NONE"
    }`
  );

  console.log(
    `TITLE              : ${
      personality.title ??
      "NONE"
    }`
  );

  console.log(
    `GENDER             : ${
      personality.gender ??
      "NONE"
    }`
  );

  console.log(
    `SHORT DESCRIPTION  : ${
      personality.shortDescription ??
      "NONE"
    }`
  );

  console.log(
    `BIOGRAPHY          : ${
      personality.biography ??
      "NONE"
    }`
  );

  console.log(
    `BIRTH DATE         : ${
      personality.birthDate ??
      "NONE"
    }`
  );

  console.log(
    `DEATH DATE         : ${
      personality.deathDate ??
      "NONE"
    }`
  );

  console.log(
    `IMAGE IDS          : ${
      personality.imageIds.length > 0
        ? personality.imageIds.join(", ")
        : "NONE"
    }`
  );

  console.log(
    `STATUS             : ${
      personality.status
    }`
  );

  console.log(
    `ADDITIONAL INFO    : ${
      personality.additionalInformation ??
      "NONE"
    }`
  );

  separator();

  console.log(
    "HISTORICAL PERSONALITY INPUT CREATED"
  );

  separator();

  console.log(
    "No MongoDB operation has been performed."
  );

  return personality;
}

/*
 * ============================================================
 * STANDALONE TEST
 * ============================================================
 */

if (
  process.argv[1]?.endsWith(
    "createHistoricalPersonality.ts"
  )
) {
  (async () => {
    try {
      const {
        getEntityInput,
      } = await import(
        "../db/entityInput"
      );

      const entity =
        await getEntityInput();

      if (
        entity.entityType !==
        "historicalPersonality"
      ) {
        throw new Error(
          "Please enter a historical personality entity."
        );
      }

      const personality =
        await createHistoricalPersonality(
          entity
        );

      separator();

      console.log(
        "HISTORICAL PERSONALITY ENTITY RESULT"
      );

      separator();

      console.log(
        JSON.stringify(
          personality,
          null,
          2
        )
      );
    } catch (error) {
      console.error("");

      console.error(
        "HISTORICAL PERSONALITY DATA ENTRY FAILED"
      );

      console.error(
        error
      );

      process.exitCode =
        1;
    }
  })();
}