import dotenv from "dotenv";
import readline from "readline";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });

type EntityType = "event" | "hero" | "historicalPersonality";

type RelatedBook = {
  _id: string;
  bookId: string;
  title: string;
  author?: string | null;
  year?: number | null;
};

type RelatedQuote = {
  _id: string;
  quoteId: string;
  text: string;
  heroId?: string | null;
  eventId?: string | null;
  sourceId?: string | null;
};

type RelatedContentResult = {
  entityType: EntityType;
  entityName: string;

  booksFound: RelatedBook[];
  selectedBookIds: string[];

  quotesFound: RelatedQuote[];
  selectedQuoteIds: string[];

  verified: boolean;
  verificationNote: string;
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function connectDatabase() {
  /*
   * IMPORTANT:
   * dotenv must load .env.local before mongoose.ts is imported.
   */
  const { connectDB } = await import("../../../src/lib/mongoose");

  await connectDB();

  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("MongoDB database is not connected.");
  }

  console.log(`CONNECTED DATABASE: ${db.databaseName}`);

  const host =
    mongoose.connection.host || "unknown";

  console.log(`CONNECTED HOST: ${host}`);

  return db;
}

function normalize(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

function makeSearchRegex(name: string): RegExp {
  const escaped = name.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  return new RegExp(escaped, "i");
}

async function searchBooks(
  db: NonNullable<typeof mongoose.connection.db>,
  entityName: string
): Promise<RelatedBook[]> {
  const regex = makeSearchRegex(entityName);

  const books = await db
    .collection("books")
    .find({
      $or: [
        { title: regex },
        { author: regex },
        { description: regex },
      ],
    })
    .project({
      bookId: 1,
      title: 1,
      author: 1,
      year: 1,
    })
    .limit(20)
    .toArray();

  return books.map((book) => ({
    _id: String(book._id),
    bookId:
      typeof book.bookId === "string"
        ? book.bookId
        : "",
    title:
      typeof book.title === "string"
        ? book.title
        : "",
    author:
      typeof book.author === "string"
        ? book.author
        : null,
    year:
      typeof book.year === "number"
        ? book.year
        : null,
  }));
}

async function searchQuotes(
  db: NonNullable<typeof mongoose.connection.db>,
  entityName: string,
  entityType: EntityType
): Promise<RelatedQuote[]> {
  const regex = makeSearchRegex(entityName);

  /*
   * Quotes can be related directly through heroId/eventId,
   * but we also search quote text for the entity name.
   *
   * We first search text because quote documents may not
   * already contain the correct relationship.
   */
  const textMatches = await db
    .collection("quotes")
    .find({
      text: regex,
    })
    .project({
      quoteId: 1,
      text: 1,
      heroId: 1,
      eventId: 1,
      sourceId: 1,
    })
    .limit(20)
    .toArray();

  /*
   * Also search relationship fields when the input is
   * already an ID-like entity reference.
   */
  const relationshipMatches =
    entityType === "hero"
      ? await db
          .collection("quotes")
          .find({
            heroId: entityName,
          })
          .project({
            quoteId: 1,
            text: 1,
            heroId: 1,
            eventId: 1,
            sourceId: 1,
          })
          .limit(20)
          .toArray()
      : entityType === "event"
        ? await db
            .collection("quotes")
            .find({
              eventId: entityName,
            })
            .project({
              quoteId: 1,
              text: 1,
              heroId: 1,
              eventId: 1,
              sourceId: 1,
            })
            .limit(20)
            .toArray()
        : [];

  const combined = [
    ...textMatches,
    ...relationshipMatches,
  ];

  const seen = new Set<string>();

  const results: RelatedQuote[] = [];

  for (const quote of combined) {
    const key =
      typeof quote._id !== "undefined"
        ? String(quote._id)
        : String(quote.quoteId ?? "");

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    results.push({
      _id: key,
      quoteId:
        typeof quote.quoteId === "string"
          ? quote.quoteId
          : "",
      text:
        typeof quote.text === "string"
          ? quote.text
          : "",
      heroId:
        typeof quote.heroId === "string"
          ? quote.heroId
          : null,
      eventId:
        typeof quote.eventId === "string"
          ? quote.eventId
          : null,
      sourceId:
        typeof quote.sourceId === "string"
          ? quote.sourceId
          : null,
    });
  }

  return results.slice(0, 20);
}

async function selectBooks(
  books: RelatedBook[]
): Promise<string[]> {
  if (books.length === 0) {
    console.log("\nNO POSSIBLE BOOKS FOUND.");
    return [];
  }

  console.log(
    `\nFOUND ${books.length} POSSIBLE BOOK(S):`
  );

  books.forEach((book, index) => {
    console.log(`\nBOOK ${index + 1}`);
    console.log(`  bookId : ${book.bookId || "NONE"}`);
    console.log(`  title  : ${book.title || "NONE"}`);
    console.log(
      `  author : ${book.author || "NONE"}`
    );
    console.log(
      `  year   : ${book.year ?? "NONE"}`
    );
  });

  const answer = await ask(
    "\nDo you want to link any of these books? (y/n) > "
  );

  if (answer.toLowerCase() !== "y") {
    return [];
  }

  const selection = await ask(
    `SELECT BOOK NUMBER(S) (e.g. 1,3) > `
  );

  const numbers = selection
    .split(",")
    .map((value) => Number(value.trim()))
    .filter(
      (number) =>
        Number.isInteger(number) &&
        number >= 1 &&
        number <= books.length
    );

  return [
    ...new Set(
      numbers.map(
        (number) => books[number - 1].bookId
      )
    ),
  ];
}

async function selectQuotes(
  quotes: RelatedQuote[]
): Promise<string[]> {
  if (quotes.length === 0) {
    console.log("\nNO POSSIBLE QUOTES FOUND.");
    return [];
  }

  console.log(
    `\nFOUND ${quotes.length} POSSIBLE QUOTE(S):`
  );

  quotes.forEach((quote, index) => {
    console.log(`\nQUOTE ${index + 1}`);
    console.log(
      `  quoteId : ${quote.quoteId || "NONE"}`
    );
    console.log(
      `  text    : ${quote.text || "NONE"}`
    );
    console.log(
      `  heroId  : ${quote.heroId || "NONE"}`
    );
    console.log(
      `  eventId : ${quote.eventId || "NONE"}`
    );
    console.log(
      `  sourceId: ${quote.sourceId || "NONE"}`
    );
  });

  const answer = await ask(
    "\nDo you want to link any of these quotes? (y/n) > "
  );

  if (answer.toLowerCase() !== "y") {
    return [];
  }

  const selection = await ask(
    `SELECT QUOTE NUMBER(S) (e.g. 1,3) > `
  );

  const numbers = selection
    .split(",")
    .map((value) => Number(value.trim()))
    .filter(
      (number) =>
        Number.isInteger(number) &&
        number >= 1 &&
        number <= quotes.length
    );

  return [
    ...new Set(
      numbers.map(
        (number) => quotes[number - 1].quoteId
      )
    ),
  ];
}

async function main() {
  console.log(`
========================================
VEERBHARAT RELATED CONTENT VERIFICATION
========================================
`);

  console.log(`Entity type:
  1. Event
  2. Hero
  3. Historical Personality
`);

  let entityTypeInput = await ask("TYPE > ");

  while (!["1", "2", "3"].includes(entityTypeInput)) {
    entityTypeInput = await ask(
      "Please enter 1, 2, or 3.\nTYPE > "
    );
  }

  const entityType: EntityType =
    entityTypeInput === "1"
      ? "event"
      : entityTypeInput === "2"
        ? "hero"
        : "historicalPersonality";

  const entityName = await ask(
    "ENTITY NAME > "
  );

  if (!entityName) {
    throw new Error("Entity name cannot be empty.");
  }

  console.log(`
========================================
CONNECTING TO DATABASE
========================================
`);

  const db = await connectDatabase();

  console.log(`
========================================
SEARCHING RELATED BOOKS
========================================
`);

  const books = await searchBooks(
    db,
    entityName
  );

  const selectedBookIds =
    await selectBooks(books);

  console.log(`
========================================
SEARCHING RELATED QUOTES
========================================
`);

  const quotes = await searchQuotes(
    db,
    entityName,
    entityType
  );

  const selectedQuoteIds =
    await selectQuotes(quotes);

  console.log(`
========================================
RELATED CONTENT VERIFICATION
========================================
`);

  console.log(
    `SELECTED BOOKS : ${
      selectedBookIds.length
        ? selectedBookIds.join(", ")
        : "NONE"
    }`
  );

  console.log(
    `SELECTED QUOTES: ${
      selectedQuoteIds.length
        ? selectedQuoteIds.join(", ")
        : "NONE"
    }`
  );

  const verified = (
    await ask(
      "\nIs this related-content selection verified/correct? (y/n) > "
    )
  ).toLowerCase() === "y";

  const result: RelatedContentResult = {
    entityType,
    entityName,
    booksFound: books,
    selectedBookIds,
    quotesFound: quotes,
    selectedQuoteIds,
    verified,
    verificationNote: verified
      ? "Related books and quotes verified by data-entry operator."
      : "Related-content selection was not verified.",
  };

  console.log(`
========================================
RELATED CONTENT RESULT
========================================
`);

  console.log(
    JSON.stringify(result, null, 2)
  );

  rl.close();
}

main()
  .catch((error) => {
    console.error(
      "\n========================================"
    );
    console.error(
      "RELATED CONTENT VERIFICATION FAILED"
    );
    console.error(
      "========================================"
    );
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });