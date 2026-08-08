// src/validations/kingdom.ts

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
   CREATE
===================================================== */

export const createKingdomSchema = z.object({
  /* BASIC */

  name: z.string().trim().min(2).max(150),

  nativeName: z.string().trim().optional().default(""),

  alternativeNames: stringArray,

  establishedDate: z.coerce.date().nullable().optional(),

  establishedDateAccuracy: accuracyEnum
    .optional()
    .default("Unknown"),

  dissolvedDate: z.coerce.date().nullable().optional(),

  dissolvedDateAccuracy: accuracyEnum
    .optional()
    .default("Unknown"),

  /* RULERS */

  capitalId: objectId.optional(),

  dynastyId: objectId.optional(),

  founderId: objectId.optional(),

  lastRulerId: objectId.optional(),

  /* KINGDOM DETAILS */

  area: z.string().trim().optional().default(""),

  flagImageId: objectId.optional(),

  emblemImageId: objectId.optional(),

  governmentType: z.string().trim().optional().default(""),

  currencies: stringArray,

  officialLanguages: stringArray,

  officialReligions: stringArray,

  nationalAnimal: z.string().trim().optional().default(""),

  nationalSymbols: stringArray,

  /* GEOGRAPHY */

  majorCities: objectIdArray,

  majorForts: objectIdArray,

  historicalPeriodId: objectId.optional(),

  /* CONTENT */

  description: z.string().trim().min(10),

  significance: z.string().trim().optional().default(""),

  imageIds: objectIdArray,

  sourceIds: objectIdArray,

  tags: stringArray,

  /* CROSS REFERENCES */

  crossReferences: z
    .object({
      relatedHeroes: objectIdArray,

      relatedBattles: objectIdArray,

      relatedPlaces: objectIdArray,

      relatedBooks: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedBattles: [],
      relatedPlaces: [],
      relatedBooks: [],
    }),

  /* SEARCH */

  searchFields: z
    .object({
      keywords: stringArray,

      nativeSpellings: stringArray,

      alternateSpellings: stringArray,
    })
    .optional()
    .default({
      keywords: [],
      nativeSpellings: [],
      alternateSpellings: [],
    }),

  /* METADATA */

  metadata: z
    .object({
      createdBy: z.string().trim().optional().default(""),

      verifiedBy: z.string().trim().optional().default(""),

      version: z.number().int().positive().default(1),
    })
    .optional()
    .default({
      createdBy: "",
      verifiedBy: "",
      version: 1,
    }),

  status: statusEnum
    .optional()
    .default("Draft"),
});

/* =====================================================
   UPDATE
===================================================== */

export const updateKingdomSchema =
  createKingdomSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const kingdomQuerySchema =
  paginationSchema.extend({
    search: z.string().trim().optional(),

    status: statusEnum.optional(),

    dynastyId: objectId.optional(),

    founderId: objectId.optional(),

    historicalPeriodId: objectId.optional(),

    sort: z
      .enum([
        "name",
        "-name",
        "createdAt",
        "-createdAt",
        "establishedDate",
        "-establishedDate",
      ])
      .default("name"),
  });

/* =====================================================
   ID PARAM
===================================================== */

export const kingdomIdSchema = z.object({
  id: z.string().trim().min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateKingdomInput =
  z.infer<typeof createKingdomSchema>;

export type UpdateKingdomInput =
  z.infer<typeof updateKingdomSchema>;

export type KingdomQuery =
  z.infer<typeof kingdomQuerySchema>;

export type KingdomId =
  z.infer<typeof kingdomIdSchema>;