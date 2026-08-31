// scripts/data-entry/research/placeFinder.ts

import type {
  EntityType,
} from "../db/entityInput";

export type PlaceCandidate = {
  name: string;

  nativeName: string | null;

  aliases: string[];

  description: string | null;

  reason: string;

  confidence:
    | "HIGH"
    | "MEDIUM"
    | "LOW";
};

export type PlaceResearchResult = {
  entityType: EntityType;
  entityName: string;

  candidates: PlaceCandidate[];

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
 * CREATE PLACE CANDIDATE
 * ------------------------------------------------------------
 */

export function createPlaceCandidate(
  data: {
    name: string;

    nativeName?: string | null;

    aliases?: string[];

    description?: string | null;

    reason: string;

    confidence?:
      | "HIGH"
      | "MEDIUM"
      | "LOW";
  }
): PlaceCandidate {
  const name =
    data.name.trim();

  if (!name) {
    throw new Error(
      "Place name cannot be empty."
    );
  }

  const reason =
    data.reason.trim();

  if (!reason) {
    throw new Error(
      "Place relevance reason cannot be empty."
    );
  }

  const aliases =
    (data.aliases ?? [])
      .map(
        (alias) =>
          alias.trim()
      )
      .filter(
        Boolean
      );

  return {
    name,

    nativeName:
      data.nativeName?.trim() ||
      null,

    aliases,

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
 *
 * The same place may appear under:
 *
 *   Surat
 *   surat
 *   Surat, Gujarat
 *
 * We do not automatically decide that every variation is
 * identical. Exact normalized names are deduplicated here.
 *
 * More sophisticated matching belongs to the database
 * duplicate finder.
 */

export function deduplicatePlaceCandidates(
  candidates: PlaceCandidate[]
): PlaceCandidate[] {
  const seen =
    new Set<string>();

  const result:
    PlaceCandidate[] =
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
  switch (
    confidence
  ) {
    case "HIGH":
      return 3;

    case "MEDIUM":
      return 2;

    case "LOW":
      return 1;
  }
}

export function sortPlaceCandidates(
  candidates: PlaceCandidate[]
): PlaceCandidate[] {
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

export function buildPlaceResearchResult(
  entityType: EntityType,
  entityName: string,
  candidates: PlaceCandidate[]
): PlaceResearchResult {
  const unique =
    deduplicatePlaceCandidates(
      candidates
    );

  const sorted =
    sortPlaceCandidates(
      unique
    );

  let researchNote =
    "Place research candidates collected.";

  if (
    sorted.length === 0
  ) {
    researchNote =
      "No relevant place candidates were supplied.";
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
 * GET HIGH CONFIDENCE PLACES
 * ------------------------------------------------------------
 */

export function getHighConfidencePlaces(
  result: PlaceResearchResult
): PlaceCandidate[] {
  return result.candidates.filter(
    (candidate) =>
      candidate.confidence ===
      "HIGH"
  );
}

/*
 * ------------------------------------------------------------
 * GET PLACE BY NAME
 * ------------------------------------------------------------
 */

export function findPlaceCandidate(
  result: PlaceResearchResult,
  name: string
): PlaceCandidate | null {
  const target =
    normalize(name);

  return (
    result.candidates.find(
      (candidate) =>
        normalize(
          candidate.name
        ) === target
    ) ?? null
  );
}

/*
 * ------------------------------------------------------------
 * DISPLAY
 * ------------------------------------------------------------
 */

export function printPlaceResearch(
  result: PlaceResearchResult
): void {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "PLACE RESEARCH"
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
      "NO RELEVANT PLACE CANDIDATES FOUND."
    );

    console.log("");
    console.log(
      `NOTE : ${result.researchNote}`
    );

    return;
  }

  console.log(
    `FOUND ${result.candidates.length} POSSIBLE PLACE(S):`
  );

  result.candidates.forEach(
    (
      candidate,
      index
    ) => {
      console.log("");
      console.log(
        `PLACE ${index + 1}`
      );

      console.log(
        `  NAME        : ${candidate.name}`
      );

      console.log(
        `  NATIVE NAME : ${
          candidate.nativeName ??
          "NONE"
        }`
      );

      console.log(
        `  ALIASES     : ${
          candidate.aliases.length
            ? candidate.aliases.join(
                ", "
              )
            : "NONE"
        }`
      );

      console.log(
        `  DESCRIPTION : ${
          candidate.description ??
          "NONE"
        }`
      );

      console.log(
        `  CONFIDENCE  : ${candidate.confidence}`
      );

      console.log(
        `  REASON      : ${candidate.reason}`
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
 * This module only discovers/proposes places.
 *
 * It does NOT:
 *
 *   - create PLC IDs
 *   - insert into MongoDB
 *   - link a place to an Event
 *   - link a place to a Hero
 *   - decide that two places are duplicates
 *
 * Correct workflow:
 *
 *   RESEARCH
 *       ↓
 *   PLACE CANDIDATE
 *       ↓
 *   DATABASE DUPLICATE SEARCH
 *       ↓
 *   OPERATOR APPROVAL
 *       ↓
 *   REUSE EXISTING PLACE
 *          OR
 *   CREATE NEW PLACE
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
    "placeFinder.ts"
  )
) {
  const candidate =
    createPlaceCandidate({
      name:
        "Surat",

      nativeName:
        null,

      aliases: [
        "Surat City",
      ],

      description:
        "Historic port city in present-day Gujarat.",

      reason:
        "The entity is historically associated with Surat.",

      confidence:
        "HIGH",
    });

  const result =
    buildPlaceResearchResult(
      "event",
      "Arrival of William Hawkins at Surat",
      [candidate]
    );

  printPlaceResearch(
    result
  );
}