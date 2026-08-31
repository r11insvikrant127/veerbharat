import dotenv from "dotenv";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });

type EntityType =
  | "event"
  | "hero"
  | "historicalPersonality";

type SourceResult = {
  _id: mongoose.Types.ObjectId;
  sourceId?: string;
  title?: string;
  author?: string;
  year?: number;
  url?: string;
};

export type SourceVerificationResult = {
  entityType: EntityType;
  entityName: string;

  useExistingSource: boolean;
  existingSourceId: mongoose.Types.ObjectId | null;

  createNewSource: boolean;

  sourceTitle: string | null;
  sourceAuthor: string | null;
  sourceYear: number | null;
  sourceUrl: string | null;

  verified: boolean;
  verificationNote: string;
};

const rl = readline.createInterface({
  input,
  output,
});

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

async function askYesNo(
  question: string
): Promise<boolean> {
  while (true) {
    const answer = normalize(
      await rl.question(question)
    );

    if (
      answer === "y" ||
      answer === "yes"
    ) {
      return true;
    }

    if (
      answer === "n" ||
      answer === "no"
    ) {
      return false;
    }

    console.log("Please enter y or n.");
  }
}

async function askRequired(
  question: string
): Promise<string> {
  while (true) {
    const value = (
      await rl.question(question)
    ).trim();

    if (value.length > 0) {
      return value;
    }

    console.log(
      "This field is required."
    );
  }
}

async function askOptional(
  question: string
): Promise<string | null> {
  const value = (
    await rl.question(question)
  ).trim();

  return value.length > 0
    ? value
    : null;
}

async function askOptionalNumber(
  question: string
): Promise<number | null> {
  while (true) {
    const value = (
      await rl.question(question)
    ).trim();

    if (value === "") {
      return null;
    }

    const number = Number(value);

    if (
      Number.isInteger(number) &&
      Number.isSafeInteger(number)
    ) {
      return number;
    }

    console.log(
      "Please enter a valid year or leave it blank."
    );
  }
}

async function searchSources(
  entityName: string
): Promise<SourceResult[]> {
  /*
   * Import after dotenv has loaded.
   */
  const { default: Source } =
    await import(
      "../../../src/models/source"
    );

  const searchTerms = entityName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);

  if (searchTerms.length === 0) {
    return [];
  }

  const regex = searchTerms.map(
    (term) =>
      new RegExp(
        term.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        ),
        "i"
      )
  );

  const conditions = regex.map(
    (pattern) => ({
      title: pattern,
    })
  );

  const sources = await Source.find({
    $or: conditions,
  })
    .select(
      "_id sourceId title author year url"
    )
    .limit(10)
    .lean();

  return sources as unknown as SourceResult[];
}

function printSource(
  source: SourceResult,
  index: number
): void {
  console.log("");
  console.log(
    `SOURCE ${index + 1}`
  );

  console.log(
    `  sourceId : ${
      source.sourceId ?? "NONE"
    }`
  );

  console.log(
    `  title    : ${
      source.title ?? "NONE"
    }`
  );

  console.log(
    `  author   : ${
      source.author ?? "NONE"
    }`
  );

  console.log(
    `  year     : ${
      source.year ?? "NONE"
    }`
  );

  console.log(
    `  url      : ${
      source.url ?? "NONE"
    }`
  );
}

