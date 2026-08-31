// scripts/data-entry/workflow/createHero.ts

import {
  ask,
} from "../utils/prompt";

import {
  createEmptyHeroInput,
  validateHeroInput,
  type HeroEntityInput,
} from "../entities/hero";

import type {
  EntityInput,
} from "../db/entityInput";

/*
 * ============================================================
 * VEERBHARAT HERO DATA ENTRY
 * ============================================================
 *
 * This module collects Hero-specific information.
 *
 * It does NOT:
 *
 *   - research historical facts
 *   - create MongoDB IDs
 *   - write to MongoDB
 *   - automatically classify somebody as a Hero
 *   - invent missing information
 *
 * Research and verification happen in separate stages.
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

async function askArray(
  question: string
): Promise<string[]> {
  const answer =
    await ask(
      `${question} > `
    );

  if (!answer.trim()) {
    return [];
  }

  return [
    ...new Set(
      answer
        .split(",")
        .map(
          (value) =>
            value.trim()
        )
        .filter(
          (value) =>
            value.length > 0
        )
    ),
  ];
}

async function askGender(): Promise<
  "Male" | "Female" | "Other"
> {
  while (true) {
    console.log("");
    console.log(
      "GENDER"
    );
    console.log(
      "  1. Male"
    );
    console.log(
      "  2. Female"
    );
    console.log(
      "  3. Other"
    );

    const answer =
      (
        await ask(
          "GENDER > "
        )
      ).trim();

    if (answer === "1") {
      return "Male";
    }

    if (answer === "2") {
      return "Female";
    }

    if (answer === "3") {
      return "Other";
    }

    console.log(
      "Please enter 1, 2, or 3."
    );
  }
}

async function askOptionalNumber(
  question: string
): Promise<number | null> {
  while (true) {
    const answer =
      (
        await ask(
          `${question} (optional) > `
        )
      ).trim();

    if (!answer) {
      return null;
    }

    const value =
      Number(answer);

    if (
      Number.isFinite(value) &&
      value >= 0
    ) {
      return value;
    }

    console.log(
      "Please enter a non-negative number or leave blank."
    );
  }
}

/*
 * ============================================================
 * CREATE HERO
 * ============================================================
 */

