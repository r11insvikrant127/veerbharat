// scripts/data-entry/entities/event.ts

import type { EntityInput } from "../db/entityInput";

/*
 * ============================================================
 * EVENT TYPES
 * ============================================================
 *
 * These values come from the current Event mongoose schema.
 *
 * We are NOT inventing historical event types here.
 */

export type EventType =
  | "Birth"
  | "Death"
  | "Martyrdom"
  | "Coronation"
  | "Battle"
  | "War"
  | "Rebellion"
  | "Uprising"
  | "Massacre"
  | "Genocide"
  | "Victory"
  | "Defeat"
  | "Treaty"
  | "Proclamation"
  | "Declaration"
  | "Arrival"
  | "Expedition"
  | "Reform"
  | "Movement"
  | "Protest"
  | "Revolution"
  | "Establishment"
  | "Independence"
  | "Annexation"
  | "Siege"
  | "Hiding"
  | "Prophecy"
  | "Other";

/*
 * ============================================================
 * EVENT IMAGE
 * ============================================================
 */

export type EventImageInput = {
  imageId: string;

  relatedSection: string | null;
};

/*
 * ============================================================
 * EVENT CROSS REFERENCES
 * ============================================================
 */

export type EventCrossReferences = {
  relatedHeroes: string[];

  relatedPlaces: string[];

  relatedBattles: string[];

  relatedBooks: string[];
};

/*
 * ============================================================
 * EVENT SEARCH FIELDS
 * ============================================================
 */

export type EventSearchFields = {
  keywords: string[];

  nativeSpellings: string[];

  alternateSpellings: string[];

  aliases: string[];
};

/*
 * ============================================================
 * EVENT INPUT
 * ============================================================
 */

export type EventEntityInput = {
  entityType: "event";

  entityName: string;

  /*
   * ----------------------------------------------------------
   * BASIC INFORMATION
   * ----------------------------------------------------------
   */

  nativeName: string | null;

  eventDate: string | null;

  eventDateAccuracy:
    | "Exact"
    | "Approximate"
    | "Unknown";

  type: EventType;

  /*
   * ----------------------------------------------------------
   * ON THIS DAY
   * ----------------------------------------------------------
   */

  isOnThisDayEligible: boolean;

  /*
   * ----------------------------------------------------------
   * EVENT RELATIONSHIPS
   * ----------------------------------------------------------
   */

  locationId: string | null;

  heroIds: string[];

  historicalPeriodId: string | null;

  linkedEventId: string | null;

  /*
   * ----------------------------------------------------------
   * CONTENT
   * ----------------------------------------------------------
   */

  description: string;

  shortDescription: string;

  details: string;

  significance: string | null;

  /*
   * ----------------------------------------------------------
   * SOURCES
   * ----------------------------------------------------------
   */

  sourceIds: string[];

  /*
   * ----------------------------------------------------------
   * IMAGES
   * ----------------------------------------------------------
   */

  imageIds: EventImageInput[];

  /*
   * ----------------------------------------------------------
   * CROSS REFERENCES
   * ----------------------------------------------------------
   */

  crossReferences: EventCrossReferences;

  /*
   * ----------------------------------------------------------
   * SEARCH
   * ----------------------------------------------------------
   */

  searchFields: EventSearchFields;

  /*
   * ----------------------------------------------------------
   * TAGS
   * ----------------------------------------------------------
   */

  tags: string[];

  /*
   * ----------------------------------------------------------
   * METADATA
   * ----------------------------------------------------------
   */

  createdBy: string | null;

  verifiedBy: string | null;

  version: number;

  /*
   * ----------------------------------------------------------
   * USER PROVIDED INFORMATION
   * ----------------------------------------------------------
   */

  additionalInformation: string | null;
};

/*
 * ============================================================
 * CREATE EMPTY EVENT
 * ============================================================
 *
 * This only creates the data structure.
 *
 * It does NOT:
 *
 *   - search the internet
 *   - decide historical facts
 *   - create IDs
 *   - connect to MongoDB
 *   - insert anything
 */

export function createEmptyEventInput(
  entity: EntityInput
): EventEntityInput {
  if (
    entity.entityType !== "event"
  ) {
    throw new Error(
      "createEmptyEventInput requires an event entity."
    );
  }

  return {
    entityType: "event",

    entityName:
      entity.name,

    /*
     * BASIC
     */

    nativeName:
      null,

    eventDate:
      null,

    eventDateAccuracy:
      "Unknown",

    type:
      "Other",

    /*
     * ON THIS DAY
     */

    isOnThisDayEligible:
      false,

    /*
     * RELATIONSHIPS
     */

    locationId:
      null,

    heroIds:
      [],

    historicalPeriodId:
      null,

    linkedEventId:
      null,

    /*
     * CONTENT
     */

    description:
      "",

    shortDescription:
      "",

    details:
      "",

    significance:
      null,

    /*
     * SOURCES
     */

    sourceIds:
      [],

    /*
     * IMAGES
     */

    imageIds:
      [],

    /*
     * CROSS REFERENCES
     */

    crossReferences: {
      relatedHeroes: [],
      relatedPlaces: [],
      relatedBattles: [],
      relatedBooks: [],
    },

    /*
     * SEARCH
     */

    searchFields: {
      keywords: [],
      nativeSpellings: [],
      alternateSpellings: [],
      aliases: [],
    },

    /*
     * TAGS
     */

    tags:
      [],

    /*
     * METADATA
     */

    createdBy:
      null,

    verifiedBy:
      null,

    version:
      1,

    /*
     * USER INFORMATION
     */

    additionalInformation:
      null,
  };
}

