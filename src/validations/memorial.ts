import { z } from "zod";

import {
  objectId,
  objectIdArray,
  stringArray,
  statusEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   MEMORIAL TYPE
===================================================== */

export const memorialTypeEnum = z.enum([
  "Smarak",
  "Chatri",
  "Monument",
  "Tourist Attraction",
  "Museum",
]);

/* =====================================================
   DEDICATED TO MODEL
===================================================== */

export const dedicatedToModelEnum = z.enum([
  "Hero",
  "WarAnimal",
]);

/* =====================================================
   CREATE
===================================================== */

export const createMemorialSchema = z.object({
  /* BASIC */

  name: z.string()
    .trim()
    .min(2)
    .max(250),

  nativeName: z.string()
    .trim()
    .optional()
    .default(""),

  type: memorialTypeEnum,

  /* LOCATION */

  locationId: objectId,

  /* DEDICATION */

  dedicatedTo: objectIdArray,

  dedicatedToModel:
    dedicatedToModelEnum.optional(),

  builtBy: objectId.optional(),

  yearBuilt: z.string()
    .trim()
    .optional()
    .default(""),

  /* CONTENT */

  description: z.string()
    .trim()
    .min(10),

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

      relatedWarAnimals: objectIdArray,

      relatedPlaces: objectIdArray,

      relatedSources: objectIdArray,

      relatedImages: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedWarAnimals: [],
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

export const updateMemorialSchema =
  createMemorialSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const memorialQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    type:
      memorialTypeEnum.optional(),

    locationId:
      objectId.optional(),

    builtBy:
      objectId.optional(),

    dedicatedToModel:
      dedicatedToModelEnum.optional(),

    sort: z.enum([
      "name",
      "-name",
      "type",
      "-type",
      "yearBuilt",
      "-yearBuilt",
      "createdAt",
      "-createdAt",
    ]).default("name"),
  });

/* =====================================================
   ID
===================================================== */

export const memorialIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateMemorialInput =
  z.infer<typeof createMemorialSchema>;

export type UpdateMemorialInput =
  z.infer<typeof updateMemorialSchema>;

export type MemorialQuery =
  z.infer<typeof memorialQuerySchema>;

export type MemorialId =
  z.infer<typeof memorialIdSchema>;