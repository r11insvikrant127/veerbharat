// scripts/data-entry/workflow/createEvent.ts

import {
  ask,
} from "../utils/prompt";

import {
  createEmptyEventInput,
  validateEventInput,
  setEventType,
  type EventEntityInput,
  type EventType,
} from "../entities/event";

import type {
  EntityInput,
} from "../db/entityInput";

/*
 * ============================================================
 * VEERBHARAT EVENT DATA ENTRY
 * ============================================================
 *
 * This module collects Event-specific information.
 *
 * It does NOT:
 *
 *   - research historical facts
 *   - determine historical truth
 *   - determine On-This-Day eligibility
 *   - create MongoDB IDs
 *   - write to MongoDB
 *   - automatically approve relationships
 *
 * Research, relationship discovery, verification and
 * database writing are separate stages.
 *
 * ============================================================
 */

function separator(): void {
  console.log("");
  console.log(
    "========================================"
  );
}

async function askOptional(
  question: string
): Promise<string | null> {
  const answer =
    await ask(
      `${question} > `
    );

  const value =
    answer.trim();

  return value.length > 0
    ? value
    : null;
}

async function askRequired(
  question: string
): Promise<string> {
  while (true) {
    const answer =
      await ask(
        `${question} > `
      );

    const value =
      answer.trim();

    if (value.length > 0) {
      return value;
    }

    console.log(
      "This field is required."
    );
  }
}

async function askArray(
  question: string
): Promise<string[]> {
  const answer =
    await ask(
      `${question} > `
    );

  if (!answer.trim()) {
    return [];
  }

  return [
    ...new Set(
      answer
        .split(",")
        .map(
          (value) =>
            value.trim()
        )
        .filter(
          (value) =>
            value.length > 0
        )
    ),
  ];
}

/*
 * ============================================================
 * EVENT TYPE
 * ============================================================
 */

async function askEventType(): Promise<EventType> {
  const eventTypes: EventType[] = [
    "Birth",
    "Death",
    "Martyrdom",
    "Coronation",
    "Battle",
    "War",
    "Rebellion",
    "Uprising",
    "Massacre",
    "Genocide",
    "Victory",
    "Defeat",
    "Treaty",
    "Proclamation",
    "Declaration",
    "Arrival",
    "Expedition",
    "Reform",
    "Movement",
    "Protest",
    "Revolution",
    "Establishment",
    "Independence",
    "Annexation",
    "Siege",
    "Hiding",
    "Prophecy",
    "Other",
  ];

  while (true) {
    console.log("");
    console.log(
      "EVENT TYPE"
    );

    eventTypes.forEach(
      (type, index) => {
        console.log(
          `  ${index + 1}. ${type}`
        );
      }
    );

    const answer =
      (
        await ask(
          "TYPE > "
        )
      ).trim();

    const number =
      Number(answer);

    if (
      Number.isInteger(number) &&
      number >= 1 &&
      number <= eventTypes.length
    ) {
      return eventTypes[
        number - 1
      ];
    }

    /*
     * Also allow the operator to type
     * the exact event type.
     */

    const typed =
      eventTypes.find(
        (type) =>
          type.toLowerCase() ===
          answer.toLowerCase()
      );

    if (typed) {
      return typed;
    }

    console.log(
      "Please enter a valid event type."
    );
  }
}

/*
 * ============================================================
 * CREATE EVENT
 * ============================================================
 */

