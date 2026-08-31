// scripts/data-entry/research/dateConflictResolver.ts

import {
  ask,
} from "../utils/prompt";

import type {
  EntityType,
} from "../db/entityInput";

import type {
  WebResearchFinding,
  WebResearchFindings,
} from "./webResearch";

export type DateField =
  | "eventDate"
  | "birthDate"
  | "deathDate";

export type DateConflict = {
  field: DateField;

  values: string[];

  findings: WebResearchFinding[];
};

export type DateResolution = {
  field: DateField;

  selectedDate: string | null;

  conflictingDates: string[];

  resolved: boolean;

  resolutionNote: string;
};

export type DateConflictResolutionResult = {
  entityType: EntityType;
  entityName: string;

  conflicts: DateConflict[];

  resolutions: DateResolution[];

  allConflictsResolved: boolean;

  verified: boolean;

  verificationNote: string;
};

/*
 * ------------------------------------------------------------
 * HELPERS
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

function uniqueStrings(
  values: string[]
): string[] {
  const seen =
    new Set<string>();

  const result: string[] =
    [];

  for (
    const value of values
  ) {
    const trimmed =
      value.trim();

    if (!trimmed) {
      continue;
    }

    const key =
      normalize(trimmed);

    if (
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);

    result.push(
      trimmed
    );
  }

  return result;
}

/*
 * ------------------------------------------------------------
 * FIND DATE CONFLICTS
 * ------------------------------------------------------------
 *
 * A conflict exists only when multiple different dates
 * have been discovered for the same field.
 */

export function findDateConflicts(
  findings: WebResearchFindings
): DateConflict[] {
  const fields:
    DateField[] = [
      "eventDate",
      "birthDate",
      "deathDate",
    ];

  const conflicts:
    DateConflict[] = [];

  for (
    const field of fields
  ) {
    const matchingFindings =
      findings.findings.filter(
        (finding) =>
          finding.field ===
          field
      );

    if (
      matchingFindings.length === 0
    ) {
      continue;
    }

    const values =
      uniqueStrings(
        matchingFindings.map(
          (finding) =>
            finding.value
        )
      );

    if (
      values.length <= 1
    ) {
      continue;
    }

    conflicts.push({
      field,
      values,
      findings:
        matchingFindings,
    });
  }

  return conflicts;
}

/*
 * ------------------------------------------------------------
 * DISPLAY CONFLICT
 * ------------------------------------------------------------
 */

function printConflict(
  conflict: DateConflict
): void {
  console.log("");
  console.log(
    "----------------------------------------"
  );

  console.log(
    `FIELD : ${conflict.field}`
  );

  console.log("");

  conflict.values.forEach(
    (
      value,
      index
    ) => {
      console.log(
        `[${index + 1}] ${value}`
      );

      const supportingFindings =
        conflict.findings.filter(
          (finding) =>
            normalize(
              finding.value
            ) ===
            normalize(value)
        );

      supportingFindings.forEach(
        (
          finding
        ) => {
          console.log(
            `    Source : ${finding.source.title}`
          );

          console.log(
            `    URL    : ${finding.source.url}`
          );
        }
      );

      console.log("");
    }
  );

  console.log(
    "----------------------------------------"
  );
}

/*
 * ------------------------------------------------------------
 * ASK FOR RESOLUTION
 * ------------------------------------------------------------
 */

async function resolveConflict(
  conflict: DateConflict
): Promise<DateResolution> {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "DATE CONFLICT"
  );
  console.log(
    "========================================"
  );

  console.log(
    `FIELD : ${conflict.field}`
  );

  console.log(
    "Multiple sources provide different dates."
  );

  console.log(
    "The program will NOT automatically choose one."
  );

  printConflict(
    conflict
  );

  while (true) {
    const answer =
      await ask(
        "SELECT CORRECT DATE NUMBER, or 0 to reject all > "
      );

    const choice =
      Number(
        answer.trim()
      );

    if (
      choice === 0
    ) {
      const note =
        await ask(
          "Why are all proposed dates being rejected? > "
        );

      return {
        field:
          conflict.field,

        selectedDate:
          null,

        conflictingDates:
          conflict.values,

        resolved:
          false,

        resolutionNote:
          note.trim() ||
          "All conflicting dates were rejected.",
      };
    }

    if (
      Number.isInteger(choice) &&
      choice >= 1 &&
      choice <=
        conflict.values.length
    ) {
      const selectedDate =
        conflict.values[
          choice - 1
        ];

      const confirmation =
        await ask(
          `Confirm ${selectedDate} as the correct ${conflict.field}? (y/n) > `
        );

      const normalized =
        normalize(
          confirmation
        );

      if (
        normalized === "y" ||
        normalized === "yes"
      ) {
        return {
          field:
            conflict.field,

          selectedDate,

          conflictingDates:
            conflict.values,

          resolved:
            true,

          resolutionNote:
            `Selected ${selectedDate} after reviewing conflicting research sources.`,
        };
      }

      continue;
    }

    console.log(
      `Please enter a number from 1 to ${conflict.values.length}, or 0.`
    );
  }
}

