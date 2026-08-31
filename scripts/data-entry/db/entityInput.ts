import {
  ask,
} from "../utils/prompt";

export type EntityType =
  | "event"
  | "hero"
  | "historicalPersonality";

export type EntityInput = {
  entityType: EntityType;
  name: string;
};


function normalizeEntityType(
  value: string
): EntityType | null {
  const normalized = value
    .trim()
    .toLowerCase();

  if (
    normalized === "event" ||
    normalized === "evt"
  ) {
    return "event";
  }

  if (
    normalized === "hero" ||
    normalized === "her"
  ) {
    return "hero";
  }

  if (
    normalized === "historical personality" ||
    normalized === "historicalpersonality" ||
    normalized === "historical person" ||
    normalized === "hist per" ||
    normalized === "hist personality" ||
    normalized === "hp"
  ) {
    return "historicalPersonality";
  }

  return null;
}

/**
 * Accepts inputs such as:
 *
 * event x
 * hero x
 * hist per x
 *
 * The first word(s) determine the entity type.
 * Everything after that becomes the entity name.
 */
function parseEntityInput(
  value: string
): EntityInput | null {
  const text = value.trim();

  if (!text) {
    return null;
  }

  const lower = text.toLowerCase();

  /*
   * Historical personality must be checked before
   * generic entity parsing because it contains
   * multiple words.
   */
  const historicalPrefixes = [
    "historical personality",
    "historical person",
    "hist personality",
    "hist per",
  ];

  for (const prefix of historicalPrefixes) {
    if (lower.startsWith(prefix + " ")) {
      const name = text
        .slice(prefix.length)
        .trim();

      if (!name) {
        return null;
      }

      return {
        entityType: "historicalPersonality",
        name,
      };
    }
  }

  const firstSpace = text.indexOf(" ");

  if (firstSpace === -1) {
    return null;
  }

  const typeText = text
    .slice(0, firstSpace)
    .trim();

  const name = text
    .slice(firstSpace + 1)
    .trim();

  const entityType =
    normalizeEntityType(typeText);

  if (!entityType || !name) {
    return null;
  }

  return {
    entityType,
    name,
  };
}

async function askEntity(): Promise<EntityInput> {
  while (true) {
    console.log("");
    console.log("========================================");
    console.log("VEERBHARAT PHASE 1 DATA ENTRY");
    console.log("========================================");
    console.log("");
    console.log(
      "Enter one of the following:"
    );
    console.log("");
    console.log("  event <name>");
    console.log("  hero <name>");
    console.log(
      "  hist per <name>"
    );
    console.log("");

    const answer =
        await ask("ENTITY > ");

    const parsed =
      parseEntityInput(answer);

    if (!parsed) {
      console.log("");
      console.log(
        "Invalid input."
      );
      console.log(
        "Use: event <name>, hero <name>, or hist per <name>"
      );
      continue;
    }

    return parsed;
  }
}

function displayEntity(
  entity: EntityInput
) {
  console.log("");
  console.log("========================================");
  console.log("ENTITY IDENTIFIED");
  console.log("========================================");

  console.log(
    `TYPE : ${entity.entityType}`
  );

  console.log(
    `NAME : ${entity.name}`
  );

  console.log("");
}

export async function getEntityInput(): Promise<EntityInput> {
  const entity =
    await askEntity();

  displayEntity(entity);

  return entity;
}

export async function closeEntityInput(): Promise<void> {
  // Shared prompt is closed by the main orchestrator.
}

