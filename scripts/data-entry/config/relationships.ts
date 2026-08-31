/**
 * VeerBharat Data Entry System
 *
 * Central relationship configuration.
 *
 * The workflow uses this configuration to discover
 * existing related records and ask the user whether
 * they should be reused.
 */

import type { EntityType } from "./entities";

export type RelationshipKind =
  | "single"
  | "multiple";

export type RelationshipConfig = {
  /**
   * Field on the originating document.
   */
  field: string;

  /**
   * Target MongoDB collection.
   */
  targetCollection: string;

  /**
   * Target public ID field.
   */
  targetIdField: string;

  /**
   * Relationship cardinality.
   */
  kind: RelationshipKind;

  /**
   * Human-readable name used in CLI questions.
   */
  label: string;

  /**
   * Whether the workflow should actively search
   * the internet/database for this relationship.
   */
  discoverAutomatically: boolean;

  /**
   * Whether a newly discovered target can be proposed
   * for creation if no matching record exists.
   */
  allowCreate: boolean;
};

export const RELATIONSHIPS: Record<
  EntityType,
  RelationshipConfig[]
> = {
  hero: [
    {
      field: "kingdomId",
      targetCollection: "kingdoms",
      targetIdField: "kingdomId",
      kind: "single",
      label: "Kingdom",
      discoverAutomatically: true,
      allowCreate: true,
    },

    {
      field: "sourceIds",
      targetCollection: "sources",
      targetIdField: "sourceId",
      kind: "multiple",
      label: "Sources",
      discoverAutomatically: true,
      allowCreate: true,
    },

    {
      field: "bookIds",
      targetCollection: "books",
      targetIdField: "bookId",
      kind: "multiple",
      label: "Books",
      discoverAutomatically: true,
      allowCreate: true,
    },

    {
      field: "quoteIds",
      targetCollection: "quotes",
      targetIdField: "quoteId",
      kind: "multiple",
      label: "Quotes",
      discoverAutomatically: true,
      allowCreate: true,
    },

    {
      field: "imageIds",
      targetCollection: "images",
      targetIdField: "imageId",
      kind: "multiple",
      label: "Image",
      discoverAutomatically: false,
      allowCreate: true,
    },

    {
      field: "birthPlaceId",
      targetCollection: "places",
      targetIdField: "placeId",
      kind: "single",
      label: "Birth Place",
      discoverAutomatically: true,
      allowCreate: true,
    },

    {
      field: "deathPlaceId",
      targetCollection: "places",
      targetIdField: "placeId",
      kind: "single",
      label: "Death Place",
      discoverAutomatically: true,
      allowCreate: true,
    },

    {
      field: "historicalPeriodId",
      targetCollection: "historicalperiods",
      targetIdField: "periodId",
      kind: "single",
      label: "Historical Period",
      discoverAutomatically: true,
      allowCreate: true,
    },
  ],

  historicalPersonality: [
    {
      field: "sourceIds",
      targetCollection: "sources",
      targetIdField: "sourceId",
      kind: "multiple",
      label: "Sources",
      discoverAutomatically: true,
      allowCreate: true,
    },

    {
      field: "bookIds",
      targetCollection: "books",
      targetIdField: "bookId",
      kind: "multiple",
      label: "Books",
      discoverAutomatically: true,
      allowCreate: true,
    },

    {
      field: "imageIds",
      targetCollection: "images",
      targetIdField: "imageId",
      kind: "multiple",
      label: "Image",
      discoverAutomatically: false,
      allowCreate: true,
    },

    {
      field: "historicalPeriodId",
      targetCollection: "historicalperiods",
      targetIdField: "periodId",
      kind: "single",
      label: "Historical Period",
      discoverAutomatically: true,
      allowCreate: true,
    },
  ],

  event: [
    {
      field: "heroIds",
      targetCollection: "heroes",
      targetIdField: "heroId",
      kind: "multiple",
      label: "Heroes",
      discoverAutomatically: true,
      allowCreate: false,
    },

    {
      field: "historicalPersonalityIds",
      targetCollection: "historicalpersonalities",
      targetIdField: "historicalPersonalityId",
      kind: "multiple",
      label: "Historical Personalities",
      discoverAutomatically: true,
      allowCreate: false,
    },

    {
      field: "sourceIds",
      targetCollection: "sources",
      targetIdField: "sourceId",
      kind: "multiple",
      label: "Sources",
      discoverAutomatically: true,
      allowCreate: true,
    },

    {
      field: "imageIds",
      targetCollection: "images",
      targetIdField: "imageId",
      kind: "multiple",
      label: "Images",
      discoverAutomatically: false,
      allowCreate: true,
    },

    {
      field: "historicalPeriodId",
      targetCollection: "historicalperiods",
      targetIdField: "periodId",
      kind: "single",
      label: "Historical Period",
      discoverAutomatically: true,
      allowCreate: true,
    },

    {
      field: "battleId",
      targetCollection: "battles",
      targetIdField: "battleId",
      kind: "single",
      label: "Battle",
      discoverAutomatically: true,
      allowCreate: true,
    },
  ],
};

/**
 * Return all relationships supported by an entity.
 */
export function getRelationships(
  entityType: EntityType
): RelationshipConfig[] {
  return RELATIONSHIPS[entityType];
}

/**
 * Return one relationship by field name.
 */
export function getRelationship(
  entityType: EntityType,
  field: string
): RelationshipConfig | undefined {
  return RELATIONSHIPS[entityType].find(
    (relationship) =>
      relationship.field === field
  );
}