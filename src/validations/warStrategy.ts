import { z } from "zod";

import {
  objectIdArray,
  stringArray,
  statusEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   WAR STRATEGY TYPE
===================================================== */

export const warStrategyTypeEnum = z.enum([
  "Guerrilla",
  "Conventional",
  "Terrain-based",
  "Deception",
  "Psychological",
]);

/* =====================================================
   CREATE
===================================================== */

export const createWarStrategySchema = z.object({
  /* BASIC */

  name: z.string()
    .trim()
    .min(2)
    .max(200),

  nativeName: z.string()
    .trim()
    .optional()
    .default(""),

  type: warStrategyTypeEnum,

  /* DETAILS */

  keyPrinciples: stringArray,

  usedBy: objectIdArray,

  usedInBattles: objectIdArray,

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

      relatedBattles: objectIdArray,

      relatedSources: objectIdArray,

      relatedImages: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedBattles: [],
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

export const updateWarStrategySchema =
  createWarStrategySchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const warStrategyQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    type:
      warStrategyTypeEnum.optional(),

    sort: z.enum([
      "name",
      "-name",
      "type",
      "-type",
      "createdAt",
      "-createdAt",
    ]).default("name"),
  });

/* =====================================================
   ID
===================================================== */

export const warStrategyIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateWarStrategyInput =
  z.infer<typeof createWarStrategySchema>;

export type UpdateWarStrategyInput =
  z.infer<typeof updateWarStrategySchema>;

export type WarStrategyQuery =
  z.infer<typeof warStrategyQuerySchema>;

export type WarStrategyId =
  z.infer<typeof warStrategyIdSchema>;