// scripts/data-entry/research/dateVerifier.ts

import {
  ask,
} from "../utils/prompt";

import type {
  EntityType,
} from "../db/entityInput";

export type DateResearchSource = {
  title: string;
  url: string;
  note: string;
};

export type DateResearchResult = {
  entityType: EntityType;
  entityName: string;

  proposedEventDate: string | null;

  proposedBirthDate: string | null;
  proposedDeathDate: string | null;

  confidence:
    | "high"
    | "medium"
    | "low"
    | "unknown";

  sources: DateResearchSource[];

  researchComplete: boolean;
};

/**
 * Ask for a date in YYYY-MM-DD format.
 *
 * This function only validates the format.
 * It does not determine whether the date is
 * historically correct.
 */
async function askDate(
  question: string,
  required: boolean = false
): Promise<string | null> {
  while (true) {
    const answer = await ask(
      `${question}${
        required ? " (required)" : " (optional)"
      } > `
    );

    const value = answer.trim();

    if (!value) {
      if (!required) {
        return null;
      }

      console.log("");
      console.log("A date is required.");
      continue;
    }

    if (!isValidDate(value)) {
      console.log("");
      console.log("Invalid date.");
      console.log(
        "Use YYYY-MM-DD, for example 1942-08-31."
      );
      continue;
    }

    return value;
  }
}

/**
 * Validate YYYY-MM-DD and reject impossible
 * calendar dates such as 1942-02-31.
 */
function isValidDate(
  value: string
): boolean {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

async function askConfidence(): Promise<
  DateResearchResult["confidence"]
> {
  while (true) {
    console.log("");
    console.log("RESEARCH CONFIDENCE");
    console.log("");
    console.log("  1. High");
    console.log("  2. Medium");
    console.log("  3. Low");
    console.log("  4. Unknown");
    console.log("");

    const answer = await ask(
      "CONFIDENCE > "
    );

    switch (answer.trim()) {
      case "1":
        return "high";

      case "2":
        return "medium";

      case "3":
        return "low";

      case "4":
        return "unknown";

      default:
        console.log(
          "Please enter 1, 2, 3, or 4."
        );
    }
  }
}

async function askSources(): Promise<
  DateResearchSource[]
> {
  const sources: DateResearchSource[] = [];

  console.log("");
  console.log("RESEARCH SOURCES");
  console.log("");
  console.log(
    "Enter the sources used to establish the proposed date."
  );
  console.log(
    "Leave SOURCE TITLE empty when finished."
  );

  while (true) {
    console.log("");

    const title = (
      await ask(
        "SOURCE TITLE (optional) > "
      )
    ).trim();

    if (!title) {
      break;
    }

    const url = (
      await ask(
        "SOURCE URL (optional) > "
      )
    ).trim();

    const note = (
      await ask(
        "SOURCE NOTE (optional) > "
      )
    ).trim();

    sources.push({
      title,
      url,
      note,
    });
  }

  return sources;
}

function printResearchResult(
  result: DateResearchResult
): void {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "DATE RESEARCH PROPOSAL"
  );
  console.log(
    "========================================"
  );

  console.log(
    `ENTITY TYPE : ${result.entityType}`
  );

  console.log(
    `ENTITY NAME : ${result.entityName}`
  );

  console.log("");

  if (result.entityType === "event") {
    console.log(
      `PROPOSED EVENT DATE : ${
        result.proposedEventDate ??
        "NONE"
      }`
    );
  } else {
    console.log(
      `PROPOSED BIRTH DATE : ${
        result.proposedBirthDate ??
        "NONE"
      }`
    );

    console.log(
      `PROPOSED DEATH DATE : ${
        result.proposedDeathDate ??
        "NONE"
      }`
    );
  }

  console.log(
    `CONFIDENCE : ${result.confidence}`
  );

  console.log("");

  if (result.sources.length === 0) {
    console.log(
      "SOURCES : NONE"
    );
  } else {
    console.log(
      `SOURCES : ${result.sources.length}`
    );

    result.sources.forEach(
      (source, index) => {
        console.log("");
        console.log(
          `SOURCE ${index + 1}`
        );

        console.log(
          `  Title : ${source.title}`
        );

        console.log(
          `  URL   : ${
            source.url || "NONE"
          }`
        );

        console.log(
          `  Note  : ${
            source.note || "NONE"
          }`
        );
      }
    );
  }

  console.log("");
  console.log(
    `RESEARCH COMPLETE : ${
      result.researchComplete
        ? "YES"
        : "NO"
    }`
  );
}

/**
 * Collect a historical-date research proposal.
 *
 * IMPORTANT:
 *
 * This function does NOT:
 * - write to MongoDB
 * - generate IDs
 * - automatically approve the date
 * - automatically mark the date as historically correct
 *
 * It only creates a research proposal that
 * can subsequently be passed to the approval
 * layer.
 */
export async function researchDates(
  entityType: EntityType,
  entityName: string
): Promise<DateResearchResult> {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "HISTORICAL DATE RESEARCH"
  );
  console.log(
    "========================================"
  );

  console.log("");
  console.log(
    `ENTITY TYPE : ${entityType}`
  );

  console.log(
    `ENTITY NAME : ${entityName}`
  );

  console.log("");

  console.log(
    "IMPORTANT:"
  );

  console.log(
    "Enter the historically documented date,"
  );

  console.log(
    "NOT today's date."
  );

  let proposedEventDate:
    string | null = null;

  let proposedBirthDate:
    string | null = null;

  let proposedDeathDate:
    string | null = null;

  if (entityType === "event") {
    proposedEventDate =
      await askDate(
        "PROPOSED HISTORICAL EVENT DATE (YYYY-MM-DD)",
        true
      );
  } else {
    proposedBirthDate =
      await askDate(
        "PROPOSED HISTORICAL BIRTH DATE (YYYY-MM-DD)"
      );

    proposedDeathDate =
      await askDate(
        "PROPOSED HISTORICAL DEATH DATE (YYYY-MM-DD)"
      );
  }

  const confidence =
    await askConfidence();

  const sources =
    await askSources();

  const result: DateResearchResult = {
    entityType,
    entityName,

    proposedEventDate,

    proposedBirthDate,
    proposedDeathDate,

    confidence,

    sources,

    researchComplete: true,
  };

  printResearchResult(result);

  return result;
}