export async function createEvent(
  entity: EntityInput
): Promise<EventEntityInput> {
  if (
    entity.entityType !== "event"
  ) {
    throw new Error(
      "createEvent() requires an event entity."
    );
  }

  let event =
    createEmptyEventInput(
      entity
    );

  separator();

  console.log(
    "VEERBHARAT EVENT DATA ENTRY"
  );

  separator();

  console.log(
    `ENTITY NAME : ${entity.name}`
  );

  /*
   * ----------------------------------------------------------
   * BASIC INFORMATION
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "BASIC INFORMATION"
  );

  separator();

  /*
   * entityName already comes from entityInput.ts.
   *
   * Do not ask for it again.
   */

  event.nativeName =
    await askOptional(
      "Native Name"
    );

  /*
   * ----------------------------------------------------------
   * EVENT TYPE
   * ----------------------------------------------------------
   */

  event =
    setEventType(
      event,
      await askEventType()
    );

  /*
   * ----------------------------------------------------------
   * DATE
   * ----------------------------------------------------------
   *
   * The actual historical date is handled and verified by
   * dateVerifier.ts.
   *
   * We therefore do not independently claim that the date
   * belongs to today here.
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "DATE INFORMATION"
  );

  separator();

  event.eventDate =
    await askOptional(
      "Event Date (YYYY-MM-DD)"
    );

  if (event.eventDate) {
    console.log("");
    console.log(
      "Event date accuracy:"
    );
    console.log(
      "  1. Exact"
    );
    console.log(
      "  2. Approximate"
    );
    console.log(
      "  3. Unknown"
    );

    while (true) {
      const answer =
        (
          await ask(
            "ACCURACY > "
          )
        ).trim();

      if (answer === "1") {
        event.eventDateAccuracy =
          "Exact";
        break;
      }

      if (answer === "2") {
        event.eventDateAccuracy =
          "Approximate";
        break;
      }

      if (answer === "3") {
        event.eventDateAccuracy =
          "Unknown";
        break;
      }

      console.log(
        "Please enter 1, 2, or 3."
      );
    }
  }

  /*
   * ----------------------------------------------------------
   * LOCATION
   * ----------------------------------------------------------
   *
   * Only an existing Place ID is accepted here.
   *
   * Relationship discovery can later find a relevant Place.
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "LOCATION"
  );

  separator();

  event.locationId =
    await askOptional(
      "Location / Place ID"
    );

  /*
   * ----------------------------------------------------------
   * HISTORICAL PERIOD
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "HISTORICAL PERIOD"
  );

  separator();

  event.historicalPeriodId =
    await askOptional(
      "Historical Period ID"
    );

  /*
   * ----------------------------------------------------------
   * LINKED EVENT
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "EVENT RELATIONSHIP"
  );

  separator();

  event.linkedEventId =
    await askOptional(
      "Linked Event ID"
    );

  /*
   * ----------------------------------------------------------
   * CONTENT
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "CONTENT"
  );

  separator();

  event.shortDescription =
    await askRequired(
      "Short Description"
    );

  event.description =
    await askRequired(
      "Description"
    );

  event.details =
    await askRequired(
      "Details"
    );

  event.significance =
    await askOptional(
      "Significance"
    );

  /*
   * ----------------------------------------------------------
   * HERO RELATIONSHIPS
   * ----------------------------------------------------------
   *
   * These are existing IDs only.
   *
   * Later relationship discovery can propose additional
   * relationships from research.
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "HERO RELATIONSHIPS"
  );

  separator();

  event.heroIds =
    await askArray(
      "Hero IDs (comma separated, optional)"
    );

  /*
   * Keep cross-reference Hero IDs synchronized.
   */

  event.crossReferences = {
    ...event.crossReferences,

    relatedHeroes: [
      ...new Set(
        event.heroIds
      ),
    ],
  };

  /*
   * ----------------------------------------------------------
   * SOURCES
   * ----------------------------------------------------------
   *
   * Source reuse/creation is handled by sourceVerification.
   * These IDs represent already-approved sources.
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "SOURCE RELATIONSHIPS"
  );

  separator();

  event.sourceIds =
    await askArray(
      "Source IDs (comma separated, optional)"
    );

  /*
   * ----------------------------------------------------------
   * CROSS REFERENCES
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "CROSS REFERENCES"
  );

  separator();

  event.crossReferences = {
    ...event.crossReferences,

    relatedHeroes:
      event.heroIds,

    relatedPlaces:
      await askArray(
        "Related Place IDs (comma separated, optional)"
      ),

    relatedBattles:
      await askArray(
        "Related Battle IDs (comma separated, optional)"
      ),

    relatedBooks:
      await askArray(
        "Related Book IDs (comma separated, optional)"
      ),
  };

  /*
   * ----------------------------------------------------------
   * IMAGES
   * ----------------------------------------------------------
   *
   * Image verification handles actual image selection.
   *
   * This field remains empty here unless approved image IDs
   * are already known.
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "IMAGES"
  );

  separator();

  console.log(
    "Images will be handled by image verification."
  );

  event.imageIds =
    [];

  /*
   * ----------------------------------------------------------
   * SEARCH FIELDS
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "SEARCH INFORMATION"
  );

  separator();

  event.searchFields = {
    keywords:
      await askArray(
        "Search Keywords (comma separated)"
      ),

    nativeSpellings:
      await askArray(
        "Native Spellings (comma separated)"
      ),

    alternateSpellings:
      await askArray(
        "Alternate Spellings (comma separated)"
      ),

    aliases:
      await askArray(
        "Aliases (comma separated)"
      ),
  };

  /*
   * ----------------------------------------------------------
   * TAGS
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "TAGS"
  );

  separator();

  event.tags =
    await askArray(
      "Tags (comma separated)"
    );

  /*
   * ----------------------------------------------------------
   * ADDITIONAL INFORMATION
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "ADDITIONAL INFORMATION"
  );

  separator();

  event.additionalInformation =
    await askOptional(
      "Additional Information"
    );

  /*
   * ----------------------------------------------------------
   * METADATA
   * ----------------------------------------------------------
   *
   * These are deliberately not operator-entered.
   * ----------------------------------------------------------
   */

  event.createdBy =
    null;

  event.verifiedBy =
    null;

  event.version =
    1;

  /*
   * ----------------------------------------------------------
   * ON THIS DAY
   * ----------------------------------------------------------
   *
   * IMPORTANT:
   *
   * Do NOT manually decide this here.
   *
   * dateVerifier.ts determines whether the date matches
   * today's month/day and the verification stage approves it.
   * ----------------------------------------------------------
   */

  event.isOnThisDayEligible =
    false;

  /*
   * ----------------------------------------------------------
   * VALIDATION
   * ----------------------------------------------------------
   */

  validateEventInput(
    event
  );

  /*
   * ----------------------------------------------------------
   * REVIEW
   * ----------------------------------------------------------
   */

  separator();

  console.log(
    "EVENT INPUT REVIEW"
  );

  separator();

  console.log(
    `ENTITY NAME        : ${event.entityName}`
  );

  console.log(
    `NATIVE NAME        : ${
      event.nativeName ??
      "NONE"
    }`
  );

  console.log(
    `EVENT DATE         : ${
      event.eventDate ??
      "NONE"
    }`
  );

  console.log(
    `DATE ACCURACY      : ${
      event.eventDateAccuracy
    }`
  );

  console.log(
    `EVENT TYPE         : ${
      event.type
    }`
  );

  console.log(
    `ON THIS DAY        : ${
      event.isOnThisDayEligible
        ? "YES"
        : "NO"
    }`
  );

  console.log(
    `LOCATION ID        : ${
      event.locationId ??
      "NONE"
    }`
  );

  console.log(
    `HERO IDS           : ${
      event.heroIds.length > 0
        ? event.heroIds.join(", ")
        : "NONE"
    }`
  );

  console.log(
    `HISTORICAL PERIOD  : ${
      event.historicalPeriodId ??
      "NONE"
    }`
  );

  console.log(
    `LINKED EVENT       : ${
      event.linkedEventId ??
      "NONE"
    }`
  );

  console.log(
    `SOURCE IDS         : ${
      event.sourceIds.length > 0
        ? event.sourceIds.join(", ")
        : "NONE"
    }`
  );

  console.log(
    `RELATED PLACES     : ${
      event.crossReferences.relatedPlaces.length > 0
        ? event.crossReferences.relatedPlaces.join(", ")
        : "NONE"
    }`
  );

  console.log(
    `RELATED BATTLES    : ${
      event.crossReferences.relatedBattles.length > 0
        ? event.crossReferences.relatedBattles.join(", ")
        : "NONE"
    }`
  );

  console.log(
    `RELATED BOOKS      : ${
      event.crossReferences.relatedBooks.length > 0
        ? event.crossReferences.relatedBooks.join(", ")
        : "NONE"
    }`
  );

  console.log(
    `IMAGE IDS          : ${
      event.imageIds.length > 0
        ? event.imageIds
            .map(
              (image) =>
                image.imageId
            )
            .join(", ")
        : "NONE"
    }`
  );

  console.log(
    `ADDITIONAL INFO    : ${
      event.additionalInformation ??
      "NONE"
    }`
  );

  separator();

  console.log(
    "EVENT INPUT CREATED"
  );

  separator();

  console.log(
    "No MongoDB operation has been performed."
  );

  return event;
}

/*
 * ============================================================
 * STANDALONE TEST
 * ============================================================
 */

if (
  process.argv[1]?.endsWith(
    "createEvent.ts"
  )
) {
  (async () => {
    try {
      const {
        getEntityInput,
      } = await import(
        "../db/entityInput"
      );

      const entity =
        await getEntityInput();

      if (
        entity.entityType !==
        "event"
      ) {
        throw new Error(
          "Please enter an event entity."
        );
      }

      const event =
        await createEvent(
          entity
        );

      separator();

      console.log(
        "EVENT ENTITY RESULT"
      );

      separator();

      console.log(
        JSON.stringify(
          event,
          null,
          2
        )
      );
    } catch (error) {
      console.error("");

      console.error(
        "EVENT DATA ENTRY FAILED"
      );

      console.error(
        error
      );

      process.exitCode =
        1;
    }
  })();
}