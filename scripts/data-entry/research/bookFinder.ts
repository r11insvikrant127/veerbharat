// scripts/data-entry/research/bookFinder.ts

import mongoose from "mongoose";

import type {
  EntityType,
} from "../db/entityInput";

export type BookCandidate = {
  _id: string;
  bookId: string;
  title: string;
  author: string | null;
  year: number | null;
  relevanceReason: string;
};

export type BookFinderResult = {
  entityType: EntityType;
  entityName: string;

  booksFound: BookCandidate[];

  researchComplete: boolean;
};

type BookDocument = {
  _id?: mongoose.Types.ObjectId | string;

  bookId?: unknown;
  title?: unknown;
  author?: unknown;
  year?: unknown;

  description?: unknown;
  subjects?: unknown;
  keywords?: unknown;

  [key: string]: unknown;
};

function getString(
  value: unknown
): string | null {
  if (
    typeof value !== "string"
  ) {
    return null;
  }

  const trimmed =
    value.trim();

  return trimmed.length > 0
    ? trimmed
    : null;
}

function getNumber(
  value: unknown
): number | null {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string"
  ) {
    const parsed =
      Number(value.trim());

    if (
      Number.isFinite(parsed)
    ) {
      return parsed;
    }
  }

  return null;
}

function normalize(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function escapeRegex(
  value: string
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}

function makeRegex(
  value: string
): RegExp {
  return new RegExp(
    escapeRegex(value.trim()),
    "i"
  );
}

function getId(
  document: BookDocument
): string | null {
  const bookId =
    getString(
      document.bookId
    );

  if (bookId) {
    return bookId;
  }

  if (document._id) {
    return String(
      document._id
    );
  }

  return null;
}

function calculateRelevance(
  document: BookDocument,
  entityName: string
): {
  score: number;
  reason: string;
} {
  const input =
    normalize(entityName);

  const title =
    getString(
      document.title
    );

  const author =
    getString(
      document.author
    );

  const description =
    getString(
      document.description
    );

  const subjects =
    Array.isArray(
      document.subjects
    )
      ? document.subjects
          .filter(
            (
              value
            ): value is string =>
              typeof value ===
              "string"
          )
          .join(" ")
      : getString(
          document.subjects
        );

  const keywords =
    Array.isArray(
      document.keywords
    )
      ? document.keywords
          .filter(
            (
              value
            ): value is string =>
              typeof value ===
              "string"
          )
          .join(" ")
      : getString(
          document.keywords
        );

  const normalizedTitle =
    title
      ? normalize(title)
      : "";

  const normalizedAuthor =
    author
      ? normalize(author)
      : "";

  const normalizedDescription =
    description
      ? normalize(description)
      : "";

  const normalizedSubjects =
    subjects
      ? normalize(subjects)
      : "";

  const normalizedKeywords =
    keywords
      ? normalize(keywords)
      : "";

  /*
   * Strongest match:
   * exact entity name in the book title.
   */
  if (
    normalizedTitle === input
  ) {
    return {
      score: 100,
      reason:
        "Book title exactly matches the entity name.",
    };
  }

  /*
   * Entity name appears in title.
   */
  if (
    normalizedTitle.includes(
      input
    )
  ) {
    return {
      score: 90,
      reason:
        "Entity name appears in the book title.",
    };
  }

  /*
   * Entity name appears in author.
   *
   * This is useful for autobiographies,
   * memoirs and works authored by the entity.
   */
  if (
    normalizedAuthor.includes(
      input
    )
  ) {
    return {
      score: 85,
      reason:
        "Entity name appears in the book author field.",
    };
  }

  /*
   * Entity name appears in structured
   * subject metadata.
   */
  if (
    normalizedSubjects.includes(
      input
    )
  ) {
    return {
      score: 80,
      reason:
        "Entity name appears in the book subject metadata.",
    };
  }

  /*
   * Entity name appears in keywords.
   */
  if (
    normalizedKeywords.includes(
      input
    )
  ) {
    return {
      score: 75,
      reason:
        "Entity name appears in the book keywords.",
    };
  }

  /*
   * Description matches.
   *
   * This is deliberately weaker because descriptions
   * can contain broad historical references.
   */
  if (
    normalizedDescription.includes(
      input
    )
  ) {
    return {
      score: 65,
      reason:
        "Entity name appears in the book description.",
    };
  }

  return {
    score: 0,
    reason:
      "No sufficiently strong relevance match.",
  };
}

/**
 * Search the existing books collection.
 *
 * IMPORTANT:
 *
 * This function:
 * - reads MongoDB only
 * - does not create books
 * - does not update books
 * - does not allocate IDs
 * - does not link books
 * - does not approve books
 */
export async function findBooks(
  entityType: EntityType,
  entityName: string
): Promise<BookFinderResult> {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "VEERBHARAT BOOK DISCOVERY"
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
    "CONNECTING TO DATABASE"
  );

  /*
   * Load dotenv before importing mongoose.ts.
   */
  const dotenv =
    await import("dotenv");

  dotenv.config({
    path: ".env.local",
  });

  const {
    connectDB,
  } = await import(
    "../../../src/lib/mongoose"
  );

  await connectDB();

  const db =
    mongoose.connection.db;

  if (!db) {
    throw new Error(
      "MongoDB database is not connected."
    );
  }

  console.log(
    `CONNECTED DATABASE: ${db.databaseName}`
  );

  console.log(
    `CONNECTED HOST: ${
      mongoose.connection.host ||
      "unknown"
    }`
  );

  const regex =
    makeRegex(entityName);

  /*
   * Search only meaningful book metadata.
   */
  const documents =
    await db
      .collection<BookDocument>(
        "books"
      )
      .find({
        $or: [
          {
            title: regex,
          },
          {
            author: regex,
          },
          {
            description: regex,
          },
          {
            subjects: regex,
          },
          {
            keywords: regex,
          },
        ],
      })
      .limit(30)
      .toArray();

  const books: BookCandidate[] =
    [];

  for (
    const document
    of documents
  ) {
    const id =
      getId(document);

    const title =
      getString(
        document.title
      );

    if (
      !id ||
      !title
    ) {
      continue;
    }

    const relevance =
      calculateRelevance(
        document,
        entityName
      );

    /*
     * Do not propose weak matches.
     */
    if (
      relevance.score < 65
    ) {
      continue;
    }

    books.push({
      _id: String(
        document._id ?? id
      ),

      bookId: id,

      title,

      author:
        getString(
          document.author
        ),

      year:
        getNumber(
          document.year
        ),

      relevanceReason:
        relevance.reason,
    });
  }

  /*
   * Highest-confidence books first.
   *
   * We calculate the score again here so that
   * ordering remains deterministic.
   */
  books.sort(
    (a, b) => {
      const scoreA =
        calculateRelevance(
          documents.find(
            (document) =>
              getId(document) ===
              a.bookId
          ) ?? {},
          entityName
        ).score;

      const scoreB =
        calculateRelevance(
          documents.find(
            (document) =>
              getId(document) ===
              b.bookId
          ) ?? {},
          entityName
        ).score;

      return scoreB - scoreA;
    }
  );

  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "BOOK DISCOVERY RESULT"
  );
  console.log(
    "========================================"
  );

  if (
    books.length === 0
  ) {
    console.log("");
    console.log(
      "NO RELEVANT EXISTING BOOK FOUND."
    );
  } else {
    console.log("");
    console.log(
      `FOUND ${books.length} POSSIBLE BOOK(S):`
    );

    books.forEach(
      (
        book,
        index
      ) => {
        console.log("");
        console.log(
          `BOOK ${index + 1}`
        );

        console.log(
          `  bookId : ${book.bookId}`
        );

        console.log(
          `  title  : ${book.title}`
        );

        console.log(
          `  author : ${
            book.author ??
            "NONE"
          }`
        );

        console.log(
          `  year   : ${
            book.year ??
            "NONE"
          }`
        );

        console.log(
          `  reason : ${book.relevanceReason}`
        );
      }
    );
  }

  return {
    entityType,
    entityName,

    booksFound: books,

    researchComplete: true,
  };
}

/**
 * Standalone test.
 *
 * This performs discovery only.
 * It does not modify MongoDB.
 */
if (
  process.argv[1]?.endsWith(
    "bookFinder.ts"
  )
) {
  (async () => {
    try {
      const entityType: EntityType =
        "hero";

      const entityName =
        "Harbakhsh Singh";

      const result =
        await findBooks(
          entityType,
          entityName
        );

      console.log("");
      console.log(
        "========================================"
      );
      console.log(
        "BOOK FINDER TEST RESULT"
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
    } catch (error) {
      console.error("");
      console.error(
        "BOOK DISCOVERY FAILED"
      );
      console.error(error);
      process.exitCode = 1;
    }
  })();
}