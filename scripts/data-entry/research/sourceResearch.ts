// scripts/data-entry/research/sourceResearch.ts

import type {
  EntityType,
} from "../db/entityInput";

export type SourceResearchCandidate = {
  title: string;
  url: string;

  publisher: string | null;
  author: string | null;
  year: number | null;

  relevanceReason: string;

  confidence:
    | "HIGH"
    | "MEDIUM"
    | "LOW";
};

export type SourceResearchResult = {
  entityType: EntityType;
  entityName: string;

  candidates: SourceResearchCandidate[];

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
 * URL VALIDATION
 * ------------------------------------------------------------
 */

function isValidUrl(
  value: string
): boolean {
  try {
    const url =
      new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

/*
 * ------------------------------------------------------------
 * SOURCE CANDIDATE CREATION
 * ------------------------------------------------------------
 */

export function createSourceResearchCandidate(
  data: {
    title: string;
    url: string;

    publisher?: string | null;
    author?: string | null;
    year?: number | null;

    relevanceReason: string;

    confidence?:
      | "HIGH"
      | "MEDIUM"
      | "LOW";
  }
): SourceResearchCandidate {
  const title =
    data.title.trim();

  const url =
    data.url.trim();

  if (!title) {
    throw new Error(
      "Research source title cannot be empty."
    );
  }

  if (
    !isValidUrl(url)
  ) {
    throw new Error(
      "Research source URL must be a valid HTTP/HTTPS URL."
    );
  }

  return {
    title,

    url,

    publisher:
      data.publisher?.trim() ||
      null,

    author:
      data.author?.trim() ||
      null,

    year:
      data.year ??
      null,

    relevanceReason:
      data.relevanceReason.trim(),

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

export function deduplicateSources(
  candidates: SourceResearchCandidate[]
): SourceResearchCandidate[] {
  const seen =
    new Set<string>();

  const result:
    SourceResearchCandidate[] =
    [];

  for (
    const candidate of candidates
  ) {
    const key =
      normalize(
        candidate.url
      );

    if (
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);

    result.push(candidate);
  }

  return result;
}

/*
 * ------------------------------------------------------------
 * SORTING
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

export function sortSourcesByConfidence(
  candidates: SourceResearchCandidate[]
): SourceResearchCandidate[] {
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
 * SOURCE RESEARCH RESULT
 * ------------------------------------------------------------
 */

export function buildSourceResearchResult(
  entityType: EntityType,
  entityName: string,
  candidates: SourceResearchCandidate[]
): SourceResearchResult {
  const unique =
    deduplicateSources(
      candidates
    );

  const sorted =
    sortSourcesByConfidence(
      unique
    );

  let researchNote =
    "Source research candidates collected.";

  if (
    sorted.length === 0
  ) {
    researchNote =
      "No external source candidates were supplied.";
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
 * SOURCE SELECTION HELPERS
 * ------------------------------------------------------------
 */

export function getHighConfidenceSources(
  result: SourceResearchResult
): SourceResearchCandidate[] {
  return result.candidates.filter(
    (candidate) =>
      candidate.confidence ===
      "HIGH"
  );
}

export function getMediumOrHigherSources(
  result: SourceResearchResult
): SourceResearchCandidate[] {
  return result.candidates.filter(
    (candidate) =>
      candidate.confidence ===
        "HIGH" ||
      candidate.confidence ===
        "MEDIUM"
  );
}

/*
 * ------------------------------------------------------------
 * DISPLAY
 * ------------------------------------------------------------
 */

export function printSourceResearch(
  result: SourceResearchResult
): void {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "SOURCE RESEARCH"
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

  if (
    result.candidates.length === 0
  ) {
    console.log("");
    console.log(
      "NO SOURCE CANDIDATES FOUND."
    );

    console.log("");
    console.log(
      `NOTE : ${result.researchNote}`
    );

    return;
  }

  console.log("");
  console.log(
    `FOUND ${result.candidates.length} SOURCE CANDIDATE(S):`
  );

  result.candidates.forEach(
    (
      candidate,
      index
    ) => {
      console.log("");
      console.log(
        `SOURCE ${index + 1}`
      );

      console.log(
        `  TITLE       : ${candidate.title}`
      );

      console.log(
        `  URL         : ${candidate.url}`
      );

      console.log(
        `  PUBLISHER   : ${
          candidate.publisher ??
          "NONE"
        }`
      );

      console.log(
        `  AUTHOR      : ${
          candidate.author ??
          "NONE"
        }`
      );

      console.log(
        `  YEAR        : ${
          candidate.year ??
          "NONE"
        }`
      );

      console.log(
        `  CONFIDENCE  : ${candidate.confidence}`
      );

      console.log(
        `  REASON      : ${candidate.relevanceReason}`
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
 * IMPORTANT ARCHITECTURAL RULE
 * ------------------------------------------------------------
 *
 * A research URL is NOT automatically a MongoDB Source.
 *
 * Example:
 *
 * Web research discovers:
 *
 *     British Library
 *     https://example.org/article
 *
 * That does NOT immediately create:
 *
 *     SRC0043
 *
 * Instead:
 *
 *     WEB RESEARCH
 *          ↓
 *     SOURCE CANDIDATE
 *          ↓
 *     EXISTING SOURCE SEARCH
 *          ↓
 *     OPERATOR APPROVAL
 *          ↓
 *     REUSE EXISTING SRC
 *       OR
 *     CREATE NEW SRC
 *
 * This prevents duplicate Source records.
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
    "sourceResearch.ts"
  )
) {
  const candidate =
    createSourceResearchCandidate({
      title:
        "Example Historical Source",

      url:
        "https://example.com/history",

      publisher:
        "Example Publisher",

      author:
        null,

      year:
        2026,

      relevanceReason:
        "Source directly discusses the selected historical entity.",

      confidence:
        "HIGH",
    });

  const result =
    buildSourceResearchResult(
      "hero",
      "Example Hero",
      [candidate]
    );

  printSourceResearch(
    result
  );
}