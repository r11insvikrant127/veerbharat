import { z } from "zod";

import {
  objectId,
  objectIdArray,
  stringArray,
  statusEnum,
  accuracyEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   EVENT TYPE
===================================================== */

export const eventTypeEnum = z.enum([
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
]);

/* =====================================================
   CREATE
===================================================== */

export const createEventSchema = z.object({
  /* BASIC */

  name: z.string()
    .trim()
    .min(2)
    .max(200),

  nativeName: z.string()
    .trim()
    .optional()
    .default(""),

  eventDate: z.coerce
    .date()
    .nullable()
    .optional(),

  eventDateAccuracy: accuracyEnum
    .optional()
    .default("Unknown"),

  /* RELATIONSHIPS */

  locationId: objectId.optional(),

  heroIds: objectIdArray,

  historicalPeriodId: objectId.optional(),

  /* CLASSIFICATION */

  type: eventTypeEnum,

  isOnThisDayEligible: z.boolean()
    .optional()
    .default(false),

  /* CONTENT */

  description: z.string()
    .trim()
    .min(10),

  shortDescription: z.string()
    .trim()
    .optional()
    .default(""),

  details: z.string()
    .trim()
    .optional()
    .default(""),

  significance: z.string()
    .trim()
    .optional()
    .default(""),

  imageIds: objectIdArray,

  sourceIds: objectIdArray,

  tags: stringArray,

  /* ===================================================
     CROSS REFERENCES
  =================================================== */

  crossReferences: z
    .object({
      relatedHeroes: objectIdArray,

      relatedPlaces: objectIdArray,

      relatedBattles: objectIdArray,

      relatedBooks: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedPlaces: [],
      relatedBattles: [],
      relatedBooks: [],
    }),

  /* ===================================================
     SEARCH
  =================================================== */

  searchFields: z
    .object({
      keywords: stringArray,

      nativeSpellings: stringArray,

      alternateSpellings: stringArray,

      aliases: stringArray,
    })
    .optional()
    .default({
      keywords: [],
      nativeSpellings: [],
      alternateSpellings: [],
      aliases: [],
    }),

  /* ===================================================
     METADATA
  =================================================== */

  metadata: z
    .object({
      createdBy: z.string()
        .trim()
        .optional()
        .default(""),

      verifiedBy: z.string()
        .trim()
        .optional()
        .default(""),

      version: z.number()
        .int()
        .positive()
        .default(1),
    })
    .optional()
    .default({
      createdBy: "",
      verifiedBy: "",
      version: 1,
    }),

  /* ===================================================
     STATUS
  =================================================== */

  status: statusEnum
    .optional()
    .default("Draft"),
});

/* =====================================================
   UPDATE
===================================================== */

export const updateEventSchema =
  createEventSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const eventQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    type: eventTypeEnum.optional(),

    historicalPeriodId:
      objectId.optional(),

    locationId:
      objectId.optional(),

    heroId:
      objectId.optional(),

    isOnThisDayEligible:
      z.coerce.boolean().optional(),

    sort: z.enum([
      "name",
      "-name",
      "eventDate",
      "-eventDate",
      "createdAt",
      "-createdAt",
    ]).default("eventDate"),
  });

/* =====================================================
   ID
===================================================== */

export const eventIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateEventInput =
  z.infer<typeof createEventSchema>;

export type UpdateEventInput =
  z.infer<typeof updateEventSchema>;

export type EventQuery =
  z.infer<typeof eventQuerySchema>;

export type EventId =
  z.infer<typeof eventIdSchema>;