// scripts/data-entry/research/webResearch.ts

import type {
  EntityType,
} from "../db/entityInput";

export type ResearchSource = {
  title: string;
  url: string;
  publisher?: string | null;
  accessedAt: string;
};

export type WebResearchResult = {
  entityType: EntityType;
  entityName: string;

  summary: string | null;

  eventDate: string | null;

  birthDate: string | null;
  deathDate: string | null;

  kingdoms: string[];
  places: string[];
  battles: string[];

  sources: ResearchSource[];

  researchCompleted: boolean;

  researchNote: string;
};

/*
 * ------------------------------------------------------------
 * SEARCH RESULT TYPES
 * ------------------------------------------------------------
 *
 * These types represent information discovered from external
 * research.
 *
 * They are NOT database records.
 */

export type WebResearchFinding = {
  field:
    | "name"
    | "eventDate"
    | "birthDate"
    | "deathDate"
    | "kingdom"
    | "place"
    | "battle"
    | "summary"
    | "other";

  value: string;

  source: ResearchSource;
};

export type WebResearchFindings = {
  entityType: EntityType;
  entityName: string;

  findings: WebResearchFinding[];

  completed: boolean;
};

/*
 * ------------------------------------------------------------
 * URL VALIDATION
 * ------------------------------------------------------------
 */

function isValidHttpUrl(
  value: string
): boolean {
  try {
    const url =
      new URL(value);

    return (
      url.protocol ===
        "http:" ||
      url.protocol ===
        "https:"
    );
  } catch {
    return false;
  }
}

/*
 * ------------------------------------------------------------
 * SOURCE CREATION
 * ------------------------------------------------------------
 */

export function createResearchSource(
  title: string,
  url: string,
  publisher?: string | null
): ResearchSource {
  const trimmedTitle =
    title.trim();

  const trimmedUrl =
    url.trim();

  if (!trimmedTitle) {
    throw new Error(
      "Research source title cannot be empty."
    );
  }

  if (
    !isValidHttpUrl(
      trimmedUrl
    )
  ) {
    throw new Error(
      "Research source URL must be a valid HTTP/HTTPS URL."
    );
  }

  return {
    title:
      trimmedTitle,

    url:
      trimmedUrl,

    publisher:
      publisher?.trim() ||
      null,

    accessedAt:
      new Date().toISOString(),
  };
}

/*
 * ------------------------------------------------------------
 * FINDING CREATION
 * ------------------------------------------------------------
 */

export function createFinding(
  field: WebResearchFinding["field"],
  value: string,
  source: ResearchSource
): WebResearchFinding {
  const trimmedValue =
    value.trim();

  if (!trimmedValue) {
    throw new Error(
      "Research finding value cannot be empty."
    );
  }

  return {
    field,
    value: trimmedValue,
    source,
  };
}

/*
 * ------------------------------------------------------------
 * RESEARCH FINDINGS
 * ------------------------------------------------------------
 *
 * This function accepts findings supplied by the research
 * layer and converts them into a consistent structure.
 *
 * It deliberately does NOT pretend to perform web searching
 * by itself.
 */

export function buildResearchFindings(
  entityType: EntityType,
  entityName: string,
  findings: WebResearchFinding[]
): WebResearchFindings {
  return {
    entityType,

    entityName:
      entityName.trim(),

    findings: [...findings],

    completed: true,
  };
}

/*
 * ------------------------------------------------------------
 * FINDINGS BY FIELD
 * ------------------------------------------------------------
 */

export function getFindingsForField(
  findings: WebResearchFindings,
  field: WebResearchFinding["field"]
): WebResearchFinding[] {
  return findings.findings.filter(
    (finding) =>
      finding.field === field
  );
}

/*
 * ------------------------------------------------------------
 * UNIQUE VALUES
 * ------------------------------------------------------------
 */

export function getUniqueFindingValues(
  findings: WebResearchFindings,
  field: WebResearchFinding["field"]
): string[] {
  const values =
    getFindingsForField(
      findings,
      field
    ).map(
      (finding) =>
        finding.value.trim()
    );

  const seen =
    new Set<string>();

  const result:
    string[] = [];

  for (
    const value of values
  ) {
    const normalized =
      value.toLowerCase();

    if (
      seen.has(normalized)
    ) {
      continue;
    }

    seen.add(
      normalized
    );

    result.push(value);
  }

  return result;
}

/*
 * ------------------------------------------------------------
 * DATE FINDINGS
 * ------------------------------------------------------------
 */

export function getDateFinding(
  findings: WebResearchFindings,
  field:
    | "eventDate"
    | "birthDate"
    | "deathDate"
): string | null {
  const matches =
    getUniqueFindingValues(
      findings,
      field
    );

  if (
    matches.length === 0
  ) {
    return null;
  }

  /*
   * We intentionally return only the first
   * discovered date.
   *
   * Multiple conflicting dates must be handled
   * by the verification layer rather than silently
   * choosing one.
   */
  return matches[0];
}

/*
 * ------------------------------------------------------------
 * CONFLICT DETECTION
 * ------------------------------------------------------------
 */

export type ResearchConflict = {
  field: WebResearchFinding["field"];

  values: string[];

  sources: ResearchSource[];
};

