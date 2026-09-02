// scripts/data-entry/workflow/relationshipApproval.ts

import {
  ask,
} from "../utils/prompt";

import type {
  EntityType,
} from "../db/entityInput";

import type {
  RelationshipCandidate,
} from "../research/relationshipFinder";

/*
 * ============================================================
 * TYPES
 * ============================================================
 */

export type RelationshipDecision =
  | "existing"
  | "new"
  | "skip";

export type RelationshipSelection = {
  decision: RelationshipDecision;

  existingId: string | null;

  createNew: boolean;

  newName: string | null;
};

export type RelationshipRelationshipSelection =
  RelationshipSelection & {
    candidate: RelationshipCandidate;
  };

export type RelationshipApprovalResult = {
  entityType: EntityType;

  entityName: string;

  kingdoms:
    RelationshipRelationshipSelection[];

  sources:
    RelationshipRelationshipSelection[];

  books:
    RelationshipRelationshipSelection[];

  quotes:
    RelationshipRelationshipSelection[];

  places:
    RelationshipRelationshipSelection[];

  battles:
    RelationshipRelationshipSelection[];

  heroes:
    RelationshipRelationshipSelection[];

  historicalPersonalities:
    RelationshipRelationshipSelection[];

  historicalPeriods:
    RelationshipRelationshipSelection[];

  images:
    RelationshipRelationshipSelection[];

  verified: boolean;

  verificationNote: string;
};

/*
 * ============================================================
 * HELPERS
 * ============================================================
 */

function normalize(
  value: string
): string {
  return value
    .trim()
    .toLowerCase();
}

function isYes(
  value: string
): boolean {
  const normalized =
    normalize(value);

  return (
    normalized === "y" ||
    normalized === "yes"
  );
}

function isNo(
  value: string
): boolean {
  const normalized =
    normalize(value);

  return (
    normalized === "n" ||
    normalized === "no"
  );
}

/*
 * ============================================================
 * EMPTY SELECTION
 * ============================================================
 */

function createSkippedSelection(
  candidate: RelationshipCandidate
): RelationshipRelationshipSelection {
  return {
    candidate,

    decision:
      "skip",

    existingId:
      null,

    createNew:
      false,

    newName:
      null,
  };
}

/*
 * ============================================================
 * EXISTING / NEW / SKIP
 * ============================================================
 *
 * IMPORTANT:
 *
 * This function does NOT search MongoDB.
 *
 * It only receives a candidate that was already discovered.
 *
 * Existing IDs may be supplied by a future duplicate-search
 * integration layer.
 * ============================================================
 */

async function askExistingOrNew(
  candidate: RelationshipCandidate,
  existingId?: string | null
): Promise<RelationshipSelection> {
  console.log("");
  console.log(
    "----------------------------------------"
  );

  console.log(
    "RELATIONSHIP ACTION"
  );

  console.log(
    `NAME : ${candidate.name}`
  );

  console.log(
    `COLLECTION : ${candidate.collection}`
  );

  console.log(
    `ID : ${candidate.id}`
  );

  if (existingId) {
    console.log("");
    console.log(
      `EXISTING RECORD FOUND : ${existingId}`
    );

    console.log("");
    console.log(
      "  1. Reuse existing record"
    );

    console.log(
      "  2. Create new record"
    );

    console.log(
      "  3. Skip relationship"
    );

    while (true) {
      const answer =
        await ask(
          "SELECT 1, 2, or 3 > "
        );

      switch (
        answer.trim()
      ) {
        case "1":
          return {
            decision:
              "existing",

            existingId,

            createNew:
              false,

            newName:
              null,
          };

        case "2":
          return {
            decision:
              "new",

            existingId:
              null,

            createNew:
              true,

            newName:
              candidate.name,
          };

        case "3":
          return {
            decision:
              "skip",

            existingId:
              null,

            createNew:
              false,

            newName:
              null,
          };

        default:
          console.log(
            "Please enter 1, 2, or 3."
          );
      }
    }
  }

  /*
   * No existing database ID has been supplied.
   */

  console.log("");
  console.log(
    "NO EXISTING RECORD ID WAS SUPPLIED."
  );

  console.log("");
  console.log(
    "  1. Create new record"
  );

  console.log(
    "  2. Skip relationship"
  );

  while (true) {
    const answer =
      await ask(
        "SELECT 1 or 2 > "
      );

    if (
      answer.trim() === "1"
    ) {
      return {
        decision:
          "new",

        existingId:
          null,

        createNew:
          true,

        newName:
          candidate.name,
      };
    }

    if (
      answer.trim() === "2"
    ) {
      return {
        decision:
          "skip",

        existingId:
          null,

        createNew:
          false,

        newName:
          null,
      };
    }

    console.log(
      "Please enter 1 or 2."
    );
  }
}