async function run(): Promise<void> {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "SOURCE VERIFICATION"
  );
  console.log(
    "========================================"
  );

  const entityTypeInput =
    normalize(
      await rl.question(`
Entity type:
  1. Event
  2. Hero
  3. Historical Personality

TYPE > `)
    );

  let entityType: EntityType;

  if (
    entityTypeInput === "1" ||
    entityTypeInput === "event"
  ) {
    entityType = "event";
  } else if (
    entityTypeInput === "2" ||
    entityTypeInput === "hero"
  ) {
    entityType = "hero";
  } else if (
    entityTypeInput === "3" ||
    entityTypeInput ===
      "historical personality" ||
    entityTypeInput ===
      "historicalpersonality" ||
    entityTypeInput === "hist per"
  ) {
    entityType =
      "historicalPersonality";
  } else {
    console.log(
      "Invalid entity type."
    );
    return;
  }

  const entityName =
    await askRequired(
      "ENTITY NAME > "
    );

  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "CONNECTING TO DATABASE"
  );
  console.log(
    "========================================"
  );

  /*
   * Import mongoose.ts only after
   * dotenv.config().
   */
  const { connectDB } =
    await import(
      "../../../src/lib/mongoose"
    );

  await connectDB();

  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "SEARCHING EXISTING SOURCES"
  );
  console.log(
    "========================================"
  );

  const sources =
    await searchSources(
      entityName
    );

  console.log("");

  if (sources.length === 0) {
    console.log(
      "NO RELEVANT EXISTING SOURCE FOUND."
    );
  } else {
    console.log(
      `FOUND ${sources.length} POSSIBLE SOURCE(S):`
    );

    sources.forEach(
      printSource
    );
  }

  let useExistingSource =
    false;

  let existingSourceId:
    | mongoose.Types.ObjectId
    | null = null;

  if (sources.length > 0) {
    console.log("");

    const relevant =
      await askYesNo(
        "Is one of these sources relevant to this entity? (y/n) > "
      );

    if (relevant) {
      while (true) {
        const selected =
          (
            await rl.question(
              `SELECT SOURCE NUMBER (1-${sources.length}) > `
            )
          ).trim();

        const index =
          Number(selected);

        if (
          Number.isInteger(index) &&
          index >= 1 &&
          index <= sources.length
        ) {
          const source =
            sources[index - 1];

          useExistingSource =
            true;

          existingSourceId =
            source._id;

          console.log("");
          console.log(
            "EXISTING SOURCE SELECTED"
          );

          console.log(
            `SOURCE ID : ${
              source.sourceId ??
              "NONE"
            }`
          );

          console.log(
            `TITLE     : ${
              source.title ??
              "NONE"
            }`
          );

          break;
        }

        console.log(
          "Invalid source number."
        );
      }
    }
  }

  let createNewSource =
    false;

  let sourceTitle:
    | string
    | null = null;

  let sourceAuthor:
    | string
    | null = null;

  let sourceYear:
    | number
    | null = null;

  let sourceUrl:
    | string
    | null = null;

  if (!useExistingSource) {
    console.log("");
    console.log(
      "NO EXISTING SOURCE WILL BE LINKED."
    );

    createNewSource =
      await askYesNo(
        "Do you want to create a new source? (y/n) > "
      );

    if (createNewSource) {
      console.log("");
      console.log(
        "========================================"
      );
      console.log(
        "NEW SOURCE DETAILS"
      );
      console.log(
        "========================================"
      );

      sourceTitle =
        await askRequired(
          "SOURCE TITLE > "
        );

      sourceAuthor =
        await askOptional(
          "AUTHOR (optional) > "
        );

      sourceYear =
        await askOptionalNumber(
          "YEAR (optional) > "
        );

      sourceUrl =
        await askOptional(
          "SOURCE URL (optional) > "
        );
    }
  }

  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "SOURCE VERIFICATION RESULT"
  );
  console.log(
    "========================================"
  );

  const result:
    SourceVerificationResult = {
      entityType,
      entityName,

      useExistingSource,
      existingSourceId,

      createNewSource,

      sourceTitle,
      sourceAuthor,
      sourceYear,
      sourceUrl,

      verified: true,

      verificationNote:
        useExistingSource
          ? "Existing relevant source selected for linking."
          : createNewSource
            ? "No existing relevant source selected; new source details supplied."
            : "No source linked and no new source requested.",
    };

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );
}

run()
  .catch((error) => {
    console.error("");
    console.error(
      "SOURCE VERIFICATION FAILED"
    );
    console.error(error);
    process.exitCode = 1;
  })
  .finally(
    async () => {
      rl.close();

      if (
        mongoose.connection
          .readyState === 1
      ) {
        await mongoose.disconnect();
      }
    }
  );