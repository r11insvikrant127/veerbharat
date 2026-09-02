// scripts/data-entry/workflow/dataEntry.ts

import {
  getEntityInput,
} from "../db/entityInput";

import {
  findDuplicates,
} from "../research/duplicateFinder";

import {
  researchDates,
} from "../research/dateVerifier";

import {
  findRelationships,
} from "../research/relationshipFinder";

import {
  runRelationshipApproval,
} from "./relationshipApproval";

import {
  createEvent,
} from "./createEvent";

import {
  createHero,
} from "./createHero";

import {
  createHistoricalPersonality,
} from "./createHistoricalPersonality";

import type {
  EntityType,
  EntityInput,
} from "../db/entityInput";

import type {
  DateResearchResult,
} from "../research/dateVerifier";

import type {
  RelationshipResearchResult,
} from "../research/relationshipFinder";

import type {
  DuplicateSearchResult,
} from "../research/duplicateFinder";

import type {
  EventEntityInput,
} from "../entities/event";

import type {
  HeroEntityInput,
} from "../entities/hero";

import type {
  HistoricalPersonalityEntityInput,
} from "../entities/historicalPersonality";

import type {
  RelationshipApprovalResult,
} from "./relationshipApproval";

/*
 * ============================================================
 * RESULT
 * ============================================================
 */

export type DataEntryWorkflowResult = {
  entity: EntityInput;

  duplicateSearch:
    | DuplicateSearchResult
    | null;

  dateResearch:
    | DateResearchResult
    | null;

  relationshipResearch:
    | RelationshipResearchResult
    | null;

  relationshipApproval:
    | RelationshipApprovalResult
    | null;

  entityData:
    | EventEntityInput
    | HeroEntityInput
    | HistoricalPersonalityEntityInput
    | null;

  relationshipApprovalVerified: boolean;

  readyForFinalVerification: boolean;

  cancelled: boolean;

  workflowNote: string;
};

/*
 * ============================================================
 * DISPLAY
 * ============================================================
 */

function separator(): void {
  console.log("");
  console.log(
    "========================================"
  );
}

function printEntity(
  entity: EntityInput
): void {
  separator();

  console.log(
    "ENTITY"
  );

  separator();

  console.log(
    `TYPE : ${entity.entityType}`
  );

  console.log(
    `NAME : ${entity.name}`
  );
}

/*
 * ============================================================
 * DUPLICATE REVIEW
 * ============================================================
 */

async function handleDuplicates(
  entity: EntityInput
): Promise<{
  result: DuplicateSearchResult;
  cancelled: boolean;
}> {
  const result =
    await findDuplicates(
      entity.entityType,
      entity.name
    );

  if (
    result.candidates.length === 0
  ) {
    console.log("");
    console.log(
      "No possible duplicate found."
    );

    return {
      result,
      cancelled: false,
    };
  }

  separator();

  console.log(
    "POSSIBLE EXISTING RECORDS"
  );

  separator();

  result.candidates.forEach(
    (
      candidate,
      index
    ) => {
      console.log("");

      console.log(
        `[${index + 1}] ${candidate.id}`
      );

      console.log(
        `    Name  : ${candidate.name}`
      );

      console.log(
        `    Score : ${candidate.score}`
      );

      console.log(
        `    Match : ${candidate.matchedFields.join(
          ", "
        )}`
      );
    }
  );

  console.log("");

  console.log(
    "[N] None — this is a new entity"
  );

  console.log(
    "[C] Cancel data entry"
  );

  const {
    ask,
  } = await import(
    "../utils/prompt"
  );

  while (true) {
    const answer =
      (
        await ask(
          "SELECT existing record number, N, or C > "
        )
      )
        .trim()
        .toLowerCase();

    if (
      answer === "c" ||
      answer === "cancel"
    ) {
      console.log("");
      console.log(
        "DATA ENTRY CANCELLED."
      );

      return {
        result,
        cancelled: true,
      };
    }

    if (
      answer === "n" ||
      answer === "none"
    ) {
      console.log("");
      console.log(
        "NO EXISTING RECORD SELECTED."
      );

      return {
        result,
        cancelled: false,
      };
    }

    const selected =
      Number(answer);

    if (
      Number.isInteger(
        selected
      ) &&
      selected >= 1 &&
      selected <=
        result.candidates.length
    ) {
      const candidate =
        result.candidates[
          selected - 1
        ];

      console.log("");
      console.log(
        "EXISTING RECORD SELECTED"
      );

      console.log(
        `ID   : ${candidate.id}`
      );

      console.log(
        `NAME : ${candidate.name}`
      );

      console.log("");

      console.log(
        "No new record will be created by this workflow."
      );

      return {
        result,
        cancelled: true,
      };
    }

    console.log(
      "Please enter a valid number, N, or C."
    );
  }
}

