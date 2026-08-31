/**
 * VeerBharat Data Entry System
 *
 * Central definition of the entities that the automated
 * data-entry workflow understands.
 *
 * IMPORTANT:
 * This file contains configuration only.
 * It does NOT create, update, or delete MongoDB data.
 */

export type EntityType =
  | "event"
  | "hero"
  | "historicalPersonality";

export type EntityConfig = {
  type: EntityType;

  /**
   * Human-readable name shown in the CLI.
   */
  label: string;

  /**
   * MongoDB collection name.
   */
  collection: string;

  /**
   * Public ID field used by the collection.
   */
  idField: string;

  /**
   * Public ID prefix.
   *
   * This is the logical prefix used by the existing
   * VeerBharat database/application.
   */
  prefix: string;

  /**
   * Name fields used for duplicate detection.
   */
  nameFields: string[];

  /**
   * Whether the entity participates in the
   * "On This Day" date verification workflow.
   */
  supportsDateVerification: boolean;

  /**
   * Whether the entity can have multiple images
   * through the data-entry workflow.
   */
  multipleImages: boolean;

  /**
   * Whether the entity has a single primary image
   * relationship.
   */
  singleImage: boolean;
};

export const ENTITY_CONFIG: Record<EntityType, EntityConfig> = {
  event: {
    type: "event",
    label: "Event",
    collection: "events",
    idField: "eventId",
    prefix: "EVT",
    nameFields: [
      "name",
      "title",
      "alternativeNames",
    ],
    supportsDateVerification: true,
    multipleImages: true,
    singleImage: false,
  },

  hero: {
    type: "hero",
    label: "Hero",
    collection: "heroes",
    idField: "heroId",
    prefix: "HER",
    nameFields: [
      "name",
      "nativeName",
      "alternativeNames",
      "searchFields",
      "tags",
    ],
    supportsDateVerification: true,
    multipleImages: false,
    singleImage: true,
  },

  historicalPersonality: {
    type: "historicalPersonality",
    label: "Historical Personality",
    collection: "historicalpersonalities",
    idField: "historicalPersonalityId",
    prefix: "HP",
    nameFields: [
      "name",
      "nativeName",
      "alternativeNames",
      "searchFields",
      "tags",
    ],
    supportsDateVerification: true,
    multipleImages: false,
    singleImage: true,
  },
};

/**
 * Returns the configuration for an entity type.
 */
export function getEntityConfig(
  type: EntityType
): EntityConfig {
  return ENTITY_CONFIG[type];
}

/**
 * Returns all supported entity types.
 */
export function getEntityTypes(): EntityType[] {
  return Object.keys(
    ENTITY_CONFIG
  ) as EntityType[];
}