export async function createHero(
  entity: EntityInput
): Promise<HeroEntityInput> {
  if (
    entity.entityType !== "hero"
  ) {
    throw new Error(
      "createHero() requires a hero entity."
    );
  }

  let hero =
    createEmptyHeroInput(
      entity
    );

  separator();

  console.log(
    "VEERBHARAT HERO DATA ENTRY"
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

  hero.nativeName =
    await askOptional(
      "Native Name"
    );

  hero.alternativeNames =
    await askArray(
      "Alternative Names (comma separated)"
    );

  hero.title =
    await askOptional(
      "Title"
    );

  hero.gender =
    await askGender();

  hero.nickname =
    await askOptional(
      "Nickname"
    );

  /*
   * ----------------------------------------------------------
   * DATE INFORMATION
   * ----------------------------------------------------------
   *
   * Date verification is handled separately.
   *
   * These fields are collected here only if the operator
   * already has verified values available.
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "DATE INFORMATION"
  );

  separator();

  hero.birthDate =
    await askOptional(
      "Birth Date (YYYY-MM-DD)"
    );

  if (hero.birthDate) {
    console.log(
      "Birth date accuracy:"
    );
    console.log(
      "  1. Exact"
    );
    console.log(
      "  2. Approximate"
    );
    console.log(
      "  3. Unknown"
    );

    while (true) {
      const answer =
        (
          await ask(
            "ACCURACY > "
          )
        ).trim();

      if (answer === "1") {
        hero.birthDateAccuracy =
          "Exact";
        break;
      }

      if (answer === "2") {
        hero.birthDateAccuracy =
          "Approximate";
        break;
      }

      if (answer === "3") {
        hero.birthDateAccuracy =
          "Unknown";
        break;
      }

      console.log(
        "Please enter 1, 2, or 3."
      );
    }
  }

  hero.deathDate =
    await askOptional(
      "Death Date (YYYY-MM-DD)"
    );

  if (hero.deathDate) {
    console.log(
      "Death date accuracy:"
    );
    console.log(
      "  1. Exact"
    );
    console.log(
      "  2. Approximate"
    );
    console.log(
      "  3. Unknown"
    );

    while (true) {
      const answer =
        (
          await ask(
            "ACCURACY > "
          )
        ).trim();

      if (answer === "1") {
        hero.deathDateAccuracy =
          "Exact";
        break;
      }

      if (answer === "2") {
        hero.deathDateAccuracy =
          "Approximate";
        break;
      }

      if (answer === "3") {
        hero.deathDateAccuracy =
          "Unknown";
        break;
      }

      console.log(
        "Please enter 1, 2, or 3."
      );
    }
  }

  /*
   * ----------------------------------------------------------
   * PLACES
   * ----------------------------------------------------------
   *
   * These are existing IDs only.
   *
   * No Place record is created here.
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "PLACE RELATIONSHIPS"
  );

  separator();

  hero.birthPlaceId =
    await askOptional(
      "Birth Place ID"
    );

  hero.deathPlaceId =
    await askOptional(
      "Death Place ID"
    );

  /*
   * ----------------------------------------------------------
   * CONTENT
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "CONTENT"
  );

  separator();

  hero.biography =
    await askRequired(
      "Biography"
    );

  hero.shortDescription =
    await askOptional(
      "Short Description"
    );

  hero.knownFor =
    await askArray(
      "Known For (comma separated)"
    );

  hero.occupation =
    await askArray(
      "Occupation (comma separated)"
    );

  hero.roles =
    await askArray(
      "Roles (comma separated)"
    );

  hero.languagesKnown =
    await askArray(
      "Languages Known (comma separated)"
    );

  hero.education =
    await askArray(
      "Education (comma separated)"
    );

  hero.religion =
    await askOptional(
      "Religion"
    );

  hero.personalityTraits =
    await askArray(
      "Personality Traits (comma separated)"
    );

  hero.legacy =
    await askOptional(
      "Legacy"
    );

  hero.achievements =
    await askArray(
      "Achievements (comma separated)"
    );

  hero.notableFeats =
    await askArray(
      "Notable Feats (comma separated)"
    );

  hero.militaryTactics =
    await askArray(
      "Military Tactics (comma separated)"
    );

  /*
   * ----------------------------------------------------------
   * POLITICAL INFORMATION
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "POLITICAL INFORMATION"
  );

  separator();

  hero.kingdomId =
    await askOptional(
      "Kingdom / Polity ID"
    );

  hero.capitalId =
    await askOptional(
      "Capital ID"
    );

  hero.historicalPeriodId =
    await askOptional(
      "Historical Period ID"
    );

  hero.reignPeriod =
    await askOptional(
      "Reign Period"
    );

  /*
   * ----------------------------------------------------------
   * MILITARY INFORMATION
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "MILITARY INFORMATION"
  );

  separator();

  hero.rank =
    await askOptional(
      "Rank"
    );

  hero.armySize =
    await askOptionalNumber(
      "Army Size"
    );

  hero.warAnimalId =
    await askOptional(
      "War Animal ID"
    );

  hero.primaryWeaponIds =
    await askArray(
      "Primary Weapon IDs (comma separated)"
    );

  hero.preferredWeapons =
    await askArray(
      "Preferred Weapons (comma separated)"
    );

  hero.warStrategyIds =
    await askArray(
      "War Strategy IDs (comma separated)"
    );

  /*
   * ----------------------------------------------------------
   * FAMILY
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "FAMILY INFORMATION"
  );

  separator();

  hero.fatherId =
    await askOptional(
      "Father ID"
    );

  hero.motherId =
    await askOptional(
      "Mother ID"
    );

  hero.brothers =
    await askArray(
      "Brothers IDs / names (comma separated)"
    );

  hero.sisters =
    await askArray(
      "Sisters IDs / names (comma separated)"
    );

  hero.spouseIds =
    await askArray(
      "Spouse IDs (comma separated)"
    );

  hero.childrenIds =
    await askArray(
      "Children IDs (comma separated)"
    );

  hero.dynastyId =
    await askOptional(
      "Dynasty ID"
    );

  hero.clan =
    await askOptional(
      "Clan"
    );

  /*
   * ----------------------------------------------------------
   * RELATIONSHIPS
   * ----------------------------------------------------------
   *
   * These fields will later be populated from approved
   * relationship discovery.
   *
   * We leave them empty here rather than asking the operator
   * to manually invent IDs.
   * ----------------------------------------------------------
   */

  hero.relatedHeroes =
    [];

  hero.relatedBattles =
    [];

  hero.relatedPlaces =
    [];

  hero.relatedBooks =
    [];

  hero.relatedSources =
    [];

  hero.relatedImages =
    [];

  hero.quoteIds =
    [];

  hero.bookIds =
    [];

  hero.imageIds =
    [];

  /*
   * ----------------------------------------------------------
   * SEARCH / TAGS
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "SEARCH / TAG INFORMATION"
  );

  separator();

  hero.tags =
    await askArray(
      "Tags (comma separated)"
    );

  hero.searchKeywords =
    await askArray(
      "Search Keywords (comma separated)"
    );

  hero.nativeSpellings =
    await askArray(
      "Native Spellings (comma separated)"
    );

  hero.alternateSpellings =
    await askArray(
      "Alternate Spellings (comma separated)"
    );

  hero.aliases =
    await askArray(
      "Aliases (comma separated)"
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

  hero.additionalInformation =
    await askOptional(
      "Additional Information"
    );

  /*
   * ----------------------------------------------------------
   * VALIDATION
   * ----------------------------------------------------------
   */

  validateHeroInput(
    hero
  );

  /*
   * ----------------------------------------------------------
   * REVIEW
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "HERO INPUT REVIEW"
  );

  separator();

  console.log(
    `ENTITY NAME        : ${hero.entityName}`
  );

  console.log(
    `NATIVE NAME        : ${
      hero.nativeName ?? "NONE"
    }`
  );

  console.log(
    `TITLE              : ${
      hero.title ?? "NONE"
    }`
  );

  console.log(
    `GENDER             : ${
      hero.gender ?? "NONE"
    }`
  );

  console.log(
    `BIRTH DATE         : ${
      hero.birthDate ?? "NONE"
    }`
  );

  console.log(
    `DEATH DATE         : ${
      hero.deathDate ?? "NONE"
    }`
  );

  console.log(
    `BIRTH PLACE ID     : ${
      hero.birthPlaceId ?? "NONE"
    }`
  );

  console.log(
    `DEATH PLACE ID     : ${
      hero.deathPlaceId ?? "NONE"
    }`
  );

  console.log(
    `KINGDOM ID         : ${
      hero.kingdomId ?? "NONE"
    }`
  );

  console.log(
    `DYNASTY ID         : ${
      hero.dynastyId ?? "NONE"
    }`
  );

  console.log(
    `HISTORICAL PERIOD  : ${
      hero.historicalPeriodId ??
      "NONE"
    }`
  );

  console.log(
    `RANK               : ${
      hero.rank ?? "NONE"
    }`
  );

  console.log(
    `ARMY SIZE          : ${
      hero.armySize ?? "NONE"
    }`
  );

  console.log(
    `BIOGRAPHY          : ${
      hero.biography
    }`
  );

  console.log(
    `BOOK IDS           : ${
      hero.bookIds.length > 0
        ? hero.bookIds.join(", ")
        : "NONE"
    }`
  );

  console.log(
    `QUOTE IDS          : ${
      hero.quoteIds.length > 0
        ? hero.quoteIds.join(", ")
        : "NONE"
    }`
  );

  console.log(
    `IMAGE IDS          : ${
      hero.imageIds.length > 0
        ? hero.imageIds.join(", ")
        : "NONE"
    }`
  );

  console.log(
    `ADDITIONAL INFO    : ${
      hero.additionalInformation ??
      "NONE"
    }`
  );

  separator();

  console.log(
    "HERO INPUT CREATED"
  );

  separator();

  console.log(
    "No MongoDB operation has been performed."
  );

  return hero;
}

/*
 * ============================================================
 * STANDALONE TEST
 * ============================================================
 */

if (
  process.argv[1]?.endsWith(
    "createHero.ts"
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
        "hero"
      ) {
        throw new Error(
          "Please enter a hero entity."
        );
      }

      const hero =
        await createHero(
          entity
        );

      separator();

      console.log(
        "HERO ENTITY RESULT"
      );

      separator();

      console.log(
        JSON.stringify(
          hero,
          null,
          2
        )
      );
    } catch (error) {
      console.error("");

      console.error(
        "HERO DATA ENTRY FAILED"
      );

      console.error(
        error
      );

      process.exitCode =
        1;
    }
  })();
}