/*
 * ============================================================
 * APPROVE GENERIC CANDIDATES
 * ============================================================
 */

async function approveCandidates(
  label: string,
  candidates: RelationshipCandidate[],
  existingIds: Map<string, string>
): Promise<
  RelationshipRelationshipSelection[]
> {
  const selections:
    RelationshipRelationshipSelection[] =
    [];

  console.log("");
  console.log(
    "========================================"
  );

  console.log(
    `${label.toUpperCase()} RELATIONSHIP APPROVAL`
  );

  console.log(
    "========================================"
  );

  if (
    candidates.length === 0
  ) {
    console.log("");
    console.log(
      `NO ${label.toUpperCase()} CANDIDATES.`
    );

    return selections;
  }

  for (
    const candidate of candidates
  ) {
    console.log("");
    console.log(
      "----------------------------------------"
    );

    console.log(
      `${label.toUpperCase()} CANDIDATE`
    );

    console.log(
      "----------------------------------------"
    );

    console.log(
      `NAME       : ${candidate.name}`
    );

    console.log(
      `ID         : ${candidate.id}`
    );

    console.log(
      `COLLECTION : ${candidate.collection}`
    );

    console.log(
      `REASON     : ${candidate.reason}`
    );

    const relevant =
      await ask(
        `Is this ${label.toLowerCase()} relevant to the entity? (y/n) > `
      );

    if (
      !isYes(relevant)
    ) {
      selections.push(
        createSkippedSelection(
          candidate
        )
      );

      continue;
    }

    /*
     * An external duplicate-search layer may later supply
     * an existing ID for this candidate.
     *
     * At present, no ID is invented here.
     */

    const existingId =
      existingIds.get(
        candidate.id
      ) ??
      null;

    const selection =
      await askExistingOrNew(
        candidate,
        existingId
      );

    selections.push({
      candidate,

      ...selection,
    });
  }

  return selections;
}

/*
 * ============================================================
 * KINGDOM APPROVAL
 * ============================================================
 */

export async function approveKingdoms(
  candidates: RelationshipCandidate[],
  existingIds: Map<string, string> =
    new Map()
): Promise<
  RelationshipRelationshipSelection[]
> {
  return approveCandidates(
    "Kingdom / Polity",
    candidates,
    existingIds
  );
}

/*
 * ============================================================
 * SOURCE APPROVAL
 * ============================================================
 */

export async function approveSources(
  candidates: RelationshipCandidate[],
  existingIds: Map<string, string> =
    new Map()
): Promise<
  RelationshipRelationshipSelection[]
> {
  return approveCandidates(
    "Source",
    candidates,
    existingIds
  );
}

/*
 * ============================================================
 * BOOK APPROVAL
 * ============================================================
 */

export async function approveBooks(
  candidates: RelationshipCandidate[],
  existingIds: Map<string, string> =
    new Map()
): Promise<
  RelationshipRelationshipSelection[]
> {
  return approveCandidates(
    "Book",
    candidates,
    existingIds
  );
}

/*
 * ============================================================
 * QUOTE APPROVAL
 * ============================================================
 */

export async function approveQuotes(
  candidates: RelationshipCandidate[],
  existingIds: Map<string, string> =
    new Map()
): Promise<
  RelationshipRelationshipSelection[]
> {
  return approveCandidates(
    "Quote",
    candidates,
    existingIds
  );
}

/*
 * ============================================================
 * PLACE APPROVAL
 * ============================================================
 */

export async function approvePlaces(
  candidates: RelationshipCandidate[],
  existingIds: Map<string, string> =
    new Map()
): Promise<
  RelationshipRelationshipSelection[]
> {
  return approveCandidates(
    "Place",
    candidates,
    existingIds
  );
}

/*
 * ============================================================
 * BATTLE APPROVAL
 * ============================================================
 */

export async function approveBattles(
  candidates: RelationshipCandidate[],
  existingIds: Map<string, string> =
    new Map()
): Promise<
  RelationshipRelationshipSelection[]
> {
  return approveCandidates(
    "Battle",
    candidates,
    existingIds
  );
}

/*
 * ============================================================
 * HERO APPROVAL
 * ============================================================
 */

export async function approveHeroes(
  candidates: RelationshipCandidate[],
  existingIds: Map<string, string> =
    new Map()
): Promise<
  RelationshipRelationshipSelection[]
> {
  return approveCandidates(
    "Hero",
    candidates,
    existingIds
  );
}

