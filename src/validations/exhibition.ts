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

export const createExhibitionSchema = z.object({
  /* BASIC */

  name: z.string()
    .trim()
    .min(2)
    .max(250),

  description: z.string()
    .trim()
    .min(10),

  /* MUSEUM */

  museumId: objectId,

  /* HEROES */

  heroIds: objectIdArray,

  /* DETAILS */

  theme: z.string()
    .trim()
    .optional()
    .default(""),

  imageIds: objectIdArray,

  tags: stringArray,

  /* ===================================================
     CROSS REFERENCES
  =================================================== */

  crossReferences: z
    .object({
      relatedHeroes: objectIdArray,

      relatedMuseums: objectIdArray,

      relatedImages: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedMuseums: [],
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

export const updateExhibitionSchema =
  createExhibitionSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const exhibitionQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    museumId:
      objectId.optional(),

    theme: z.string()
      .trim()
      .optional(),

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

export const exhibitionIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateExhibitionInput =
  z.infer<typeof createExhibitionSchema>;

export type UpdateExhibitionInput =
  z.infer<typeof updateExhibitionSchema>;

export type ExhibitionQuery =
  z.infer<typeof exhibitionQuerySchema>;

export type ExhibitionId =
  z.infer<typeof exhibitionIdSchema>;