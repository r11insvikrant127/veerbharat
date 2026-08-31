// scripts/data-entry/entities/hero.ts

import type { EntityInput } from "../db/entityInput";

export type HeroEntityInput = {
  entityType: "hero";

  entityName: string;

  /*
   * ----------------------------------------------------------
   * BASIC INFORMATION
   * ----------------------------------------------------------
   */

  nativeName: string | null;

  alternativeNames: string[];

  title: string | null;

  gender:
    | "Male"
    | "Female"
    | "Other"
    | null;

  nickname: string | null;

  /*
   * ----------------------------------------------------------
   * DATE INFORMATION
   * ----------------------------------------------------------
   */

  birthDate: string | null;

  birthDateAccuracy:
    | "Exact"
    | "Approximate"
    | "Unknown";

  deathDate: string | null;

  deathDateAccuracy:
    | "Exact"
    | "Approximate"
    | "Unknown";

  /*
   * ----------------------------------------------------------
   * PLACES
   * ----------------------------------------------------------
   */

  birthPlaceId: string | null;

  deathPlaceId: string | null;

  /*
   * ----------------------------------------------------------
   * CONTENT
   * ----------------------------------------------------------
   */

  biography: string;

  shortDescription: string | null;

  knownFor: string[];

  occupation: string[];

  roles: string[];

  languagesKnown: string[];

  education: string[];

  religion: string | null;

  personalityTraits: string[];

  legacy: string | null;

  achievements: string[];

  notableFeats: string[];

  militaryTactics: string[];

  /*
   * ----------------------------------------------------------
   * POLITICAL
   * ----------------------------------------------------------
   */

  kingdomId: string | null;

  capitalId: string | null;

  historicalPeriodId: string | null;

  reignPeriod: string | null;

  /*
   * ----------------------------------------------------------
   * MILITARY
   * ----------------------------------------------------------
   */

  rank: string | null;

  armySize: number | null;

  warAnimalId: string | null;

  primaryWeaponIds: string[];

  preferredWeapons: string[];

  warStrategyIds: string[];

  /*
   * ----------------------------------------------------------
   * FAMILY
   * ----------------------------------------------------------
   */

  fatherId: string | null;

  motherId: string | null;

  brothers: string[];

  sisters: string[];

  spouseIds: string[];

  childrenIds: string[];

  dynastyId: string | null;

  clan: string | null;

  /*
   * ----------------------------------------------------------
   * RELATIONSHIPS
   * ----------------------------------------------------------
   */

  relatedHeroes: string[];

  relatedBattles: string[];

  relatedPlaces: string[];

  relatedBooks: string[];

  relatedSources: string[];

  relatedImages: string[];

  quoteIds: string[];

  bookIds: string[];

  imageIds: string[];

  /*
   * ----------------------------------------------------------
   * SEARCH / TAGS
   * ----------------------------------------------------------
   */

  tags: string[];

  searchKeywords: string[];

  nativeSpellings: string[];

  alternateSpellings: string[];

  aliases: string[];

  /*
   * ----------------------------------------------------------
   * METADATA
   * ----------------------------------------------------------
   */

  additionalInformation: string | null;
};

/*
 * ============================================================
 * CREATE EMPTY HERO INPUT
 * ============================================================
 *
 * This function creates the structure used by the workflow.
 *
 * It does NOT:
 *
 *   - research anything
 *   - create a MongoDB ID
 *   - create a database document
 *   - invent historical information
 */

export function createEmptyHeroInput(
  entity: EntityInput
): HeroEntityInput {
  if (
    entity.entityType !== "hero"
  ) {
    throw new Error(
      "createEmptyHeroInput requires a hero entity."
    );
  }

  return {
    entityType: "hero",

    entityName:
      entity.name,

    /*
     * BASIC
     */

    nativeName:
      null,

    alternativeNames:
      [],

    title:
      null,

    gender:
      null,

    nickname:
      null,

    /*
     * DATES
     */

    birthDate:
      null,

    birthDateAccuracy:
      "Unknown",

    deathDate:
      null,

    deathDateAccuracy:
      "Unknown",

    /*
     * PLACES
     */

    birthPlaceId:
      null,

    deathPlaceId:
      null,

    /*
     * CONTENT
     */

    biography:
      "",

    shortDescription:
      null,

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
      null,

    personalityTraits:
      [],

    legacy:
      null,

    achievements:
      [],

    notableFeats:
      [],

    militaryTactics:
      [],

    /*
     * POLITICAL
     */

    kingdomId:
      null,

    capitalId:
      null,

    historicalPeriodId:
      null,

    reignPeriod:
      null,

    /*
     * MILITARY
     */

    rank:
      null,

    armySize:
      null,

    warAnimalId:
      null,

    primaryWeaponIds:
      [],

    preferredWeapons:
      [],

    warStrategyIds:
      [],

    /*
     * FAMILY
     */

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
      null,

    /*
     * RELATIONSHIPS
     */

    relatedHeroes:
      [],

    relatedBattles:
      [],

    relatedPlaces:
      [],

    relatedBooks:
      [],

    relatedSources:
      [],

    relatedImages:
      [],

    quoteIds:
      [],

    bookIds:
      [],

    imageIds:
      [],

    /*
     * SEARCH
     */

    tags:
      [],

    searchKeywords:
      [],

    nativeSpellings:
      [],

    alternateSpellings:
      [],

    aliases:
      [],

    /*
     * USER INFORMATION
     */

    additionalInformation:
      null,
  };
}