/*
 * ============================================================
 * HISTORICAL PERSONALITY APPROVAL
 * ============================================================
 */

export async function approveHistoricalPersonalities(
  candidates: RelationshipCandidate[],
  existingIds: Map<string, string> =
    new Map()
): Promise<
  RelationshipRelationshipSelection[]
> {
  return approveCandidates(
    "Historical Personality",
    candidates,
    existingIds
  );
}

/*
 * ============================================================
 * HISTORICAL PERIOD APPROVAL
 * ============================================================
 */

export async function approveHistoricalPeriods(
  candidates: RelationshipCandidate[],
  existingIds: Map<string, string> =
    new Map()
): Promise<
  RelationshipRelationshipSelection[]
> {
  return approveCandidates(
    "Historical Period",
    candidates,
    existingIds
  );
}

/*
 * ============================================================
 * IMAGE APPROVAL
 * ============================================================
 */

export async function approveImages(
  candidates: RelationshipCandidate[],
  existingIds: Map<string, string> =
    new Map()
): Promise<
  RelationshipRelationshipSelection[]
> {
  return approveCandidates(
    "Image",
    candidates,
    existingIds
  );
}

/*
 * ============================================================
 * REVIEW
 * ============================================================
 */

function printSelections(
  label: string,
  selections:
    RelationshipRelationshipSelection[]
): void {
  console.log("");
  console.log(
    "----------------------------------------"
  );

  console.log(
    label.toUpperCase()
  );

  console.log(
    "----------------------------------------"
  );

  if (
    selections.length === 0
  ) {
    console.log(
      "NONE"
    );

    return;
  }

  selections.forEach(
    (
      selection,
      index
    ) => {
      console.log("");
      console.log(
        `[${index + 1}] ${selection.candidate.name}`
      );

      console.log(
        `    Candidate ID : ${selection.candidate.id}`
      );

      console.log(
        `    Collection   : ${selection.candidate.collection}`
      );

      console.log(
        `    Decision     : ${selection.decision}`
      );

      if (
        selection.existingId
      ) {
        console.log(
          `    Existing ID  : ${selection.existingId}`
        );
      }

      if (
        selection.createNew
      ) {
        console.log(
          `    New Name     : ${
            selection.newName ??
            "NONE"
          }`
        );
      }
    }
  );
}

function printReview(
  result: RelationshipApprovalResult
): void {
  console.log("");
  console.log(
    "========================================"
  );

  console.log(
    "RELATIONSHIP REVIEW"
  );

  console.log(
    "========================================"
  );

  console.log("");

  console.log(
    `ENTITY TYPE : ${result.entityType}`
  );

  console.log(
    `ENTITY NAME : ${result.entityName}`
  );

  printSelections(
    "KINGDOMS / POLITIES",
    result.kingdoms
  );

  printSelections(
    "SOURCES",
    result.sources
  );

  printSelections(
    "BOOKS",
    result.books
  );

  printSelections(
    "QUOTES",
    result.quotes
  );

  printSelections(
    "PLACES",
    result.places
  );

  printSelections(
    "BATTLES",
    result.battles
  );

  printSelections(
    "HEROES",
    result.heroes
  );

  printSelections(
    "HISTORICAL PERSONALITIES",
    result.historicalPersonalities
  );

  printSelections(
    "HISTORICAL PERIODS",
    result.historicalPeriods
  );

  printSelections(
    "IMAGES",
    result.images
  );
}

/*
 * ============================================================
 * MAIN APPROVAL FUNCTION
 * ============================================================
 */