export function findResearchConflicts(
  findings: WebResearchFindings
): ResearchConflict[] {
  const fields:
    WebResearchFinding["field"][] =
    [
      "eventDate",
      "birthDate",
      "deathDate",
      "kingdom",
      "place",
      "battle",
    ];

  const conflicts:
    ResearchConflict[] =
    [];

  for (
    const field of fields
  ) {
    const fieldFindings =
      getFindingsForField(
        findings,
        field
      );

    if (
      fieldFindings.length <= 1
    ) {
      continue;
    }

    const valueMap =
      new Map<
        string,
        ResearchSource[]
      >();

    for (
      const finding
      of fieldFindings
    ) {
      const normalized =
        finding.value
          .trim()
          .toLowerCase();

      const existing =
        valueMap.get(
          normalized
        ) ?? [];

      existing.push(
        finding.source
      );

      valueMap.set(
        normalized,
        existing
      );
    }

    if (
      valueMap.size <= 1
    ) {
      continue;
    }

    const values:
      string[] = [];

    const sources:
      ResearchSource[] =
      [];

    for (
      const [
        value,
        valueSources,
      ] of valueMap
    ) {
      values.push(value);

      sources.push(
        ...valueSources
      );
    }

    conflicts.push({
      field,
      values,
      sources,
    });
  }

  return conflicts;
}

/*
 * ------------------------------------------------------------
 * RESEARCH RESULT BUILDER
 * ------------------------------------------------------------
 */

export function buildResearchResult(
  findings: WebResearchFindings
): WebResearchResult {
  const conflicts =
    findResearchConflicts(
      findings
    );

  const sources =
    findings.findings.map(
      (finding) =>
        finding.source
    );

  /*
   * Remove duplicate sources.
   */
  const uniqueSources:
    ResearchSource[] =
    [];

  const seenUrls =
    new Set<string>();

  for (
    const source of sources
  ) {
    const normalizedUrl =
      source.url
        .trim()
        .toLowerCase();

    if (
      seenUrls.has(
        normalizedUrl
      )
    ) {
      continue;
    }

    seenUrls.add(
      normalizedUrl
    );

    uniqueSources.push(
      source
    );
  }

  const eventDates =
    getUniqueFindingValues(
      findings,
      "eventDate"
    );

  const birthDates =
    getUniqueFindingValues(
      findings,
      "birthDate"
    );

  const deathDates =
    getUniqueFindingValues(
      findings,
      "deathDate"
    );

  const summaries =
    getUniqueFindingValues(
      findings,
      "summary"
    );

  const kingdoms =
    getUniqueFindingValues(
      findings,
      "kingdom"
    );

  const places =
    getUniqueFindingValues(
      findings,
      "place"
    );

  const battles =
    getUniqueFindingValues(
      findings,
      "battle"
    );

  let researchNote =
    "External research findings collected.";

  if (
    conflicts.length > 0
  ) {
    researchNote +=
      ` ${conflicts.length} conflicting field(s) require manual verification.`;
  }

  return {
    entityType:
      findings.entityType,

    entityName:
      findings.entityName,

    summary:
      summaries[0] ??
      null,

    eventDate:
      eventDates[0] ??
      null,

    birthDate:
      birthDates[0] ??
      null,

    deathDate:
      deathDates[0] ??
      null,

    kingdoms,

    places,

    battles,

    sources:
      uniqueSources,

    researchCompleted:
      findings.completed,

    researchNote,
  };
}

/*
 * ------------------------------------------------------------
 * DISPLAY RESEARCH
 * ------------------------------------------------------------
 */

export function printResearchResult(
  result: WebResearchResult
): void {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "WEB RESEARCH RESULT"
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
  console.log(
    `EVENT DATE  : ${
      result.eventDate ??
      "NONE"
    }`
  );

  console.log(
    `BIRTH DATE  : ${
      result.birthDate ??
      "NONE"
    }`
  );

  console.log(
    `DEATH DATE  : ${
      result.deathDate ??
      "NONE"
    }`
  );

  console.log("");
  console.log(
    `KINGDOMS    : ${
      result.kingdoms.length
        ? result.kingdoms.join(
            ", "
          )
        : "NONE"
    }`
  );

  console.log(
    `PLACES      : ${
      result.places.length
        ? result.places.join(
            ", "
          )
        : "NONE"
    }`
  );

  console.log(
    `BATTLES     : ${
      result.battles.length
        ? result.battles.join(
            ", "
          )
        : "NONE"
    }`
  );

  console.log("");
  console.log(
    `SOURCES     : ${result.sources.length}`
  );

  result.sources.forEach(
    (
      source,
      index
    ) => {
      console.log("");
      console.log(
        `SOURCE ${index + 1}`
      );

      console.log(
        `  TITLE : ${source.title}`
      );

      console.log(
        `  URL   : ${source.url}`
      );

      console.log(
        `  PUBLISHER : ${
          source.publisher ??
          "NONE"
        }`
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
 * IMPORTANT ARCHITECTURAL NOTE
 * ------------------------------------------------------------
 *
 * This file intentionally does NOT perform an automatic
 * internet search.
 *
 * The actual web-search implementation should be connected
 * here only after we decide exactly which external sources
 * and search mechanism the project will use.
 *
 * This prevents fake "research" from being treated as
 * historically verified information.
 */