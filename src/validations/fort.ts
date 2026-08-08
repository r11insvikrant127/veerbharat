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
   FORT STATUS
===================================================== */

export const fortStatusEnum = z.enum([
  "Active",
  "Ruins",
  "Restored",
]);

/* =====================================================
   CREATE
===================================================== */

export const createFortSchema = z.object({
  /* BASIC */

  name: z.string()
    .trim()
    .min(2)
    .max(200),

  nativeName: z.string()
    .trim()
    .optional()
    .default(""),

  alternativeNames: stringArray,

  /* LOCATION */

  locationId: objectId,

  /* HISTORY */

  constructionDate: z.coerce
    .date()
    .nullable()
    .optional(),

  constructionDateAccuracy:
    accuracyEnum
      .optional()
      .default("Unknown"),

  builderId: objectId.optional(),

  kingdomId: objectId.optional(),

  /* FORT DETAILS */

  architectureStyle: z.string()
    .trim()
    .optional()
    .default(""),

  features: stringArray,

  battles: objectIdArray,

  fortStatus:
    fortStatusEnum.optional(),

  /* CONTENT */

  description: z.string()
    .trim()
    .min(10),

  imageIds: objectIdArray,

  sourceIds: objectIdArray,

  tags: stringArray,

  /* ===================================================
     CROSS REFERENCES
  =================================================== */

  crossReferences: z
    .object({
      relatedHeroes: objectIdArray,

      relatedKingdoms: objectIdArray,

      relatedBattles: objectIdArray,

      relatedPlaces: objectIdArray,

      relatedSources: objectIdArray,

      relatedImages: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedKingdoms: [],
      relatedBattles: [],
      relatedPlaces: [],
      relatedSources: [],
      relatedImages: [],
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

export const updateFortSchema =
  createFortSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const fortQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    fortStatus:
      fortStatusEnum.optional(),

    locationId:
      objectId.optional(),

    builderId:
      objectId.optional(),

    kingdomId:
      objectId.optional(),

    sort: z.enum([
      "name",
      "-name",
      "constructionDate",
      "-constructionDate",
      "createdAt",
      "-createdAt",
    ]).default("name"),
  });

/* =====================================================
   ID
===================================================== */

export const fortIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateFortInput =
  z.infer<typeof createFortSchema>;

export type UpdateFortInput =
  z.infer<typeof updateFortSchema>;

export type FortQuery =
  z.infer<typeof fortQuerySchema>;

export type FortId =
  z.infer<typeof fortIdSchema>;