/*
 * ------------------------------------------------------------
 * RESOLVE ALL CONFLICTS
 * ------------------------------------------------------------
 */

export async function resolveDateConflicts(
  entityType: EntityType,
  entityName: string,
  findings: WebResearchFindings
): Promise<DateConflictResolutionResult> {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "DATE CONFLICT RESOLUTION"
  );
  console.log(
    "========================================"
  );

  console.log(
    `ENTITY TYPE : ${entityType}`
  );

  console.log(
    `ENTITY NAME : ${entityName}`
  );

  const conflicts =
    findDateConflicts(
      findings
    );

  if (
    conflicts.length === 0
  ) {
    console.log("");
    console.log(
      "NO DATE CONFLICTS FOUND."
    );

    return {
      entityType,
      entityName,

      conflicts: [],

      resolutions: [],

      allConflictsResolved:
        true,

      verified:
        true,

      verificationNote:
        "No conflicting dates were found in the supplied research findings.",
    };
  }

  console.log("");
  console.log(
    `FOUND ${conflicts.length} DATE CONFLICT(S).`
  );

  const resolutions:
    DateResolution[] =
    [];

  for (
    const conflict of conflicts
  ) {
    const resolution =
      await resolveConflict(
        conflict
      );

    resolutions.push(
      resolution
    );
  }

  const allConflictsResolved =
    resolutions.every(
      (resolution) =>
        resolution.resolved
    );

  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "DATE CONFLICT REVIEW"
  );
  console.log(
    "========================================"
  );

  resolutions.forEach(
    (
      resolution,
      index
    ) => {
      console.log("");
      console.log(
        `CONFLICT ${index + 1}`
      );

      console.log(
        `  FIELD    : ${resolution.field}`
      );

      console.log(
        `  SELECTED : ${
          resolution.selectedDate ??
          "NONE"
        }`
      );

      console.log(
        `  RESOLVED : ${
          resolution.resolved
            ? "YES"
            : "NO"
        }`
      );

      console.log(
        `  NOTE     : ${resolution.resolutionNote}`
      );
    }
  );

  if (
    !allConflictsResolved
  ) {
    return {
      entityType,
      entityName,

      conflicts,

      resolutions,

      allConflictsResolved:
        false,

      verified:
        false,

      verificationNote:
        "One or more conflicting dates could not be resolved.",
    };
  }

  const finalConfirmation =
    await ask(
      "Are all resolved dates correct? (y/n) > "
    );

  const verified =
    normalize(
      finalConfirmation
    ) === "y" ||
    normalize(
      finalConfirmation
    ) === "yes";

  return {
    entityType,
    entityName,

    conflicts,

    resolutions,

    allConflictsResolved:
      allConflictsResolved,

    verified,

    verificationNote:
      verified
        ? "All conflicting dates were manually resolved and approved."
        : "Resolved dates were rejected by the data-entry operator.",
  };
}

/*
 * ------------------------------------------------------------
 * APPLY RESOLUTIONS
 * ------------------------------------------------------------
 *
 * This creates a NEW findings object.
 *
 * The original research findings are never mutated.
 */

export function applyDateResolutions(
  findings: WebResearchFindings,
  result: DateConflictResolutionResult
): WebResearchFindings {
  if (
    !result.allConflictsResolved
  ) {
    throw new Error(
      "Cannot apply unresolved date conflicts."
    );
  }

  const resolutionMap =
    new Map<
      DateField,
      string
    >();

  for (
    const resolution
    of result.resolutions
  ) {
    if (
      resolution.resolved &&
      resolution.selectedDate
    ) {
      resolutionMap.set(
        resolution.field,
        resolution.selectedDate
      );
    }
  }

  const remainingFindings =
    findings.findings.filter(
      (finding) => {
        if (
          finding.field !==
            "eventDate" &&
          finding.field !==
            "birthDate" &&
          finding.field !==
            "deathDate"
        ) {
          return true;
        }

        const selected =
          resolutionMap.get(
            finding.field
          );

        if (!selected) {
          return true;
        }

        return (
          normalize(
            finding.value
          ) ===
          normalize(selected)
        );
      }
    );

  return {
    ...findings,

    findings:
      remainingFindings,
  };
}