/*
 * ============================================================
 * VALIDATION
 * ============================================================
 *
 * This validates the collected Event structure.
 *
 * It does NOT determine whether the historical claims
 * are true. That belongs to the research + verification
 * stages.
 */

export function validateEventInput(
  event: EventEntityInput
): void {
  if (
    !event.entityName.trim()
  ) {
    throw new Error(
      "Event name cannot be empty."
    );
  }

  if (
    !event.description.trim()
  ) {
    throw new Error(
      "Event description cannot be empty."
    );
  }

  if (
    !event.type
  ) {
    throw new Error(
      "Event type must be specified."
    );
  }

  /*
   * An Event marked eligible for On This Day
   * must have a date.
   */

  if (
    event.isOnThisDayEligible &&
    !event.eventDate
  ) {
    throw new Error(
      "An On-This-Day eligible event must have an event date."
    );
  }

  /*
   * Remove accidental duplicate references.
   */

  assertNoDuplicateIds(
    event.heroIds,
    "heroIds"
  );

  assertNoDuplicateIds(
    event.sourceIds,
    "sourceIds"
  );

  assertNoDuplicateIds(
    event.crossReferences.relatedHeroes,
    "crossReferences.relatedHeroes"
  );

  assertNoDuplicateIds(
    event.crossReferences.relatedPlaces,
    "crossReferences.relatedPlaces"
  );

  assertNoDuplicateIds(
    event.crossReferences.relatedBattles,
    "crossReferences.relatedBattles"
  );

  assertNoDuplicateIds(
    event.crossReferences.relatedBooks,
    "crossReferences.relatedBooks"
  );

  /*
   * Image IDs must also be unique.
   */

  const imageIds =
    event.imageIds.map(
      (image) => image.imageId
    );

  assertNoDuplicateIds(
    imageIds,
    "imageIds"
  );

  /*
   * Version must be valid.
   */

  if (
    !Number.isInteger(
      event.version
    ) ||
    event.version < 1
  ) {
    throw new Error(
      "Event version must be a positive integer."
    );
  }
}

/*
 * ============================================================
 * DUPLICATE-ID VALIDATION
 * ============================================================
 */

function assertNoDuplicateIds(
  values: string[],
  fieldName: string
): void {
  const normalized =
    values
      .map(
        (value) =>
          value.trim()
      )
      .filter(Boolean);

  const unique =
    new Set(
      normalized
    );

  if (
    unique.size !==
    normalized.length
  ) {
    throw new Error(
      `Duplicate IDs found in ${fieldName}.`
    );
  }
}

/*
 * ============================================================
 * DATE
 * ============================================================
 */

export function setEventDate(
  event: EventEntityInput,
  date: string,
  accuracy:
    | "Exact"
    | "Approximate"
    | "Unknown"
): EventEntityInput {
  const normalized =
    date.trim();

  if (!normalized) {
    throw new Error(
      "Event date cannot be empty."
    );
  }

  return {
    ...event,

    eventDate:
      normalized,

    eventDateAccuracy:
      accuracy,
  };
}

/*
 * ============================================================
 * ON THIS DAY
 * ============================================================
 *
 * IMPORTANT:
 *
 * This function does not decide whether the event
 * historically belongs to today's date.
 *
 * That decision comes from dateVerifier.ts and
 * operator verification.
 */

export function setOnThisDayEligibility(
  event: EventEntityInput,
  eligible: boolean
): EventEntityInput {
  return {
    ...event,

    isOnThisDayEligible:
      eligible,
  };
}

/*
 * ============================================================
 * EVENT TYPE
 * ============================================================
 */

export function setEventType(
  event: EventEntityInput,
  type: EventType
): EventEntityInput {
  return {
    ...event,

    type,
  };
}

/*
 * ============================================================
 * LOCATION
 * ============================================================
 */

export function setEventLocation(
  event: EventEntityInput,
  placeId: string
): EventEntityInput {
  const id =
    placeId.trim();

  if (!id) {
    throw new Error(
      "Place ID cannot be empty."
    );
  }

  return {
    ...event,

    locationId:
      id,
  };
}

/*
 * ============================================================
 * HERO RELATIONSHIP
 * ============================================================
 */

export function addEventHero(
  event: EventEntityInput,
  heroId: string
): EventEntityInput {
  const id =
    heroId.trim();

  if (!id) {
    return event;
  }

  if (
    event.heroIds.includes(id)
  ) {
    return event;
  }

  return {
    ...event,

    heroIds: [
      ...event.heroIds,
      id,
    ],

    crossReferences: {
      ...event.crossReferences,

      relatedHeroes: event
        .crossReferences
        .relatedHeroes
        .includes(id)
        ? event.crossReferences.relatedHeroes
        : [
            ...event.crossReferences.relatedHeroes,
            id,
          ],
    },
  };
}

