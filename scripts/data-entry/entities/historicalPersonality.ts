// scripts/data-entry/entities/historicalPersonality.ts

import type { EntityInput } from "../db/entityInput";

/*
 * ============================================================
 * HISTORICAL PERSONALITY INPUT
 * ============================================================
 *
 * This structure mirrors the CURRENT
 * HistoricalPersonality mongoose schema.
 *
 * Verification-specific information is handled by the
 * research and workflow layers.
 *
 * Relationships discovered by research are handled by the
 * research/workflow layers.
 */

export type HistoricalPersonalityEntityInput = {
  entityType: "historicalPersonality";

  /*
   * ----------------------------------------------------------
   * BASIC INFORMATION
   * ----------------------------------------------------------
   */

  entityName: string;

  nativeName: string | null;

  title: string | null;

  gender: string | null;

  /*
   * ----------------------------------------------------------
   * DESCRIPTION
   * ----------------------------------------------------------
   */

  shortDescription: string | null;

  biography: string | null;

  /*
   * ----------------------------------------------------------
   * DATES
   * ----------------------------------------------------------
   */

  birthDate: string | null;

  deathDate: string | null;

  /*
   * ----------------------------------------------------------
   * IMAGE
   * ----------------------------------------------------------
   *
   * The current data-entry rule allows one image for a
   * Historical Personality.
   *
   * The mongoose schema itself stores imageIds as an array,
   * so the one-image rule is enforced here at workflow level.
   */

  imageIds: string[];

  /*
   * ----------------------------------------------------------
   * STATUS
   * ----------------------------------------------------------
   */

  status: string;

  /*
   * ----------------------------------------------------------
   * USER PROVIDED INFORMATION
   * ----------------------------------------------------------
   */

  additionalInformation: string | null;
};

/*
 * ============================================================
 * CREATE EMPTY HISTORICAL PERSONALITY
 * ============================================================
 */

export function createEmptyHistoricalPersonalityInput(
  entity: EntityInput
): HistoricalPersonalityEntityInput {
  if (
    entity.entityType !==
    "historicalPersonality"
  ) {
    throw new Error(
      "createEmptyHistoricalPersonalityInput requires a historical personality entity."
    );
  }

  return {
    entityType:
      "historicalPersonality",

    entityName:
      entity.name,

    nativeName:
      null,

    title:
      null,

    gender:
      null,

    shortDescription:
      null,

    biography:
      null,

    birthDate:
      null,

    deathDate:
      null,

    imageIds:
      [],

    status:
      "published",

    additionalInformation:
      null,
  };
}

/*
 * ============================================================
 * VALIDATION
 * ============================================================
 *
 * This validates structure only.
 *
 * It does NOT decide:
 *
 *   - whether the person really existed
 *   - whether the biography is historically correct
 *   - whether the person should be classified as Hero
 *   - whether the person should be classified as Historical
 *     Personality
 *
 * Those decisions belong to the research + verification
 * workflow.
 */

export function validateHistoricalPersonalityInput(
  personality:
    HistoricalPersonalityEntityInput
): void {
  if (
    !personality.entityName.trim()
  ) {
    throw new Error(
      "Historical personality name cannot be empty."
    );
  }

  /*
   * Current workflow rule:
   * maximum one image.
   */

  if (
    personality.imageIds.length > 1
  ) {
    throw new Error(
      "Historical Personality can have at most one image in the current data-entry workflow."
    );
  }

  /*
   * Prevent duplicate image IDs.
   */

  const uniqueImageIds =
    new Set(
      personality.imageIds
    );

  if (
    uniqueImageIds.size !==
    personality.imageIds.length
  ) {
    throw new Error(
      "Duplicate image IDs found in Historical Personality."
    );
  }

  /*
   * If both dates are available, ensure the basic
   * chronological relationship is valid.
   */

  if (
    personality.birthDate &&
    personality.deathDate
  ) {
    const birth =
      new Date(
        personality.birthDate
      );

    const death =
      new Date(
        personality.deathDate
      );

    if (
      !Number.isNaN(
        birth.getTime()
      ) &&
      !Number.isNaN(
        death.getTime()
      ) &&
      birth > death
    ) {
      throw new Error(
        "Birth date cannot be later than death date."
      );
    }
  }
}