/*
 * ============================================================
 * VALIDATION
 * ============================================================
 *
 * This validates the information collected for a Hero.
 *
 * It intentionally does NOT validate historical truth.
 *
 * Historical truth is handled by:
 *
 *   research
 *       ↓
 *   verification
 *       ↓
 *   operator approval
 */

export function validateHeroInput(
  hero: HeroEntityInput
): void {
  if (
    !hero.entityName.trim()
  ) {
    throw new Error(
      "Hero name cannot be empty."
    );
  }

  if (
    !hero.biography.trim()
  ) {
    throw new Error(
      "Hero biography cannot be empty."
    );
  }

  if (
    !hero.gender
  ) {
    throw new Error(
      "Hero gender must be specified before database writing."
    );
  }

  if (
    hero.armySize !== null &&
    (
      !Number.isFinite(
        hero.armySize
      ) ||
      hero.armySize < 0
    )
  ) {
    throw new Error(
      "Hero armySize must be a non-negative number or null."
    );
  }

  if (
    hero.birthDate &&
    hero.deathDate
  ) {
    const birth =
      new Date(
        hero.birthDate
      );

    const death =
      new Date(
        hero.deathDate
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
      throw new Error(
        "Hero birth date cannot be later than death date."
      );
    }
  }
}

/*
 * ============================================================
 * ADDITIONAL INFORMATION
 * ============================================================
 *
 * User-provided information is kept separately.
 *
 * The workflow can later compare it against researched data
 * before incorporating it into the final record.
 */

export function setAdditionalInformation(
  hero: HeroEntityInput,
  information: string | null
): HeroEntityInput {
  return {
    ...hero,

    additionalInformation:
      information?.trim() ||
      null,
  };
}

/*
 * ============================================================
 * RELATIONSHIP HELPERS
 * ============================================================
 */

export function setHeroKingdom(
  hero: HeroEntityInput,
  kingdomId: string
): HeroEntityInput {
  if (
    !kingdomId.trim()
  ) {
    throw new Error(
      "Kingdom ID cannot be empty."
    );
  }

  return {
    ...hero,

    kingdomId:
      kingdomId.trim(),
  };
}

export function addHeroBook(
  hero: HeroEntityInput,
  bookId: string
): HeroEntityInput {
  const id =
    bookId.trim();

  if (!id) {
    return hero;
  }

  if (
    hero.bookIds.includes(id)
  ) {
    return hero;
  }

  return {
    ...hero,

    bookIds: [
      ...hero.bookIds,
      id,
    ],

    relatedBooks: [
      ...hero.relatedBooks,
      id,
    ],
  };
}

export function addHeroQuote(
  hero: HeroEntityInput,
  quoteId: string
): HeroEntityInput {
  const id =
    quoteId.trim();

  if (!id) {
    return hero;
  }

  if (
    hero.quoteIds.includes(id)
  ) {
    return hero;
  }

  return {
    ...hero,

    quoteIds: [
      ...hero.quoteIds,
      id,
    ],
  };
}

export function addHeroImage(
  hero: HeroEntityInput,
  imageId: string
): HeroEntityInput {
  const id =
    imageId.trim();

  if (!id) {
    return hero;
  }

  /*
   * Your current Hero model allows one image relationship
   * through the data-entry rule we established.
   *
   * Do not silently add a second image here.
   */

  if (
    hero.imageIds.length >= 1
  ) {
    throw new Error(
      "Hero already has an image. The current data-entry rule allows exactly one."
    );
  }

  return {
    ...hero,

    imageIds: [
      id,
    ],

    relatedImages: [
      id,
    ],
  };
}

export function addRelatedHero(
  hero: HeroEntityInput,
  heroId: string
): HeroEntityInput {
  const id =
    heroId.trim();

  if (!id) {
    return hero;
  }

  if (
    hero.relatedHeroes.includes(id)
  ) {
    return hero;
  }

  return {
    ...hero,

    relatedHeroes: [
      ...hero.relatedHeroes,
      id,
    ],
  };
}

export function addRelatedBattle(
  hero: HeroEntityInput,
  battleId: string
): HeroEntityInput {
  const id =
    battleId.trim();

  if (!id) {
    return hero;
  }

  if (
    hero.relatedBattles.includes(id)
  ) {
    return hero;
  }

  return {
    ...hero,

    relatedBattles: [
      ...hero.relatedBattles,
      id,
    ],
  };
}

export function addRelatedPlace(
  hero: HeroEntityInput,
  placeId: string
): HeroEntityInput {
  const id =
    placeId.trim();

  if (!id) {
    return hero;
  }

  if (
    hero.relatedPlaces.includes(id)
  ) {
    return hero;
  }

  return {
    ...hero,

    relatedPlaces: [
      ...hero.relatedPlaces,
      id,
    ],
  };
}