// scripts/data-entry/research/battleFinder.ts

import type {
  EntityType,
} from "../db/entityInput";

export type BattleCandidate = {
  name: string;

  alternateNames: string[];

  date: string | null;

  location: string | null;

  description: string | null;

  reason: string;

  confidence:
    | "HIGH"
    | "MEDIUM"
    | "LOW";
};

export type BattleResearchResult = {
  entityType: EntityType;
  entityName: string;

  candidates: BattleCandidate[];

  researchCompleted: boolean;

  researchNote: string;
};

/*
 * ------------------------------------------------------------
 * NORMALIZATION
 * ------------------------------------------------------------
 */

function normalize(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/*
 * ------------------------------------------------------------
 * CREATE BATTLE CANDIDATE
 * ------------------------------------------------------------
 */

export function createBattleCandidate(
  data: {
    name: string;

    alternateNames?: string[];

    date?: string | null;

    location?: string | null;

    description?: string | null;

    reason: string;

    confidence?:
      | "HIGH"
      | "MEDIUM"
      | "LOW";
  }
): BattleCandidate {
  const name =
    data.name.trim();

  if (!name) {
    throw new Error(
      "Battle name cannot be empty."
    );
  }

  const reason =
    data.reason.trim();

  if (!reason) {
    throw new Error(
      "Battle relevance reason cannot be empty."
    );
  }

  const alternateNames =
    (data.alternateNames ?? [])
      .map(
        (value) =>
          value.trim()
      )
      .filter(
        Boolean
      );

  return {
    name,

    alternateNames,

    date:
      data.date?.trim() ||
      null,

    location:
      data.location?.trim() ||
      null,

    description:
      data.description?.trim() ||
      null,

    reason,

    confidence:
      data.confidence ??
      "MEDIUM",
  };
}

/*
 * ------------------------------------------------------------
 * DEDUPLICATION
 * ------------------------------------------------------------
 */

export function deduplicateBattleCandidates(
  candidates: BattleCandidate[]
): BattleCandidate[] {
  const seen =
    new Set<string>();

  const result:
    BattleCandidate[] =
    [];

  for (
    const candidate of candidates
  ) {
    const key =
      normalize(
        candidate.name
      );

    if (
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);

    result.push(
      candidate
    );
  }

  return result;
}

/*
 * ------------------------------------------------------------
 * CONFIDENCE SORTING
 * ------------------------------------------------------------
 */

function confidenceScore(
  confidence:
    | "HIGH"
    | "MEDIUM"
    | "LOW"
): number {
  if (
    confidence === "HIGH"
  ) {
    return 3;
  }

  if (
    confidence === "MEDIUM"
  ) {
    return 2;
  }

  return 1;
}

export function sortBattleCandidates(
  candidates: BattleCandidate[]
): BattleCandidate[] {
  return [
    ...candidates,
  ].sort(
    (a, b) =>
      confidenceScore(
        b.confidence
      ) -
      confidenceScore(
        a.confidence
      )
  );
}

/*
 * ------------------------------------------------------------
 * BUILD RESEARCH RESULT
 * ------------------------------------------------------------
 */

export function buildBattleResearchResult(
  entityType: EntityType,
  entityName: string,
  candidates: BattleCandidate[]
): BattleResearchResult {
  const unique =
    deduplicateBattleCandidates(
      candidates
    );

  const sorted =
    sortBattleCandidates(
      unique
    );

  let researchNote =
    "Battle research candidates collected.";

  if (
    sorted.length === 0
  ) {
    researchNote =
      "No relevant battle candidates were supplied.";
  }

  return {
    entityType,

    entityName:
      entityName.trim(),

    candidates:
      sorted,

    researchCompleted:
      true,

    researchNote,
  };
}

/*
 * ------------------------------------------------------------
 * FIND CANDIDATE
 * ------------------------------------------------------------
 */

export function findBattleCandidate(
  result: BattleResearchResult,
  name: string
): BattleCandidate | null {
  const target =
    normalize(name);

  for (
    const candidate
    of result.candidates
  ) {
    if (
      normalize(
        candidate.name
      ) === target
    ) {
      return candidate;
    }

    const aliasMatch =
      candidate.alternateNames.some(
        (alias) =>
          normalize(alias) ===
          target
      );

    if (aliasMatch) {
      return candidate;
    }
  }

  return null;
}

/*
 * ------------------------------------------------------------
 * HIGH CONFIDENCE BATTLES
 * ------------------------------------------------------------
 */

export function getHighConfidenceBattles(
  result: BattleResearchResult
): BattleCandidate[] {
  return result.candidates.filter(
    (candidate) =>
      candidate.confidence ===
      "HIGH"
  );
}

/*
 * ------------------------------------------------------------
 * DISPLAY
 * ------------------------------------------------------------
 */

export function printBattleResearch(
  result: BattleResearchResult
): void {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "BATTLE RESEARCH"
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

  console.log("");

  if (
    result.candidates.length === 0
  ) {
    console.log(
      "NO RELEVANT BATTLE CANDIDATES FOUND."
    );

    console.log("");
    console.log(
      `NOTE : ${result.researchNote}`
    );

    return;
  }

  console.log(
    `FOUND ${result.candidates.length} POSSIBLE BATTLE(S):`
  );

  result.candidates.forEach(
    (
      candidate,
      index
    ) => {
      console.log("");
      console.log(
        `BATTLE ${index + 1}`
      );

      console.log(
        `  NAME          : ${candidate.name}`
      );

      console.log(
        `  ALTERNATE NAMES : ${
          candidate.alternateNames.length
            ? candidate.alternateNames.join(
                ", "
              )
            : "NONE"
        }`
      );

      console.log(
        `  DATE          : ${
          candidate.date ??
          "NONE"
        }`
      );

      console.log(
        `  LOCATION      : ${
          candidate.location ??
          "NONE"
        }`
      );

      console.log(
        `  DESCRIPTION   : ${
          candidate.description ??
          "NONE"
        }`
      );

      console.log(
        `  CONFIDENCE    : ${candidate.confidence}`
      );

      console.log(
        `  REASON        : ${candidate.reason}`
      );
    }
  );

  console.log("");
  console.log(
    `RESEARCH COMPLETED : ${
      result.researchCompleted
        ? "YES"
        : "NO"
    }`
  );

  console.log(
    `NOTE : ${result.researchNote}`
  );
}

/*
 * ------------------------------------------------------------
 * ARCHITECTURAL RULE
 * ------------------------------------------------------------
 *
 * This module discovers/proposes battles.
 *
 * It does NOT:
 *
 *   - create a BTL ID
 *   - insert a Battle document
 *   - link a Battle automatically
 *   - decide that two battles are duplicates
 *
 * Correct workflow:
 *
 *   RESEARCH
 *       ↓
 *   BATTLE CANDIDATE
 *       ↓
 *   DUPLICATE FINDER
 *       ↓
 *   OPERATOR APPROVAL
 *       ↓
 *   REUSE EXISTING BTL
 *          OR
 *   CREATE NEW BTL
 *
 * This is particularly important because the same battle
 * can be mentioned using different names or spellings.
 */

/*
 * ------------------------------------------------------------
 * STANDALONE TEST
 * ------------------------------------------------------------
 *
 * No MongoDB connection.
 * No database modification.
 */

if (
  process.argv[1]?.endsWith(
    "battleFinder.ts"
  )
) {
  const candidate =
    createBattleCandidate({
      name:
        "Battle of Plassey",

      alternateNames: [
        "Plassey",
        "Battle of Palashi",
      ],

      date:
        "1757-06-23",

      location:
        "Plassey, Bengal",

      description:
        "A major eighteenth-century battle in Bengal.",

      reason:
        "The entity is historically associated with this battle.",

      confidence:
        "HIGH",
    });

  const result =
    buildBattleResearchResult(
      "event",
      "Battle of Plassey",
      [candidate]
    );

  printBattleResearch(
    result
  );
}