/*
 * ============================================================
 * DATE RESEARCH
 * ============================================================
 */

async function runDateResearch(
  entity: EntityInput
): Promise<DateResearchResult> {
  return researchDates(
    entity.entityType,
    entity.name
  );
}

/*
 * ============================================================
 * RELATIONSHIP RESEARCH
 * ============================================================
 */

async function runRelationshipResearch(
  entity: EntityInput
): Promise<RelationshipResearchResult> {
  return findRelationships(
    entity.entityType,
    entity.name
  );
}

/*
 * ============================================================
 * ENTITY DATA COLLECTION
 * ============================================================
 *
 * IMPORTANT:
 *
 * The appropriate entity-specific collector is selected here.
 *
 * No entity IDs are generated here.
 *
 * No MongoDB writes occur here.
 * ============================================================
 */

async function collectEntityData(
  entity: EntityInput
): Promise<
  | EventEntityInput
  | HeroEntityInput
  | HistoricalPersonalityEntityInput
> {
  switch (
    entity.entityType
  ) {
    case "event":
      return createEvent(
        entity
      );

    case "hero":
      return createHero(
        entity
      );

    case "historicalPersonality":
      return createHistoricalPersonality(
        entity
      );

    default: {
      const neverEntity:
        never =
        entity.entityType;

      throw new Error(
        `Unsupported entity type: ${neverEntity}`
      );
    }
  }
}

/*
 * ============================================================
 * MAIN WORKFLOW
 * ============================================================
 */