/*
 * ============================================================
 * BASIC INFORMATION
 * ============================================================
 */

export function setNativeName(
  personality:
    HistoricalPersonalityEntityInput,
  nativeName: string | null
): HistoricalPersonalityEntityInput {
  return {
    ...personality,

    nativeName:
      nativeName?.trim() ||
      null,
  };
}

export function setTitle(
  personality:
    HistoricalPersonalityEntityInput,
  title: string | null
): HistoricalPersonalityEntityInput {
  return {
    ...personality,

    title:
      title?.trim() ||
      null,
  };
}

export function setGender(
  personality:
    HistoricalPersonalityEntityInput,
  gender: string | null
): HistoricalPersonalityEntityInput {
  return {
    ...personality,

    gender:
      gender?.trim() ||
      null,
  };
}

/*
 * ============================================================
 * DESCRIPTION
 * ============================================================
 */

export function setShortDescription(
  personality:
    HistoricalPersonalityEntityInput,
  description: string | null
): HistoricalPersonalityEntityInput {
  return {
    ...personality,

    shortDescription:
      description?.trim() ||
      null,
  };
}

export function setBiography(
  personality:
    HistoricalPersonalityEntityInput,
  biography: string | null
): HistoricalPersonalityEntityInput {
  return {
    ...personality,

    biography:
      biography?.trim() ||
      null,
  };
}

/*
 * ============================================================
 * DATES
 * ============================================================
 *
 * Dates are kept as strings in this intermediate structure.
 *
 * The verified Date values can be converted immediately before
 * database writing.
 */

export function setBirthDate(
  personality:
    HistoricalPersonalityEntityInput,
  birthDate: string | null
): HistoricalPersonalityEntityInput {
  return {
    ...personality,

    birthDate:
      birthDate?.trim() ||
      null,
  };
}

export function setDeathDate(
  personality:
    HistoricalPersonalityEntityInput,
  deathDate: string | null
): HistoricalPersonalityEntityInput {
  return {
    ...personality,

    deathDate:
      deathDate?.trim() ||
      null,
  };
}

/*
 * ============================================================
 * IMAGE
 * ============================================================
 */

export function setHistoricalPersonalityImage(
  personality:
    HistoricalPersonalityEntityInput,
  imageId: string
): HistoricalPersonalityEntityInput {
  const id =
    imageId.trim();

  if (!id) {
    throw new Error(
      "Image ID cannot be empty."
    );
  }

  /*
   * Current project rule:
   * exactly one image maximum.
   */

  if (
    personality.imageIds.length >= 1
  ) {
    throw new Error(
      "Historical Personality already has an image. Only one image is allowed."
    );
  }

  return {
    ...personality,

    imageIds: [
      id,
    ],
  };
}

export function removeHistoricalPersonalityImage(
  personality:
    HistoricalPersonalityEntityInput
): HistoricalPersonalityEntityInput {
  return {
    ...personality,

    imageIds:
      [],
  };
}

/*
 * ============================================================
 * STATUS
 * ============================================================
 */

export function setHistoricalPersonalityStatus(
  personality:
    HistoricalPersonalityEntityInput,
  status: string
): HistoricalPersonalityEntityInput {
  const normalized =
    status.trim();

  if (!normalized) {
    throw new Error(
      "Status cannot be empty."
    );
  }

  return {
    ...personality,

    status:
      normalized,
  };
}

/*
 * ============================================================
 * ADDITIONAL INFORMATION
 * ============================================================
 *
 * This remains separate from verified database information
 * until the final workflow decides how it should be merged.
 */

export function setAdditionalInformation(
  personality:
    HistoricalPersonalityEntityInput,
  information: string | null
): HistoricalPersonalityEntityInput {
  return {
    ...personality,

    additionalInformation:
      information?.trim() ||
      null,
  };
}