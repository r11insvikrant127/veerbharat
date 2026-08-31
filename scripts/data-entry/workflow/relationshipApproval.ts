// scripts/data-entry/workflow/relationshipApproval.ts

import {
  ask,
} from "../utils/prompt";

import type {
  EntityType,
} from "../db/entityInput";

import type {
  SourceResearchCandidate,
} from "../research/sourceResearch";

import type {
  PlaceCandidate,
} from "../research/placeFinder";

import type {
  BattleCandidate,
} from "../research/battleFinder";

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

export type SourceRelationshipSelection =
  RelationshipSelection & {
    candidate: SourceResearchCandidate;
  };

export type PlaceRelationshipSelection =
  RelationshipSelection & {
    candidate: PlaceCandidate;
  };

export type BattleRelationshipSelection =
  RelationshipSelection & {
    candidate: BattleCandidate;
  };

export type RelationshipApprovalResult = {
  entityType: EntityType;
  entityName: string;

  sources: SourceRelationshipSelection[];

  places: PlaceRelationshipSelection[];

  battles: BattleRelationshipSelection[];

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
 * EXISTING RECORD SELECTION
 * ============================================================
 *
 * IMPORTANT:
 *
 * This function does NOT search MongoDB.
 *
 * duplicateFinder.ts / relationshipFinder.ts are responsible
 * for finding existing records.
 *
 * This function only asks the operator what to do with the
 * candidates already discovered.
 */

async function askExistingOrNew(
  entityLabel: string,
  name: string,
  existingId?: string | null
): Promise<RelationshipSelection> {
  console.log("");
  console.log(
    "----------------------------------------"
  );

  console.log(
    `${entityLabel.toUpperCase()} RELATIONSHIP`
  );

  console.log(
    "----------------------------------------"
  );

  console.log(
    `NAME : ${name}`
  );

  if (existingId) {
    console.log("");
    console.log(
      `EXISTING RECORD : ${existingId}`
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
              name,
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

  console.log("");
  console.log(
    "NO EXISTING RECORD WAS PROVIDED."
  );

  console.log("");
  console.log(
    "Create a new record?"
  );

  while (true) {
    const answer =
      await ask(
        "(y/n) > "
      );

    if (
      isYes(answer)
    ) {
      return {
        decision:
          "new",

        existingId:
          null,

        createNew:
          true,

        newName:
          name,
      };
    }

    if (
      isNo(answer)
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
      "Please enter y or n."
    );
  }
}

/*
 * ============================================================
 * SOURCE APPROVAL
 * ============================================================
 */

export async function approveSources(
  candidates: Array<{
    candidate: SourceResearchCandidate;

    existingSourceId?: string | null;
  }>
): Promise<
  SourceRelationshipSelection[]
> {
  const selections:
    SourceRelationshipSelection[] =
    [];

  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "SOURCE RELATIONSHIP APPROVAL"
  );
  console.log(
    "========================================"
  );

  if (
    candidates.length === 0
  ) {
    console.log("");
    console.log(
      "NO SOURCE CANDIDATES."
    );

    return selections;
  }

  for (
    const item of candidates
  ) {
    const candidate =
      item.candidate;

    console.log("");
    console.log(
      `SOURCE : ${candidate.title}`
    );

    console.log(
      `URL    : ${candidate.url}`
    );

    console.log(
      `CONFIDENCE : ${candidate.confidence}`
    );

    console.log(
      `REASON : ${candidate.relevanceReason}`
    );

    const useCandidate =
      await ask(
        "Consider this source relevant? (y/n) > "
      );

    if (
      !isYes(useCandidate)
    ) {
      selections.push({
        candidate,

        decision:
          "skip",

        existingId:
          null,

        createNew:
          false,

        newName:
          null,
      });

      continue;
    }

    const selection =
      await askExistingOrNew(
        "Source",
        candidate.title,
        item.existingSourceId ??
          null
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
 * PLACE APPROVAL
 * ============================================================
 */

export async function approvePlaces(
  candidates: Array<{
    candidate: PlaceCandidate;

    existingPlaceId?: string | null;
  }>
): Promise<
  PlaceRelationshipSelection[]
> {
  const selections:
    PlaceRelationshipSelection[] =
    [];

  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "PLACE RELATIONSHIP APPROVAL"
  );
  console.log(
    "========================================"
  );

  if (
    candidates.length === 0
  ) {
    console.log("");
    console.log(
      "NO PLACE CANDIDATES."
    );

    return selections;
  }

  for (
    const item of candidates
  ) {
    const candidate =
      item.candidate;

    console.log("");
    console.log(
      `PLACE : ${candidate.name}`
    );

    console.log(
      `NATIVE NAME : ${
        candidate.nativeName ??
        "NONE"
      }`
    );

    console.log(
      `ALIASES : ${
        candidate.aliases.length
          ? candidate.aliases.join(
              ", "
            )
          : "NONE"
      }`
    );

    console.log(
      `CONFIDENCE : ${candidate.confidence}`
    );

    console.log(
      `REASON : ${candidate.reason}`
    );

    const relevant =
      await ask(
        "Is this place relevant to the entity? (y/n) > "
      );

    if (
      !isYes(relevant)
    ) {
      selections.push({
        candidate,

        decision:
          "skip",

        existingId:
          null,

        createNew:
          false,

        newName:
          null,
      });

      continue;
    }

    const selection =
      await askExistingOrNew(
        "Place",
        candidate.name,
        item.existingPlaceId ??
          null
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
 * BATTLE APPROVAL
 * ============================================================
 */

export async function approveBattles(
  candidates: Array<{
    candidate: BattleCandidate;

    existingBattleId?: string | null;
  }>
): Promise<
  BattleRelationshipSelection[]
> {
  const selections:
    BattleRelationshipSelection[] =
    [];

  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "BATTLE RELATIONSHIP APPROVAL"
  );
  console.log(
    "========================================"
  );

  if (
    candidates.length === 0
  ) {
    console.log("");
    console.log(
      "NO BATTLE CANDIDATES."
    );

    return selections;
  }

  for (
    const item of candidates
  ) {
    const candidate =
      item.candidate;

    console.log("");
    console.log(
      `BATTLE : ${candidate.name}`
    );

    console.log(
      `ALTERNATE NAMES : ${
        candidate.alternateNames.length
          ? candidate.alternateNames.join(
              ", "
            )
          : "NONE"
      }`
    );

    console.log(
      `DATE : ${
        candidate.date ??
        "NONE"
      }`
    );

    console.log(
      `LOCATION : ${
        candidate.location ??
        "NONE"
      }`
    );

    console.log(
      `CONFIDENCE : ${candidate.confidence}`
    );

    console.log(
      `REASON : ${candidate.reason}`
    );

    const relevant =
      await ask(
        "Is this battle relevant to the entity? (y/n) > "
      );

    if (
      !isYes(relevant)
    ) {
      selections.push({
        candidate,

        decision:
          "skip",

        existingId:
          null,

        createNew:
          false,

        newName:
          null,
      });

      continue;
    }

    const selection =
      await askExistingOrNew(
        "Battle",
        candidate.name,
        item.existingBattleId ??
          null
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
 * FINAL RELATIONSHIP REVIEW
 * ============================================================
 */

function printSelections(
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
    "SOURCES"
  );

  if (
    result.sources.length === 0
  ) {
    console.log(
      "  NONE"
    );
  }

  result.sources.forEach(
    (
      selection
    ) => {
      console.log(
        `  ${selection.candidate.title}`
      );

      console.log(
        `    Decision : ${selection.decision}`
      );

      if (
        selection.existingId
      ) {
        console.log(
          `    Existing ID : ${selection.existingId}`
        );
      }
    }
  );

  console.log("");

  console.log(
    "PLACES"
  );

  if (
    result.places.length === 0
  ) {
    console.log(
      "  NONE"
    );
  }

  result.places.forEach(
    (
      selection
    ) => {
      console.log(
        `  ${selection.candidate.name}`
      );

      console.log(
        `    Decision : ${selection.decision}`
      );

      if (
        selection.existingId
      ) {
        console.log(
          `    Existing ID : ${selection.existingId}`
        );
      }
    }
  );

  console.log("");

  console.log(
    "BATTLES"
  );

  if (
    result.battles.length === 0
  ) {
    console.log(
      "  NONE"
    );
  }

  result.battles.forEach(
    (
      selection
    ) => {
      console.log(
        `  ${selection.candidate.name}`
      );

      console.log(
        `    Decision : ${selection.decision}`
      );

      if (
        selection.existingId
      ) {
        console.log(
          `    Existing ID : ${selection.existingId}`
        );
      }
    }
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

    sources?: Array<{
      candidate: SourceResearchCandidate;

      existingSourceId?: string | null;
    }>;

    places?: Array<{
      candidate: PlaceCandidate;

      existingPlaceId?: string | null;
    }>;

    battles?: Array<{
      candidate: BattleCandidate;

      existingBattleId?: string | null;
    }>;
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

  const sources =
    await approveSources(
      input.sources ?? []
    );

  const places =
    await approvePlaces(
      input.places ?? []
    );

  const battles =
    await approveBattles(
      input.battles ?? []
    );

  const result:
    RelationshipApprovalResult =
    {
      entityType:
        input.entityType,

      entityName:
        input.entityName,

      sources,

      places,

      battles,

      verified:
        false,

      verificationNote:
        "",
    };

  printSelections(
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

  return {
    ...result,

    verified:
      false,

    verificationNote:
      "Relationship selections rejected by the data-entry operator.",
  };
}

/*
 * ============================================================
 * ARCHITECTURAL RULE
 * ============================================================
 *
 * This module does NOT:
 *
 *   - search the web
 *   - search MongoDB
 *   - generate IDs
 *   - insert records
 *
 * Its only job is:
 *
 *       DISCOVERY
 *          ↓
 *       CANDIDATE
 *          ↓
 *       EXISTING MATCH
 *          ↓
 *       OPERATOR DECISION
 *
 * The actual database writer remains the final step.
 */