export async function runDataEntryWorkflow(): Promise<DataEntryWorkflowResult> {
  separator();

  console.log(
    "VEERBHARAT DATA ENTRY WORKFLOW"
  );

  separator();

  /*
   * ----------------------------------------------------------
   * STEP 1
   * ENTITY INPUT
   * ----------------------------------------------------------
   */

  const entity =
    await getEntityInput();

  printEntity(
    entity
  );

  /*
   * ----------------------------------------------------------
   * STEP 2
   * DUPLICATE DISCOVERY
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "STEP 2 — DUPLICATE DISCOVERY"
  );

  separator();

  const duplicate =
    await handleDuplicates(
      entity
    );

  if (
    duplicate.cancelled
  ) {
    return {
      entity,

      duplicateSearch:
        duplicate.result,

      dateResearch:
        null,

      relationshipResearch:
        null,

      relationshipApproval:
        null,

      entityData:
        null,

      relationshipApprovalVerified:
        false,

      readyForFinalVerification:
        false,

      cancelled:
        true,

      workflowNote:
        "Workflow stopped during duplicate review.",
    };
  }

  /*
   * ----------------------------------------------------------
   * STEP 3
   * DATE RESEARCH
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "STEP 3 — HISTORICAL DATE RESEARCH"
  );

  separator();

  const dateResearch =
    await runDateResearch(
      entity
    );

  /*
   * ----------------------------------------------------------
   * STEP 4
   * RELATIONSHIP RESEARCH
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "STEP 4 — RELATIONSHIP DISCOVERY"
  );

  separator();

  const relationshipResearch =
    await runRelationshipResearch(
      entity
    );

  /*
   * ----------------------------------------------------------
   * STEP 5
   * RELATIONSHIP APPROVAL
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "STEP 5 — RELATIONSHIP APPROVAL"
  );

  separator();

  const relationshipApproval =
    await runRelationshipApproval({
        entityType:
        entity.entityType,

        entityName:
        entity.name,

        kingdoms:
        relationshipResearch.kingdoms,

        sources:
        relationshipResearch.sources,

        books:
        relationshipResearch.books,

        quotes:
        relationshipResearch.quotes,

        places:
        relationshipResearch.places,

        battles:
        relationshipResearch.battles,

        heroes:
        relationshipResearch.heroes,

        historicalPersonalities:
        relationshipResearch.historicalPersonalities,

        historicalPeriods:
        relationshipResearch.historicalPeriods,

        images:
        relationshipResearch.images,
    });

  if (
    !relationshipApproval.verified
  ) {
    separator();

    console.log(
      "WORKFLOW STOPPED"
    );

    console.log(
      "Relationship approval was rejected."
    );

    return {
      entity,

      duplicateSearch:
        duplicate.result,

      dateResearch,

      relationshipResearch,

      relationshipApproval,

      entityData:
        null,

      relationshipApprovalVerified:
        false,

      readyForFinalVerification:
        false,

      cancelled:
        true,

      workflowNote:
        "Workflow stopped because relationship approval was rejected.",
    };
  }

  /*
   * ----------------------------------------------------------
   * STEP 6
   * ENTITY DATA COLLECTION
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "STEP 6 — ENTITY DATA COLLECTION"
  );

  separator();

  console.log("");

  console.log(
    "Collecting entity-specific information."
  );

  console.log(
    "No database operation will be performed."
  );

  const entityData =
    await collectEntityData(
      entity
    );

  /*
   * ----------------------------------------------------------
   * STEP 7
   * READY FOR FINAL VERIFICATION
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "WORKFLOW DISCOVERY / DATA COLLECTION COMPLETE"
  );

  separator();

  console.log("");

  console.log(
    "The workflow has collected:"
  );

  console.log(
    "  ✓ Entity"
  );

  console.log(
    "  ✓ Duplicate candidates"
  );

  console.log(
    "  ✓ Date research"
  );

  console.log(
    "  ✓ Relationship candidates"
  );

  console.log(
    "  ✓ Relationship approval"
  );

  console.log(
    "  ✓ Entity-specific data"
  );

  console.log("");

  console.log(
    "Database writing has NOT started."
  );

  console.log(
    "Data is ready for final verification."
  );

  return {
    entity,

    duplicateSearch:
      duplicate.result,

    dateResearch,

    relationshipResearch,

    relationshipApproval,

    entityData,

    relationshipApprovalVerified:
      true,

    readyForFinalVerification:
      true,

    cancelled:
      false,

    workflowNote:
      "Entity data, historical-date research, relationship research, and relationship approval have completed. Data is ready for final verification.",
  };
}

/*
 * ============================================================
 * STANDALONE TEST
 * ============================================================
 *
 * This runs the complete collection/discovery workflow.
 *
 * It does NOT call databaseWriter.ts.
 * ============================================================
 */

if (
  process.argv[1]?.endsWith(
    "dataEntry.ts"
  )
) {
  (async () => {
    try {
      const result =
        await runDataEntryWorkflow();

      separator();

      console.log(
        "DATA ENTRY WORKFLOW RESULT"
      );

      separator();

      console.log(
        JSON.stringify(
          result,
          null,
          2
        )
      );
    } catch (error) {
      console.error("");

      console.error(
        "DATA ENTRY WORKFLOW FAILED"
      );

      console.error(
        error
      );

      process.exitCode =
        1;
    }
  })();
}