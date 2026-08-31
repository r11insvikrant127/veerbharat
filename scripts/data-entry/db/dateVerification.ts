import readline from "node:readline/promises";
import {
  stdin as input,
  stdout as output,
} from "node:process";

import type { EntityType } from "./entityInput";

export type DateAccuracy =
  | "Exact"
  | "Approximate"
  | "Year Only"
  | "Unknown";

export type DateVerificationResult = {
  entityType: EntityType;

  eventDate: Date | null;

  birthDate: Date | null;
  birthDateAccuracy: DateAccuracy;

  deathDate: Date | null;
  deathDateAccuracy: DateAccuracy;

  onThisDay: boolean;

  verified: boolean;
  verificationNote: string;
};

const rl = readline.createInterface({
  input,
  output,
});

/**
 * Convert a YYYY-MM-DD string into a Date.
 *
 * We deliberately use UTC so that the date does not shift
 * because of the computer's local timezone.
 */
function parseDate(
  value: string
): Date | null {
  const text = value.trim();

  if (!text) {
    return null;
  }

  const match = text.match(
    /^(\d{4})-(\d{2})-(\d{2})$/
  );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatDate(
  date: Date | null
): string {
  if (!date) {
    return "NONE";
  }

  return date
    .toISOString()
    .slice(0, 10);
}

function isOnThisDay(
  date: Date | null
): boolean {
  if (!date) {
    return false;
  }

  const now = new Date();

  return (
    date.getUTCMonth() ===
      now.getUTCMonth() &&
    date.getUTCDate() ===
      now.getUTCDate()
  );
}

async function askDate(
  question: string,
  required: boolean = false
): Promise<Date | null> {
  while (true) {
    const answer =
      await rl.question(
        `${question}${
          required ? " (required)" : " (optional)"
        } > `
      );

    const trimmed = answer.trim();

    if (!trimmed) {
      if (!required) {
        return null;
      }

      console.log(
        "A date is required."
      );
      continue;
    }

    const date =
      parseDate(trimmed);

    if (!date) {
      console.log(
        "Invalid date."
      );
      console.log(
        "Use YYYY-MM-DD, for example 1931-08-29."
      );
      continue;
    }

    return date;
  }
}

async function askAccuracy(
  label: string,
  date: Date | null
): Promise<DateAccuracy> {
  if (!date) {
    return "Unknown";
  }

  while (true) {
    console.log("");
    console.log(
      `${label} accuracy:`
    );
    console.log(
      "  1. Exact"
    );
    console.log(
      "  2. Approximate"
    );
    console.log(
      "  3. Year Only"
    );
    console.log(
      "  4. Unknown"
    );

    const answer =
      await rl.question(
        "ACCURACY > "
      );

    switch (answer.trim()) {
      case "1":
        return "Exact";

      case "2":
        return "Approximate";

      case "3":
        return "Year Only";

      case "4":
        return "Unknown";

      default:
        console.log(
          "Please enter 1, 2, 3, or 4."
        );
    }
  }
}

async function askVerification(
  result: DateVerificationResult
): Promise<{
  verified: boolean;
  verificationNote: string;
}> {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "DATE VERIFICATION"
  );
  console.log(
    "========================================"
  );

  if (result.entityType === "event") {
    console.log(
      `EVENT DATE : ${formatDate(result.eventDate)}`
    );
  } else {
    console.log(
      `BIRTH DATE : ${formatDate(result.birthDate)}`
    );

    console.log(
      `BIRTH ACCURACY : ${result.birthDateAccuracy}`
    );

    console.log(
      `DEATH DATE : ${formatDate(result.deathDate)}`
    );

    console.log(
      `DEATH ACCURACY : ${result.deathDateAccuracy}`
    );
  }

  console.log("");

  if (result.onThisDay) {
    console.log(
      "ON-THIS-DAY : YES"
    );
  } else {
    console.log(
      "ON-THIS-DAY : NO"
    );
  }

  console.log("");

  while (true) {
    const answer =
      await rl.question(
        "Are these dates verified/correct? (y/n) > "
      );

    const normalized =
      answer.trim().toLowerCase();

    if (
      normalized === "y" ||
      normalized === "yes"
    ) {
      return {
        verified: true,
        verificationNote:
          "Date information verified by data-entry operator.",
      };
    }

    if (
      normalized === "n" ||
      normalized === "no"
    ) {
      const note =
        await rl.question(
          "What needs correction? > "
        );

      return {
        verified: false,
        verificationNote:
          note.trim() ||
          "Date information requires correction.",
      };
    }

    console.log(
      "Please enter y or n."
    );
  }
}

