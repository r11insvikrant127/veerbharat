import { z } from "zod";

import {
  objectIdArray,
  stringArray,
  statusEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   CREATE
===================================================== */

export const createTribeSchema = z.object({
  /* BASIC */

  name: z.string()
    .trim()
    .min(2)
    .max(250),

  nativeName: z.string()
    .trim()
    .optional()
    .default(""),

  region: z.string()
    .trim()
    .optional()
    .default(""),

  historicalRole: z.string()
    .trim()
    .optional()
    .default(""),

  /* REFERENCES */

  alliances: objectIdArray,

  /* CONTENT */

  description: z.string()
    .trim()
    .min(10),

  sourceIds: objectIdArray,

  tags: stringArray,

  /* ===================================================
     CROSS REFERENCES
  =================================================== */

  crossReferences: z
    .object({
      relatedAlliances: objectIdArray,

      relatedHeroes: objectIdArray,

      relatedKingdoms: objectIdArray,

      relatedSources: objectIdArray,
    })
    .optional()
    .default({
      relatedAlliances: [],
      relatedHeroes: [],
      relatedKingdoms: [],
      relatedSources: [],
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

export const updateTribeSchema =
  createTribeSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const tribeQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    region: z.string()
      .trim()
      .optional(),

    sort: z.enum([
      "name",
      "-name",
      "region",
      "-region",
      "createdAt",
      "-createdAt",
    ]).default("name"),
  });

/* =====================================================
   ID
===================================================== */

export const tribeIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateTribeInput =
  z.infer<typeof createTribeSchema>;

export type UpdateTribeInput =
  z.infer<typeof updateTribeSchema>;

export type TribeQuery =
  z.infer<typeof tribeQuerySchema>;

export type TribeId =
  z.infer<typeof tribeIdSchema>;