export async function runRelationshipApproval(
  input: {
    entityType: EntityType;

    entityName: string;

    kingdoms?: RelationshipCandidate[];

    sources?: RelationshipCandidate[];

    books?: RelationshipCandidate[];

    quotes?: RelationshipCandidate[];

    places?: RelationshipCandidate[];

    battles?: RelationshipCandidate[];

    heroes?: RelationshipCandidate[];

    historicalPersonalities?: RelationshipCandidate[];

    historicalPeriods?: RelationshipCandidate[];

    images?: RelationshipCandidate[];

    existingKingdomIds?: Map<string, string>;

    existingSourceIds?: Map<string, string>;

    existingBookIds?: Map<string, string>;

    existingQuoteIds?: Map<string, string>;

    existingPlaceIds?: Map<string, string>;

    existingBattleIds?: Map<string, string>;

    existingHeroIds?: Map<string, string>;

    existingHistoricalPersonalityIds?: Map<string, string>;

    existingHistoricalPeriodIds?: Map<string, string>;

    existingImageIds?: Map<string, string>;
  }
): Promise<RelationshipApprovalResult> {
  console.log("");
  console.log(
    "========================================"
  );

  console.log(
    "VEERBHARAT RELATIONSHIP APPROVAL"
  );

  console.log(
    "========================================"
  );

  console.log("");

  console.log(
    `ENTITY TYPE : ${input.entityType}`
  );

  console.log(
    `ENTITY NAME : ${input.entityName}`
  );

  /*
   * ----------------------------------------------------------
   * KINGDOM / POLITY
   * ----------------------------------------------------------
   */

  const kingdoms =
    await approveKingdoms(
      input.kingdoms ?? [],
      input.existingKingdomIds ??
        new Map()
    );

  /*
   * ----------------------------------------------------------
   * SOURCE
   * ----------------------------------------------------------
   */

  const sources =
    await approveSources(
      input.sources ?? [],
      input.existingSourceIds ??
        new Map()
    );

  /*
   * ----------------------------------------------------------
   * BOOK
   * ----------------------------------------------------------
   */

  const books =
    await approveBooks(
      input.books ?? [],
      input.existingBookIds ??
        new Map()
    );

  /*
   * ----------------------------------------------------------
   * QUOTE
   * ----------------------------------------------------------
   */

  const quotes =
    await approveQuotes(
      input.quotes ?? [],
      input.existingQuoteIds ??
        new Map()
    );

  /*
   * ----------------------------------------------------------
   * PLACE
   * ----------------------------------------------------------
   */

  const places =
    await approvePlaces(
      input.places ?? [],
      input.existingPlaceIds ??
        new Map()
    );

  /*
   * ----------------------------------------------------------
   * BATTLE
   * ----------------------------------------------------------
   */

  const battles =
    await approveBattles(
      input.battles ?? [],
      input.existingBattleIds ??
        new Map()
    );

  /*
   * ----------------------------------------------------------
   * HERO
   * ----------------------------------------------------------
   */

  const heroes =
    await approveHeroes(
      input.heroes ?? [],
      input.existingHeroIds ??
        new Map()
    );

  /*
   * ----------------------------------------------------------
   * HISTORICAL PERSONALITY
   * ----------------------------------------------------------
   */

  const historicalPersonalities =
    await approveHistoricalPersonalities(
      input.historicalPersonalities ?? [],
      input.existingHistoricalPersonalityIds ??
        new Map()
    );

  /*
   * ----------------------------------------------------------
   * HISTORICAL PERIOD
   * ----------------------------------------------------------
   */

  const historicalPeriods =
    await approveHistoricalPeriods(
      input.historicalPeriods ?? [],
      input.existingHistoricalPeriodIds ??
        new Map()
    );

  /*
   * ----------------------------------------------------------
   * IMAGE
   * ----------------------------------------------------------
   */

  const images =
    await approveImages(
      input.images ?? [],
      input.existingImageIds ??
        new Map()
    );

  /*
   * ----------------------------------------------------------
   * BUILD RESULT
   * ----------------------------------------------------------
   */

  const result:
    RelationshipApprovalResult =
    {
      entityType:
        input.entityType,

      entityName:
        input.entityName,

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

      verified:
        false,

      verificationNote:
        "",
    };

  /*
   * ----------------------------------------------------------
   * REVIEW
   * ----------------------------------------------------------
   */

  printReview(
    result
  );

  console.log("");

  const confirmation =
    await ask(
      "Is this relationship selection correct? (y/n) > "
    );

  if (
    isYes(confirmation)
  ) {
    return {
      ...result,

      verified:
        true,

      verificationNote:
        "Relationship selections reviewed and approved by the data-entry operator.",
    };
  }

  if (
    isNo(confirmation)
  ) {
    return {
      ...result,

      verified:
        false,

      verificationNote:
        "Relationship selections rejected by the data-entry operator.",
    };
  }

  return {
    ...result,

    verified:
      false,

    verificationNote:
      "Relationship selection was not explicitly confirmed.",
  };
}

/*
 * ============================================================
 * ARCHITECTURAL RULE
 * ============================================================
 *
 * This module ONLY performs operator approval.
 *
 * It does NOT:
 *
 *   - search the web
 *   - search MongoDB
 *   - generate IDs
 *   - insert records
 *   - modify existing records
 *   - automatically approve candidates
 *
 * Correct architecture:
 *
 *   RESEARCH
 *       ↓
 *   CANDIDATE
 *       ↓
 *   EXISTING MATCH (if available)
 *       ↓
 *   OPERATOR DECISION
 *       ↓
 *   FINAL VERIFICATION
 *       ↓
 *   DATABASE WRITER
 *
 * No historical entity data is hardcoded here.
 * ============================================================
 */