/**
 * Collect and verify dates for the selected entity.
 *
 * EVENT:
 *   - eventDate
 *
 * HERO:
 *   - birthDate
 *   - deathDate
 *
 * HISTORICAL PERSONALITY:
 *   - birthDate
 *   - deathDate
 */
export async function verifyDates(
  entityType: EntityType
): Promise<DateVerificationResult> {
  console.log("");
  console.log(
    "========================================"
  );
  console.log(
    "DATE / ON-THIS-DAY"
  );
  console.log(
    "========================================"
  );

  if (entityType === "event") {
    const eventDate =
      await askDate(
        "EVENT DATE (YYYY-MM-DD)",
        true
      );

    const result: DateVerificationResult = {
      entityType,

      eventDate,

      birthDate: null,
      birthDateAccuracy: "Unknown",

      deathDate: null,
      deathDateAccuracy: "Unknown",

      onThisDay:
        isOnThisDay(eventDate),

      verified: false,
      verificationNote: "",
    };

    const verification =
      await askVerification(
        result
      );

    return {
      ...result,
      ...verification,
    };
  }

  const birthDate =
    await askDate(
      "BIRTH DATE (YYYY-MM-DD)"
    );

  const birthDateAccuracy =
    await askAccuracy(
      "Birth date",
      birthDate
    );

  const deathDate =
    await askDate(
      "DEATH DATE (YYYY-MM-DD)"
    );

  const deathDateAccuracy =
    await askAccuracy(
      "Death date",
      deathDate
    );

  /*
   * For people, On This Day is true if either
   * the birth date or death date matches today's
   * month/day.
   */
  const onThisDay =
    isOnThisDay(birthDate) ||
    isOnThisDay(deathDate);

  const result: DateVerificationResult = {
    entityType,

    eventDate: null,

    birthDate,
    birthDateAccuracy,

    deathDate,
    deathDateAccuracy,

    onThisDay,

    verified: false,
    verificationNote: "",
  };

  const verification =
    await askVerification(
      result
    );

  return {
    ...result,
    ...verification,
  };
}

export function closeDateVerification(): void {
  rl.close();
}

/**
 * Standalone test.
 *
 * This file does NOT connect to MongoDB
 * and does NOT modify the database.
 */
if (
  process.argv[1]?.endsWith(
    "dateVerification.ts"
  )
) {
  (async () => {
    try {
      console.log("");
      console.log(
        "========================================"
      );
      console.log(
        "DATE VERIFICATION TEST"
      );
      console.log(
        "========================================"
      );

      console.log("");
      console.log(
        "Select entity type:"
      );
      console.log(
        "  1. Event"
      );
      console.log(
        "  2. Hero"
      );
      console.log(
        "  3. Historical Personality"
      );

      while (true) {
        const answer =
          await rl.question(
            "TYPE > "
          );

        const choice =
          answer.trim();

        let entityType: EntityType | null =
          null;

        if (choice === "1") {
          entityType = "event";
        } else if (choice === "2") {
          entityType = "hero";
        } else if (choice === "3") {
          entityType =
            "historicalPersonality";
        }

        if (!entityType) {
          console.log(
            "Please enter 1, 2, or 3."
          );
          continue;
        }

        const result =
          await verifyDates(
            entityType
          );

        console.log("");
        console.log(
          "========================================"
        );
        console.log(
          "DATE VERIFICATION RESULT"
        );
        console.log(
          "========================================"
        );

        console.log(
          JSON.stringify(
            {
              ...result,
              eventDate:
                formatDate(
                  result.eventDate
                ),
              birthDate:
                formatDate(
                  result.birthDate
                ),
              deathDate:
                formatDate(
                  result.deathDate
                ),
            },
            null,
            2
          )
        );

        break;
      }
    } finally {
      closeDateVerification();
    }
  })();
}