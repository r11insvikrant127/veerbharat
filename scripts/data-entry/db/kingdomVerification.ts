import dotenv from "dotenv";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });

type EntityType =
  | "event"
  | "hero"
  | "historicalPersonality";

type KingdomResult = {
  _id: mongoose.Types.ObjectId;
  kingdomId?: string;
  name?: string;
  nativeName?: string;
  alternativeNames?: string[];
};

export type KingdomVerificationResult = {
  entityType: EntityType;
  entityName: string;

  kingdomName: string;

  useExistingKingdom: boolean;
  existingKingdomId: mongoose.Types.ObjectId | null;

  createNewKingdom: boolean;

  newKingdomName: string | null;
  newKingdomNativeName: string | null;
  newKingdomAlternativeNames: string[];

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

async function searchKingdoms(
  kingdomName: string
): Promise<KingdomResult[]> {
  const { default: Kingdom } =
    await import(
      "../../../src/models/kingdom"
    );

  const searchTerms = kingdomName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);

  if (searchTerms.length === 0) {
    return [];
  }

  const regexes = searchTerms.map(
    (term) =>
      new RegExp(
        term.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        ),
        "i"
      )
  );

  const conditions = regexes.flatMap(
    (regex) => [
      { name: regex },
      { nativeName: regex },
      { alternativeNames: regex },
    ]
  );

  const kingdoms = await Kingdom.find({
    $or: conditions,
  })
    .select(
      "_id kingdomId name nativeName alternativeNames"
    )
    .limit(10)
    .lean();

  return kingdoms as unknown as KingdomResult[];
}

function printKingdom(
  kingdom: KingdomResult,
  index: number
): void {
  console.log("");
  console.log(
    `KINGDOM ${index + 1}`
  );

  console.log(
    `  kingdomId : ${
      kingdom.kingdomId ?? "NONE"
    }`
  );

  console.log(
    `  name      : ${
      kingdom.name ?? "NONE"
    }`
  );

  console.log(
    `  nativeName: ${
      kingdom.nativeName ?? "NONE"
    }`
  );

  console.log(
    `  aliases   : ${
      kingdom.alternativeNames?.join(
        ", "
      ) || "NONE"
    }`
  );
}

async function run(): Promise<void> {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "KINGDOM VERIFICATION"
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

  const kingdomName =
    await askRequired(
      "KINGDOM / POLITY > "
    );

  /*
   * IMPORTANT:
   * Load mongoose.ts only after dotenv
   * has loaded .env.local.
   */
  const { connectDB } =
    await import(
      "../../../src/lib/mongoose"
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

  await connectDB();

  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "SEARCHING EXISTING KINGDOMS"
  );
  console.log(
    "========================================"
  );

  const kingdoms =
    await searchKingdoms(
      kingdomName
    );

  console.log("");

  if (kingdoms.length === 0) {
    console.log(
      "NO RELEVANT EXISTING KINGDOM FOUND."
    );
  } else {
    console.log(
      `FOUND ${kingdoms.length} POSSIBLE KINGDOM(S):`
    );

    kingdoms.forEach(
      printKingdom
    );
  }

  let useExistingKingdom =
    false;

  let existingKingdomId:
    | mongoose.Types.ObjectId
    | null = null;

  if (kingdoms.length > 0) {
    console.log("");

    const relevant =
      await askYesNo(
        "Is one of these kingdoms/polities relevant to this entity? (y/n) > "
      );

    if (relevant) {
      while (true) {
        const selected =
          (
            await rl.question(
              `SELECT KINGDOM NUMBER (1-${kingdoms.length}) > `
            )
          ).trim();

        const index =
          Number(selected);

        if (
          Number.isInteger(index) &&
          index >= 1 &&
          index <= kingdoms.length
        ) {
          const kingdom =
            kingdoms[index - 1];

          useExistingKingdom =
            true;

          existingKingdomId =
            kingdom._id;

          console.log("");
          console.log(
            "EXISTING KINGDOM SELECTED"
          );

          console.log(
            `KINGDOM ID : ${
              kingdom.kingdomId ??
              "NONE"
            }`
          );

          console.log(
            `NAME       : ${
              kingdom.name ??
              "NONE"
            }`
          );

          break;
        }

        console.log(
          "Invalid kingdom number."
        );
      }
    }
  }

  let createNewKingdom =
    false;

  let newKingdomName:
    | string
    | null = null;

  let newKingdomNativeName:
    | string
    | null = null;

  let newKingdomAlternativeNames:
    string[] = [];

  if (!useExistingKingdom) {
    console.log("");
    console.log(
      "NO EXISTING KINGDOM WILL BE LINKED."
    );

    createNewKingdom =
      await askYesNo(
        "Do you want to create a new kingdom/polity? (y/n) > "
      );

    if (createNewKingdom) {
      console.log("");
      console.log(
        "========================================"
      );
      console.log(
        "NEW KINGDOM DETAILS"
      );
      console.log(
        "========================================"
      );

      newKingdomName =
        await askRequired(
          "KINGDOM NAME > "
        );

      newKingdomNativeName =
        await askOptional(
          "NATIVE NAME (optional) > "
        );

      const aliases =
        await askOptional(
          "ALTERNATIVE NAMES, comma-separated (optional) > "
        );

      if (aliases) {
        newKingdomAlternativeNames =
          aliases
            .split(",")
            .map(
              (value) =>
                value.trim()
            )
            .filter(Boolean);
      }
    }
  }

  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "KINGDOM VERIFICATION RESULT"
  );
  console.log(
    "========================================"
  );

  const result:
    KingdomVerificationResult = {
      entityType,
      entityName,

      kingdomName,

      useExistingKingdom,
      existingKingdomId,

      createNewKingdom,

      newKingdomName,
      newKingdomNativeName,
      newKingdomAlternativeNames,

      verified: true,

      verificationNote:
        useExistingKingdom
          ? "Existing relevant kingdom/polity selected for linking."
          : createNewKingdom
            ? "No existing relevant kingdom selected; new kingdom details supplied."
            : "No kingdom linked and no new kingdom requested.",
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
      "KINGDOM VERIFICATION FAILED"
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