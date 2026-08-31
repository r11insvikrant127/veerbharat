// scripts/data-entry/research/quoteVerifier.ts

import {
  ask,
} from "../utils/prompt";

import type {
  EntityType,
} from "../db/entityInput";

export type QuoteCandidate = {
  quoteId?: string;
  text: string;

  attributedTo?: string | null;
  sourceId?: string | null;

  evidence?: string | null;
};

export type QuoteVerificationResult = {
  entityType: EntityType;
  entityName: string;

  quoteFound: boolean;

  selectedQuote: QuoteCandidate | null;

  verified: boolean;
  verificationNote: string;
};

/*
 * Normalize text only for comparison/display purposes.
 *
 * We do NOT modify the actual quote.
 */
function normalize(
  value: string
): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

async function askYesNo(
  question: string
): Promise<boolean> {
  while (true) {
    const answer =
      await ask(question);

    const normalized =
      normalize(answer);

    if (
      normalized === "y" ||
      normalized === "yes"
    ) {
      return true;
    }

    if (
      normalized === "n" ||
      normalized === "no"
    ) {
      return false;
    }

    console.log(
      "Please enter y or n."
    );
  }
}

async function askOptional(
  question: string
): Promise<string | null> {
  const answer =
    await ask(question);

  const value =
    answer.trim();

  return value.length > 0
    ? value
    : null;
}

/**
 * Display a proposed quote.
 */
function printQuote(
  quote: QuoteCandidate
): void {
  console.log("");
  console.log(
    "----------------------------------------"
  );

  console.log(
    `QUOTE ID : ${
      quote.quoteId ??
      "NEW"
    }`
  );

  console.log(
    `TEXT     : ${quote.text}`
  );

  console.log(
    `ATTRIBUTED TO : ${
      quote.attributedTo ??
      "NONE"
    }`
  );

  console.log(
    `SOURCE ID     : ${
      quote.sourceId ??
      "NONE"
    }`
  );

  console.log(
    `EVIDENCE      : ${
      quote.evidence ??
      "NONE"
    }`
  );

  console.log(
    "----------------------------------------"
  );
}

/**
 * Verify a quote that has already been discovered.
 *
 * IMPORTANT:
 *
 * This function does NOT search the internet.
 * It does NOT create a Quote document.
 * It does NOT update MongoDB.
 *
 * It only asks the operator whether the proposed
 * quote has sufficient evidence.
 */
export async function verifyQuote(
  entityType: EntityType,
  entityName: string,
  candidate: QuoteCandidate
): Promise<QuoteVerificationResult> {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "QUOTE VERIFICATION"
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
    "A quote found online is NOT automatically considered authentic."
  );

  console.log(
    "Verify the attribution and evidence before approving it."
  );

  printQuote(candidate);

  console.log("");

  const attributionCorrect =
    await askYesNo(
      "Is the quote correctly attributed to this entity? (y/n) > "
    );

  if (!attributionCorrect) {
    return {
      entityType,
      entityName,

      quoteFound: true,

      selectedQuote: null,

      verified: false,

      verificationNote:
        "Quote attribution rejected by data-entry operator.",
    };
  }

  const evidence =
    await askOptional(
      "Enter verification evidence/source (optional) > "
    );

  console.log("");
  console.log(
    "QUOTE REVIEW"
  );

  console.log(
    `Attribution : ${
      attributionCorrect
        ? "CONFIRMED"
        : "NOT CONFIRMED"
    }`
  );

  console.log(
    `Evidence    : ${
      evidence ??
      "NONE"
    }`
  );

  const approved =
    await askYesNo(
      "Is this quote sufficiently verified and correct? (y/n) > "
    );

  if (!approved) {
    return {
      entityType,
      entityName,

      quoteFound: true,

      selectedQuote: null,

      verified: false,

      verificationNote:
        "Quote verification rejected by data-entry operator.",
    };
  }

  const verifiedQuote: QuoteCandidate = {
    ...candidate,

    evidence:
      evidence ??
      candidate.evidence ??
      null,
  };

  console.log("");
  console.log(
    "QUOTE VERIFIED"
  );

  return {
    entityType,
    entityName,

    quoteFound: true,

    selectedQuote:
      verifiedQuote,

    verified: true,

    verificationNote:
      "Quote attribution and supporting evidence were reviewed and approved by the data-entry operator.",
  };
}

/**
 * Verify multiple proposed quotes.
 *
 * Each quote is independently approved or rejected.
 */
export async function verifyQuotes(
  entityType: EntityType,
  entityName: string,
  candidates: QuoteCandidate[]
): Promise<QuoteVerificationResult[]> {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "MULTIPLE QUOTE VERIFICATION"
  );
  console.log(
    "========================================"
  );

  if (
    candidates.length === 0
  ) {
    console.log("");
    console.log(
      "NO QUOTES TO VERIFY."
    );

    return [];
  }

  const results:
    QuoteVerificationResult[] =
    [];

  for (
    let index = 0;
    index < candidates.length;
    index++
  ) {
    const candidate =
      candidates[index];

    console.log("");
    console.log(
      `QUOTE ${index + 1} OF ${candidates.length}`
    );

    const result =
      await verifyQuote(
        entityType,
        entityName,
        candidate
      );

    results.push(result);
  }

  return results;
}

/**
 * Standalone test.
 *
 * Does NOT connect to MongoDB.
 * Does NOT write to MongoDB.
 */
if (
  process.argv[1]?.endsWith(
    "quoteVerifier.ts"
  )
) {
  (async () => {
    const entityType: EntityType =
      "hero";

    const entityName =
      "Test Hero";

    const candidate: QuoteCandidate =
      {
        quoteId:
          "QTE000002",

        text:
          "Example historical quote.",

        attributedTo:
          entityName,

        sourceId:
          "SRC0001",

        evidence:
          "Example historical source.",
      };

    const result =
      await verifyQuote(
        entityType,
        entityName,
        candidate
      );

    console.log("");
    console.log(
      "========================================"
    );
    console.log(
      "QUOTE VERIFICATION RESULT"
    );
    console.log(
      "========================================"
    );

    console.log(
      JSON.stringify(
        result,
        null,
        2
      )
    );
  })();
}