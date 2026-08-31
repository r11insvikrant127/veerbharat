// scripts/data-entry/research/quoteFinder.ts

import type {
  EntityType,
} from "../db/entityInput";

export type QuoteCandidate = {
  text: string;

  attributedTo: string | null;

  sourceTitle: string | null;

  sourceUrl: string | null;

  reason: string;

  confidence:
    | "HIGH"
    | "MEDIUM"
    | "LOW";
};

export type QuoteResearchResult = {
  entityType: EntityType;

  entityName: string;

  candidates: QuoteCandidate[];

  researchCompleted: boolean;

  researchNote: string;
};

/*
 * ============================================================
 * NORMALIZATION
 * ============================================================
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
 * ============================================================
 * CREATE QUOTE CANDIDATE
 * ============================================================
 */

export function createQuoteCandidate(
  data: {
    text: string;

    attributedTo?: string | null;

    sourceTitle?: string | null;

    sourceUrl?: string | null;

    reason: string;

    confidence?:
      | "HIGH"
      | "MEDIUM"
      | "LOW";
  }
): QuoteCandidate {
  const text =
    data.text.trim();

  if (!text) {
    throw new Error(
      "Quote text cannot be empty."
    );
  }

  const reason =
    data.reason.trim();

  if (!reason) {
    throw new Error(
      "Quote relevance reason cannot be empty."
    );
  }

  const sourceUrl =
    data.sourceUrl?.trim() ||
    null;

  if (sourceUrl) {
    try {
      const url =
        new URL(sourceUrl);

      if (
        url.protocol !== "http:" &&
        url.protocol !== "https:"
      ) {
        throw new Error();
      }
    } catch {
      throw new Error(
        "Quote source URL must be a valid HTTP/HTTPS URL."
      );
    }
  }

  return {
    text,

    attributedTo:
      data.attributedTo?.trim() ||
      null,

    sourceTitle:
      data.sourceTitle?.trim() ||
      null,

    sourceUrl,

    reason,

    confidence:
      data.confidence ??
      "MEDIUM",
  };
}

/*
 * ============================================================
 * QUOTE DEDUPLICATION
 * ============================================================
 *
 * Quotes may appear on several websites.
 *
 * The same quote should therefore not become multiple
 * candidates merely because it was discovered from different
 * pages.
 *
 * This only performs exact normalized-text deduplication.
 *
 * It does NOT decide whether two similar quotes are actually
 * the same quote.
 */

export function deduplicateQuoteCandidates(
  candidates: QuoteCandidate[]
): QuoteCandidate[] {
  const seen =
    new Set<string>();

  const result:
    QuoteCandidate[] =
    [];

  for (
    const candidate of candidates
  ) {
    const key =
      normalize(
        candidate.text
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
 * ============================================================
 * CONFIDENCE SORTING
 * ============================================================
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

export function sortQuoteCandidates(
  candidates: QuoteCandidate[]
): QuoteCandidate[] {
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
 * ============================================================
 * BUILD RESULT
 * ============================================================
 */

export function buildQuoteResearchResult(
  entityType: EntityType,
  entityName: string,
  candidates: QuoteCandidate[]
): QuoteResearchResult {
  const unique =
    deduplicateQuoteCandidates(
      candidates
    );

  const sorted =
    sortQuoteCandidates(
      unique
    );

  let researchNote =
    "Quote research candidates collected.";

  if (
    sorted.length === 0
  ) {
    researchNote =
      "No relevant quote candidates were supplied.";
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
 * ============================================================
 * HIGH-CONFIDENCE QUOTES
 * ============================================================
 */

export function getHighConfidenceQuotes(
  result: QuoteResearchResult
): QuoteCandidate[] {
  return result.candidates.filter(
    (candidate) =>
      candidate.confidence ===
      "HIGH"
  );
}

/*
 * ============================================================
 * FIND QUOTE
 * ============================================================
 */

export function findQuoteCandidate(
  result: QuoteResearchResult,
  quoteText: string
): QuoteCandidate | null {
  const target =
    normalize(
      quoteText
    );

  return (
    result.candidates.find(
      (candidate) =>
        normalize(
          candidate.text
        ) === target
    ) ?? null
  );
}

/*
 * ============================================================
 * DISPLAY
 * ============================================================
 */

export function printQuoteResearch(
  result: QuoteResearchResult
): void {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "QUOTE RESEARCH"
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
      "NO RELEVANT QUOTE CANDIDATES FOUND."
    );

    console.log("");
    console.log(
      `NOTE : ${result.researchNote}`
    );

    return;
  }

  console.log(
    `FOUND ${result.candidates.length} POSSIBLE QUOTE(S):`
  );

  result.candidates.forEach(
    (
      candidate,
      index
    ) => {
      console.log("");
      console.log(
        `QUOTE ${index + 1}`
      );

      console.log(
        `  TEXT : ${candidate.text}`
      );

      console.log(
        `  ATTRIBUTED TO : ${
          candidate.attributedTo ??
          "NONE"
        }`
      );

      console.log(
        `  SOURCE : ${
          candidate.sourceTitle ??
          "NONE"
        }`
      );

      console.log(
        `  SOURCE URL : ${
          candidate.sourceUrl ??
          "NONE"
        }`
      );

      console.log(
        `  CONFIDENCE : ${candidate.confidence}`
      );

      console.log(
        `  REASON : ${candidate.reason}`
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
 * ============================================================
 * QUOTE VERIFICATION RULE
 * ============================================================
 *
 * A quote candidate is NOT automatically considered genuine.
 *
 * Correct workflow:
 *
 *       WEB RESEARCH
 *            ↓
 *       QUOTE CANDIDATE
 *            ↓
 *       ATTRIBUTION CHECK
 *            ↓
 *       SOURCE CHECK
 *            ↓
 *       OPERATOR APPROVAL
 *            ↓
 *       EXISTING QUOTE?
 *          ↙       ↘
 *        YES       NO
 *         ↓         ↓
 *       REUSE     CREATE
 *
 * A quote with only an unattributed social-media/posting source
 * should not automatically receive HIGH confidence.
 *
 * This module deliberately does not make that decision by
 * itself; the research layer supplies the confidence.
 */

/*
 * ============================================================
 * ARCHITECTURAL RULE
 * ============================================================
 *
 * This file does NOT:
 *
 *   - search MongoDB
 *   - create QTE IDs
 *   - insert quotes
 *   - automatically link quotes
 *   - decide historical authenticity
 *
 * It only prepares research candidates.
 */