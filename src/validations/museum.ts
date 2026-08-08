import { z } from "zod";

import {
  objectId,
  objectIdArray,
  stringArray,
  statusEnum,
  paginationSchema,
} from "@/validations/common";

/* =====================================================
   MUSEUM TYPE
===================================================== */

export const museumTypeEnum = z.enum([
  "Museum",
  "Memorial",
  "Cultural Center",
]);

/* =====================================================
   CREATE
===================================================== */

export const createMuseumSchema = z.object({
  /* BASIC */

  name: z.string()
    .trim()
    .min(2)
    .max(250),

  nativeName: z.string()
    .trim()
    .optional()
    .default(""),

  /* LOCATION */

  locationId: objectId,

  type: museumTypeEnum,

  /* DETAILS */

  dedicatedTo: objectIdArray,

  description: z.string()
    .trim()
    .min(10),

  highlights: stringArray,

  openingHours: z.string()
    .trim()
    .optional()
    .default(""),

  entryFee: z.string()
    .trim()
    .optional()
    .default(""),

  website: z.string()
    .trim()
    .url()
    .optional()
    .default(""),

  /* CONTENT */

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

      relatedExhibitions: objectIdArray,

      relatedWeapons: objectIdArray,

      relatedSources: objectIdArray,

      relatedImages: objectIdArray,
    })
    .optional()
    .default({
      relatedHeroes: [],
      relatedPlaces: [],
      relatedExhibitions: [],
      relatedWeapons: [],
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

export const updateMuseumSchema =
  createMuseumSchema.partial();

/* =====================================================
   QUERY
===================================================== */

export const museumQuerySchema =
  paginationSchema.extend({
    search: z.string()
      .trim()
      .optional(),

    status: statusEnum.optional(),

    type: museumTypeEnum.optional(),

    locationId:
      objectId.optional(),

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

export const museumIdSchema = z.object({
  id: z.string()
    .trim()
    .min(1),
});

/* =====================================================
   TYPES
===================================================== */

export type CreateMuseumInput =
  z.infer<typeof createMuseumSchema>;

export type UpdateMuseumInput =
  z.infer<typeof updateMuseumSchema>;

export type MuseumQuery =
  z.infer<typeof museumQuerySchema>;

export type MuseumId =
  z.infer<typeof museumIdSchema>;