/*
 * ============================================================
 * SOURCE
 * ============================================================
 */

export function addEventSource(
  event: EventEntityInput,
  sourceId: string
): EventEntityInput {
  const id =
    sourceId.trim();

  if (!id) {
    return event;
  }

  if (
    event.sourceIds.includes(id)
  ) {
    return event;
  }

  return {
    ...event,

    sourceIds: [
      ...event.sourceIds,
      id,
    ],
  };
}

/*
 * ============================================================
 * IMAGE
 * ============================================================
 */

export function addEventImage(
  event: EventEntityInput,
  imageId: string,
  relatedSection:
    | string
    | null = null
): EventEntityInput {
  const id =
    imageId.trim();

  if (!id) {
    return event;
  }

  if (
    event.imageIds.some(
      (image) =>
        image.imageId === id
    )
  ) {
    return event;
  }

  return {
    ...event,

    imageIds: [
      ...event.imageIds,

      {
        imageId:
          id,

        relatedSection:
          relatedSection?.trim() ||
          null,
      },
    ],
  };
}

/*
 * ============================================================
 * BOOK
 * ============================================================
 */

export function addEventBook(
  event: EventEntityInput,
  bookId: string
): EventEntityInput {
  const id =
    bookId.trim();

  if (!id) {
    return event;
  }

  if (
    event.crossReferences.relatedBooks.includes(id)
  ) {
    return event;
  }

  return {
    ...event,

    crossReferences: {
      ...event.crossReferences,

      relatedBooks: [
        ...event.crossReferences.relatedBooks,
        id,
      ],
    },
  };
}

/*
 * ============================================================
 * BATTLE
 * ============================================================
 */

export function addEventBattle(
  event: EventEntityInput,
  battleId: string
): EventEntityInput {
  const id =
    battleId.trim();

  if (!id) {
    return event;
  }

  if (
    event.crossReferences.relatedBattles.includes(id)
  ) {
    return event;
  }

  return {
    ...event,

    crossReferences: {
      ...event.crossReferences,

      relatedBattles: [
        ...event.crossReferences.relatedBattles,
        id,
      ],
    },
  };
}

/*
 * ============================================================
 * RELATED PLACE
 * ============================================================
 */

export function addEventPlace(
  event: EventEntityInput,
  placeId: string
): EventEntityInput {
  const id =
    placeId.trim();

  if (!id) {
    return event;
  }

  if (
    event.crossReferences.relatedPlaces.includes(id)
  ) {
    return event;
  }

  return {
    ...event,

    crossReferences: {
      ...event.crossReferences,

      relatedPlaces: [
        ...event.crossReferences.relatedPlaces,
        id,
      ],
    },
  };
}

/*
 * ============================================================
 * HISTORICAL PERIOD
 * ============================================================
 */

export function setHistoricalPeriod(
  event: EventEntityInput,
  historicalPeriodId: string
): EventEntityInput {
  const id =
    historicalPeriodId.trim();

  if (!id) {
    throw new Error(
      "Historical period ID cannot be empty."
    );
  }

  return {
    ...event,

    historicalPeriodId:
      id,
  };
}

/*
 * ============================================================
 * LINKED EVENT
 * ============================================================
 */

export function setLinkedEvent(
  event: EventEntityInput,
  linkedEventId: string
): EventEntityInput {
  const id =
    linkedEventId.trim();

  if (!id) {
    return event;
  }

  return {
    ...event,

    linkedEventId:
      id,
  };
}

/*
 * ============================================================
 * TAG
 * ============================================================
 */

export function addEventTag(
  event: EventEntityInput,
  tag: string
): EventEntityInput {
  const normalized =
    tag.trim();

  if (!normalized) {
    return event;
  }

  const exists =
    event.tags.some(
      (existing) =>
        existing.toLowerCase() ===
        normalized.toLowerCase()
    );

  if (exists) {
    return event;
  }

  return {
    ...event,

    tags: [
      ...event.tags,
      normalized,
    ],
  };
}

/*
 * ============================================================
 * SEARCH KEYWORD
 * ============================================================
 */

export function addEventKeyword(
  event: EventEntityInput,
  keyword: string
): EventEntityInput {
  const normalized =
    keyword.trim();

  if (!normalized) {
    return event;
  }

  const exists =
    event.searchFields.keywords.some(
      (existing) =>
        existing.toLowerCase() ===
        normalized.toLowerCase()
    );

  if (exists) {
    return event;
  }

  return {
    ...event,

    searchFields: {
      ...event.searchFields,

      keywords: [
        ...event.searchFields.keywords,
        normalized,
      ],
    },
  };
}

/*
 * ============================================================
 * USER INFORMATION
 * ============================================================
 */

export function setAdditionalInformation(
  event: EventEntityInput,
  information: string | null
): EventEntityInput {
  return {
    ...event,

    additionalInformation:
      information?.trim() ||
      null,
  };
}