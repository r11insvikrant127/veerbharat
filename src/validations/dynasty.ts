import { z } from "zod";

import {
  objectId,
  objectIdArray,
  stringArray,
  statusEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   CREATE
===================================================== */

export const createDynastySchema = z.object({
  /* BASIC */

  name: z.string()
    .trim()
    .min(2)
    .max(150),

  nativeName: z.string()
    .trim()
    .optional()
    .default(""),

  alternativeNames: stringArray,

  origin: z.string()
    .trim()
    .optional()
    .default(""),

  /* RELATIONSHIPS */

  founderId: objectId.optional(),

  kingdomId: objectId.optional(),

  famousRulers: objectIdArray,

  historicalPeriodId: objectId.optional(),

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
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedKingdoms: [],
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

export const updateDynastySchema =
  createDynastySchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const dynastyQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    kingdomId: objectId.optional(),

    founderId: objectId.optional(),

    historicalPeriodId:
      objectId.optional(),

    sort: z.enum([
      "name",
      "-name",
      "createdAt",
      "-createdAt",
    ]).default("name"),
  });

/* =====================================================
   ID
===================================================== */

export const dynastyIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateDynastyInput =
  z.infer<typeof createDynastySchema>;

export type UpdateDynastyInput =
  z.infer<typeof updateDynastySchema>;

export type DynastyQuery =
  z.infer<typeof dynastyQuerySchema>;

export type DynastyId =
  z.infer<typeof dynastyIdSchema>;